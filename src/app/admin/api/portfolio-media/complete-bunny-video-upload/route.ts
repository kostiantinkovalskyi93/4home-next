import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CompleteBunnyVideoUploadBody = {
  mediaId?: unknown;
  posterPath?: unknown;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error:
          "Потрібна авторизація адміністратора.",
      },
      {
        status: 401,
      },
    );
  }

  const {
    data: admin,
    error: adminError,
  } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error(
      "Failed to verify Bunny upload completion admin:",
      adminError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити права адміністратора.",
      },
      {
        status: 500,
      },
    );
  }

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Недостатньо прав адміністратора.",
      },
      {
        status: 403,
      },
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as
    | CompleteBunnyVideoUploadBody
    | null;

  const mediaId =
    typeof body?.mediaId === "string"
      ? body.mediaId.trim()
      : "";

  const posterPath =
    typeof body?.posterPath === "string" &&
    body.posterPath.trim()
      ? body.posterPath.trim()
      : null;

  if (!UUID_PATTERN.test(mediaId)) {
    return NextResponse.json(
      {
        error:
          "Некоректний ID відео.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    data: media,
    error: mediaError,
  } = await supabase
    .from("portfolio_media")
    .select(
      "id, media_type, storage_provider, bunny_video_id",
    )
    .eq("id", mediaId)
    .maybeSingle();

  if (mediaError) {
    console.error(
      "Failed to load Bunny media before completion:",
      mediaError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити відео.",
      },
      {
        status: 500,
      },
    );
  }

  if (!media) {
    return NextResponse.json(
      {
        error:
          "Відео не знайдено.",
      },
      {
        status: 404,
      },
    );
  }

  if (
    media.media_type !== "video" ||
    media.storage_provider !== "bunny" ||
    !media.bunny_video_id
  ) {
    return NextResponse.json(
      {
        error:
          "Цей запис не є Bunny Stream відео.",
      },
      {
        status: 409,
      },
    );
  }

  const uploadCompletedAt =
    new Date().toISOString();

  const {
    data: updatedMedia,
    error: updateError,
  } = await supabase
    .from("portfolio_media")
    .update({
      processing_status: "processing",
      video_poster_path: posterPath,
      bunny_error: null,
      bunny_encode_progress: 0,
      bunny_upload_completed_at:
        uploadCompletedAt,
    })
    .eq("id", mediaId)
    .eq("media_type", "video")
    .eq("storage_provider", "bunny")
    .select(
      "id, processing_status, bunny_upload_completed_at",
    )
    .maybeSingle();

  if (updateError) {
    console.error(
      "Failed to mark Bunny upload as processing:",
      updateError,
    );

    return NextResponse.json(
      {
        error:
          "Відео завантажено в Bunny, але не вдалося оновити його стан у базі.",
      },
      {
        status: 500,
      },
    );
  }

  if (!updatedMedia) {
    console.error(
      "Bunny upload completion update affected no media row:",
      {
        mediaId,
      },
    );

    return NextResponse.json(
      {
        error:
          "Відео завантажено в Bunny, але його стан у базі не було оновлено.",
      },
      {
        status: 409,
      },
    );
  }

  return NextResponse.json({
    ok: true,
    media: {
      id: updatedMedia.id,
      processingStatus:
        updatedMedia.processing_status,
      uploadCompletedAt:
        updatedMedia.bunny_upload_completed_at,
    },
  });
}