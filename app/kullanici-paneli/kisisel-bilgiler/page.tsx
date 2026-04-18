import { AlignLeft, Phone, Ruler, Shield, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PanelFormSection, panelFieldClass, panelLabelClass } from "../panel-form";
import { ProfileFeedback } from "../profil/profile-feedback";
import { SubmitButton } from "../profil/save-profile-button";

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

const readonlyFieldClass = `${panelFieldClass} cursor-not-allowed border-[var(--border-subtle)]/80 bg-[var(--bg-deep)]/35 text-[var(--muted)]`;

export default async function UserPanelPersonalInfoPage() {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, last_name, bio, phone, birth_date, height_cm, weight_kg")
    .maybeSingle();

  const defaultFirstName = profile?.first_name ?? "";
  const defaultLastName = profile?.last_name ?? "";
  const defaultBirthDate = profile?.birth_date ?? "";
  const calculatedAge = calculateAgeFromBirthDate(defaultBirthDate);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dim)]">Hesap</p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kişisel bilgiler
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          Adın, iletişimin ve fiziksel bilgilerin; kadro ve profil kartlarında kullanılabilir.
        </p>
      </header>

      <ProfileFeedback />

      <form action="/kullanici-paneli/save" method="post" className="space-y-6">
        <input type="hidden" name="return_to" value="/kullanici-paneli/kisisel-bilgiler" />
        <input type="hidden" name="section" value="kisisel" />

        <PanelFormSection
          icon={UserRound}
          title="Kimlik"
          description="Kayıtta kullandığın isim bilgileri; istersen buradan güncelleyebilirsin."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={panelLabelClass}>Ad</span>
              <input
                name="first_name"
                defaultValue={defaultFirstName}
                placeholder="Adın"
                className={panelFieldClass}
                autoComplete="given-name"
              />
            </label>
            <label className="block">
              <span className={panelLabelClass}>Soyad</span>
              <input
                name="last_name"
                defaultValue={defaultLastName}
                placeholder="Soyadın"
                className={panelFieldClass}
                autoComplete="family-name"
              />
            </label>
          </div>
        </PanelFormSection>

        <PanelFormSection
          icon={AlignLeft}
          title="Kendini anlat"
          description="Kısa bir tanıtım; topluluk özelliklerinde veya ileride profil önizlemesinde görünebilir."
        >
          <label className="block">
            <span className={panelLabelClass}>Kısa biyografi</span>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={4}
              placeholder="Halı saha tarzın, oynadığın lig veya kısa bir not..."
              className={`${panelFieldClass} min-h-[7rem] resize-y`}
            />
          </label>
        </PanelFormSection>

        <PanelFormSection
          icon={Phone}
          title="İletişim"
          description="Telefon isteğe bağlıdır; etkinlik veya ekip bildirimleri için kullanılabilir."
        >
          <label className="block max-w-xl">
            <span className={panelLabelClass}>Telefon</span>
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">Opsiyonel</span>
            <input
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder="+90 5xx xxx xx xx"
              className={panelFieldClass}
              autoComplete="tel"
            />
          </label>
        </PanelFormSection>

        <PanelFormSection
          icon={Ruler}
          title="Fiziksel Detaylar"
          description="Doğum tarihi yaşını otomatik hesaplar; boy ve kilo istatistik veya kadro önerileri için kullanılabilir."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={panelLabelClass}>Doğum tarihi</span>
              <input name="birth_date" type="date" defaultValue={defaultBirthDate} className={panelFieldClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex flex-wrap items-baseline gap-x-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">
                Yaş
                <span className="text-[11px] font-normal normal-case tracking-normal text-[var(--muted)]/85">
                  (Doğum tarihinden hesaplanır)
                </span>
              </span>
              <input
                value={calculatedAge != null ? String(calculatedAge) : ""}
                readOnly
                placeholder="—"
                className={readonlyFieldClass}
                aria-readonly="true"
              />
            </label>
            <label className="block">
              <span className={panelLabelClass}>Boy (cm)</span>
              <input
                name="height_cm"
                type="number"
                min={50}
                max={260}
                defaultValue={profile?.height_cm ?? ""}
                placeholder="Örn: 178"
                className={panelFieldClass}
              />
            </label>
            <label className="block">
              <span className={panelLabelClass}>Kilo (kg)</span>
              <input
                name="weight_kg"
                type="number"
                min={20}
                max={300}
                defaultValue={profile?.weight_kg ?? ""}
                placeholder="Örn: 72"
                className={panelFieldClass}
              />
            </label>
          </div>
        </PanelFormSection>

        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <Shield className="mr-1.5 inline-block h-3.5 w-3.5 -translate-y-px text-[var(--accent-dim)]" aria-hidden />
            Bu bilgiler yalnızca senin hesabına bağlıdır.
          </p>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
