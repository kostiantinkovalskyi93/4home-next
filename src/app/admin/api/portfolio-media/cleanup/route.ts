import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type DeleteResult = {
  new_cover_id: string | null;
  new_cover_status: string | null;
  deleted_original_path: string | null;
  deleted_web_path: string | null;
  deleted_card_path: string | null;
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
    | { projectId?: string }
    | null;

  if (!body?.projectId) {
    return NextResponse.json(
      { error: "Не вказано проєкт." },
      { status: 400 },
    );
  }

  const { data: rows, error: rowsError } =
    await supabase
      .from("portfolio_media")
      .select("id")
      .eq("project_id", body.projectId)
      .eq("media_type", "photo")
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
          "Не вдалося знайти незавершені фото.",
      },
      { status: 500 },
    );
  }

  const deletedIds: string[] = [];

  for (const row of rows ?? []) {
    const { data, error } = await supabase.rpc(
      "delete_portfolio_photo",
      {
        p_media_id: row.id,
      },
    );

    if (error) {
      console.error(
        `Failed to clean media ${row.id}:`,
        error,
      );
      continue;
    }

    const result = (
      Array.isArray(data) ? data[0] : data
    ) as DeleteResult | null;

    if (!result) {
      continue;
    }

    deletedIds.push(row.id);

    if (result.deleted_original_path) {
      await supabase.storage
        .from("portfolio-originals")
        .remove([
          result.deleted_original_path,
        ]);
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
      await supabase.storage
        .from("portfolio-public")
        .remove(publicPaths);
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
  });
}
