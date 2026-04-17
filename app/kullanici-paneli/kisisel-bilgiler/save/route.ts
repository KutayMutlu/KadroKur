import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function toOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
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
      return NextResponse.redirect(new URL("/kullanici-paneli/kisisel-bilgiler?rate=1", request.url), 303);
    }
  }

  const formData = await request.formData();
  const payload = {
    user_id: currentUser.id,
    first_name: String(formData.get("first_name") ?? "").trim(),
    last_name: String(formData.get("last_name") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    birth_date: String(formData.get("birth_date") ?? "").trim() || null,
    height_cm: toOptionalInt(formData.get("height_cm")),
    weight_kg: toOptionalInt(formData.get("weight_kg")),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) {
    const msg = encodeURIComponent(error.message.slice(0, 180));
    return NextResponse.redirect(new URL(`/kullanici-paneli/kisisel-bilgiler?error=1&msg=${msg}`, request.url), 303);
  }

  return NextResponse.redirect(new URL("/kullanici-paneli/kisisel-bilgiler?saved=1", request.url), 303);
}
