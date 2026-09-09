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
    | {
        projectId?: string;
        mediaIds?: string[];
      }
    | null;

  if (
    !body?.projectId ||
    !Array.isArray(body.mediaIds) ||
    body.mediaIds.some(
      (id) => typeof id !== "string" || !id,
    )
  ) {
    return NextResponse.json(
      { error: "Некоректний порядок фото." },
      { status: 400 },
    );
  }

  const { error } = await supabase.rpc(
    "reorder_portfolio_photos",
    {
      p_project_id: body.projectId,
      p_media_ids: body.mediaIds,
    },
  );

  if (error) {
    console.error(
      "Failed to reorder portfolio photos:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося зберегти порядок фото.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
