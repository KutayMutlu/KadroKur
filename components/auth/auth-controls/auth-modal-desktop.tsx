"use client";

import { BirthDatePicker } from "@/components/auth/BirthDatePicker";
import { Button } from "@/components/ui/button";
import type { AuthModalPanelProps } from "./types";
import {
  emailInputClassDesktop,
  passwordConfirmClassDesktop,
  passwordMainClassDesktop,
  textFieldClassDesktop,
} from "./field-classes";
import { GoogleMark } from "./google-mark";

export function AuthModalDesktop(props: AuthModalPanelProps) {
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
  } = props;

  return (
    <div className="relative hidden min-h-[440px] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 sm:block sm:min-h-[480px] sm:max-h-[min(78vh,640px)]">
      <div
        className={`absolute left-0 top-0 h-full w-1/2 p-5 transition-opacity duration-300 ease-out ${
          authMode === "signIn" ? "z-20 opacity-100 pointer-events-auto" : "z-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-3">
          <h4 className="text-xl font-semibold text-white">Giriş Yap</h4>
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
            className={emailInputClassDesktop(emailInvalid)}
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
            className={passwordMainClassDesktop(passwordMainInvalid)}
          />
          <Button type="button" onClick={() => void signInWithEmail()} disabled={loading}>
            Giriş Yap
          </Button>
          <div className="text-center">
            <button
              type="button"
              className="text-sm font-medium text-white/90 underline-offset-2 hover:text-white hover:underline focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
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
              className="h-11 w-11 shrink-0 p-0"
              title="Google ile devam et"
              aria-label="Google ile devam et"
            >
              <GoogleMark className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`absolute right-0 top-0 min-h-full w-1/2 p-5 transition-opacity duration-300 ease-out ${
          authMode === "signUp" ? "z-20 opacity-100 pointer-events-auto" : "z-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex min-h-full flex-col justify-center gap-2.5 py-1 sm:gap-3 sm:py-2">
          <h4 className="text-xl font-semibold text-white">Kayıt Ol</h4>
          <p className="text-xs text-white/70">Ad, soyad, doğum tarihi ve hesap bilgilerinizi girin.</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              id="kadrokur-signup-firstname-lg"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setFirstNameInvalid(false);
              }}
              placeholder="Ad *"
              autoComplete="given-name"
              aria-invalid={firstNameInvalid}
              className={textFieldClassDesktop(firstNameInvalid)}
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
              className={textFieldClassDesktop(lastNameInvalid)}
            />
          </div>
          <BirthDatePicker
            id="kadrokur-signup-birthdate-lg"
            value={birthDate}
            onChange={(v) => {
              setBirthDate(v);
              setBirthInvalid(false);
            }}
            invalid={birthInvalid}
            variant="desktop"
            aria-label="Doğum tarihi"
            emptyPlaceholder="Doğum tarihi seçin *"
          />
          <input
            id="kadrokur-signup-email-lg"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailInvalid(false);
            }}
            placeholder="E-posta *"
            autoComplete="email"
            aria-invalid={emailInvalid}
            className={emailInputClassDesktop(emailInvalid)}
          />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
              className={passwordMainClassDesktop(passwordMainInvalid)}
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
              className={passwordConfirmClassDesktop(passwordConfirmInvalid)}
            />
          </div>
          <Button type="button" onClick={() => void signUpWithEmail()} disabled={loading} className="w-full">
            Kayıt Ol
          </Button>
        </div>
      </div>

      <div
        className={`absolute top-0 z-30 h-full w-1/2 bg-gradient-to-br from-indigo-600/95 via-violet-600/95 to-fuchsia-600/95 p-5 text-white transition-transform duration-500 ease-in-out ${
          authMode === "signIn" ? "left-1/2 translate-x-0" : "left-1/2 -translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h4 className="text-2xl font-bold">{authMode === "signIn" ? "Merhaba!" : "Tekrar Hoş Geldin!"}</h4>
          <p className="mt-2 text-sm text-white/85">
            {authMode === "signIn" ? "Hesabın yoksa hızlıca kayıt ol." : "Zaten hesabın varsa giriş yapıp devam et."}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-5 border-0 bg-white/95 font-semibold text-slate-900 shadow-md hover:bg-white hover:text-slate-900"
            onClick={() => {
              if (authMode === "signIn") {
                setAuthMode("signUp");
              } else {
                setAuthMode("signIn");
              }
            }}
          >
            {authMode === "signIn" ? "Kayıt Ol" : "Giriş Yap"}
          </Button>
        </div>
      </div>
    </div>
  );
}
