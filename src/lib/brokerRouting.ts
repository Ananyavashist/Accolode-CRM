import type { Lead, LeadRejectionReason } from "@/types";

/** Demo broker id — all seeded Shift Hona assignments attach to this broker. */
export const DEMO_BROKER_ID = "broker-demo";

export const LEAD_REJECTION_LABELS: Record<LeadRejectionReason, string> = {
  outside_area: "Outside my area",
  budget_mismatch: "Budget outside my range",
  property_type: "Property type",
  at_capacity: "At capacity",
  requirements_incomplete: "Requirements incomplete",
};

export function isShiftHonaRoutedLead(lead: Lead): boolean {
  return lead.source === "ShiftHona";
}

export function isAssignedToBroker(lead: Lead, brokerId: string = DEMO_BROKER_ID): boolean {
  return lead.assignedBrokerId === brokerId || !lead.assignedBrokerId;
}

export function getPendingRoutedLeads(
  leads: Lead[],
  brokerId: string = DEMO_BROKER_ID,
): Lead[] {
  return leads.filter(
    (l) =>
      (l.status ?? "new") === "new" &&
      isShiftHonaRoutedLead(l) &&
      isAssignedToBroker(l, brokerId),
  );
}

export function getAcceptedRoutedLeads(leads: Lead[], brokerId: string = DEMO_BROKER_ID): Lead[] {
  return leads.filter(
    (l) =>
      l.status === "accepted" && isShiftHonaRoutedLead(l) && isAssignedToBroker(l, brokerId),
  );
}

export function getDeprioritisedLeads(leads: Lead[], brokerId: string = DEMO_BROKER_ID): Lead[] {
  return leads.filter(
    (l) =>
      l.status === "deprioritised" &&
      isShiftHonaRoutedLead(l) &&
      isAssignedToBroker(l, brokerId),
  );
}