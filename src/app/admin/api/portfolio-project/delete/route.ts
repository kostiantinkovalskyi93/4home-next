import { NextResponse } from "next/server";

import {
  BunnyStreamError,
  deleteBunnyStreamVideo,
} from "@/lib/bunny/stream.server";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DeleteProjectResult = {
  deleted_project_id: string;
  original_paths: string[] | null;
  public_paths: string[] | null;
  video_paths: string[] | null;
  video_poster_paths: string[] | null;
};

type ProjectVideoProviderRow = {
  id: string;
  storage_provider: string | null;
  bunny_video_id: string | null;
};

async function removeStoragePaths(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bucket: string,
  paths: string[] | null,
  warning: string,
  cleanupWarnings: string[],
) {
  const uniquePaths = [
    ...new Set((paths ?? []).filter(Boolean)),
  ];

  if (uniquePaths.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove(uniquePaths);

  if (error) {
    console.error(`Failed to clean ${bucket}:`, error);
    cleanupWarnings.push(warning);
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Потрібна авторизація адміністратора." },
      { status: 401 },
    );
  }

  const { data: admin, error: adminError } =
    await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (adminError || !admin) {
    return NextResponse.json(
      { error: "Недостатньо прав адміністратора." },
      { status: 403 },
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as
    | { projectId?: string }
    | null;

  const projectId = body?.projectId?.trim() ?? "";

  if (!UUID_PATTERN.test(projectId)) {
    return NextResponse.json(
      { error: "Некоректний ID роботи." },
      { status: 400 },
    );
  }

  /*
   * Preserve every Bunny reference until Bunny confirms deletion.
   *
   * A retry is safe:
   * - Bunny 404 means the remote asset is already gone.
   * - any other Bunny failure stops before the database delete.
   * - the delete RPC compares the Bunny IDs seen here with the IDs
   *   still attached to the project under a project-row lock.
   *   If media changed concurrently, the database delete is aborted.
   */
  const { data: providerData, error: providerError } =
    await supabase
      .from("portfolio_media")
      .select("id, storage_provider, bunny_video_id")
      .eq("project_id", projectId)
      .eq("media_type", "video");

  if (providerError) {
    console.error(
      "Failed to load project video providers before delete:",
      providerError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити відео роботи перед видаленням.",
      },
      { status: 500 },
    );
  }

  const providerRows =
    (providerData ?? []) as ProjectVideoProviderRow[];

  const bunnyRows = providerRows.filter(
    (row) => row.storage_provider === "bunny",
  );

  const invalidBunnyRow = bunnyRows.find(
    (row) => !row.bunny_video_id,
  );

  if (invalidBunnyRow) {
    console.error(
      "Bunny video row is missing bunny_video_id:",
      invalidBunnyRow.id,
    );

    return NextResponse.json(
      {
        error:
          "Робота має відео з некоректними даними Bunny Stream. Видалення зупинено.",
      },
      { status: 409 },
    );
  }

  const expectedBunnyVideoIds = bunnyRows
    .map((row) => row.bunny_video_id as string)
    .sort();

  for (const bunnyVideoId of expectedBunnyVideoIds) {
    try {
      await deleteBunnyStreamVideo(bunnyVideoId);
    } catch (error) {
      if (
        error instanceof BunnyStreamError &&
        error.status === 404
      ) {
        continue;
      }

      console.error(
        "Failed to remove Bunny Stream video before project delete:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Bunny Stream не підтвердив видалення всіх відео. Роботу та записи в базі залишено без змін.",
        },
        { status: 502 },
      );
    }
  }

  const { data, error } = await supabase.rpc(
    "delete_portfolio_project",
    {
      p_project_id: projectId,
      p_expected_bunny_video_ids:
        expectedBunnyVideoIds,
    },
  );

  if (error) {
    console.error(
      "Failed to delete portfolio project:",
      error,
    );

    const message =
      typeof error.message === "string"
        ? error.message
        : "";

    if (
      message.includes(
        "portfolio_media_changed_during_delete",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Медіа роботи змінилися під час видалення. Дані в базі залишено; повторіть спробу.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error:
          expectedBunnyVideoIds.length > 0
            ? "Відео Bunny Stream видалено, але не вдалося видалити роботу з бази. Повторіть спробу."
            : "Не вдалося видалити роботу.",
      },
      { status: 500 },
    );
  }

  const result = (
    Array.isArray(data) ? data[0] : data
  ) as DeleteProjectResult | null;

  if (!result) {
    return NextResponse.json(
      {
        error:
          "Роботу не знайдено або її вже видалено.",
      },
      { status: 404 },
    );
  }

  const cleanupWarnings: string[] = [];

  await removeStoragePaths(
    supabase,
    "portfolio-originals",
    result.original_paths,
    "Не вдалося очистити частину оригіналів фото.",
    cleanupWarnings,
  );

  await removeStoragePaths(
    supabase,
    "portfolio-public",
    result.public_paths,
    "Не вдалося очистити частину web-зображень.",
    cleanupWarnings,
  );

  await removeStoragePaths(
    supabase,
    "portfolio-videos",
    result.video_paths,
    "Не вдалося очистити частину відеофайлів.",
    cleanupWarnings,
  );

  await removeStoragePaths(
    supabase,
    "portfolio-video-posters",
    result.video_poster_paths,
    "Не вдалося очистити частину video poster-файлів.",
    cleanupWarnings,
  );

  return NextResponse.json({
    ok: true,
    cleanupWarnings,
  });
}
