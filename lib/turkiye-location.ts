import "server-only";

/**
 * turkiye-db (turkey-location-data) paketi fs + __dirname ile JSON okur; Next/Turbopack
 * paketlemesinde yol bozulup ENOENT veriyor. Veriyi doğrudan JSON import ile yüklüyoruz.
 */
import plateCodesJson from "turkiye-db/data/plate_codes.json";
import turkeyLocationData from "turkiye-db/data/turkey_location_data.json";

import type { DistrictOption, LocationCatalog, ProvinceOption } from "./turkiye-location.types";

export type { DistrictOption, LocationCatalog, ProvinceOption } from "./turkiye-location.types";

type ProvinceRow = {
  name: string;
  apiId: number;
  districts: { name: string; apiId: number }[];
};

const PROVINCES = turkeyLocationData as ProvinceRow[];

function getProvinceNameByPlateCode(plate: number): string | null {
  const name = (plateCodesJson as Record<string, string>)[String(plate)];
  return name ?? null;
}

function getAllProvinces(): { name: string; apiId: number }[] {
  return PROVINCES.map(({ name, apiId }) => ({ name, apiId }));
}

function getDistrictsByProvinceApiId(provinceApiId: number): { name: string; apiId: number }[] {
  const province = PROVINCES.find((p) => p.apiId === provinceApiId);
  return province?.districts.map(({ name, apiId }) => ({ name, apiId })) ?? [];
}

/**
 * Plaka kodu (1–81) ve turkiye-db il apiId eşlemesi ile tüm iller + il ilçe listeleri.
 */
export function getLocationCatalog(): LocationCatalog {
  const provinces = getAllProvinces();
  const apiIdByName = new Map(provinces.map((p) => [p.name, p.apiId]));

  const provinceOptions: ProvinceOption[] = [];
  const districtsByPlate: Record<string, DistrictOption[]> = {};

  for (let plate = 1; plate <= 81; plate++) {
    const name = getProvinceNameByPlateCode(plate);
    if (!name) continue;
    const provinceApiId = apiIdByName.get(name);
    if (provinceApiId === undefined) continue;

    const plateKey = String(plate);
    provinceOptions.push({ plate: plateKey, name });

    const districts = getDistrictsByProvinceApiId(provinceApiId)
      .map((d) => ({ id: String(d.apiId), name: d.name }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
    districtsByPlate[plateKey] = districts;
  }

  provinceOptions.sort((a, b) => Number(a.plate) - Number(b.plate));

  return { provinces: provinceOptions, districtsByPlate };
}

/** DB’deki plaka + ilçe id’sinden okunabilir etiket (profil önizleme / doğrulama). */
export function resolveLocationLabels(
  cityPlate: string | null | undefined,
  districtId: string | null | undefined
): { cityName: string | null; districtName: string | null } {
  const plate = cityPlate?.trim() ?? "";
  const dId = districtId?.trim() ?? "";
  if (!plate || !/^\d{1,2}$/.test(plate)) {
    return { cityName: null, districtName: null };
  }

  const pNum = Number(plate);
  if (pNum < 1 || pNum > 81) {
    return { cityName: null, districtName: null };
  }

  const cityName = getProvinceNameByPlateCode(pNum);
  if (!cityName) return { cityName: null, districtName: null };

  const provinces = getAllProvinces();
  const province = provinces.find((x) => x.name === cityName);
  if (!province) return { cityName, districtName: null };

  if (!dId) return { cityName, districtName: null };

  const did = Number(dId);
  if (!Number.isFinite(did)) return { cityName, districtName: null };

  const districts = getDistrictsByProvinceApiId(province.apiId);
  const found = districts.find((x) => x.apiId === did);
  return { cityName, districtName: found?.name ?? null };
}

/** Kayıtta ilçe id’sinin seçili plakaya ait olduğunu doğrula. */
export function isValidDistrictForPlate(plate: string, districtId: string): boolean {
  const p = Number(plate);
  if (!Number.isFinite(p) || p < 1 || p > 81) return false;
  const cityName = getProvinceNameByPlateCode(p);
  if (!cityName) return false;
  const provinces = getAllProvinces();
  const province = provinces.find((x) => x.name === cityName);
  if (!province) return false;
  const did = Number(districtId);
  if (!Number.isFinite(did)) return false;
  return getDistrictsByProvinceApiId(province.apiId).some((x) => x.apiId === did);
}
