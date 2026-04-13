"use client";

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
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="match-format">Oyun tipi</Label>
      <Select
        value={value}
        onValueChange={(key) => onChange(key as MatchFormatKey)}
        disabled={disabled}
      >
        <SelectTrigger id="match-format" className="w-full">
          <SelectValue placeholder="Seçin" />
        </SelectTrigger>
        <SelectContent>
          {MATCH_FORMATS.map((format) => (
            <SelectItem key={format.key} value={format.key}>
              {format.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
