import type Konva from "konva";

export function exportStageToPng(
  stage: Konva.Stage,
  filename = "taktik.png",
  options?: { pixelRatio?: number }
): void {
  const uri = stage.toDataURL({ pixelRatio: options?.pixelRatio ?? 2 });
  const link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
