import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MyTacticsPageView } from "./my-tactics-page-view";

export default async function MyTacticsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("tactics")
    .select(
      "id, title, share_id, is_public, canvas_state, home_team_name, away_team_name, formation_key, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const tactics = data ?? [];

  return <MyTacticsPageView tactics={tactics} loadError={Boolean(error)} />;
}
