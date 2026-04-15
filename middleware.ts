import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.pathname === "/" && url.searchParams.has("code")) {
    const dest = new URL("/auth/callback", request.url);
    url.searchParams.forEach((value, key) => {
      dest.searchParams.set(key, value);
    });
    return NextResponse.redirect(dest);
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
