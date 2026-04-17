import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserPanelShell } from "./panel-shell";
import { UserPanelProvider } from "./user-panel-context";

export default async function UserPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("avatar_url, first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const first = profile?.first_name?.trim() ?? "";
  const last = profile?.last_name?.trim() ?? "";
  const fromProfile = [first, last].filter(Boolean).join(" ").trim();
  const emailLocal = user.email?.split("@")[0]?.trim();
  const displayName = fromProfile || emailLocal || "Hesabım";
  const rawAvatar = profile?.avatar_url?.trim();
  const avatarUrl = rawAvatar && rawAvatar.length > 0 ? rawAvatar : null;

  return (
    <UserPanelProvider
      user={{
        id: user.id,
        email: user.email ?? null,
        displayName,
        avatarUrl,
      }}
    >
      <UserPanelShell>{children}</UserPanelShell>
    </UserPanelProvider>
  );
}
