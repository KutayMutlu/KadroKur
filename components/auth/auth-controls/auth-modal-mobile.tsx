"use client";

import { BirthDatePicker } from "@/components/auth/BirthDatePicker";
import { Button } from "@/components/ui/button";
import type { AuthModalPanelProps } from "./types";
import {
  emailInputClassMobile,
  passwordConfirmClassMobile,
  passwordMainClassMobile,
  textFieldClassMobile,
} from "./field-classes";
import { GoogleMark } from "./google-mark";

export function AuthModalMobile(props: AuthModalPanelProps) {
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

  return (
    <div className="sm:hidden">
      <div className="mb-4 space-y-1 pr-10 text-center">
        {authMode === "signIn" ? (
          <>
            <h2 className="text-lg font-semibold leading-snug text-[var(--foreground)]">Giriş Yap</h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Hesabınıza giriş yapmak için e-posta ve şifrenizi girin.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold leading-snug text-[var(--foreground)]">Kayıt Ol</h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Ad, soyad, doğum tarihi ve hesap bilgilerinizi girin.
            </p>
          </>
        )}
      </div>
      <div className="space-y-3">
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
              placeholder="E-posta"
              autoComplete="email"
              aria-invalid={emailInvalid}
              className={emailInputClassMobile(emailInvalid)}
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
              className={passwordMainClassMobile(passwordMainInvalid)}
            />
            <Button type="button" onClick={() => void signInWithEmail()} disabled={loading} className="w-full">
              Giriş Yap
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 disabled:opacity-50"
                disabled={loading}
                onClick={() => void requestPasswordReset()}
              >
                Şifremi unuttum?
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void signInWithGoogle()}
                disabled={loading}
                className="h-11 w-11 shrink-0 touch-manipulation p-0"
                title="Google ile devam et"
                aria-label="Google ile devam et"
              >
                <GoogleMark className="h-6 w-6" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                id="kadrokur-signup-firstname-sm"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameInvalid(false);
                }}
                placeholder="Ad *"
                autoComplete="given-name"
                aria-invalid={firstNameInvalid}
                className={textFieldClassMobile(firstNameInvalid)}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameInvalid(false);
                }}
                placeholder="Soyad *"
                autoComplete="family-name"
                aria-invalid={lastNameInvalid}
                className={textFieldClassMobile(lastNameInvalid)}
              />
            </div>
            <BirthDatePicker
              id="kadrokur-signup-birthdate-sm"
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
              id="kadrokur-signup-email-sm"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailInvalid(false);
              }}
              placeholder="E-posta *"
              autoComplete="email"
              aria-invalid={emailInvalid}
              className={emailInputClassMobile(emailInvalid)}
            />
            <div className="grid grid-cols-2 gap-2.5">
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
                className={passwordMainClassMobile(passwordMainInvalid)}
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
                className={passwordConfirmClassMobile(passwordConfirmInvalid)}
              />
            </div>
            <Button type="button" onClick={() => void signUpWithEmail()} disabled={loading} className="w-full">
              Kayıt Ol
            </Button>
          </>
        )}
        <div className="text-center text-sm text-[var(--muted)]">
          {authMode === "signIn" ? (
            <div className="flex flex-col items-center gap-1">
              <span>Hesabın yok mu?</span>
              <button
                type="button"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
                onClick={() => {
                  setAuthMode("signUp");
                  setAuthMessage("");
                }}
              >
                Kayıt ol
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span>Zaten hesabın var mı?</span>
              <button
                type="button"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50"
                onClick={() => {
                  setAuthMode("signIn");
                  setAuthMessage("");
                }}
              >
                Giriş yap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
