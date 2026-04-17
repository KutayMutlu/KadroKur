import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function parseRoleList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .slice(0, 12);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const currentUser = auth.user;
  if (!currentUser) return NextResponse.redirect(new URL("/", request.url), 303);

  const { data: currentProfile } = await supabase
    .from("user_profiles")
    .select("updated_at")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (currentProfile?.updated_at) {
    const lastUpdate = new Date(currentProfile.updated_at);
    const secondsSinceLastSave = (Date.now() - lastUpdate.getTime()) / 1000;
    if (secondsSinceLastSave < 8) {
      return NextResponse.redirect(new URL("/kullanici-paneli/profil?rate=1", request.url), 303);
    }
  }

  const formData = await request.formData();
  const payload = {
    user_id: currentUser.id,
    position: String(formData.get("position") ?? "").trim(),
    preferred_foot: String(formData.get("preferred_foot") ?? "").trim(),
    dominant_roles: parseRoleList(formData.get("dominant_roles")),
    avatar_url: String(formData.get("avatar_url") ?? "").trim(),
    social_link: String(formData.get("social_link") ?? "").trim(),
    privacy_level: String(formData.get("privacy_level") ?? "").trim(),
    favorite_team: String(formData.get("favorite_team") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    district: String(formData.get("district") ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) {
    const msg = encodeURIComponent(error.message.slice(0, 180));
    return NextResponse.redirect(new URL(`/kullanici-paneli/profil?error=1&msg=${msg}`, request.url), 303);
  }

  return NextResponse.redirect(new URL("/kullanici-paneli/profil?saved=1", request.url), 303);
}
