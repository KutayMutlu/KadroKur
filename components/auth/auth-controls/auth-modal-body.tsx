"use client";

import { BirthDatePicker } from "@/components/auth/BirthDatePicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthModalPanelProps } from "./types";
import { authModalFieldClass } from "./field-classes";
import { GoogleMark } from "./google-mark";

export function AuthModalBody(props: AuthModalPanelProps) {
  const {
    authMode,
    setAuthMode,
    loading,
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
  } = props;

  const field = authModalFieldClass;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Sekmeler — ortalanmış */}
      <div
        className="mx-auto flex w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-black/[0.18] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:bg-black/25"
        role="tablist"
        aria-label="Giriş veya kayıt"
      >
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "signIn"}
          className={cn(
            "flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition sm:py-2.5",
            authMode === "signIn"
              ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md shadow-[var(--accent)]/20"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
          style={authMode === "signIn" ? { fontFamily: "var(--font-display)" } : undefined}
          onClick={() => {
            setAuthMode("signIn");
            setAuthMessage("");
          }}
        >
          Giriş yap
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "signUp"}
          className={cn(
            "flex-1 rounded-xl px-3 py-2.5 text-center text-sm font-semibold transition sm:py-2.5",
            authMode === "signUp"
              ? "bg-[var(--accent)] text-[var(--on-accent)] shadow-md shadow-[var(--accent)]/20"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          )}
          style={authMode === "signUp" ? { fontFamily: "var(--font-display)" } : undefined}
          onClick={() => {
            setAuthMode("signUp");
            setAuthMessage("");
          }}
        >
          Kayıt ol
        </button>
      </div>

      <p className="mt-4 text-center text-sm leading-relaxed text-[var(--muted)]">
        {authMode === "signIn"
          ? "E-posta ve şifrenle oturum aç."
          : "Ad, soyad ve doğum tarihini gir; hesabını oluştur."}
      </p>

      <div className="mt-6 space-y-3 sm:space-y-3.5">
        {authMode === "signIn" ? (
          <>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailInvalid(false);
              }}
              placeholder="E-posta adresin"
              autoComplete="email"
              aria-invalid={emailInvalid}
              className={field(emailInvalid)}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordMainInvalid(false);
              }}
              placeholder="Şifre"
              autoComplete="current-password"
              aria-invalid={passwordMainInvalid}
              className={field(passwordMainInvalid)}
            />
            <Button
              type="button"
              onClick={() => void signInWithEmail()}
              disabled={loading}
              className="h-12 w-full touch-manipulation text-base font-semibold sm:h-11 sm:text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Giriş yap
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-[var(--accent)] underline-offset-4 transition hover:underline focus:outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 disabled:opacity-50"
                disabled={loading}
                onClick={() => void requestPasswordReset()}
              >
                Şifremi unuttum
              </button>
            </div>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                <span className="bg-[var(--bg-card)] px-3 py-0.5">veya</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void signInWithGoogle()}
              disabled={loading}
              className="flex h-12 w-full touch-manipulation items-center justify-center gap-2.5 border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 text-[var(--foreground)] hover:border-[var(--accent)]/35 hover:bg-[var(--bg-elevated)] sm:h-11"
            >
              <GoogleMark className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Google ile devam et</span>
            </Button>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
              <input
                id="kadrokur-signup-firstname"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameInvalid(false);
                }}
                placeholder="Ad *"
                autoComplete="given-name"
                aria-invalid={firstNameInvalid}
                className={field(firstNameInvalid)}
              />
              <input
                id="kadrokur-signup-lastname"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameInvalid(false);
                }}
                placeholder="Soyad *"
                autoComplete="family-name"
                aria-invalid={lastNameInvalid}
                className={field(lastNameInvalid)}
              />
            </div>
            <BirthDatePicker
              id="kadrokur-signup-birthdate"
              value={birthDate}
              onChange={(v) => {
                setBirthDate(v);
                setBirthInvalid(false);
              }}
              invalid={birthInvalid}
              variant="mobile"
              aria-label="Doğum tarihi"
              emptyPlaceholder="Doğum tarihi seçin *"
            />
            <input
              id="kadrokur-signup-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailInvalid(false);
              }}
              placeholder="E-posta *"
              autoComplete="email"
              aria-invalid={emailInvalid}
              className={field(emailInvalid)}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordMainInvalid(false);
                }}
                placeholder="Şifre *"
                autoComplete="new-password"
                aria-invalid={passwordMainInvalid}
                className={field(passwordMainInvalid)}
              />
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  setPasswordConfirmInvalid(false);
                }}
                placeholder="Şifre tekrar *"
                autoComplete="new-password"
                aria-invalid={passwordConfirmInvalid}
                className={field(passwordConfirmInvalid)}
              />
            </div>
            <Button
              type="button"
              onClick={() => void signUpWithEmail()}
              disabled={loading}
              className="h-12 w-full touch-manipulation text-base font-semibold sm:h-11 sm:text-sm"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Hesap oluştur
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <span className="w-full border-t border-[var(--border-subtle)]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                <span className="bg-[var(--bg-card)] px-3 py-0.5">veya</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void signInWithGoogle()}
              disabled={loading}
              className="flex h-12 w-full touch-manipulation items-center justify-center gap-2.5 border-[var(--border-subtle)] bg-[var(--bg-elevated)]/90 text-[var(--foreground)] hover:border-[var(--accent)]/35 hover:bg-[var(--bg-elevated)] sm:h-11"
            >
              <GoogleMark className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Google ile kayıt ol</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
