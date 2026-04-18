"use client";

import { MapPin, Shield, Sparkles, UserCircle } from "lucide-react";
import { ProfileLocationSelects } from "@/components/kullanici-paneli/profile-location-selects";
import type { LocationCatalog } from "@/lib/turkiye-location.types";
import { useLocale } from "@/components/locale-provider";
import { PanelFormSection, panelFieldClass, panelLabelClass } from "../panel-form";
import { ProfileFeedback } from "./profile-feedback";
import { SubmitButton } from "./save-profile-button";

const fieldClass = panelFieldClass;
const labelClass = panelLabelClass;

type ProfileRow = {
  position: string | null;
  preferred_foot: string | null;
  dominant_roles: unknown;
  avatar_url: string | null;
  social_link: string | null;
  privacy_level: string | null;
  favorite_team: string | null;
  city: string | null;
  district: string | null;
};

export function ProfilPageView({
  profile,
  locationCatalog,
  rolesText,
}: {
  profile: ProfileRow | null;
  locationCatalog: LocationCatalog;
  rolesText: string;
}) {
  const { strings: ui } = useLocale();

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dim)]">
          {ui.panelProfileEyebrow}
        </p>
        <h1
          className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ui.panelProfileTitle}
        </h1>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          {ui.panelProfileIntro}
        </p>
      </header>

      <ProfileFeedback />

      <form action="/kullanici-paneli/save" method="post" className="space-y-6">
        <input type="hidden" name="return_to" value="/kullanici-paneli/profil" />
        <input type="hidden" name="section" value="profil" />

        <PanelFormSection
          icon={Sparkles}
          title={ui.panelSectionPitchRole}
          description={ui.panelSectionPitchRoleDesc}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className={labelClass}>{ui.panelFavoriteTeam}</span>
              <input
                name="favorite_team"
                defaultValue={profile?.favorite_team ?? ""}
                placeholder={ui.panelFavoriteTeamPlaceholder}
                className={fieldClass}
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className={labelClass}>{ui.panelPosition}</span>
              <select name="position" defaultValue={profile?.position ?? ""} className={`${fieldClass} cursor-pointer`}>
                <option value="">{ui.panelSelectPlaceholder}</option>
                <option value="Kaleci">{ui.panelPositionGk}</option>
                <option value="Defans">{ui.panelPositionDef}</option>
                <option value="Orta Saha">{ui.panelPositionMid}</option>
                <option value="Forvet">{ui.panelPositionFwd}</option>
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>{ui.panelPreferredFoot}</span>
              <select
                name="preferred_foot"
                defaultValue={profile?.preferred_foot ?? ""}
                className={`${fieldClass} cursor-pointer`}
              >
                <option value="">{ui.panelSelectPlaceholder}</option>
                <option value="Sağ">{ui.panelFootRight}</option>
                <option value="Sol">{ui.panelFootLeft}</option>
                <option value="İki Ayak">{ui.panelFootBoth}</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className={labelClass}>{ui.panelDominantRoles}</span>
              <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">{ui.panelDominantRolesHint}</span>
              <input
                name="dominant_roles"
                defaultValue={rolesText}
                placeholder={ui.panelDominantRolesPlaceholder}
                className={fieldClass}
                autoComplete="off"
              />
            </label>
          </div>
        </PanelFormSection>

        <PanelFormSection
          icon={MapPin}
          title={ui.panelSectionLocation}
          description={ui.panelSectionLocationDesc}
        >
          <ProfileLocationSelects
            catalog={locationCatalog}
            initialCity={profile?.city ?? ""}
            initialDistrict={profile?.district ?? ""}
          />
        </PanelFormSection>

        <PanelFormSection
          icon={UserCircle}
          title={ui.panelSectionVisibility}
          description={ui.panelSectionVisibilityDesc}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={labelClass}>{ui.panelAvatarUrl}</span>
              <span className="mb-1.5 block text-[11px] text-[var(--muted)]/90">{ui.panelAvatarUrlHint}</span>
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
              <span className={labelClass}>{ui.panelSocialLink}</span>
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
              <span className={labelClass}>{ui.panelPrivacyLevel}</span>
              <select
                name="privacy_level"
                defaultValue={profile?.privacy_level ?? "friends"}
                className={`${fieldClass} max-w-md cursor-pointer`}
              >
                <option value="public">{ui.panelPrivacyPublic}</option>
                <option value="friends">{ui.panelPrivacyFriends}</option>
                <option value="private">{ui.panelPrivacyPrivate}</option>
              </select>
            </label>
          </div>
        </PanelFormSection>

        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            <Shield className="mr-1.5 inline-block h-3.5 w-3.5 -translate-y-px text-[var(--accent-dim)]" aria-hidden />
            {ui.panelFooterShieldProfile}
          </p>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
