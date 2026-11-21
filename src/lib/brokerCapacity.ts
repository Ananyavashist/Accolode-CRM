import type { Client, Lead } from "@/types";
import { normalizeStage } from "@/lib/pipeline";

export const MAX_ACTIVE_CLIENTS = 20;
export const MAX_LEADS_PER_MONTH = 15;

function isActiveClient(client: Client): boolean {
  return normalizeStage(client.progressStage) !== "Closed";
}

export function countActiveClients(clients: Client[]): number {
  return clients.filter(isActiveClient).length;
}

export function countLeadsAcceptedThisMonth(leads: Lead[], ref = new Date()): number {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  return leads.filter((l) => {
    if (l.status !== "accepted" || !l.acceptedAt) return false;
    const d = new Date(l.acceptedAt);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

export type CapacityBlockReason = "active_full" | "monthly_full" | null;

export function acceptBlockedReason(
  clients: Client[],
  leads: Lead[],
): CapacityBlockReason {
  if (countActiveClients(clients) >= MAX_ACTIVE_CLIENTS) return "active_full";
  if (countLeadsAcceptedThisMonth(leads) >= MAX_LEADS_PER_MONTH) return "monthly_full";
  return null;
}

export function capacityBlockMessage(reason: CapacityBlockReason): string {
  if (reason === "active_full") {
    return "At capacity (20 active clients)—close a client before accepting.";
  }
  if (reason === "monthly_full") {
    return "Monthly lead limit reached (15)—new assignments resume on the 1st.";
  }
  return "";
}