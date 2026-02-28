import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPaths = ["/session", "/dashboard", "/settings"];

export async function middleware(request: NextRequest) {
  // Run i18n middleware first to get locale-resolved response
  const intlResponse = intlMiddleware(request);

  // Check if the path (without locale prefix) is protected
  const pathname = request.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/(en|es|fr|de)/, "");
  const isProtected = protectedPaths.some((p) =>
    pathnameWithoutLocale.startsWith(p)
  );

  if (!isProtected) {
    return intlResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return intlResponse;
  }

  // For protected routes, check Supabase auth
  const response = intlResponse || NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const localeMatch = pathname.match(/^\/(en|es|fr|de)/);
      const locale = localeMatch ? localeMatch[1] : "en";
      const redirectUrl = new URL(`/${locale}/auth`, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    // If Supabase is unreachable, redirect to auth page instead of crashing
    const localeMatch = pathname.match(/^\/(en|es|fr|de)/);
    const locale = localeMatch ? localeMatch[1] : "en";
    const redirectUrl = new URL(`/${locale}/auth`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en|es|fr|de)/:path*"],
};
