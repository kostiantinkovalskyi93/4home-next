import { NextResponse } from "next/server";

import {
  BunnyStreamError,
  createBunnyStreamUploadAuthorization,
  createBunnyStreamVideo,
  deleteBunnyStreamVideo,
} from "@/lib/bunny/stream.server";
import { createClient } from "@/lib/supabase/server";

const MAX_VIDEO_FILE_SIZE =
  150 * 1024 * 1024;

const ALLOWED_VIDEO_MIME_TYPES =
  new Set([
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ]);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CreateBunnyVideoUploadBody = {
  projectId?: unknown;
  fileName?: unknown;
  mimeType?: unknown;
  fileSize?: unknown;
};

type CreateBunnyVideoMediaResult = {
  media_id: string;
  media_sort_order: number;
};

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function normalizeFileName(
  value: string,
) {
  return value.trim().replace(/\s+/g, " ");
}

function isValidFileSize(
  value: unknown,
): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_VIDEO_FILE_SIZE
  );
}

export async function POST(
  request: Request,
) {
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
      "Failed to verify Bunny video upload admin:",
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
  // 3. Parse request
  //
  // Important:
  // the request contains metadata only.
  // The video File/Blob must NEVER be sent to this route.
  // ----------------------------------------------------------

  const body = (await request
    .json()
    .catch(() => null)) as
    | CreateBunnyVideoUploadBody
    | null;

  if (!body) {
    return NextResponse.json(
      {
        error:
          "Некоректний запит на завантаження відео.",
      },
      {
        status: 400,
      },
    );
  }

  const {
    projectId,
    fileName,
    mimeType,
    fileSize,
  } = body;

  // ----------------------------------------------------------
  // 4. Validate project ID
  // ----------------------------------------------------------

  if (
    typeof projectId !== "string" ||
    !isUuid(projectId)
  ) {
    return NextResponse.json(
      {
        error:
          "Некоректний ID роботи.",
      },
      {
        status: 400,
      },
    );
  }

  // ----------------------------------------------------------
  // 5. Validate filename
  // ----------------------------------------------------------

  if (
    typeof fileName !== "string"
  ) {
    return NextResponse.json(
      {
        error:
          "Не вказано назву відеофайлу.",
      },
      {
        status: 400,
      },
    );
  }

  const normalizedFileName =
    normalizeFileName(fileName);

  if (
    !normalizedFileName ||
    normalizedFileName.length > 255
  ) {
    return NextResponse.json(
      {
        error:
          "Некоректна назва відеофайлу.",
      },
      {
        status: 400,
      },
    );
  }

  // ----------------------------------------------------------
  // 6. Validate MIME type
  // ----------------------------------------------------------

  if (
    typeof mimeType !== "string" ||
    !ALLOWED_VIDEO_MIME_TYPES.has(
      mimeType,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Підтримуються відео MP4, MOV та WebM.",
      },
      {
        status: 400,
      },
    );
  }

  // ----------------------------------------------------------
  // 7. Validate file size
  //
  // 150 MiB = 157,286,400 bytes.
  // This is server-side business validation.
  //
  // The file itself still does NOT pass through Vercel.
  // ----------------------------------------------------------

  if (!isValidFileSize(fileSize)) {
    return NextResponse.json(
      {
        error:
          "Розмір відео має бути від 1 байта до 150 МБ.",
      },
      {
        status: 400,
      },
    );
  }

  // ----------------------------------------------------------
  // 8. Verify project exists
  // ----------------------------------------------------------

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) {
    console.error(
      "Failed to verify portfolio project before Bunny upload:",
      projectError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити роботу.",
      },
      {
        status: 500,
      },
    );
  }

  if (!project) {
    return NextResponse.json(
      {
        error:
          "Роботу не знайдено.",
      },
      {
        status: 404,
      },
    );
  }

  // ----------------------------------------------------------
  // 9. Early max-two-videos validation
  //
  // This improves UX and avoids creating a Bunny object when
  // the project already has two videos.
  //
  // The existing database trigger remains the final invariant
  // against concurrent requests.
  // ----------------------------------------------------------

  const {
    count: videoCount,
    error: videoCountError,
  } = await supabase
    .from("portfolio_media")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("project_id", projectId)
    .eq("media_type", "video");

  if (videoCountError) {
    console.error(
      "Failed to count portfolio videos before Bunny upload:",
      videoCountError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити кількість відео.",
      },
      {
        status: 500,
      },
    );
  }

  if (
    typeof videoCount === "number" &&
    videoCount >= 2
  ) {
    return NextResponse.json(
      {
        error:
          "Для однієї роботи можна додати максимум 2 відео.",
      },
      {
        status: 409,
      },
    );
  }

  // ----------------------------------------------------------
  // 10. Create Bunny video object
  // ----------------------------------------------------------

  let bunnyVideoId: string | null =
    null;

  try {
    const bunnyVideo =
      await createBunnyStreamVideo({
        title: normalizedFileName,
      });

    if (
      !bunnyVideo?.guid ||
      !isUuid(bunnyVideo.guid)
    ) {
      console.error(
        "Bunny Create Video returned an invalid GUID:",
        bunnyVideo,
      );

      return NextResponse.json(
        {
          error:
            "Bunny Stream повернув некоректний ID відео.",
        },
        {
          status: 502,
        },
      );
    }

    bunnyVideoId = bunnyVideo.guid;

    // --------------------------------------------------------
    // 11. Create short-lived direct-upload authorization
    //
    // Generate this before the DB insert.
    // It is a pure server-side operation, so after the DB row
    // exists there is no additional signing step that could
    // leave the two systems inconsistent.
    // --------------------------------------------------------

    const uploadAuthorization =
      createBunnyStreamUploadAuthorization(
        bunnyVideoId,
      );

    // --------------------------------------------------------
    // 12. Atomically register Bunny video in portfolio_media
    //
    // The RPC additionally checks:
    // - auth.uid()
    // - admin_users
    // - project existence
    // - project-row lock
    // - append sort_order
    // - unique Bunny GUID
    //
    // The existing DB trigger enforces max 2 videos.
    // --------------------------------------------------------

    const {
      data: mediaData,
      error: mediaError,
    } = await supabase.rpc(
      "create_bunny_portfolio_video_media",
      {
        p_project_id: projectId,
        p_bunny_video_id:
          bunnyVideoId,
      },
    );

    if (mediaError) {
      console.error(
        "Failed to create Bunny portfolio media row:",
        mediaError,
      );

      try {
        await deleteBunnyStreamVideo(
          bunnyVideoId,
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up Bunny video after DB insert failure:",
          cleanupError,
        );
      }

      const databaseMessage =
        mediaError.message ?? "";

      if (
        databaseMessage.includes(
          "portfolio_project_not_found",
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Роботу більше не знайдено. Оновіть сторінку.",
          },
          {
            status: 409,
          },
        );
      }

      if (
        databaseMessage.includes(
          "authentication_required",
        )
      ) {
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

      if (
        databaseMessage.includes(
          "admin_required",
        )
      ) {
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

      if (
        databaseMessage.includes(
          "bunny_video_already_registered",
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Це Bunny-відео вже зареєстроване.",
          },
          {
            status: 409,
          },
        );
      }

      if (
        databaseMessage
          .toLowerCase()
          .includes(
            "maximum of two videos",
          ) ||
        databaseMessage
          .toLowerCase()
          .includes(
            "max two",
          )
      ) {
        return NextResponse.json(
          {
            error:
              "Для однієї роботи можна додати максимум 2 відео.",
          },
          {
            status: 409,
          },
        );
      }

      return NextResponse.json(
        {
          error:
            "Не вдалося зареєструвати відео в роботі.",
        },
        {
          status: 500,
        },
      );
    }

    const mediaRow = (
      Array.isArray(mediaData)
        ? mediaData[0]
        : mediaData
    ) as
      | CreateBunnyVideoMediaResult
      | null;

    if (
      !mediaRow?.media_id ||
      !isUuid(mediaRow.media_id) ||
      !Number.isInteger(
        mediaRow.media_sort_order,
      )
    ) {
      console.error(
        "create_bunny_portfolio_video_media returned an invalid result:",
        mediaData,
      );

      // At this point both Bunny and DB resources exist.
      // Do not perform a blind DB delete here because the RPC
      // succeeded and we need deterministic cleanup semantics.
      // The pending row remains visible to the later cleanup
      // mechanism instead of risking a partially hidden state.
      return NextResponse.json(
        {
          error:
            "Відео створено, але сервер отримав некоректну відповідь БД. Оновіть сторінку перед повторною спробою.",
        },
        {
          status: 500,
        },
      );
    }

    // --------------------------------------------------------
    // 13. Return ONLY temporary upload credentials
    //
    // BUNNY_STREAM_API_KEY is never returned.
    // --------------------------------------------------------

    return NextResponse.json({
      ok: true,

      media: {
        id: mediaRow.media_id,
        sortOrder:
          mediaRow.media_sort_order,
      },

      upload: {
        endpoint:
          uploadAuthorization.endpoint,

        libraryId:
          uploadAuthorization.libraryId,

        videoId:
          uploadAuthorization.videoId,

        authorizationSignature:
          uploadAuthorization.authorizationSignature,

        authorizationExpire:
          uploadAuthorization.authorizationExpire,
      },
    });
  } catch (error) {
    // --------------------------------------------------------
    // 14. Compensating cleanup
    //
    // If Bunny video creation succeeded but a later operation
    // failed before the DB RPC completed successfully, remove
    // the empty Bunny object.
    // --------------------------------------------------------

    if (bunnyVideoId) {
      try {
        await deleteBunnyStreamVideo(
          bunnyVideoId,
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up Bunny video after upload preparation failure:",
          cleanupError,
        );
      }
    }

    if (error instanceof BunnyStreamError) {
      console.error(
        "Bunny Stream upload preparation failed:",
        {
          message: error.message,
          status: error.status,
          responseBody:
            error.responseBody,
        },
      );

      return NextResponse.json(
        {
          error:
            "Не вдалося підготувати Bunny Stream для завантаження відео.",
        },
        {
          status: 502,
        },
      );
    }

    console.error(
      "Unexpected Bunny video upload preparation error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося підготувати завантаження відео.",
      },
      {
        status: 500,
      },
    );
  }
}