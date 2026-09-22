import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const VERCEL_ANALYTICS_URL =
  "https://api.vercel.com/v1/query/web-analytics";

const PERIODS = {
  today: 1,
  "7d": 7,
  "30d": 30,
} as const;

type Period = keyof typeof PERIODS;

type AnalyticsDimension =
  | "day"
  | "requestPath"
  | "referrerHostname"
  | "country"
  | "deviceType"
  | "browserName"
  | "osName";

function isPeriod(value: string | null): value is Period {
  return value !== null && value in PERIODS;
}

function getDateRange(period: Period) {
  const until = new Date();

  const since = new Date(until);

  if (period === "today") {
    since.setUTCHours(0, 0, 0, 0);
  } else {
    since.setUTCDate(
      since.getUTCDate() - PERIODS[period],
    );
  }

  return {
    since: since.toISOString(),
    until: until.toISOString(),
  };
}

async function fetchVercelAnalytics(
  path: string,
  token: string,
  params: URLSearchParams,
) {
  const response = await fetch(
    `${VERCEL_ANALYTICS_URL}/${path}?${params.toString()}`,
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

  if (!response.ok) {
    console.error(
      "Vercel Web Analytics API request failed:",
      path,
      response.status,
      data,
    );

    throw new Error(
      `Vercel Analytics request failed: ${response.status}`,
    );
  }

  return data;
}

function createBaseParams(
  teamId: string,
  projectId: string,
  since: string,
  until: string,
) {
  return new URLSearchParams({
    teamId,
    projectId,
    since,
    until,
  });
}

function createAggregateParams(
  teamId: string,
  projectId: string,
  since: string,
  until: string,
  by: AnalyticsDimension,
) {
  return new URLSearchParams({
    teamId,
    projectId,
    since,
    until,
    by,
  });
}

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const requestedPeriod =
    url.searchParams.get("period");

  const period: Period = isPeriod(requestedPeriod)
    ? requestedPeriod
    : "7d";

  const { since, until } = getDateRange(period);

  const baseParams = createBaseParams(
    teamId,
    projectId,
    since,
    until,
  );

  try {
    const [
      totals,
      timeline,
      pages,
      referrers,
      countries,
      devices,
      browsers,
      operatingSystems,
    ] = await Promise.all([
      fetchVercelAnalytics(
        "visits/count",
        token,
        baseParams,
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "day",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "requestPath",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "referrerHostname",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "country",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "deviceType",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "browserName",
        ),
      ),

      fetchVercelAnalytics(
        "visits/aggregate",
        token,
        createAggregateParams(
          teamId,
          projectId,
          since,
          until,
          "osName",
        ),
      ),
    ]);

    return NextResponse.json({
      ok: true,
      period,
      range: {
        since,
        until,
      },
      updatedAt: new Date().toISOString(),
      analytics: {
        totals,
        timeline,
        pages,
        referrers,
        countries,
        devices,
        browsers,
        operatingSystems,
      },
    });
  } catch (error) {
    console.error(
      "Failed to load CMS analytics:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося отримати дані аналітики.",
      },
      { status: 502 },
    );
  }
}