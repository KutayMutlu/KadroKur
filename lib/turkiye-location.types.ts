export type ProvinceOption = { plate: string; name: string };

export type DistrictOption = { id: string; name: string };

export type LocationCatalog = {
  provinces: ProvinceOption[];
  districtsByPlate: Record<string, DistrictOption[]>;
};
