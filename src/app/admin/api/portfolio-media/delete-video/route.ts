import { NextResponse } from "next/server";

import {
  BunnyStreamError,
  deleteBunnyStreamVideo,
} from "@/lib/bunny/stream.server";
import { createClient } from "@/lib/supabase/server";

type DeleteVideoResult = {
  deleted_project_id: string;
  deleted_web_path: string | null;
  deleted_video_poster_path: string | null;
};

type VideoProviderRow = {
  id: string;
  storage_provider: string | null;
  bunny_video_id: string | null;
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

  const { data: admin, error: adminError } = await supabase
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

  const body = (await request.json().catch(() => null)) as
    | { mediaId?: string }
    | null;

  if (!body?.mediaId) {
    return NextResponse.json(
      { error: "Не вказано відео." },
      { status: 400 },
    );
  }

  const { data: providerData, error: providerError } = await supabase
    .from("portfolio_media")
    .select("id, storage_provider, bunny_video_id")
    .eq("id", body.mediaId)
    .eq("media_type", "video")
    .maybeSingle();

  if (providerError) {
    console.error(
      "Failed to load video provider before delete:",
      providerError,
    );

    return NextResponse.json(
      { error: "Не вдалося перевірити відео перед видаленням." },
      { status: 500 },
    );
  }

  const provider = providerData as VideoProviderRow | null;

  if (!provider) {
    return NextResponse.json(
      { error: "Відео не знайдено." },
      { status: 404 },
    );
  }

  /*
   * Bunny Stream videos must be removed from Bunny BEFORE the database row.
   *
   * This order is intentional:
   *
   * 1. Delete the Bunny asset.
   * 2. Treat Bunny 404 as success because the desired final state
   *    (the remote video no longer exists) has already been reached.
   * 3. For every other Bunny error, stop immediately and preserve
   *    the portfolio_media row so we keep the bunny_video_id and can retry.
   * 4. Only after Bunny cleanup succeeds do we delete the database row.
   *
   * This prevents an orphan Bunny asset caused by deleting the database
   * reference first and then losing the remote cleanup operation.
   */
  if (provider.storage_provider === "bunny") {
    if (!provider.bunny_video_id) {
      console.error(
        "Bunny video row is missing bunny_video_id:",
        provider.id,
      );

      return NextResponse.json(
        {
          error:
            "Відео має некоректні дані Bunny Stream. Видалення зупинено.",
        },
        { status: 409 },
      );
    }

    try {
      await deleteBunnyStreamVideo(provider.bunny_video_id);
    } catch (error) {
      if (error instanceof BunnyStreamError && error.status === 404) {
        // The Bunny asset is already absent.
        // This is the desired remote state, so database cleanup may continue.
      } else {
        console.error("Failed to remove Bunny Stream video:", error);

        return NextResponse.json(
          {
            error:
              "Bunny Stream не підтвердив видалення відео. Запис у базі залишено без змін.",
          },
          { status: 502 },
        );
      }
    }
  }

  const { data, error } = await supabase.rpc("delete_portfolio_video", {
    p_media_id: body.mediaId,
  });

  if (error) {
    console.error("Failed to delete portfolio video row:", error);

    /*
     * For Bunny videos the remote asset may already have been deleted
     * at this point. We deliberately report the database failure instead
     * of pretending that the whole operation succeeded.
     *
     * The remaining portfolio_media row still gives us a recoverable,
     * observable state. A retry is safe because Bunny 404 is accepted
     * as an already-completed remote deletion.
     */
    return NextResponse.json(
      {
        error:
          provider.storage_provider === "bunny"
            ? "Відео видалено з Bunny Stream, але не вдалося видалити запис із бази. Повторіть спробу."
            : "Не вдалося видалити відео.",
      },
      { status: 500 },
    );
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | DeleteVideoResult
    | null;

  if (!row) {
    return NextResponse.json(
      { error: "Відео не знайдено." },
      { status: 404 },
    );
  }

  const cleanupWarnings: string[] = [];

  /*
   * Legacy Supabase video cleanup.
   *
   * Bunny videos do not normally have these paths, but keeping this
   * cleanup based on the RPC result preserves compatibility with the
   * previous video pipeline.
   */
  if (row.deleted_video_poster_path) {
    const { error: posterStorageError } = await supabase.storage
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
    const { error: videoStorageError } = await supabase.storage
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