import type { Lead } from "@/types";
import { DEMO_BROKER_ID } from "@/lib/brokerRouting";
import { enrichLeadProfile } from "@/lib/leadProfileEnrich";
import { shouldExpireLead } from "@/lib/leadSla";

function hoursAgoIso(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

const ROUTING_OVERRIDES: Record<string, Partial<Lead>> = {
  "lead-1": { assignedAt: hoursAgoIso(3) },
  "lead-4": { assignedAt: hoursAgoIso(14) },
  "lead-expired-1": {
    status: "moved_on",
    assignedAt: hoursAgoIso(26),
    movedOnAt: hoursAgoIso(2),
  },
  "lead-rejected-demo": {
    status: "rejected",
    assignedAt: hoursAgoIso(48),
    rejectionReason: "budget_mismatch",
  },
  "lead-acc-1": {
    status: "accepted",
    assignedAt: hoursAgoIso(72),
    acceptedAt: hoursAgoIso(48),
  },
  "lead-acc-2": {
    status: "accepted",
    assignedAt: hoursAgoIso(120),
    acceptedAt: hoursAgoIso(96),
  },
  "lead-acc-3": {
    status: "accepted",
    assignedAt: hoursAgoIso(90),
    acceptedAt: hoursAgoIso(60),
  },
};

export function normalizeLead(lead: Lead): Lead {
  const override = ROUTING_OVERRIDES[lead.id] ?? {};
  let status = override.status ?? lead.status ?? "new";
  const base = { ...lead, ...override, status };

  let assignedBrokerId = base.assignedBrokerId;
  let assignedAt = base.assignedAt;

  if (base.source === "ShiftHona") {
    assignedBrokerId = assignedBrokerId ?? DEMO_BROKER_ID;
    if (status === "new" && !assignedAt) {
      assignedAt = hoursAgoIso(Math.min(Math.max(base.daysAgo, 1) * 4, 20));
    }
  }

  const merged: Lead = {
    ...base,
    status,
    assignedBrokerId,
    assignedAt,
  };

  if (shouldExpireLead(assignedAt, status)) {
    return enrichLeadProfile({
      ...merged,
      status: "moved_on",
      movedOnAt: merged.movedOnAt ?? new Date().toISOString(),
    });
  }

  return enrichLeadProfile(merged);
}