import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type DeleteResult = {
  deleted_project_id: string;
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
    | { mediaId?: string }
    | null;

  if (!body?.mediaId) {
    return NextResponse.json(
      { error: "Не вказано фото для видалення." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.rpc(
    "delete_portfolio_photo",
    {
      p_media_id: body.mediaId,
    },
  );

  if (error) {
    console.error(
      "Failed to delete portfolio photo row:",
      error,
    );

    return NextResponse.json(
      { error: "Не вдалося видалити фото." },
      { status: 500 },
    );
  }

  const row = (
    Array.isArray(data) ? data[0] : data
  ) as DeleteResult | null;

  if (!row) {
    return NextResponse.json(
      { error: "Фото не знайдено." },
      { status: 404 },
    );
  }

  const cleanupWarnings: string[] = [];

  if (row.deleted_original_path) {
    const { error: originalError } =
      await supabase.storage
        .from("portfolio-originals")
        .remove([row.deleted_original_path]);

    if (originalError) {
      console.error(
        "Failed to remove portfolio original:",
        originalError,
      );
      cleanupWarnings.push(
        "Не вдалося видалити backup оригіналу.",
      );
    }
  }

  const publicPaths = [
    row.deleted_web_path,
    row.deleted_card_path,
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
        "Failed to remove public portfolio media:",
        publicError,
      );
      cleanupWarnings.push(
        "Не вдалося видалити одну з web-версій.",
      );
    }
  }

  return NextResponse.json({
    ok: true,
    newCoverId: row.new_cover_id,
    newCoverStatus: row.new_cover_status,
    cleanupWarnings,
  });
}
