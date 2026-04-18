"use client";

import { useEffect } from "react";
import { applyStoredLocaleToDocument } from "@/lib/app-locale";

/** localStorage’daki dil tercihini sayfa yüklenince html lang’a yansıtır */
export function LocaleSync() {
  useEffect(() => {
    applyStoredLocaleToDocument();
  }, []);
  return null;
}
