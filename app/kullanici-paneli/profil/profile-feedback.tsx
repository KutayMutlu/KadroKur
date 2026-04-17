"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ProfileFeedback() {
  const params = useSearchParams();
  const [visible, setVisible] = useState(true);

  const saved = params.get("saved") === "1";
  const error = params.get("error") === "1";
  const rate = params.get("rate") === "1";
  const msg = params.get("msg");
  const shouldShow = (saved || error || rate) && visible;

  useEffect(() => {
    setVisible(true);
  }, [params]);

  useEffect(() => {
    if (!saved && !error && !rate) return;

    if (!saved) return;
    const hideTimer = window.setTimeout(() => setVisible(false), 3000);
    return () => window.clearTimeout(hideTimer);
  }, [saved, error, rate]);

  if (!shouldShow) return null;

  if (saved) {
    return (
      <p className="mb-4 rounded-lg border border-green-500/40 bg-green-950/35 px-3 py-2 text-sm text-green-200">
        Profil bilgileriniz kaydedildi.
      </p>
    );
  }

  if (rate) {
    return (
      <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-950/35 px-3 py-2 text-sm text-amber-200">
        Çok hızlı işlem yapıyorsunuz. Lütfen birkaç saniye bekleyip tekrar deneyin.
      </p>
    );
  }

  return (
    <p className="mb-4 rounded-lg border border-red-500/40 bg-red-950/35 px-3 py-2 text-sm text-red-200">
      Profil kaydedilirken bir hata oluştu. {msg ? `Detay: ${msg}` : "Lütfen tekrar deneyin."}
    </p>
  );
}
