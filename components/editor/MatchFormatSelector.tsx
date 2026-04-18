"use client";

import { useLocale } from "@/components/locale-provider";
import { matchFormatLabel } from "@/lib/editor-i18n";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MATCH_FORMATS, type MatchFormatKey } from "@/lib/formations";

export interface MatchFormatSelectorProps {
  value: MatchFormatKey;
  onChange: (key: MatchFormatKey) => void;
  disabled?: boolean;
}

export function MatchFormatSelector({
  value,
  onChange,
  disabled,
}: MatchFormatSelectorProps) {
  const { strings: ui } = useLocale();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="match-format">{ui.editorMatchTypeLabel}</Label>
      <Select
        value={value}
        onValueChange={(key) => onChange(key as MatchFormatKey)}
        disabled={disabled}
      >
        <SelectTrigger id="match-format" className="w-full">
          <SelectValue placeholder={ui.editorSelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {MATCH_FORMATS.map((format) => (
            <SelectItem key={format.key} value={format.key}>
              {matchFormatLabel(ui, format.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
