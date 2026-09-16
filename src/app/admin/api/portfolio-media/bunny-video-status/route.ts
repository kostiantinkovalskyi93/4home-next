import { NextResponse } from "next/server";

import {
  BunnyStreamError,
  getBunnyStreamVideo,
} from "@/lib/bunny/stream.server";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BUNNY_STATUS_FINISHED = 4;
const BUNNY_ENCODE_PROGRESS_COMPLETE = 100;

function normalizeNonNegativeInteger(
  value: number,
): number | null {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.round(value);
}

function normalizePositiveNumber(
  value: number,
): number | null {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value;
}

function normalizeText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

function getBunnyTranscodingError(
  messages: Array<{
    level: number;
    message: string;
  }>,
): string | null {
  if (!Array.isArray(messages)) {
    return null;
  }

  const relevantMessages = messages
    .filter(
      (message) =>
        typeof message?.message === "string" &&
        message.message.trim(),
    )
    .map((message) => message.message.trim());

  if (relevantMessages.length === 0) {
    return null;
  }

  return relevantMessages
    .slice(0, 3)
    .join(" | ")
    .slice(0, 2000);
}

export async function GET(request: Request) {
  const supabase = await createClient();

  // ----------------------------------------------------------
  // 1. Authentication
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // 2. Authorization
  // ----------------------------------------------------------

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
      "Failed to verify Bunny status admin:",
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

  // ----------------------------------------------------------
  // 3. Validate media ID
  // ----------------------------------------------------------

  const url = new URL(request.url);

  const mediaId =
    url.searchParams.get("mediaId")?.trim() ?? "";

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

  // ----------------------------------------------------------
  // 4. Load portfolio media
  // ----------------------------------------------------------

  const {
    data: media,
    error: mediaError,
  } = await supabase
    .from("portfolio_media")
    .select(
      "id, media_type, storage_provider, bunny_video_id, processing_status, bunny_ready_at",
    )
    .eq("id", mediaId)
    .maybeSingle();

  if (mediaError) {
    console.error(
      "Failed to load Bunny media status row:",
      mediaError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося отримати відео.",
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

  // ----------------------------------------------------------
  // 5. Read real state from Bunny Stream
  //
  // The Bunny API key remains server-side.
  // ----------------------------------------------------------

  let bunnyVideo;

  try {
    bunnyVideo = await getBunnyStreamVideo(
      media.bunny_video_id,
    );
  } catch (error) {
    if (error instanceof BunnyStreamError) {
      console.error(
        "Failed to read Bunny Stream video status:",
        {
          mediaId,
          bunnyVideoId:
            media.bunny_video_id,
          status: error.status,
          message: error.message,
          responseBody:
            error.responseBody,
        },
      );

      return NextResponse.json(
        {
          error:
            "Не вдалося отримати стан відео з Bunny Stream.",
        },
        {
          status: 502,
        },
      );
    }

    console.error(
      "Unexpected Bunny status error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося отримати стан відео.",
      },
      {
        status: 500,
      },
    );
  }

  // ----------------------------------------------------------
  // 6. Normalize Bunny metadata
  // ----------------------------------------------------------

  const bunnyStatus =
    normalizeNonNegativeInteger(
      bunnyVideo.status,
    );

  const encodeProgress =
    normalizeNonNegativeInteger(
      bunnyVideo.encodeProgress,
    );

  const durationSeconds =
    normalizePositiveNumber(
      bunnyVideo.length,
    );

  const width =
    normalizePositiveNumber(
      bunnyVideo.width,
    );

  const height =
    normalizePositiveNumber(
      bunnyVideo.height,
    );

  const storageSize =
    normalizeNonNegativeInteger(
      bunnyVideo.storageSize,
    );

  const availableResolutions =
    normalizeText(
      bunnyVideo.availableResolutions,
    );

  const bunnyError =
    getBunnyTranscodingError(
      bunnyVideo.transcodingMessages,
    );

  // ----------------------------------------------------------
  // 7. Derive CMS processing state
  //
  // We have confirmed with a successfully encoded production-
  // shaped test video that Bunny status 4 together with 100%
  // encode progress represents a ready video.
  //
  // bunny_ready_at is written only on the first transition to
  // ready and is preserved on all later polling requests.
  // ----------------------------------------------------------

  const providerIsReady =
    bunnyStatus === BUNNY_STATUS_FINISHED &&
    encodeProgress ===
      BUNNY_ENCODE_PROGRESS_COMPLETE;

  const shouldMarkReady =
    providerIsReady &&
    media.processing_status !== "ready";

  const nextProcessingStatus =
    providerIsReady
      ? "ready"
      : media.processing_status;

  const readyAt =
    media.bunny_ready_at ??
    (shouldMarkReady
      ? new Date().toISOString()
      : null);

  // ----------------------------------------------------------
  // 8. Persist provider metadata + confirmed ready state
  // ----------------------------------------------------------

  const {
    data: updatedMedia,
    error: updateError,
  } = await supabase
    .from("portfolio_media")
    .update({
      processing_status:
        nextProcessingStatus,

      bunny_status:
        bunnyStatus,

      bunny_encode_progress:
        encodeProgress,

      bunny_available_resolutions:
        availableResolutions,

      bunny_storage_size:
        storageSize,

      duration_seconds:
        durationSeconds,

      width,

      height,

      bunny_error:
        bunnyError,

      bunny_ready_at:
        readyAt,
    })
    .eq("id", mediaId)
    .eq("media_type", "video")
    .eq("storage_provider", "bunny")
    .eq(
      "bunny_video_id",
      media.bunny_video_id,
    )
    .select(
      "id, processing_status, bunny_status, bunny_encode_progress, bunny_available_resolutions, bunny_storage_size, duration_seconds, width, height, bunny_error, bunny_upload_completed_at, bunny_ready_at",
    )
    .maybeSingle();

  if (updateError) {
    console.error(
      "Failed to persist Bunny Stream status:",
      updateError,
    );

    return NextResponse.json(
      {
        error:
          "Стан Bunny отримано, але не вдалося оновити його в базі.",
      },
      {
        status: 500,
      },
    );
  }

  if (!updatedMedia) {
    console.error(
      "Bunny status update affected no media row:",
      {
        mediaId,
        bunnyVideoId:
          media.bunny_video_id,
      },
    );

    return NextResponse.json(
      {
        error:
          "Відео змінилося під час перевірки. Оновіть сторінку.",
      },
      {
        status: 409,
      },
    );
  }

  // ----------------------------------------------------------
  // 9. Return normalized CMS state + provider diagnostics
  // ----------------------------------------------------------

  return NextResponse.json({
    ok: true,

    media: {
      id:
        updatedMedia.id,

      processingStatus:
        updatedMedia.processing_status,

      bunnyStatus:
        updatedMedia.bunny_status,

      encodeProgress:
        updatedMedia.bunny_encode_progress,

      availableResolutions:
        updatedMedia.bunny_available_resolutions,

      storageSize:
        updatedMedia.bunny_storage_size,

      durationSeconds:
        updatedMedia.duration_seconds,

      width:
        updatedMedia.width,

      height:
        updatedMedia.height,

      error:
        updatedMedia.bunny_error,

      uploadCompletedAt:
        updatedMedia.bunny_upload_completed_at,

      readyAt:
        updatedMedia.bunny_ready_at,
    },

    provider: {
      videoId:
        bunnyVideo.guid,

      title:
        bunnyVideo.title,

      status:
        bunnyVideo.status,

      encodeProgress:
        bunnyVideo.encodeProgress,

      thumbnailFileName:
        bunnyVideo.thumbnailFileName,

      transcodingMessages:
        bunnyVideo.transcodingMessages,
    },
  });
}