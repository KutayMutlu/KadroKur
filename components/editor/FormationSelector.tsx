"use client";

import { useLocale } from "@/components/locale-provider";
import type { FormationDefinition } from "@/types/formation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormationSelectorProps {
  value: string;
  onChange: (key: string) => void;
  options: FormationDefinition[];
  disabled?: boolean;
}

export function FormationSelector({
  value,
  onChange,
  options,
  disabled,
}: FormationSelectorProps) {
  const { strings: ui } = useLocale();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="formation">{ui.editorFormationLabel}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id="formation" className="w-full">
          <SelectValue placeholder={ui.editorSelectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((f) => (
            <SelectItem key={f.key} value={f.key}>
              {f.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
