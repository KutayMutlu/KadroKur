import { ShareViewClient } from "@/components/share/ShareViewClient";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  return <ShareViewClient shareId={shareId} />;
}
