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

import { isUpcomingCapacityMonth } from "@/lib/crmClock";
import { PLATFORM_COLORS } from "@/lib/theme";

export const platformLeads = [
  { name: "ShiftHona", value: 38, color: PLATFORM_COLORS.ShiftHona },
  { name: "Magicbricks", value: 34, color: PLATFORM_COLORS.Magicbricks },
  { name: "99acres", value: 28, color: PLATFORM_COLORS["99acres"] },
];

export const propertiesOverview = [
  { month: "January", rent: 26, sold: 20 },
  { month: "February", rent: 24, sold: 26 },
  { month: "March", rent: 34, sold: 32 },
  { month: "April", rent: 38, sold: 28 },
  { month: "May", rent: 44, sold: 36 },
  { month: "June", rent: 36, sold: 42 },
  { month: "July", rent: 32, sold: 48 },
  { month: "August", rent: 30, sold: 22 },
  { month: "September", rent: 40, sold: 34 },
  { month: "October", rent: 52, sold: 30 },
  { month: "November", rent: 28, sold: 24 },
  { month: "December", rent: 30, sold: 18 },
];

export type PropertiesPoint = (typeof propertiesOverview)[number];

/** Closed deals per month ,  chart Y domain is fixed 0 to 20. */
const DEAL_CLOSED_TEMPLATE = [
  3, 6, 9, 4, 7, 12, 8, 10, 15, 9, 3, 7,
];

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type DealClosedPoint = {
  month: string;
  monthYear: string;
  closed: number;
};

export function dealClosedForYear(year: number): DealClosedPoint[] {
  return MONTH_LABELS.map((month, i) => ({
    month,
    monthYear: `${month}, ${year}`,
    closed: DEAL_CLOSED_TEMPLATE[i],
  }));
}

export const dealClosedSeries = dealClosedForYear(2026);

export type DealClosedView = "6 months" | "9 months" | "1 year" | `year-${number}`;

export function filterDealClosed(view: DealClosedView): DealClosedPoint[] {
  const series =
    typeof view === "string" && view.startsWith("year-")
      ? dealClosedForYear(Number(view.replace("year-", "")))
      : dealClosedSeries;

  switch (view) {
    case "6 months":
      return series.slice(-6);
    case "9 months":
      return series.slice(-9);
    case "1 year":
      return series;
    default:
      return series;
  }
}

export function filterPropertiesByPeriod(period: string): PropertiesPoint[] {
  switch (period) {
    case "Last 3 Months":
      return propertiesOverview.slice(-3);
    case "Last 12 Months":
      return propertiesOverview;
    case "Last 6 Months":
    default:
      return propertiesOverview.slice(-6);
  }
}

export const CLIENT_CAPACITY_MONTHLY_MAX = 20;
export const CLIENT_CAPACITY_WEEKLY_ACCEPT_MAX = 6;
const CLIENT_CAPACITY_WEEKS_PER_MONTH = 4;

const CLIENT_CAPACITY_MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type ClientCapacityPoint = {
  month: string;
  monthYear: string;
  activeClients: number;
  leadAccepted: number;
  dealClosed: number;
  /** Future month in the reference year — near-zero gray bar on chart */
  isUpcoming?: boolean;
};

function clampCapacity(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Each month partitions the broker's 20 lead slots across active work, new accepts
 * (max 6/week), and deals closed (freeing space before new accepts).
 */
export function clientCapacityForYear(year: number): ClientCapacityPoint[] {
  const yearlySkew = year - 2026;
  let inFlight = 10;
  const weeklyAcceptCap =
    CLIENT_CAPACITY_WEEKLY_ACCEPT_MAX * CLIENT_CAPACITY_WEEKS_PER_MONTH;

  return CLIENT_CAPACITY_MONTH_NAMES.map((month, i) => {
    if (isUpcomingCapacityMonth(month, year)) {
      return {
        month,
        monthYear: `${month}, ${year}`,
        activeClients: 1,
        leadAccepted: 0,
        dealClosed: 0,
        isUpcoming: true,
      };
    }

    let dealClosed = clampCapacity(
      DEAL_CLOSED_TEMPLATE[i] + yearlySkew + (i % 3 === 0 ? 1 : 0),
      2,
      10,
    );
    dealClosed = Math.min(dealClosed, inFlight);
    inFlight -= dealClosed;

    const weeklyPattern = 4 + ((i + yearlySkew + 1) % 4) * 2;
    const slotsOpen = CLIENT_CAPACITY_MONTHLY_MAX - inFlight;
    let leadAccepted = Math.min(weeklyPattern, weeklyAcceptCap, slotsOpen);
    inFlight += leadAccepted;

    let activeClients = Math.max(0, inFlight - leadAccepted);

    let stackTotal = activeClients + leadAccepted + dealClosed;
    if (stackTotal > CLIENT_CAPACITY_MONTHLY_MAX) {
      const trim = stackTotal - CLIENT_CAPACITY_MONTHLY_MAX;
      leadAccepted = Math.max(0, leadAccepted - trim);
      activeClients = Math.max(0, inFlight - leadAccepted);
      if (activeClients + leadAccepted + dealClosed > CLIENT_CAPACITY_MONTHLY_MAX) {
        activeClients = CLIENT_CAPACITY_MONTHLY_MAX - dealClosed - leadAccepted;
      }
    }

    inFlight = activeClients + leadAccepted;

    return {
      month,
      monthYear: `${MONTH_LABELS[i]}, ${year}`,
      activeClients,
      leadAccepted,
      dealClosed,
    };
  });
}

export const clientCapacitySeries = clientCapacityForYear(2026);

export type ClientCapacityView = "6 months" | "9 months" | "1 year" | `year-${number}`;

export function filterClientCapacity(view: ClientCapacityView): ClientCapacityPoint[] {
  const series =
    typeof view === "string" && view.startsWith("year-")
      ? clientCapacityForYear(Number(view.replace("year-", "")))
      : clientCapacitySeries;

  switch (view) {
    case "6 months":
      return series.slice(-6);
    case "9 months":
      return series.slice(-9);
    case "1 year":
      return series;
    default:
      return series;
  }
}

export function clientCapacityChartYear(view: ClientCapacityView): number {
  if (typeof view === "string" && view.startsWith("year-")) {
    return Number(view.replace("year-", ""));
  }
  return 2026;
}
