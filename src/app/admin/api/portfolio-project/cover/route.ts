import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CoverBody = {
  projectId?: unknown;
  mediaId?: unknown;
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

  if (adminError) {
    console.error("Failed to verify portfolio cover admin:", adminError);
    return NextResponse.json(
      { error: "Не вдалося перевірити права адміністратора." },
      { status: 500 },
    );
  }

  if (!admin) {
    return NextResponse.json(
      { error: "Недостатньо прав адміністратора." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as CoverBody | null;
  const projectId =
    typeof body?.projectId === "string" ? body.projectId.trim() : "";
  const mediaId =
    typeof body?.mediaId === "string" ? body.mediaId.trim() : "";

  if (!UUID_PATTERN.test(projectId) || !UUID_PATTERN.test(mediaId)) {
    return NextResponse.json(
      { error: "Некоректний ID роботи або фото." },
      { status: 400 },
    );
  }

  const { error } = await supabase.rpc("set_portfolio_cover", {
    p_project_id: projectId,
    p_media_id: mediaId,
  });

  if (error) {
    console.error("Failed to set portfolio cover:", error);
    const message = error.message ?? "";

    if (message.includes("project_not_found")) {
      return NextResponse.json(
        { error: "Роботу не знайдено." },
        { status: 404 },
      );
    }

    if (message.includes("cover_photo_not_ready_or_not_found")) {
      return NextResponse.json(
        { error: "Фото ще не готове або не належить цій роботі." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Не вдалося змінити обкладинку." },
      { status: 500 },
    );
  }

  const { data: verified, error: verifyError } = await supabase
    .from("portfolio_media")
    .select("id,is_cover,processing_status,media_type")
    .eq("id", mediaId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (
    verifyError ||
    !verified ||
    !verified.is_cover ||
    verified.processing_status !== "ready" ||
    verified.media_type !== "photo"
  ) {
    console.error("Portfolio cover verification failed:", verifyError);
    return NextResponse.json(
      { error: "Обкладинку не вдалося підтвердити після зміни." },
      { status: 500 },
    );
  }

  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");

  return NextResponse.json({ ok: true });
}
