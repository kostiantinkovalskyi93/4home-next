import { NextResponse } from "next/server";

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

  const { data, error } = await supabase.rpc(
    "delete_portfolio_project",
    { p_project_id: projectId },
  );

  if (error) {
    console.error(
      "Failed to delete portfolio project:",
      error,
    );

    return NextResponse.json(
      { error: "Не вдалося видалити роботу." },
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
