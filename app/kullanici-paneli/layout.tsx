import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserPanelShell } from "./panel-shell";

export default async function UserPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/");
  }

  return <UserPanelShell>{children}</UserPanelShell>;
}
