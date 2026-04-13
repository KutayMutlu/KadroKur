/**
 * Forma şablonu — ileride kullanıcı kit kütüphanesi / özel SVG ile genişletilecek.
 * Şimdilik: düz ve dikey şerit (klasik kulüp görünümü).
 */
export type JerseyPatternId = "solid" | "vertical_stripes";

/** Oyuncuya bağlı forma tercihi (persist; opsiyonel alanlar geriye dönük uyumlu). */
export interface JerseyKitRef {
  pattern?: JerseyPatternId;
  /** İkincil renk (şerit, yaka çizgisi, şort bölümü vb.) */
  secondary?: string;
  /** Numara / detay vurgusu (varsayılan: beyaza yakın veya otomatik kontrast) */
  accent?: string;
}

/** Sahada çizim için çözümlenmiş renk + desen. */
export interface ResolvedJerseyKit {
  pattern: JerseyPatternId;
  primary: string;
  secondary: string;
  accent: string;
}
