import { isMobileLayout } from "./device";

export type ShareHttpUrlResult = "shared" | "cancelled" | "unsupported";

/**
 * Yalnızca dar ekranda `navigator.share({ url })` dener.
 * Masaüstünde veya API yoksa `unsupported` döner — çağıran panoya kopyalamayı sürdürebilir.
 */
export async function shareHttpUrl(
  url: string,
  options?: { title?: string; text?: string }
): Promise<ShareHttpUrlResult> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return "unsupported";
  }
  if (!isMobileLayout()) {
    return "unsupported";
  }

  const data: ShareData = { url };
  if (options?.title) data.title = options.title;
  if (options?.text) data.text = options.text;

  try {
    if (typeof navigator.canShare === "function") {
      try {
        if (!navigator.canShare(data)) return "unsupported";
      } catch {
        /* bazı tarayıcılarda canShare url ile hata verir — share denenebilir */
      }
    }
    await navigator.share(data);
    return "shared";
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") return "cancelled";
    return "unsupported";
  }
}
