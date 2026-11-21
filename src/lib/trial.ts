const TRIAL_LENGTH_DAYS = 14;

export function trialDaysRemaining(startIso?: string): number {
  if (!startIso) return 12;
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return 12;
  const end = new Date(start);
  end.setDate(end.getDate() + TRIAL_LENGTH_DAYS);
  const left = Math.ceil((end.getTime() - Date.now()) / 86_400_000);
  return Math.max(0, left);
}

export function formatTrialDaysLeft(days: number): string {
  if (days <= 0) return "Trial ended";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}