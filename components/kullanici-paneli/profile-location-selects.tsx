"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { panelLabelClass } from "@/app/kullanici-paneli/panel-form";
import { cn } from "@/lib/utils";
import type { LocationCatalog } from "@/lib/turkiye-location.types";

const labelClass = panelLabelClass;

/** Radix Select boş değer için placeholder item (value="" desteklenmediği için) */
const EMPTY = "__kadrokur_empty__";

function normalizePlate(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!/^\d{1,2}$/.test(s)) return "";
  const n = Number(s);
  if (n < 1 || n > 81) return "";
  return String(n);
}

function normalizeDistrictId(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!/^\d+$/.test(s)) return "";
  return s;
}

export type ProfileLocationSelectsProps = {
  catalog: LocationCatalog;
  /** DB: plaka kodu string, örn. "34" — boş olabilir */
  initialCity: string | null | undefined;
  /** DB: ilçe apiId string — boş olabilir */
  initialDistrict: string | null | undefined;
};

export function ProfileLocationSelects({
  catalog,
  initialCity,
  initialDistrict,
}: ProfileLocationSelectsProps) {
  const { strings: ui } = useLocale();
  const [plate, setPlate] = useState(() => normalizePlate(initialCity));

  const [districtId, setDistrictId] = useState(() => {
    const p = normalizePlate(initialCity);
    const d = normalizeDistrictId(initialDistrict);
    if (!p || !d) return "";
    return catalog.districtsByPlate[p]?.some((x) => x.id === d) ? d : "";
  });

  const districtOptions = useMemo(() => {
    if (!plate) return [];
    return catalog.districtsByPlate[plate] ?? [];
  }, [catalog.districtsByPlate, plate]);

  const districtDisabled = !plate;
  const districtHint = districtDisabled ? ui.panelLocationPickCityFirst : undefined;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <input type="hidden" name="city" value={plate} />
      <input type="hidden" name="district" value={plate ? districtId : ""} />

      <div className="space-y-2">
        <span className={labelClass} id="profile-location-city-label">
          {ui.panelLocationCity}
        </span>
        <Select
          value={plate || EMPTY}
          onValueChange={(v) => {
            const next = v === EMPTY ? "" : v;
            setPlate(next);
            setDistrictId("");
          }}
        >
          <SelectTrigger
            id="profile-location-city"
            className="w-full"
            aria-labelledby="profile-location-city-label"
          >
            <SelectValue placeholder={ui.panelLocationSelectCity} />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6}>
            <SelectItem value={EMPTY} className="text-[var(--muted)]">
              {ui.panelLocationSelectCity}
            </SelectItem>
            {catalog.provinces.map((p) => (
              <SelectItem key={p.plate} value={p.plate}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={cn("space-y-2 transition-opacity", districtDisabled && "opacity-50")}
        title={districtHint}
      >
        <span className={labelClass} id="profile-location-district-label">
          {ui.panelLocationDistrict}
        </span>
        <Select
          disabled={districtDisabled}
          value={districtId || EMPTY}
          onValueChange={(v) => setDistrictId(v === EMPTY ? "" : v)}
        >
          <SelectTrigger
            id="profile-location-district"
            className={cn("w-full", districtDisabled && "cursor-not-allowed")}
            aria-labelledby="profile-location-district-label"
            aria-disabled={districtDisabled}
          >
            <SelectValue
              placeholder={districtDisabled ? ui.panelLocationSelectCityFirst : ui.panelLocationSelectDistrict}
            />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={6}>
            <SelectItem value={EMPTY} className="text-[var(--muted)]">
              {districtDisabled ? ui.panelLocationSelectCityFirst : ui.panelLocationSelectDistrict}
            </SelectItem>
            {districtOptions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
