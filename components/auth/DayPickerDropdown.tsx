"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ChangeEvent } from "react";
import type { DropdownProps } from "react-day-picker";
import { UI } from "react-day-picker";

/**
 * react-day-picker varsayılanı görünmez &lt;select&gt; kullanır; Windows/Edge’de sistem
 * açılır listesi / mavi vurgu tetiklenir. Radix Select ile KadroKur temasına taşır.
 */
export function DayPickerRadixDropdown(props: DropdownProps) {
  const { options, className, classNames, components, ...selectAttrs } = props;
  void components;
  const { value, onChange, disabled, style, "aria-label": ariaLabel } = selectAttrs;

  const mergedDropdownClass = [classNames[UI.Dropdown], className].filter(Boolean).join(" ");
  const strValue = value === undefined || value === null ? "" : String(value);

  return (
    <span className={classNames[UI.DropdownRoot]} data-disabled={disabled ? true : undefined} style={style}>
      <Select
        value={strValue}
        disabled={disabled}
        onValueChange={(v) => {
          const n = Number(v);
          const synthetic = {
            target: { value: n },
            currentTarget: { value: n },
          } as unknown as ChangeEvent<HTMLSelectElement>;
          onChange?.(synthetic);
        }}
      >
        <SelectTrigger
          aria-label={ariaLabel}
          className={cn(
            "kadrokur-daypicker-caption-select !relative !inset-auto !h-9 !w-auto min-w-[6.25rem] max-w-[11rem] shrink-0 !opacity-100 !border-[var(--border-subtle)] bg-[var(--bg-deep)] px-2.5 text-sm text-[var(--foreground)] shadow-none [&_svg]:text-[var(--accent)]",
            mergedDropdownClass
          )}
        >
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={6}
          className="z-[10060] max-h-72 min-w-[var(--radix-select-trigger-width)] border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--foreground)] shadow-lg"
        >
          {options?.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)} disabled={opt.disabled} className="cursor-pointer">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </span>
  );
}
