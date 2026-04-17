import type { RefObject } from "react";
import type { ReactNode } from "react";

export type AuthControlsProps = {
  /** Giriş yokken gösterilir (ör. tema); giriş yapılınca tema hesap menüsüne taşınır. */
  guestCompanion?: ReactNode;
};

export type AuthModalProps = {
  onClose: () => void;
  authMode: "signIn" | "signUp";
  setAuthMode: (m: "signIn" | "signUp") => void;
  loading: boolean;
  authMessage: string;
  authMessageTone: "success" | "warning";
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
  emailInvalid: boolean;
  setEmailInvalid: (v: boolean) => void;
  passwordMainInvalid: boolean;
  setPasswordMainInvalid: (v: boolean) => void;
  passwordConfirmInvalid: boolean;
  setPasswordConfirmInvalid: (v: boolean) => void;
  firstNameInvalid: boolean;
  setFirstNameInvalid: (v: boolean) => void;
  lastNameInvalid: boolean;
  setLastNameInvalid: (v: boolean) => void;
  birthInvalid: boolean;
  setBirthInvalid: (v: boolean) => void;
  emailInputRef: RefObject<HTMLInputElement | null>;
  signInWithEmail: () => void | Promise<void>;
  signUpWithEmail: () => void | Promise<void>;
  signInWithGoogle: () => void | Promise<void>;
  requestPasswordReset: () => void | Promise<void>;
  setAuthMessage: (s: string) => void;
};

/** Mobil / masaüstü formlar; mesaj satırı portalda gösterilir. */
export type AuthModalPanelProps = Omit<AuthModalProps, "onClose" | "authMessage" | "authMessageTone">;
