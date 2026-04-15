"use client";

import { useEffect, useState } from "react";

export function useResponsiveDrawer() {
  const [isLg, setIsLg] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      setIsLg(mq.matches);
      if (mq.matches) setMobileSettingsOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!mobileSettingsOpen || isLg) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSettingsOpen, isLg]);

  return { isLg, mobileSettingsOpen, setMobileSettingsOpen };
}
