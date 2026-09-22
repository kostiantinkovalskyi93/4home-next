import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

  const { data: admin, error: adminError } =
    await supabase
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

  const token =
    process.env.VERCEL_ANALYTICS_API_TOKEN;
  const projectId =
    process.env.VERCEL_ANALYTICS_PROJECT_ID;
  const teamId =
    process.env.VERCEL_ANALYTICS_TEAM_ID;

  if (!token || !projectId || !teamId) {
    return NextResponse.json(
      {
        error:
          "Відсутня конфігурація Vercel Analytics.",
      },
      { status: 500 },
    );
  }

const params = new URLSearchParams({
  teamId,
  projectId,
  by: "path",
});

  const response = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data: unknown = await response
    .json()
    .catch(() => null);

  return NextResponse.json(
    {
      status: response.status,
      ok: response.ok,
      data,
    },
    {
      status: response.ok ? 200 : 502,
    },
  );
}