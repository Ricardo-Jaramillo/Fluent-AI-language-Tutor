import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPaths = ["/onboarding", "/session", "/dashboard", "/settings"];

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

  // Use SUPABASE_URL (runtime, for server-side/Docker) with fallback to NEXT_PUBLIC_ (build-time, for local dev)
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return intlResponse;
  }

  // For protected routes, check Supabase auth
  const response = intlResponse || NextResponse.next({ request });

  try {
    // When the server-side URL differs from the browser URL (e.g., Docker),
    // the cookie name must match the browser-side Supabase client.
    // Cookie name is derived from hostname: "sb-<host-first-part>-auth-token"
    const browserUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl;
    const storageKey = `sb-${new URL(browserUrl).hostname.split(".")[0]}-auth-token`;

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      auth: { storageKey },
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
