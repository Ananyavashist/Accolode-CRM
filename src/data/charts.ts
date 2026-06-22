export const leadAcquisition = [
  { date: "01/01", direct: 60, social: 150, platform: 120 },
  { date: "01/05", direct: 210, social: 90, platform: 180 },
  { date: "01/10", direct: 130, social: 200, platform: 70 },
  { date: "01/15", direct: 180, social: 120, platform: 210 },
  { date: "01/20", direct: 100, social: 170, platform: 150 },
  { date: "01/25", direct: 100, social: 50, platform: 110 },
  { date: "01/30", direct: 160, social: 210, platform: 90 },
];

export type AcquisitionPoint = (typeof leadAcquisition)[number];

export function filterAcquisitionByPeriod(period: string): AcquisitionPoint[] {
  switch (period) {
    case "Last 7 Days":
      return leadAcquisition.slice(0, 2);
    case "Last 90 Days":
      return leadAcquisition;
    case "This Month":
      return leadAcquisition.slice(-2);
    default:
      return leadAcquisition;
  }
}

export function sumAcquisitionTotal(data: AcquisitionPoint[]): number {
  return data.reduce((sum, d) => sum + d.direct + d.social + d.platform, 0);
}

import { PLATFORM_COLORS } from "@/lib/theme";

export const platformLeads = [
  { name: "ShiftHona", value: 38, color: PLATFORM_COLORS.ShiftHona },
  { name: "Magicbricks", value: 34, color: PLATFORM_COLORS.Magicbricks },
  { name: "99acres", value: 28, color: PLATFORM_COLORS["99acres"] },
];

export const propertiesOverview = [
  { month: "July", rent: 32, sold: 48 },
  { month: "August", rent: 30, sold: 22 },
  { month: "September", rent: 40, sold: 34 },
  { month: "October", rent: 52, sold: 30 },
  { month: "November", rent: 28, sold: 24 },
  { month: "December", rent: 30, sold: 18 },
];

export type PropertiesPoint = (typeof propertiesOverview)[number];

export function filterPropertiesByPeriod(period: string): PropertiesPoint[] {
  switch (period) {
    case "Last 3 Months":
      return propertiesOverview.slice(-3);
    case "Last 12 Months":
      return propertiesOverview;
    default:
      return propertiesOverview;
  }
}
