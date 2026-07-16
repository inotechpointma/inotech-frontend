import { NextResponse, type NextRequest } from "next/server";

/**
 * Currently just strips trailing slashes so /category/laptops/ and /category/laptops resolve to
 * the same canonical URL. If FR/AR locale routing is needed later, prefix matching against
 * SUPPORTED_LOCALES and rewrite to /[locale]/... here — the app/ tree underneath is unaffected.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
