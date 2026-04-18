/**
 * Ad veya soyadı kayıtta tutarken: her boşlukla ayrılmış kelimenin ilk harfi büyük (tr-TR),
 * geri kalanı küçük. Örn. "ahmet", "MEHMET ali" → "Ahmet", "Mehmet Ali".
 */
export function normalizePersonNameForStorage(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      const lower = word.toLocaleLowerCase("tr-TR");
      if (!lower) return "";
      const first = lower.charAt(0).toLocaleUpperCase("tr-TR");
      return first + lower.slice(1);
    })
    .join(" ");
}
