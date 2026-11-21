const MS_HOUR = 3_600_000;
export const SLA_REMINDER_HOURS = 12;
export const SLA_EXPIRE_HOURS = 24;

export type LeadSlaState = {
  msRemaining: number;
  hoursRemaining: number;
  pastReminder: boolean;
  expired: boolean;
  label: string;
};

export function leadSlaFromAssignedAt(assignedAt?: string): LeadSlaState | null {
  if (!assignedAt) return null;
  const start = new Date(assignedAt).getTime();
  if (Number.isNaN(start)) return null;
  const expireAt = start + SLA_EXPIRE_HOURS * MS_HOUR;
  const now = Date.now();
  const msRemaining = expireAt - now;
  const hoursRemaining = Math.max(0, Math.ceil(msRemaining / MS_HOUR));
  const pastReminder = now >= start + SLA_REMINDER_HOURS * MS_HOUR;
  const expired = msRemaining <= 0;

  let label: string;
  if (expired) {
    label = "Past 24h window";
  } else if (pastReminder) {
    label = `${hoursRemaining}h left · reminder`;
  } else {
    label = `${hoursRemaining}h left to respond`;
  }

  return { msRemaining, hoursRemaining, pastReminder, expired, label };
}

export function shouldExpireLead(assignedAt: string | undefined, status?: string): boolean {
  if (!assignedAt || (status ?? "new") !== "new") return false;
  const sla = leadSlaFromAssignedAt(assignedAt);
  return Boolean(sla?.expired);
}