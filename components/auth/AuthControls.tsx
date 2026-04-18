"use client";

import { AccountDropdown } from "@/components/auth/auth-controls/account-dropdown";
import { AuthModal } from "@/components/auth/auth-controls/auth-modal";
import { AuthNotConfigured } from "@/components/auth/auth-controls/not-configured";
import type { AuthControlsProps, AuthModalProps } from "@/components/auth/auth-controls/types";
import {
  isLikelyValidEmail,
  type ProfileNameFields,
} from "@/components/auth/auth-controls/user-helpers";
import { getOAuthRedirectOrigin } from "@/lib/site-origin";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { LogIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type { AuthControlsProps };

function mapAuthErrorMessage(rawMessage: string, action: "signIn" | "signUp" | "reset" | "google"): string {
  const message = rawMessage.toLowerCase();

  if (message.includes("email rate limit exceeded") || message.includes("rate limit")) {
    return "Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar deneyin.";
  }
  if (message.includes("invalid login credentials")) {
    return "E-posta veya şifre hatalı.";
  }
  if (message.includes("email not confirmed")) {
    return "E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.";
  }
  if (message.includes("user already registered")) {
    return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin.";
  }
  if (message.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }
  if (message.includes("signup is disabled")) {
    return "Kayıt olma şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return "Bağlantı sorunu oluştu. İnternetinizi kontrol edip tekrar deneyin.";
  }

  if (action === "reset") return "Şifre sıfırlama işlemi tamamlanamadı. Lütfen tekrar deneyin.";
  if (action === "signUp") return "Kayıt işlemi tamamlanamadı. Bilgileri kontrol edip tekrar deneyin.";
  if (action === "signIn") return "Giriş işlemi başarısız oldu. Bilgilerinizi kontrol edip tekrar deneyin.";
  return "Google ile giriş başlatılamadı. Lütfen tekrar deneyin.";
}

export function AuthControls({ guestCompanion }: AuthControlsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [birthInvalid, setBirthInvalid] = useState(false);
  const [passwordMainInvalid, setPasswordMainInvalid] = useState(false);
  const [passwordConfirmInvalid, setPasswordConfirmInvalid] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authMessageTone, setAuthMessageTone] = useState<"success" | "warning">("warning");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarTone, setSnackbarTone] = useState<"success" | "warning">("success");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [profileNames, setProfileNames] = useState<ProfileNameFields | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const configured = isSupabaseConfigured();

  const fetchProfileNames = useCallback(async () => {
    const uid = user?.id;
    if (!uid) {
      setProfileNames(null);
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", uid)
      .maybeSingle();
    setProfileNames(
      data
        ? { first_name: data.first_name ?? null, last_name: data.last_name ?? null }
        : null
    );
  }, [user?.id]);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    void fetchProfileNames();
  }, [fetchProfileNames]);

  useEffect(() => {
    if (!user) return;
    setAuthModalOpen(false);
    setAuthMode("signIn");
    setAuthMessage("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setFirstName("");
    setLastName("");
    setBirthDate("");
    setEmailInvalid(false);
    setFirstNameInvalid(false);
    setLastNameInvalid(false);
    setBirthInvalid(false);
    setPasswordMainInvalid(false);
    setPasswordConfirmInvalid(false);
  }, [user]);

  useEffect(() => {
    if (!authModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAuthModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const timer = window.setTimeout(() => {
      emailInputRef.current?.focus();
    }, 80);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [authModalOpen]);

  useEffect(() => {
    if (!authModalOpen) {
      setEmailInvalid(false);
      setFirstNameInvalid(false);
      setLastNameInvalid(false);
      setBirthInvalid(false);
      setPasswordMainInvalid(false);
      setPasswordConfirmInvalid(false);
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setPassword("");
      setPasswordConfirm("");
    }
  }, [authModalOpen]);

  useEffect(() => {
    if (!snackbarMessage) return;
    const timer = window.setTimeout(() => setSnackbarMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [snackbarMessage]);

  useEffect(() => {
    setEmailInvalid(false);
    setFirstNameInvalid(false);
    setLastNameInvalid(false);
    setBirthInvalid(false);
    setPasswordMainInvalid(false);
    setPasswordConfirmInvalid(false);
    if (authMode === "signIn") {
      setEmail("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setPassword("");
      setPasswordConfirm("");
      setFirstNameInvalid(false);
      setLastNameInvalid(false);
      setBirthInvalid(false);
      setPasswordMainInvalid(false);
      setPasswordConfirmInvalid(false);
    } else {
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setPasswordMainInvalid(false);
      setPasswordConfirmInvalid(false);
    }
  }, [authMode]);

  useEffect(() => {
    if (!authModalOpen || authMode !== "signUp") return;
    const timer = window.setTimeout(() => {
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      if (narrow) {
        document.getElementById("kadrokur-signup-firstname-sm")?.focus();
      } else {
        document.getElementById("kadrokur-signup-firstname-lg")?.focus();
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [authModalOpen, authMode]);

  const signInWithGoogle = async () => {
    const sb = getSupabase();
    if (!sb) {
      setAuthMessageTone("warning");
      setAuthMessage("Sistem ayarları eksik. Lütfen daha sonra tekrar deneyin.");
      return;
    }
    setAuthMessage("");
    setLoading(true);
    try {
      const origin = getOAuthRedirectOrigin();
      if (
        process.env.NODE_ENV === "development" &&
        origin.includes("vercel.app") &&
        typeof window !== "undefined" &&
        !window.location.origin.includes("vercel.app")
      ) {
        console.error(
          "[KadroKur] NEXT_PUBLIC_APP_ORIGIN canlı adres içeriyor; .env.local içinde kaldırın veya http://localhost:3000 yapın."
        );
      }
      const returnPath = `${window.location.pathname}${window.location.search}`;
      document.cookie = `kadrokur_auth_next=${encodeURIComponent(returnPath)}; Path=/; Max-Age=600; SameSite=Lax`;
      const redirectTo = `${origin}/auth/callback`;
      const { data, error } = await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo, skipBrowserRedirect: false },
      });
      if (error) {
        setAuthMessageTone("warning");
        setAuthMessage(mapAuthErrorMessage(error.message, "google"));
        setLoading(false);
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (e) {
      const fallback = e instanceof Error ? e.message : "Google ile giriş başlatılamadı.";
      setAuthMessageTone("warning");
      setAuthMessage(mapAuthErrorMessage(fallback, "google"));
      setLoading(false);
    }
  };

  const signInWithEmail = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setAuthMessage("");
    setEmailInvalid(false);
    setPasswordMainInvalid(false);

    const em = email.trim();
    const pwEmpty = password.trim().length === 0;
    const emailMissing = em.length === 0;
    const emailBadFormat = em.length > 0 && !isLikelyValidEmail(em);

    if (emailMissing) setEmailInvalid(true);
    if (emailBadFormat) setEmailInvalid(true);
    if (pwEmpty) setPasswordMainInvalid(true);

    if (emailMissing || emailBadFormat || pwEmpty) {
      setAuthMessageTone("warning");
      if (emailMissing && pwEmpty) {
        setAuthMessage("Lütfen e-posta ve şifre giriniz.");
      } else if (emailMissing) {
        setAuthMessage("Lütfen e-posta giriniz.");
      } else if (emailBadFormat && pwEmpty) {
        setAuthMessage("Geçerli bir e-posta adresi girin ve şifrenizi yazın.");
      } else if (emailBadFormat) {
        setAuthMessage("Geçerli bir e-posta adresi girin.");
      } else {
        setAuthMessage("Lütfen şifre giriniz.");
      }
      return;
    }

    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setAuthMessageTone("warning");
      setAuthMessage(mapAuthErrorMessage(error.message, "signIn"));
      return;
    }
    setAuthMessageTone("success");
    setAuthMessage("Giriş başarılı.");
    setSnackbarTone("success");
    setSnackbarMessage("Giriş başarılı.");
    setAuthModalOpen(false);
    setPassword("");
    setPasswordConfirm("");
  };

  const requestPasswordReset = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setAuthMessage("");
    const em = email.trim();
    if (!em) {
      setAuthMessageTone("warning");
      setEmailInvalid(true);
      setAuthMessage("Şifre sıfırlama için e-posta adresinizi girin.");
      return;
    }
    if (!isLikelyValidEmail(em)) {
      setAuthMessageTone("warning");
      setEmailInvalid(true);
      setAuthMessage("Geçerli bir e-posta adresi girin.");
      return;
    }
    setLoading(true);
    const origin = getOAuthRedirectOrigin();
    const { error } = await sb.auth.resetPasswordForEmail(em, {
      redirectTo: `${origin}/auth/confirm`,
    });
    setLoading(false);
    if (error) {
      setAuthMessageTone("warning");
      setAuthMessage(error.message);
      return;
    }
    setAuthMessageTone("success");
    setAuthMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
  };

  const signUpWithEmail = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setAuthMessage("");
    setEmailInvalid(false);
    setFirstNameInvalid(false);
    setLastNameInvalid(false);
    setBirthInvalid(false);
    setPasswordMainInvalid(false);
    setPasswordConfirmInvalid(false);

    const fnOk = firstName.trim().length > 0;
    const lnOk = lastName.trim().length > 0;
    const birthOk = birthDate.trim().length > 0;
    const em = email.trim();
    const emailMissing = em.length === 0;
    const emailBadFormat = em.length > 0 && !isLikelyValidEmail(em);
    const pw = password;
    const pwc = passwordConfirm;
    const pwEmpty = pw.trim().length === 0;
    const pwcEmpty = pwc.trim().length === 0;
    const pwMismatch = pw.trim().length > 0 && pwc.trim().length > 0 && pw !== pwc;
    const pwTooShort = pw.trim().length > 0 && pw.length < 6;

    if (!fnOk) setFirstNameInvalid(true);
    if (!lnOk) setLastNameInvalid(true);
    if (!birthOk) setBirthInvalid(true);
    if (emailMissing || emailBadFormat) setEmailInvalid(true);
    if (pwEmpty) setPasswordMainInvalid(true);
    if (pwcEmpty) setPasswordConfirmInvalid(true);
    if (pwMismatch) {
      setPasswordMainInvalid(true);
      setPasswordConfirmInvalid(true);
    }
    if (pwTooShort) setPasswordMainInvalid(true);

    if (
      !fnOk ||
      !lnOk ||
      !birthOk ||
      emailMissing ||
      emailBadFormat ||
      pwEmpty ||
      pwcEmpty ||
      pwMismatch ||
      pwTooShort
    ) {
      setAuthMessageTone("warning");
      if (!fnOk || !lnOk || !birthOk) {
        setAuthMessage("Lütfen * ile belirtilen tüm alanları eksiksiz doldurun.");
      } else if (emailMissing) {
        setAuthMessage("Lütfen e-posta adresinizi girin.");
      } else if (emailBadFormat) {
        setAuthMessage("Geçerli bir e-posta adresi girin.");
      } else if (pwEmpty || pwcEmpty) {
        setAuthMessage("Lütfen şifre ve şifre tekrar alanlarını doldurun.");
      } else if (pwTooShort) {
        setAuthMessage("Şifre en az 6 karakter olmalıdır.");
      } else if (pwMismatch) {
        setAuthMessage("Şifreler birbiriyle eşleşmiyor.");
      } else {
        setAuthMessage("Lütfen bilgileri kontrol edip tekrar deneyin.");
      }
      return;
    }

    setLoading(true);
    const origin = getOAuthRedirectOrigin();
    const { data, error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          birth_date: birthDate,
        },
      },
    });
    setLoading(false);
    if (error) {
      setAuthMessageTone("warning");
      setAuthMessage(mapAuthErrorMessage(error.message, "signUp"));
      return;
    }
    setAuthMessageTone("success");
    if (data.session) {
      setAuthMessage("Kayıt başarılı. Oturumunuz açıldı.");
      setSnackbarTone("success");
      setSnackbarMessage("Kayıt başarılı. Oturumunuz açıldı.");
    } else {
      setAuthMessage("Kayıt başarılı. E-postanızı doğrulayın.");
    }
    setPasswordConfirm("");
  };

  const signOut = async () => {
    const sb = getSupabase();
    if (!sb) return;
    setLoading(true);
    await sb.auth.signOut();
    setLoading(false);
  };

  if (!configured) {
    return <AuthNotConfigured />;
  }

  if (!user) {
    const modalProps: AuthModalProps = {
      onClose: () => setAuthModalOpen(false),
      authMode,
      setAuthMode,
      loading,
      authMessage,
      authMessageTone,
      email,
      setEmail,
      password,
      setPassword,
      passwordConfirm,
      setPasswordConfirm,
      firstName,
      setFirstName,
      lastName,
      setLastName,
      birthDate,
      setBirthDate,
      emailInvalid,
      setEmailInvalid,
      passwordMainInvalid,
      setPasswordMainInvalid,
      passwordConfirmInvalid,
      setPasswordConfirmInvalid,
      firstNameInvalid,
      setFirstNameInvalid,
      lastNameInvalid,
      setLastNameInvalid,
      birthInvalid,
      setBirthInvalid,
      emailInputRef,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      requestPasswordReset,
      setAuthMessage,
    };

    return (
      <>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={loading}
            aria-haspopup="dialog"
            aria-expanded={authModalOpen}
            aria-label="Giriş yap veya kayıt ol"
            onClick={() => {
              setAuthMode("signIn");
              setAuthMessage("");
              setAuthModalOpen(true);
            }}
            className="group relative flex min-h-[44px] shrink-0 touch-manipulation items-center gap-2.5 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/95 py-2 pl-2 pr-3 shadow-[var(--card-inset-glow)] backdrop-blur-sm transition hover:border-[var(--accent)]/35 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_22%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:pointer-events-none disabled:opacity-50 sm:min-h-0 sm:py-1.5 sm:pl-1.5 sm:pr-2.5"
          >
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/28 to-transparent opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            />
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/[0.14] text-[var(--accent)] ring-1 ring-[var(--accent)]/18">
              <LogIn className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
            </span>
            <span
              className="relative min-w-0 text-[13px] font-semibold leading-tight text-[var(--foreground)] sm:text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="whitespace-nowrap">
                Giriş yap
                <span className="px-1 text-[var(--muted)]">·</span>
                Kayıt ol
              </span>
            </span>
          </button>
          {guestCompanion}
          {authModalOpen ? <AuthModal {...modalProps} /> : null}
        </div>
        {snackbarMessage ? (
          <div className="pointer-events-none fixed bottom-4 left-1/2 z-[10020] w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 px-2">
            <div
              className={`rounded-lg border px-4 py-2 text-sm shadow-lg backdrop-blur ${
                snackbarTone === "success"
                  ? "border-green-500/50 bg-green-950/85 text-green-100"
                  : "border-amber-500/50 bg-amber-950/85 text-amber-100"
              }`}
            >
              {snackbarMessage}
            </div>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <>
      <AccountDropdown
        user={user}
        profile={profileNames}
        loading={loading}
        onSignOut={signOut}
        onMenuOpenChange={(open) => {
          if (open) void fetchProfileNames();
        }}
      />
      {snackbarMessage ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-[10020] w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 px-2">
          <div
            className={`rounded-lg border px-4 py-2 text-sm shadow-lg backdrop-blur ${
              snackbarTone === "success"
                ? "border-green-500/50 bg-green-950/85 text-green-100"
                : "border-amber-500/50 bg-amber-950/85 text-amber-100"
            }`}
          >
            {snackbarMessage}
          </div>
        </div>
      ) : null}
    </>
  );
}
