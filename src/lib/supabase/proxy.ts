import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  /*
   * Важливо:
   * не прибирай цей виклик і не вставляй між createServerClient()
   * та getClaims() сторонню логіку.
   *
   * Він перевіряє/оновлює Supabase Auth session.
   */
  const { data: claimsData } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub ?? null;
  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  /*
   * Неавторизований користувач на будь-якій admin-сторінці,
   * крім login → /admin/login
   */
  if (isAdminRoute && !isLoginRoute && !userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";

    return NextResponse.redirect(url);
  }

  /*
   * Авторизований користувач відкрив /admin/login →
   * одразу в CMS.
   */
  if (isLoginRoute && userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/portfolio";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return response;
}