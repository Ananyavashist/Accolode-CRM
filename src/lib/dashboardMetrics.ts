import type { Client, Lead } from "@/types";
import type { AcquisitionPoint } from "@/data/charts";
import { leadAcquisition, propertiesOverview } from "@/data/charts";
import { LOCATION_SLICE_COLORS, PLATFORM_COLORS } from "@/lib/theme";

const PLATFORM_SOURCES = ["ShiftHona", "Magicbricks", "99acres"] as const;

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

export function computeNewLeads(leads: Lead[]): number {
  return leads.filter((l) => (l.status ?? "new") === "new").length;
}

export function computeQualified(leads: Lead[], clients: Client[]): number {
  const leadQualified = leads.filter((l) => l.intent === "High").length;
  const clientQualified = clients.filter((c) => c.progressStage === "Qualified").length;
  return leadQualified + clientQualified;
}

export function computeScheduledVisits(clients: Client[]): number {
  return clients.filter((c) => c.status === "Active Lead").length;
}

export function computeNegotiation(clients: Client[]): number {
  return clients.filter((c) => c.status === "Awaiting Action").length;
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
      { name: "ShiftHona", value: 38, color: PLATFORM_COLORS.ShiftHona },
      { name: "Magicbricks", value: 34, color: PLATFORM_COLORS.Magicbricks },
      { name: "99acres", value: 28, color: PLATFORM_COLORS["99acres"] },
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

export function computeClientDatabaseStats(clients: Client[]) {
  return {
    total: clients.length,
    active: clients.filter((c) => c.status === "Active Lead").length,
    completed: clients.filter((c) => c.status === "Completed" || c.status === "Completed Client")
      .length,
    awaiting: clients.filter((c) => c.status === "Awaiting Action").length,
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
