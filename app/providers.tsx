"use client";

import { LocaleSync } from "@/components/locale-sync";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="kadrokur-theme"
      disableTransitionOnChange
    >
      <LocaleSync />
      {children}
    </ThemeProvider>
  );
}
