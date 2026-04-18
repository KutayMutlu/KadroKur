export type AppLocale = "tr" | "en";

export const LOCALE_STORAGE_KEY = "kadrokur-locale";

export function getStoredLocale(): AppLocale {
  if (typeof window === "undefined") return "tr";
  const v = localStorage.getItem(LOCALE_STORAGE_KEY);
  return v === "en" ? "en" : "tr";
}

export function setStoredLocale(locale: AppLocale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
}

/** İlk yüklemede kayıtlı dili <html lang> üzerine uygular */
export function applyStoredLocaleToDocument(): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = getStoredLocale();
}
