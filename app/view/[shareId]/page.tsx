import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicTacticViewer } from "@/components/share/PublicTacticViewer";
import type { CanvasState } from "@/types/tactic";

export default async function PublicSharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const supabase = await createClient();

  const primary = await supabase
    .from("tactics")
    .select("title, owner_name, formation_key, canvas_state, is_public")
    .eq("share_id", shareId)
    .eq("is_public", true)
    .maybeSingle();

  let data = primary.data;
  let ownerName = data?.owner_name || "KadroKur kullanıcısı";

  // Geriye uyumluluk: owner_name kolonu henüz DB'ye eklenmediyse fallback sorgu
  if (primary.error && primary.error.message.toLowerCase().includes("owner_name")) {
    const fallback = await supabase
      .from("tactics")
      .select("title, formation_key, canvas_state, is_public")
      .eq("share_id", shareId)
      .eq("is_public", true)
      .maybeSingle();
    data = fallback.data as typeof data;
    ownerName = "KadroKur kullanıcısı";
  }

  if (!data?.canvas_state) {
    notFound();
  }

  return (
    <PublicTacticViewer
      title={data.title || "Paylaşılan Taktik"}
      ownerName={ownerName}
      formationKey={data.formation_key}
      state={data.canvas_state as CanvasState}
    />
  );
}
