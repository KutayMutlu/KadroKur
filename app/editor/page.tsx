import { EditorClient } from "@/components/editor/EditorClient";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <EditorClient initialTacticId={id ?? null} />;
}
