import type { AppLocale } from "./app-locale";
import { editorUiStrings } from "./editor-ui-strings";
import { panelUiStrings } from "./panel-ui-strings";

/** Ayarlar, site başlığı, ana sayfa, kayıtlı taktikler — locale ile seçilir */
export const uiStrings = {
  tr: {
    settingsTitle: "Görünüm ve dil",
    settingsAria: "Görünüm ve dil ayarları",
    theme: "Tema",
    themeSelectionAria: "Tema seçimi",
    themeLight: "Açık",
    themeDark: "Koyu",
    themeSystem: "Sistem",
    themeSystemHint: "Şu an: {mode} (cihaz ayarı)",
    themeModeDark: "koyu",
    themeModeLight: "açık",
    language: "Dil",
    languageSelectionAria: "Dil seçimi",
    langTr: "Türkçe",
    langEn: "English",
    langFootnote:
      "Dil tercihin kaydedilir. Diğer sayfaların çevirisi kademeli eklenir.",
    siteTagline: "Halı saha taktik tahtası",
    editorLinkShort: "Editör →",
    editorLinkLong: "Editöre git →",

    homeBadge: "Halı saha taktik editörü",
    homeHeroLine1: "Stratejin cebinde,",
    homeHeroGradient: "Halı saha ritmiyle.",
    homeLead:
      "KadroKur ile dizilişini belirle, stratejini saniyeler içinde çiz ve anında paylaş. Maçın kaderini belirleyen son dokunuş senin elinde.",
    homeCtaStart: "Taktik kurmaya başla",
    homeCtaSaved: "Kayıtlı taktikler",
    homeAnchorHow: "Nasıl çalışır?",
    homeAnchorList: "Listeme git",
    homeFeat1Label: "Çoklu diziliş",
    homeFeat1Sub: "2-3-1, 3-2-1…",
    homeFeat2Label: "PNG dışa aktar",
    homeFeat2Sub: "Tek dokunuşla",
    homeFeat3Label: "Link ile paylaş",
    homeFeat3Sub: "Salt okunur görünüm",
    homeHowTitle: "Nasıl çalışır?",
    homeHowIntro:
      "Üç kısa adımda taktik hazır; hesabın varsa taktikler bulutta da senkronlanır.",
    homeHow1Title: "Takım ve diziliş",
    homeHow1Text:
      "Maç formatını seç, kendi dizilişini kur; istersen rakip çizgisi ekle.",
    homeHow2Title: "Sürükle ve düzenle",
    homeHow2Text:
      "Oyuncuları sahada konumlandır; çift tıkla isim ve forma ayarlarını aç.",
    homeHow3Title: "Kaydet ve paylaş",
    homeHow3Text: "PNG al, buluta kaydet veya tek linkle takımına gönder.",
    homeHowCta: "Editöre geç",
    footerAfterBrand: "— halı saha için taktik editörü",
    footerTagline: "Diziliş · kayıt · paylaşım — tek yerde.",

    tacticsSrTitle: "Kayıtlı taktikler",
    tacticsEmptyBody:
      "Henüz kayıtlı taktik yok. Editörde bir diziliş kaydettiğinde burada listelenecek.",
    tacticsCtaFirst: "İlk taktikini oluştur",
    tacticsSectionTitle: "Kayıtlı taktikler",
    tacticsSectionSubtitle: "Bu cihazdaki ve hesabınızdaki kayıtlar",
    tacticsCloudHeading: "Hesabımdaki taktikler",
    tacticsLocalHeading: "Bu cihazdaki kayıtlar",

    accountMenuAria: "Hesap menüsü: {name}",
    accountShortcutsHeading: "Kısayollar",
    accountLinkUserPanel: "Kullanıcı paneli",
    accountLinkMyTactics: "Taktiklerim",
    accountSignOut: "Çıkış yap",
  },
  en: {
    settingsTitle: "Appearance & language",
    settingsAria: "Appearance and language settings",
    theme: "Theme",
    themeSelectionAria: "Theme selection",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    themeSystemHint: "Currently: {mode} (device setting)",
    themeModeDark: "dark",
    themeModeLight: "light",
    language: "Language",
    languageSelectionAria: "Language selection",
    langTr: "Turkish",
    langEn: "English",
    langFootnote:
      "Your preference is saved. More screens are translated gradually.",
    siteTagline: "Indoor football tactics board",
    editorLinkShort: "Editor →",
    editorLinkLong: "Open editor →",

    homeBadge: "Indoor football tactics editor",
    homeHeroLine1: "Your strategy in your pocket,",
    homeHeroGradient: "Five-a-side rhythm.",
    homeLead:
      "With KadroKur, set your formation, sketch your strategy in seconds, and share instantly. The final touch that decides the match is in your hands.",
    homeCtaStart: "Start building tactics",
    homeCtaSaved: "Saved tactics",
    homeAnchorHow: "How it works",
    homeAnchorList: "Go to my list",
    homeFeat1Label: "Multiple formations",
    homeFeat1Sub: "2-3-1, 3-2-1…",
    homeFeat2Label: "PNG export",
    homeFeat2Sub: "One tap",
    homeFeat3Label: "Share via link",
    homeFeat3Sub: "Read-only view",
    homeHowTitle: "How it works",
    homeHowIntro:
      "Three quick steps to a ready tactic; with an account, tactics also sync to the cloud.",
    homeHow1Title: "Team & formation",
    homeHow1Text:
      "Choose match format and your lineup; add an opponent line if you want.",
    homeHow2Title: "Drag & edit",
    homeHow2Text:
      "Position players on the pitch; double-tap for name and kit settings.",
    homeHow3Title: "Save & share",
    homeHow3Text: "Export PNG, save to the cloud, or send one link to your team.",
    homeHowCta: "Open editor",
    footerAfterBrand: "— indoor football tactics editor",
    footerTagline: "Formation · save · share — in one place.",

    tacticsSrTitle: "Saved tactics",
    tacticsEmptyBody:
      "No saved tactics yet. Save a lineup in the editor and it will appear here.",
    tacticsCtaFirst: "Create your first tactic",
    tacticsSectionTitle: "Saved tactics",
    tacticsSectionSubtitle: "On this device and in your account",
    tacticsCloudHeading: "In my account",
    tacticsLocalHeading: "On this device",

    accountMenuAria: "Account menu: {name}",
    accountShortcutsHeading: "Shortcuts",
    accountLinkUserPanel: "Account",
    accountLinkMyTactics: "My tactics",
    accountSignOut: "Sign out",
  },
} as const;

export type UiStrings = (typeof uiStrings)[AppLocale] &
  (typeof editorUiStrings)[AppLocale] &
  (typeof panelUiStrings)[AppLocale];

export function getUiStrings(locale: AppLocale): UiStrings {
  return { ...uiStrings[locale], ...editorUiStrings[locale], ...panelUiStrings[locale] };
}
