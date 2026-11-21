import type { Client, Lead, Task } from "@/types";
import { getPendingRoutedLeads } from "@/lib/brokerRouting";
import { normalizeStage } from "@/lib/pipeline";
import {
  CRM_CURRENT_MONTH,
  crmMonthIndex,
  isFutureDemoMonth,
} from "@/lib/crmClock";
import { formatDisplayCopy } from "@/lib/utils";
import type { AcquisitionPoint } from "@/data/charts";
import { leadAcquisition, propertiesOverview } from "@/data/charts";
import { LOCATION_SLICE_COLORS, PLATFORM_COLORS } from "@/lib/theme";

export const PLATFORM_SOURCES = ["ShiftHona", "Magicbricks", "99acres"] as const;

const CHANNEL_DISPLAY_NAMES: Record<(typeof PLATFORM_SOURCES)[number], string> = {
  ShiftHona: "ShiftHona",
  Magicbricks: "Direct Link",
  "99acres": "In Visit Leads",
};

export function channelDisplayName(source: string): string {
  if ((PLATFORM_SOURCES as readonly string[]).includes(source)) {
    return CHANNEL_DISPLAY_NAMES[source as (typeof PLATFORM_SOURCES)[number]];
  }
  return formatDisplayCopy(source);
}

function isPlatformSource(source: string): source is (typeof PLATFORM_SOURCES)[number] {
  return (PLATFORM_SOURCES as readonly string[]).includes(source);
}

function periodWindowDays(period: string): number {
  switch (period) {
    case "1Y":
      return 365;
    case "6M":
      return 180;
    case "1M":
    case "Last 30 Days":
    case "This Month":
      return 30;
    case "Last 7 Days":
      return 7;
    case "Last 90 Days":
      return 90;
    default:
      return 30;
  }
}

function platformLeadsInDaysRange(leads: Lead[], minDays: number, maxDays: number): Lead[] {
  return leads.filter(
    (l) => isPlatformSource(l.source) && l.daysAgo >= minDays && l.daysAgo <= maxDays,
  );
}

export function topPlatformSharePercent(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const counts = PLATFORM_SOURCES.map(
    (source) => leads.filter((l) => l.source === source).length,
  );
  return slicePercent(Math.max(...counts), leads.length);
}

export function platformSlicesForLeads(leads: Lead[]): PieSlice[] {
  return PLATFORM_SOURCES.map((source) => ({
    name: source,
    value: leads.filter((l) => l.source === source).length,
    color: PLATFORM_COLORS[source],
  }));
}

export function computeLeadChannelsMetrics(
  leads: Lead[],
  period: string,
): {
  slices: PieSlice[];
  total: number;
  headlinePct: number;
  trendPoints: number;
  usesFallback: boolean;
} {
  const windowDays = periodWindowDays(period);
  const currentLeads = platformLeadsInDaysRange(leads, 0, windowDays);
  const previousLeads = platformLeadsInDaysRange(leads, windowDays + 1, windowDays * 2);

  const currentShare = topPlatformSharePercent(currentLeads);
  const previousShare = topPlatformSharePercent(previousLeads);
  const trendPoints =
    previousLeads.length > 0
      ? Math.round((currentShare - previousShare) * 10) / 10
      : 0;

  if (currentLeads.length === 0) {
    const fallback = computePlatformLeads(leads);
    const top = Math.max(...fallback.slices.map((s) => s.value));
    return {
      slices: platformSlicesForLeads([]).map((s) => {
        const demo = fallback.slices.find((x) => x.name === s.name);
        return demo ? { ...s, value: demo.value } : s;
      }),
      total: fallback.total,
      headlinePct: slicePercent(top, fallback.total),
      trendPoints,
      usesFallback: true,
    };
  }

  return {
    slices: platformSlicesForLeads(currentLeads),
    total: currentLeads.length,
    headlinePct: currentShare,
    trendPoints,
    usesFallback: false,
  };
}

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

export function computeNewLeads(leads: Lead[]): number {
  return getPendingRoutedLeads(leads).length;
}

export function computeQualified(leads: Lead[], clients: Client[]): number {
  const leadQualified = leads.filter((l) => l.intent === "High").length;
  const clientQualified = clients.filter((c) => {
    const stage = normalizeStage(c.progressStage);
    return stage === "Site Visit" || stage === "Negotiation" || stage === "Documentation";
  }).length;
  return leadQualified + clientQualified;
}

export function computeScheduledVisits(clients: Client[]): number {
  return clients.filter((c) => c.status === "Active Lead").length;
}

export function computeNegotiation(clients: Client[]): number {
  return clients.filter((c) => c.status === "Awaiting Action").length;
}

/** November overview funnel — qualified pool split across visit, negotiation, and no response. */
export const OVERVIEW_FUNNEL = {
  qualified: 18,
  scheduledVisits: 11,
  negotiation: 3,
  rejectedLeads: 24,
} as const;

export function computeClientsNotResponding(
  qualified = OVERVIEW_FUNNEL.qualified,
  scheduled = OVERVIEW_FUNNEL.scheduledVisits,
  negotiation = OVERVIEW_FUNNEL.negotiation,
): number {
  return Math.max(0, qualified - scheduled - negotiation);
}

/** Broker-declined leads (capacity, fit, timing) — not capped by the 20 client slots. */
export function computeRejectedLeads(leads: Lead[]): number {
  const declined = leads.filter((l) => l.status === "deprioritised").length;
  return Math.max(declined, OVERVIEW_FUNNEL.rejectedLeads);
}

function overviewMonthScale(month: string): number {
  const offset = crmMonthIndex(month) - crmMonthIndex(CRM_CURRENT_MONTH);
  return 1 + offset * 0.07;
}

function scaleMetric(value: number, month: string): number {
  if (isFutureDemoMonth(month)) return 0;
  const scaled = Math.round(value * overviewMonthScale(month));
  return Math.max(0, scaled);
}

export function computeOverviewFunnel(leads: Lead[], month: string = CRM_CURRENT_MONTH) {
  if (isFutureDemoMonth(month)) {
    return {
      newLeads: 0,
      qualified: 0,
      scheduled: 0,
      negotiation: 0,
      notResponding: 0,
      rejected: 0,
    };
  }

  const qualified = scaleMetric(OVERVIEW_FUNNEL.qualified, month);
  const scheduled = Math.min(scaleMetric(OVERVIEW_FUNNEL.scheduledVisits, month), qualified);
  const negotiation = Math.min(scaleMetric(OVERVIEW_FUNNEL.negotiation, month), qualified - scheduled);
  const notResponding = Math.max(0, qualified - scheduled - negotiation);
  const newLeads =
    month === CRM_CURRENT_MONTH
      ? computeNewLeads(leads)
      : scaleMetric(computeNewLeads(leads) || 32, month);
  const rejected =
    month === CRM_CURRENT_MONTH
      ? computeRejectedLeads(leads)
      : scaleMetric(OVERVIEW_FUNNEL.rejectedLeads, month);

  return {
    newLeads,
    qualified,
    scheduled,
    negotiation,
    notResponding,
    rejected,
  };
}

export function computeAcquisitionTotal(data: AcquisitionPoint[] = leadAcquisition): number {
  const last = data[data.length - 1];
  if (!last) return 0;
  return last.direct + last.social + last.platform;
}

export function computePlatformLeads(leads: Lead[]): {
  slices: PieSlice[];
  total: number;
  count: number;
} {
  const counts = PLATFORM_SOURCES.map((source) => ({
    name: source,
    value: leads.filter((l) => l.source === source).length,
    color: PLATFORM_COLORS[source],
  }));

  const count = counts.reduce((s, c) => s + c.value, 0);

  if (count === 0) {
    const slices = [
      { name: "ShiftHona", value: 8, color: PLATFORM_COLORS.ShiftHona },
      { name: "Magicbricks", value: 9, color: PLATFORM_COLORS.Magicbricks },
      { name: "99acres", value: 5, color: PLATFORM_COLORS["99acres"] },
    ];
    return { slices, total: slices.reduce((s, x) => s + x.value, 0), count: 0 };
  }

  return { slices: counts.filter((c) => c.value > 0), total: count, count };
}

export function computeClientInProgress(clients: Client[]): { slices: PieSlice[]; total: number } {
  const inProgress = clients.filter(
    (c) => c.status === "Active Lead" || c.status === "Awaiting Action",
  );

  const map = new Map<string, number>();
  for (const client of inProgress) {
    const loc = client.location.trim();
    map.set(loc, (map.get(loc) ?? 0) + 1);
  }

  const entries = [...map.entries()].sort((a, b) => b[1] - a[1]);
  const topEntries = entries.slice(0, 5);
  const otherCount = entries.slice(5).reduce((sum, [, count]) => sum + count, 0);

  const displayEntries =
    otherCount > 0 ? [...topEntries, ["Other", otherCount] as const] : topEntries;

  const slices: PieSlice[] = displayEntries.map(([name, value], i) => ({
    name,
    value,
    color: LOCATION_SLICE_COLORS[i % LOCATION_SLICE_COLORS.length],
  }));

  const sliceTotal = slices.reduce((sum, s) => sum + s.value, 0);
  const total = inProgress.length;
  return { slices, total: sliceTotal || total };
}

export function computeClientDatabaseStats(clients: Client[], tasks: Task[] = []) {
  const clientIds = new Set(clients.map((c) => c.id));
  return {
    total: clients.length,
    active: clients.filter((c) => normalizeStage(c.progressStage) !== "Closed").length,
    closed: clients.filter((c) => normalizeStage(c.progressStage) === "Closed").length,
    pendingFollowUps: tasks.filter((t) => !t.done && clientIds.has(t.clientId)).length,
  };
}

export function computePropertiesTotals() {
  const rent = propertiesOverview.reduce((s, m) => s + m.rent, 0);
  const sold = propertiesOverview.reduce((s, m) => s + m.sold, 0);
  return { rent, sold, total: rent + sold };
}

export function slicePercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
