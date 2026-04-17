"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProfileFeedback() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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

    // Başarı mesajı kısa süre gösterilir; hata/rate kullanıcı görebilsin diye kalıcıdır.
    if (!saved) return;

    const hideTimer = window.setTimeout(() => setVisible(false), 3000);
    const clearQueryTimer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 3200);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearQueryTimer);
    };
  }, [saved, error, rate, pathname, router]);

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
