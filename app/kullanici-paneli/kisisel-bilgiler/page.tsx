import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileFeedback } from "../profil/profile-feedback";
import { SaveProfileButton } from "../profil/save-profile-button";

function toOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateAgeFromBirthDate(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
}

export default async function UserPanelPersonalInfoPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    redirect("/");
  }

  async function savePersonalInfo(formData: FormData) {
    "use server";

    const supabaseServer = await createClient();
    const { data: auth } = await supabaseServer.auth.getUser();
    const currentUser = auth.user;

    if (!currentUser) {
      redirect("/");
    }

    const { data: currentProfile } = await supabaseServer
      .from("user_profiles")
      .select("updated_at")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    if (currentProfile?.updated_at) {
      const lastUpdate = new Date(currentProfile.updated_at);
      const secondsSinceLastSave = (Date.now() - lastUpdate.getTime()) / 1000;
      if (secondsSinceLastSave < 8) {
        redirect("/kullanici-paneli/kisisel-bilgiler?rate=1");
      }
    }

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

    const { error } = await supabaseServer.from("user_profiles").upsert(payload, { onConflict: "user_id" });

    if (error) {
      redirect("/kullanici-paneli/kisisel-bilgiler?error=1");
    }

    redirect("/kullanici-paneli/kisisel-bilgiler?saved=1");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, last_name, bio, phone, birth_date, height_cm, weight_kg")
    .eq("user_id", user.id)
    .maybeSingle();

  const defaultFirstName =
    profile?.first_name ?? (typeof user.user_metadata?.first_name === "string" ? user.user_metadata.first_name : "");
  const defaultLastName =
    profile?.last_name ?? (typeof user.user_metadata?.last_name === "string" ? user.user_metadata.last_name : "");
  const defaultBirthDate =
    profile?.birth_date ?? (typeof user.user_metadata?.birth_date === "string" ? user.user_metadata.birth_date : "");
  const calculatedAge = calculateAgeFromBirthDate(defaultBirthDate);

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Kişisel Bilgiler</h2>

      <ProfileFeedback />

      <form action={savePersonalInfo} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Ad</span>
            <input
              name="first_name"
              defaultValue={defaultFirstName}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Soyad</span>
            <input
              name="last_name"
              defaultValue={defaultLastName}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm text-[var(--muted)]">Kısa Biyografi</span>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={3}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Telefon (opsiyonel)</span>
            <input
              name="phone"
              defaultValue={profile?.phone ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Doğum Tarihi</span>
            <input
              name="birth_date"
              type="date"
              defaultValue={defaultBirthDate}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Yaş (otomatik)</span>
            <input
              value={calculatedAge ?? ""}
              readOnly
              placeholder="Doğum tarihinden hesaplanır"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--muted)] outline-none"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Boy (cm)</span>
            <input
              name="height_cm"
              type="number"
              min={50}
              max={260}
              defaultValue={profile?.height_cm ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Kilo (kg)</span>
            <input
              name="weight_kg"
              type="number"
              min={20}
              max={300}
              defaultValue={profile?.weight_kg ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
        </div>

        <SaveProfileButton />
      </form>
    </section>
  );
}
