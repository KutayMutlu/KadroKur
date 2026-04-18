"use client";

import { AlignLeft, Phone, Ruler, Shield, UserRound } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { PanelFormSection, panelFieldClass, panelLabelClass } from "../panel-form";
import { ProfileFeedback } from "../profil/profile-feedback";
import { SubmitButton } from "../profil/save-profile-button";

const readonlyFieldClass = `${panelFieldClass} cursor-not-allowed border-[var(--border-subtle)]/80 bg-[var(--bg-deep)]/35 text-[var(--muted)]`;

type ProfileRow = {
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  phone: string | null;
  birth_date: string | null;
  height_cm: number | null;
  weight_kg: number | null;
};

export function KisiselPageView({
  profile,
  calculatedAge,
}: {
  profile: ProfileRow | null;
  calculatedAge: number | null;
}) {
  const { strings: ui } = useLocale();

  const defaultFirstName = profile?.first_name ?? "";
  const defaultLastName = profile?.last_name ?? "";
  const defaultBirthDate = profile?.birth_date ?? "";

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dim)]">
          {ui.panelPersonalEyebrow}
        </p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ui.panelPersonalTitle}
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {ui.panelPersonalIntro}
        </p>
      </header>

      <ProfileFeedback />

      <form action="/kullanici-paneli/save" method="post" className="space-y-6">
        <input type="hidden" name="return_to" value="/kullanici-paneli/kisisel-bilgiler" />
        <input type="hidden" name="section" value="kisisel" />

        <PanelFormSection
          icon={UserRound}
          title={ui.panelSectionIdentity}
          description={ui.panelSectionIdentityDesc}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={panelLabelClass}>{ui.panelFirstName}</span>
              <input
                name="first_name"
                defaultValue={defaultFirstName}
                placeholder={ui.panelFirstNamePlaceholder}
                className={panelFieldClass}
                autoComplete="given-name"
              />
            </label>
            <label className="block">
              <span className={panelLabelClass}>{ui.panelLastName}</span>
              <input
                name="last_name"
                defaultValue={defaultLastName}
                placeholder={ui.panelLastNamePlaceholder}
                className={panelFieldClass}
                autoComplete="family-name"
              />
            </label>
          </div>
        </PanelFormSection>

        <PanelFormSection icon={AlignLeft} title={ui.panelSectionBio} description={ui.panelSectionBioDesc}>
          <label className="block">
            <span className={panelLabelClass}>{ui.panelBio}</span>
            <textarea
              name="bio"
              defaultValue={profile?.bio ?? ""}
              rows={4}
              placeholder={ui.panelBioPlaceholder}
              className={`${panelFieldClass} min-h-[7rem] resize-y`}
            />
          </label>
        </PanelFormSection>

        <PanelFormSection
          icon={Phone}
          title={ui.panelSectionContact}
          description={ui.panelSectionContactDesc}
        >
          <label className="block max-w-xl">
            <span className={panelLabelClass}>{ui.panelPhone}</span>
            <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">{ui.panelPhoneOptional}</span>
            <input
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder={ui.panelPhonePlaceholder}
              className={panelFieldClass}
              autoComplete="tel"
            />
          </label>
        </PanelFormSection>

        <PanelFormSection
          icon={Ruler}
          title={ui.panelSectionPhysical}
          description={ui.panelSectionPhysicalDesc}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={panelLabelClass}>{ui.panelBirthDate}</span>
              <input name="birth_date" type="date" defaultValue={defaultBirthDate} className={panelFieldClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex flex-wrap items-baseline gap-x-1.5 text-xs font-medium tracking-wide text-[var(--muted)]">
                {ui.panelAge}
                <span className="text-[11px] font-normal normal-case tracking-normal text-[var(--muted)]/85">
                  {ui.panelAgeFromBirth}
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
              <span className={panelLabelClass}>{ui.panelHeightCm}</span>
              <input
                name="height_cm"
                type="number"
                min={50}
                max={260}
                defaultValue={profile?.height_cm ?? ""}
                placeholder={ui.panelHeightPlaceholder}
                className={panelFieldClass}
              />
            </label>
            <label className="block">
              <span className={panelLabelClass}>{ui.panelWeightKg}</span>
              <input
                name="weight_kg"
                type="number"
                min={20}
                max={300}
                defaultValue={profile?.weight_kg ?? ""}
                placeholder={ui.panelWeightPlaceholder}
                className={panelFieldClass}
              />
            </label>
          </div>
        </PanelFormSection>

        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <Shield className="mr-1.5 inline-block h-3.5 w-3.5 -translate-y-px text-[var(--accent-dim)]" aria-hidden />
            {ui.panelFooterShieldPersonal}
          </p>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
