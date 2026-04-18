import type { MatchFormatKey } from "@/lib/formations";
import type { TacticalPresetKey } from "@/lib/presets";
import type { UiStrings } from "@/lib/ui-strings";

export function matchFormatLabel(s: UiStrings, key: MatchFormatKey): string {
  const m: Record<MatchFormatKey, string> = {
    "5v5": s.editorMatch_5v5,
    "6v6": s.editorMatch_6v6,
    "7v7": s.editorMatch_7v7,
    "8v8": s.editorMatch_8v8,
    "9v9": s.editorMatch_9v9,
    "10v10": s.editorMatch_10v10,
    "11v11": s.editorMatch_11v11,
  };
  return m[key];
}

export function presetLabel(s: UiStrings, key: TacticalPresetKey): string {
  const m: Record<TacticalPresetKey, string> = {
    default: s.editorPreset_default,
    press: s.editorPreset_press,
    counter: s.editorPreset_counter,
    possession: s.editorPreset_possession,
    low_block: s.editorPreset_low_block,
  };
  return m[key];
}
