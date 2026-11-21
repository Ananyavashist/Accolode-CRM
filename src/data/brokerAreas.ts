/** Static city → locality lists for broker coverage (demo; no Places API). */
export const BROKER_CITY_OPTIONS = ["Delhi", "Gurugram", "Noida", "Mumbai", "Bengaluru"] as const;

export type BrokerCityOption = (typeof BROKER_CITY_OPTIONS)[number];

export const AREAS_BY_CITY: Record<string, string[]> = {
  Delhi: [
    "Saket",
    "Malviya Nagar",
    "Hauz Khas",
    "Connaught Place",
    "Dwarka",
    "Rohini",
    "Vasant Kunj",
    "Greater Kailash",
    "Karol Bagh",
    "Lajpat Nagar",
  ],
  Gurugram: [
    "DLF Phase 1",
    "DLF Phase 2",
    "Sector 29",
    "Sector 56",
    "Sohna Road",
    "Golf Course Road",
    "Sector 14",
  ],
  Noida: ["Sector 18", "Sector 62", "Sector 50", "Sector 76", "Greater Noida West", "Sector 137"],
  Mumbai: ["Bandra", "Andheri", "Powai", "Worli", "Juhu", "Lower Parel", "Thane"],
  Bengaluru: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "MG Road"],
};

export function areasForCity(city: string): string[] {
  return AREAS_BY_CITY[city] ?? [];
}