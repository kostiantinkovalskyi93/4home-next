import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type StatusBody = {
  projectId?: unknown;
  action?: unknown;
};

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { supabase, response: NextResponse.json(
      { error: "Потрібна авторизація адміністратора." },
      { status: 401 },
    ) };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Failed to verify portfolio status admin:", adminError);
    return { supabase, response: NextResponse.json(
      { error: "Не вдалося перевірити права адміністратора." },
      { status: 500 },
    ) };
  }

  if (!admin) {
    return { supabase, response: NextResponse.json(
      { error: "Недостатньо прав адміністратора." },
      { status: 403 },
    ) };
  }

  return { supabase, response: null };
}

export async function POST(request: Request) {
  const { supabase, response } = await requireAdmin();
  if (response) return response;

  const body = (await request.json().catch(() => null)) as StatusBody | null;
  const projectId =
    typeof body?.projectId === "string" ? body.projectId.trim() : "";
  const action = body?.action;

  if (!UUID_PATTERN.test(projectId)) {
    return NextResponse.json(
      { error: "Некоректний ID роботи." },
      { status: 400 },
    );
  }

  if (action !== "publish" && action !== "unpublish") {
    return NextResponse.json(
      { error: "Некоректна дія зі статусом роботи." },
      { status: 400 },
    );
  }

  if (action === "publish") {
    const { error } = await supabase.rpc("publish_portfolio_project", {
      p_project_id: projectId,
    });

    if (error) {
      console.error("Failed to publish portfolio project:", error);
      const message = error.message ?? "";

      if (message.includes("project_not_found")) {
        return NextResponse.json(
          { error: "Роботу не знайдено." },
          { status: 404 },
        );
      }
      if (message.includes("ready_photo_required")) {
        return NextResponse.json(
          { error: "Для публікації потрібне хоча б одне готове фото." },
          { status: 409 },
        );
      }
      if (message.includes("ready_cover_required")) {
        return NextResponse.json(
          { error: "Для публікації виберіть готове фото як обкладинку." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        { error: "Не вдалося опублікувати роботу." },
        { status: 500 },
      );
    }
  } else {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({ status: "draft", published_at: null })
      .eq("id", projectId)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to unpublish portfolio project:", error);
      return NextResponse.json(
        { error: "Не вдалося зняти роботу з публікації." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Роботу не знайдено." },
        { status: 404 },
      );
    }
  }

  const { data: verified, error: verifyError } = await supabase
    .from("portfolio_projects")
    .select("status")
    .eq("id", projectId)
    .maybeSingle();

  const expectedStatus = action === "publish" ? "published" : "draft";
  if (verifyError || !verified || verified.status !== expectedStatus) {
    console.error("Portfolio status verification failed:", verifyError);
    return NextResponse.json(
      { error: "Статус роботи не вдалося підтвердити після зміни." },
      { status: 500 },
    );
  }

  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");

  return NextResponse.json({ ok: true, status: expectedStatus });
}
