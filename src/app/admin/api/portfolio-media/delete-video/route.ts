import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type DeleteVideoResult = {
  deleted_project_id: string;
  deleted_web_path: string | null;
  deleted_video_poster_path: string | null;
};

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

  const body = (await request
    .json()
    .catch(() => null)) as
    | { mediaId?: string }
    | null;

  if (!body?.mediaId) {
    return NextResponse.json(
      { error: "Не вказано відео." },
      { status: 400 },
    );
  }

  // Delete the database row first, atomically, and return the Storage paths.
  // If Storage cleanup fails afterwards, the project remains internally
  // consistent and only an orphan file may remain for later cleanup.
  const { data, error } = await supabase.rpc(
    "delete_portfolio_video",
    {
      p_media_id: body.mediaId,
    },
  );

  if (error) {
    console.error(
      "Failed to delete portfolio video row:",
      error,
    );

    return NextResponse.json(
      { error: "Не вдалося видалити відео." },
      { status: 500 },
    );
  }

  const row = (
    Array.isArray(data) ? data[0] : data
  ) as DeleteVideoResult | null;

  if (!row) {
    return NextResponse.json(
      { error: "Відео не знайдено." },
      { status: 404 },
    );
  }

  const cleanupWarnings: string[] = [];

  if (row.deleted_video_poster_path) {
    const { error: posterStorageError } =
      await supabase.storage
        .from("portfolio-video-posters")
        .remove([row.deleted_video_poster_path]);

    if (posterStorageError) {
      console.error(
        "Failed to remove portfolio video poster:",
        posterStorageError,
      );
      cleanupWarnings.push(
        "Не вдалося видалити poster-зображення зі сховища.",
      );
    }
  }

  if (row.deleted_web_path) {
    const { error: videoStorageError } =
      await supabase.storage
        .from("portfolio-videos")
        .remove([row.deleted_web_path]);

    if (videoStorageError) {
      console.error(
        "Failed to remove portfolio video file:",
        videoStorageError,
      );
      cleanupWarnings.push(
        "Не вдалося видалити відеофайл зі сховища.",
      );
    }
  }

  return NextResponse.json({
    ok: true,
    cleanupWarnings,
  });
}
