/** Demo "today" — aligned with deal pipeline dates (November 2026). */
export const CRM_REFERENCE_YEAR = 2026;
export const CRM_CURRENT_MONTH = "November";
export const CRM_CURRENT_MONTH_ABBREV = "Nov";

export const CRM_MONTHS = [
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

export type CrmMonth = (typeof CRM_MONTHS)[number];

const MONTH_ORDER = CRM_MONTHS;

export function crmMonthIndex(month: string): number {
  const i = MONTH_ORDER.indexOf(month as (typeof MONTH_ORDER)[number]);
  return i >= 0 ? i : -1;
}

/** Months after the reference month in the reference year have no capacity data yet. */
export function isUpcomingCapacityMonth(month: string, year: number): boolean {
  if (year > CRM_REFERENCE_YEAR) return true;
  if (year < CRM_REFERENCE_YEAR) return false;
  return crmMonthIndex(month) > crmMonthIndex(CRM_CURRENT_MONTH);
}

export function formatCrmMonthSubtitle(
  month: string = CRM_CURRENT_MONTH,
  prefix = "for the month of",
): string {
  return `${prefix} ${month}`;
}

/** Demo months after the reference month have no overview activity yet. */
export function isFutureDemoMonth(month: string): boolean {
  return isUpcomingCapacityMonth(month, CRM_REFERENCE_YEAR);
}