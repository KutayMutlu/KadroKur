/**
 * OAuth redirectTo tabanı. Varsayılan: tarayıcı origin'i.
 * NEXT_PUBLIC_APP_ORIGIN yalnızca bilinçli kullanımda (tek tip localhost adresi vb.).
 * Yanlışlıkla Vercel URL'si kalırsa giriş production'a düşer.
 */
export function getOAuthRedirectOrigin(): string {
  if (typeof window === "undefined") return "";
  const env = process.env.NEXT_PUBLIC_APP_ORIGIN?.trim().replace(/\/$/, "");
  if (env) return env;
  return window.location.origin;
}
