"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type AppLocale,
  applyStoredLocaleToDocument,
  getStoredLocale,
  setStoredLocale as persistLocale,
} from "@/lib/app-locale";
import { getUiStrings, type UiStrings } from "@/lib/ui-strings";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  strings: UiStrings;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("tr");

  useEffect(() => {
    const stored = getStoredLocale();
    setLocaleState(stored);
    applyStoredLocaleToDocument();
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    persistLocale(next);
    setLocaleState(next);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      strings: getUiStrings(locale),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
