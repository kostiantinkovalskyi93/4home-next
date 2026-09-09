import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

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

  const { data: media, error: mediaError } =
    await supabase
      .from("portfolio_media")
      .select("id, project_id, media_type, web_path")
      .eq("id", body.mediaId)
      .eq("media_type", "video")
      .maybeSingle();

  if (mediaError || !media) {
    return NextResponse.json(
      { error: "Відео не знайдено." },
      { status: 404 },
    );
  }

  if (media.web_path) {
    const { error: storageError } =
      await supabase.storage
        .from("portfolio-videos")
        .remove([media.web_path]);

    if (storageError) {
      console.error(
        "Failed to remove portfolio video:",
        storageError,
      );

      return NextResponse.json(
        {
          error:
            "Не вдалося видалити відеофайл зі сховища.",
        },
        { status: 500 },
      );
    }
  }

  const { error: deleteError } =
    await supabase
      .from("portfolio_media")
      .delete()
      .eq("id", media.id);

  if (deleteError) {
    return NextResponse.json(
      {
        error:
          "Файл видалено, але не вдалося видалити запис відео.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
