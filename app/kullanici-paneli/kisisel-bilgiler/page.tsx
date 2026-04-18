import { createClient } from "@/lib/supabase/server";
import { KisiselPageView } from "./kisisel-page-view";

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

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, last_name, bio, phone, birth_date, height_cm, weight_kg")
    .maybeSingle();

  const calculatedAge = calculateAgeFromBirthDate(profile?.birth_date ?? "");

  return <KisiselPageView profile={profile ?? null} calculatedAge={calculatedAge} />;
}
