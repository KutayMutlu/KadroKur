import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const { error, count } = await supabase
    .from("tactics")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[taktiklerim/delete] Supabase delete error:", error);
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  if ((count ?? 0) === 0) {
    console.error("[taktiklerim/delete] Delete affected 0 rows. Possible RLS/policy issue.", {
      id,
      userId: user.id,
    });
    return NextResponse.json({ error: "delete_blocked_by_rls" }, { status: 403 });
  }

  revalidatePath("/taktiklerim");
  return NextResponse.json({ ok: true });
}
