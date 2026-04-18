import type Konva from "konva";
import { isMobileLayout } from "./device";

export type ExportStagePngOptions = {
  pixelRatio?: number;
};

/**
 * Masaüstü: doğrudan PNG indir.
 * Mobil (dar ekran): mümkünse Web Share ile dosya (galeri yolu); değilse indir.
 */
export function exportStageToPng(
  stage: Konva.Stage,
  filename = "taktik.png",
  options?: ExportStagePngOptions
): void {
  void exportStageToPngAsync(stage, filename, options);
}

async function exportStageToPngAsync(
  stage: Konva.Stage,
  filename: string,
  options?: ExportStagePngOptions
): Promise<void> {
  const pixelRatio = options?.pixelRatio ?? 2;
  const uri = stage.toDataURL({ pixelRatio, mimeType: "image/png" });
  if (!uri || uri === "data:,") return;

  if (!isMobileLayout()) {
    triggerDownload(uri, filename);
    return;
  }

  const blob = await dataUrlToBlob(uri);
  const file = new File([blob], filename, { type: "image/png" });

  try {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        files: [file],
        title: "KadroKur taktik",
        text: "Taktik sahası görüntüsü",
      });
      return;
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return;
  }

  triggerDownload(uri, filename);
}

function triggerDownload(uri: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
