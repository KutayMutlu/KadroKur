import { createClient } from "@/lib/supabase/server";
import { ProfileFeedback } from "./profile-feedback";
import { SaveProfileButton } from "./save-profile-button";

export default async function UserPanelProfilePage() {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "position, preferred_foot, dominant_roles, avatar_url, social_link, privacy_level, favorite_team, city, district"
    )
    .maybeSingle();
  const rolesText = Array.isArray(profile?.dominant_roles) ? profile.dominant_roles.join(", ") : "";

  return (
    <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[var(--muted)]">Profil</h2>

      <ProfileFeedback />

      <form action="/kullanici-paneli/profil/save" method="post" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Tuttuğu Takım</span>
            <input
              name="favorite_team"
              defaultValue={profile?.favorite_team ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Pozisyon</span>
            <select
              name="position"
              defaultValue={profile?.position ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            >
              <option value="">Seçiniz</option>
              <option value="Kaleci">Kaleci</option>
              <option value="Defans">Defans</option>
              <option value="Orta Saha">Orta Saha</option>
              <option value="Forvet">Forvet</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Tercih Edilen Ayak</span>
            <select
              name="preferred_foot"
              defaultValue={profile?.preferred_foot ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            >
              <option value="">Seçiniz</option>
              <option value="Sağ">Sağ</option>
              <option value="Sol">Sol</option>
              <option value="İki Ayak">İki Ayak</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Avatar URL</span>
            <input
              name="avatar_url"
              defaultValue={profile?.avatar_url ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Instagram / Sosyal Link</span>
            <input
              name="social_link"
              defaultValue={profile?.social_link ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Gizlilik Seviyesi</span>
            <select
              name="privacy_level"
              defaultValue={profile?.privacy_level ?? "friends"}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            >
              <option value="public">Herkese Açık</option>
              <option value="friends">Arkadaşlar</option>
              <option value="private">Gizli</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">Şehir</span>
            <input
              name="city"
              defaultValue={profile?.city ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm text-[var(--muted)]">İlçe</span>
            <input
              name="district"
              defaultValue={profile?.district ?? ""}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-sm text-[var(--muted)]">Baskın Roller (virgülle ayırın)</span>
            <input
              name="dominant_roles"
              defaultValue={rolesText}
              placeholder="Örn: Oyun kurucu, Presçi, Bitirici"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none ring-[var(--accent)]/50 transition focus:ring-2"
            />
          </label>
        </div>

        <SaveProfileButton />
      </form>
    </section>
  );
}
