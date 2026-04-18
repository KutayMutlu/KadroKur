import { createClient } from "@/lib/supabase/server";
import { getLocationCatalog } from "@/lib/turkiye-location";
import { ProfilPageView } from "./profil-page-view";

export default async function UserPanelProfilePage() {
  const supabase = await createClient();
  const locationCatalog = getLocationCatalog();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "position, preferred_foot, dominant_roles, avatar_url, social_link, privacy_level, favorite_team, city, district"
    )
    .maybeSingle();
  const rolesText = Array.isArray(profile?.dominant_roles) ? profile.dominant_roles.join(", ") : "";

  return (
    <ProfilPageView profile={profile ?? null} locationCatalog={locationCatalog} rolesText={rolesText} />
  );
}
