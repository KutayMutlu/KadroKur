import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function toText(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function toOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseRoleList(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .slice(0, 12);
}

function getSafeReturnPath(value: FormDataEntryValue | null, requestUrl: string): string {
  const defaultPath = "/kullanici-paneli/profil";
  const rawPath = typeof value === "string" ? value.trim() : defaultPath;

  if (!rawPath.startsWith("/kullanici-paneli")) return defaultPath;
  if (rawPath.includes("://")) return defaultPath;

  const url = new URL(rawPath, requestUrl);
  return `${url.pathname}${url.search}`;
}

function withQuery(path: string, query: string): string {
  return path.includes("?") ? `${path}&${query}` : `${path}?${query}`;
}

type SaveSection = "profil" | "kisisel";

function getSection(value: FormDataEntryValue | null): SaveSection {
  return value === "kisisel" ? "kisisel" : "profil";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const currentUser = auth.user;
  if (!currentUser) return NextResponse.redirect(new URL("/", request.url), 303);

  const formData = await request.formData();
  const returnPath = getSafeReturnPath(formData.get("return_to"), request.url);
  const section = getSection(formData.get("section"));

  const { data: currentProfile } = await supabase
    .from("user_profiles")
    .select("updated_at")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (currentProfile?.updated_at) {
    const lastUpdate = new Date(currentProfile.updated_at);
    const secondsSinceLastSave = (Date.now() - lastUpdate.getTime()) / 1000;
    if (secondsSinceLastSave < 8) {
      return NextResponse.redirect(new URL(withQuery(returnPath, "rate=1"), request.url), 303);
    }
  }

  const payload: Record<string, unknown> = {
    user_id: currentUser.id,
    updated_at: new Date().toISOString(),
  };

  if (section === "profil") {
    payload.position = toText(formData.get("position")) || null;
    payload.preferred_foot = toText(formData.get("preferred_foot")) || null;
    payload.dominant_roles = parseRoleList(formData.get("dominant_roles"));
    payload.avatar_url = toText(formData.get("avatar_url"));
    payload.social_link = toText(formData.get("social_link"));
    payload.privacy_level = toText(formData.get("privacy_level")) || "friends";
    payload.favorite_team = toText(formData.get("favorite_team"));
    payload.city = toText(formData.get("city"));
    payload.district = toText(formData.get("district"));
  } else {
    payload.first_name = toText(formData.get("first_name"));
    payload.last_name = toText(formData.get("last_name"));
    payload.bio = toText(formData.get("bio"));
    payload.phone = toText(formData.get("phone"));
    payload.birth_date = toText(formData.get("birth_date")) || null;
    payload.height_cm = toOptionalInt(formData.get("height_cm"));
    payload.weight_kg = toOptionalInt(formData.get("weight_kg"));
  }

  const { error } = await supabase.from("user_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) {
    const msg = encodeURIComponent(error.message.slice(0, 180));
    return NextResponse.redirect(new URL(withQuery(returnPath, `error=1&msg=${msg}`), request.url), 303);
  }

  return NextResponse.redirect(new URL(withQuery(returnPath, "saved=1"), request.url), 303);
}
