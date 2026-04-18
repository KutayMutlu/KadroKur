import type Konva from "konva";
import { isMobileLayout } from "./device";

export type ExportStagePngOptions = {
  pixelRatio?: number;
};

/** shared: paylaşım sheet’i hatasız kapandı (galeriye kaydet dahil) · downloaded: dosya indirildi · cancelled: boş sahne veya kullanıcı iptal */
export type ExportStagePngResult = "shared" | "downloaded" | "cancelled";

/**
 * Masaüstü: doğrudan PNG indir.
 * Mobil/tablet: mümkünse Web Share ile dosya; değilse indir.
 */
export async function exportStageToPng(
  stage: Konva.Stage,
  filename = "taktik.png",
  options?: ExportStagePngOptions
): Promise<ExportStagePngResult> {
  const pixelRatio = options?.pixelRatio ?? 2;
  const uri = stage.toDataURL({ pixelRatio, mimeType: "image/png" });
  if (!uri || uri === "data:,") return "cancelled";

  if (!isMobileLayout()) {
    triggerDownload(uri, filename);
    return "downloaded";
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
      return "shared";
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return "cancelled";
  }

  triggerDownload(uri, filename);
  return "downloaded";
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
