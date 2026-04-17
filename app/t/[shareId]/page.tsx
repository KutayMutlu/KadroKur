import { redirect } from "next/navigation";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  redirect(`/view/${encodeURIComponent(shareId)}`);
}
