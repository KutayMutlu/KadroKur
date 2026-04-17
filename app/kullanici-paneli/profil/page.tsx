import { MapPin, Shield, Sparkles, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PanelFormSection, panelFieldClass, panelLabelClass } from "../panel-form";
import { ProfileFeedback } from "./profile-feedback";
import { SubmitButton } from "./save-profile-button";

const fieldClass = panelFieldClass;
const labelClass = panelLabelClass;

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
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dim)]">Futbol profili</p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Profil
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Saha tercihlerin ve görünürlük ayarların tek yerde. Kaydettiğinde taktik paylaşımlarında da kullanılır.
        </p>
      </header>

      <ProfileFeedback />

      <form action="/kullanici-paneli/save" method="post" className="space-y-6">
        <input type="hidden" name="return_to" value="/kullanici-paneli/profil" />
        <input type="hidden" name="section" value="profil" />

        <PanelFormSection
          icon={Sparkles}
          title="Saha & rol"
          description="Takımın, oynadığın bölge ve ayak tercihin — editör ve kartlarda özet olarak görünebilir."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Tuttuğu takım</span>
              <input
                name="favorite_team"
                defaultValue={profile?.favorite_team ?? ""}
                placeholder="Örn: Yeşil forma"
                className={fieldClass}
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className={labelClass}>Pozisyon</span>
              <select name="position" defaultValue={profile?.position ?? ""} className={`${fieldClass} cursor-pointer`}>
                <option value="">Seçiniz</option>
                <option value="Kaleci">Kaleci</option>
                <option value="Defans">Defans</option>
                <option value="Orta Saha">Orta Saha</option>
                <option value="Forvet">Forvet</option>
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Tercih edilen ayak</span>
              <select name="preferred_foot" defaultValue={profile?.preferred_foot ?? ""} className={`${fieldClass} cursor-pointer`}>
                <option value="">Seçiniz</option>
                <option value="Sağ">Sağ</option>
                <option value="Sol">Sol</option>
                <option value="İki Ayak">İki Ayak</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className={labelClass}>Baskın roller</span>
              <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">Virgülle ayırın — örn: oyun kurucu, presçi</span>
              <input
                name="dominant_roles"
                defaultValue={rolesText}
                placeholder="Örn: Oyun kurucu, Presçi, Bitirici"
                className={fieldClass}
                autoComplete="off"
              />
            </label>
          </div>
        </PanelFormSection>

        <PanelFormSection
          icon={MapPin}
          title="Konum"
          description="İsteğe bağlı. Yakın çevre veya lig eşleşmeleri için kullanılabilir."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Şehir</span>
              <input name="city" defaultValue={profile?.city ?? ""} placeholder="Örn: İstanbul" className={fieldClass} autoComplete="address-level2" />
            </label>
            <label className="block">
              <span className={labelClass}>İlçe</span>
              <input name="district" defaultValue={profile?.district ?? ""} placeholder="Örn: Kadıköy" className={fieldClass} autoComplete="off" />
            </label>
          </div>
        </PanelFormSection>

        <PanelFormSection
          icon={UserCircle}
          title="Görünürlük & iletişim"
          description="Profil fotoğrafı linki ve sosyal hesabın; gizlilik kimin seni görebileceğini belirler."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={labelClass}>Avatar URL</span>
              <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">Kare veya yuvarlak görsel önerilir (HTTPS)</span>
              <input
                name="avatar_url"
                type="url"
                defaultValue={profile?.avatar_url ?? ""}
                placeholder="https://..."
                className={fieldClass}
                autoComplete="off"
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelClass}>Instagram / sosyal link</span>
              <input
                name="social_link"
                type="url"
                defaultValue={profile?.social_link ?? ""}
                placeholder="https://instagram.com/..."
                className={fieldClass}
                autoComplete="off"
              />
            </label>
            <label className="block md:col-span-2">
              <span className={labelClass}>Gizlilik seviyesi</span>
              <select name="privacy_level" defaultValue={profile?.privacy_level ?? "friends"} className={`${fieldClass} max-w-md cursor-pointer`}>
                <option value="public">Herkese açık</option>
                <option value="friends">Sadece arkadaşlar</option>
                <option value="private">Gizli</option>
              </select>
            </label>
          </div>
        </PanelFormSection>

        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <Shield className="mr-1.5 inline-block h-3.5 w-3.5 -translate-y-px text-[var(--accent-dim)]" aria-hidden />
            Verilerin yalnızca hesabına bağlıdır; dilediğinde güncelleyebilirsin.
          </p>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
