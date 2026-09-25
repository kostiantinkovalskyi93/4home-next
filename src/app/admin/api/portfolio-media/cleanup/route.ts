import { NextResponse } from "next/server";

import {
  BunnyStreamError,
  deleteBunnyStreamVideo,
} from "@/lib/bunny/stream.server";
import { createClient } from "@/lib/supabase/server";

type DeletePhotoResult = {
  new_cover_id: string | null;
  new_cover_status: string | null;
  deleted_original_path: string | null;
  deleted_web_path: string | null;
  deleted_card_path: string | null;
};

type DeleteVideoResult = {
  deleted_project_id: string;
  deleted_web_path: string | null;
  deleted_video_poster_path: string | null;
};

type IncompleteMediaRow = {
  id: string;
  media_type: "photo" | "video";
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

  const {
    data: admin,
    error: adminError,
  } = await supabase
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

  if (!body?.projectId) {
    return NextResponse.json(
      { error: "Не вказано проєкт." },
      { status: 400 },
    );
  }

  // Keep cleanup media-aware. The current video pipeline normally inserts
  // only ready rows, but this also safely handles future pending/failed video
  // states without leaving the endpoint photo-only.
  const { data: rows, error: rowsError } =
    await supabase
      .from("portfolio_media")
      .select("id, media_type, storage_provider, bunny_video_id")
      .eq("project_id", body.projectId)
      .in("processing_status", [
        "pending",
        "failed",
      ])
      .order("sort_order", {
        ascending: false,
      });

  if (rowsError) {
    return NextResponse.json(
      {
        error:
          "Не вдалося знайти незавершені медіа.",
      },
      { status: 500 },
    );
  }

  const deletedIds: string[] = [];
  const cleanupWarnings: string[] = [];

  for (const row of (rows ?? []) as IncompleteMediaRow[]) {
    if (row.media_type === "video") {
      // Bunny assets must be removed before their database row.
      // Keeping the DB reference until remote cleanup succeeds makes a
      // failed cleanup observable and safely retryable. Bunny 404 means
      // the desired remote state has already been reached.
      if (row.storage_provider === "bunny") {
        if (!row.bunny_video_id) {
          console.error(
            `Incomplete Bunny video ${row.id} is missing bunny_video_id.`,
          );
          cleanupWarnings.push(
            `Відео ${row.id} має некоректні дані Bunny Stream і не було видалене.`,
          );
          continue;
        }

        try {
          await deleteBunnyStreamVideo(
            row.bunny_video_id,
          );
        } catch (error) {
          if (
            !(
              error instanceof BunnyStreamError &&
              error.status === 404
            )
          ) {
            console.error(
              `Failed to clean Bunny video ${row.id}:`,
              error,
            );
            cleanupWarnings.push(
              `Bunny Stream не підтвердив видалення відео ${row.id}; запис у базі залишено для повторної спроби.`,
            );
            continue;
          }
        }
      }

      const { data, error } = await supabase.rpc(
        "delete_portfolio_video",
        {
          p_media_id: row.id,
        },
      );

      if (error) {
        console.error(
          `Failed to clean video ${row.id}:`,
          error,
        );
        continue;
      }

      const result = (
        Array.isArray(data) ? data[0] : data
      ) as DeleteVideoResult | null;

      if (!result) {
        continue;
      }

      deletedIds.push(row.id);

      if (result.deleted_video_poster_path) {
        const { error: posterError } =
          await supabase.storage
            .from("portfolio-video-posters")
            .remove([
              result.deleted_video_poster_path,
            ]);

        if (posterError) {
          console.error(
            `Failed to clean video poster ${row.id}:`,
            posterError,
          );
          cleanupWarnings.push(
            `Poster для відео ${row.id} потребує фонової очистки.`,
          );
        }
      }

      if (result.deleted_web_path) {
        const { error: videoError } =
          await supabase.storage
            .from("portfolio-videos")
            .remove([result.deleted_web_path]);

        if (videoError) {
          console.error(
            `Failed to clean video file ${row.id}:`,
            videoError,
          );
          cleanupWarnings.push(
            `Відеофайл ${row.id} потребує фонової очистки.`,
          );
        }
      }

      continue;
    }

    const { data, error } = await supabase.rpc(
      "delete_portfolio_photo",
      {
        p_media_id: row.id,
      },
    );

    if (error) {
      console.error(
        `Failed to clean photo ${row.id}:`,
        error,
      );
      continue;
    }

    const result = (
      Array.isArray(data) ? data[0] : data
    ) as DeletePhotoResult | null;

    if (!result) {
      continue;
    }

    deletedIds.push(row.id);

    if (result.deleted_original_path) {
      const { error: originalError } =
        await supabase.storage
          .from("portfolio-originals")
          .remove([
            result.deleted_original_path,
          ]);

      if (originalError) {
        console.error(
          `Failed to clean photo original ${row.id}:`,
          originalError,
        );
        cleanupWarnings.push(
          `Оригінал фото ${row.id} потребує фонової очистки.`,
        );
      }
    }

    const publicPaths = [
      result.deleted_web_path,
      result.deleted_card_path,
    ].filter(
      (path): path is string =>
        typeof path === "string" &&
        path.length > 0,
    );

    if (publicPaths.length) {
      const { error: publicError } =
        await supabase.storage
          .from("portfolio-public")
          .remove(publicPaths);

      if (publicError) {
        console.error(
          `Failed to clean public photo files ${row.id}:`,
          publicError,
        );
        cleanupWarnings.push(
          `Web-версії фото ${row.id} потребують фонової очистки.`,
        );
      }
    }
  }

  const { data: cover } = await supabase
    .from("portfolio_media")
    .select("id, processing_status")
    .eq("project_id", body.projectId)
    .eq("media_type", "photo")
    .eq("is_cover", true)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    deletedIds,
    coverId: cover?.id ?? null,
    coverStatus:
      cover?.processing_status ?? null,
    cleanupWarnings,
  });
}
