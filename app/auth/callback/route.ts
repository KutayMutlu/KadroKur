import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfileFromAuthUser } from "@/lib/user-profile-sync";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("kadrokur_auth_next")?.value;
  let nextPath = "/";
  if (fromCookie) {
    try {
      const decoded = decodeURIComponent(fromCookie);
      if (decoded.startsWith("/")) nextPath = decoded;
    } catch {
      /* ignore */
    }
  }
  if (nextPath === "/" && searchParams.get("next")) {
    const q = searchParams.get("next") ?? "/";
    nextPath = q.startsWith("/") ? q : "/";
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    await ensureUserProfileFromAuthUser(supabase);
  }

  const res = NextResponse.redirect(`${origin}${nextPath}`);
  res.cookies.set("kadrokur_auth_next", "", { path: "/", maxAge: 0 });
  return res;
}
