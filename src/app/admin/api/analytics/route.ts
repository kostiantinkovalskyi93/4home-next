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
    console.error(
      "Vercel Analytics environment variables are missing.",
    );

    return NextResponse.json(
      {
        error:
          "Аналітика тимчасово недоступна через конфігурацію сервера.",
      },
      { status: 500 },
    );
  }

  const params = new URLSearchParams({
  teamId,
  projectId,
});

const response = await fetch(
  `https://api.vercel.com/v1/query/web-analytics/visits/count?${params.toString()}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  },
);

const data: unknown = await response.json().catch(() => null);

if (!response.ok) {
  console.error(
    "Vercel Web Analytics API request failed:",
    response.status,
    data,
  );

  return NextResponse.json(
    {
      error: "Не вдалося отримати дані аналітики.",
    },
    { status: 502 },
  );
}

return NextResponse.json({
  ok: true,
  analytics: data,
});
}