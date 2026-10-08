import type { Client, ConversionStatus, ProgressStage } from "@/types";
import { PROGRESS_STAGE_OPTIONS } from "@/types";

export const PIPELINE_TABS = [
  "All",
  "New",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Closed",
] as const;

export type PipelineTab = (typeof PIPELINE_TABS)[number];

export function normalizeStage(stage: string | undefined): ProgressStage {
  if (stage === "Inquiry") return "New";
  if (PROGRESS_STAGE_OPTIONS.includes(stage as ProgressStage)) {
    return stage as ProgressStage;
  }
  return "New";
}

export function statusFromStage(stage: string | undefined): ConversionStatus {
  const s = normalizeStage(stage);
  if (s === "Closed") return "Completed";
  if (s === "Site Visit" || s === "Negotiation") return "Awaiting Action";
  return "Active Lead";
}

export function stageRank(stage: string | undefined): number {
  return PROGRESS_STAGE_OPTIONS.indexOf(normalizeStage(stage));
}

export function withDerivedStatus<T extends Pick<Client, "progressStage" | "status">>(
  client: T,
): T {
  const progressStage = normalizeStage(client.progressStage);
  return {
    ...client,
    progressStage,
    status: statusFromStage(progressStage),
  };
}

export function parseBudgetMax(budget: string): number | null {
  const nums = [...budget.matchAll(/(\d+(?:\.\d+)?)\s*([lLkK])?/g)].map((m) => {
    const n = Number(m[1]);
    const unit = (m[2] ?? "").toLowerCase();
    if (unit === "l") return n * 100000;
    if (unit === "k") return n * 1000;
    return n;
  });
  if (nums.length === 0) return null;
  return Math.max(...nums);
}

export function mismatchLines(client: Client): string[] {
  const lines: string[] = [];
  const saidMax = parseBudgetMax(client.onboarding.budget);
  const doingMax = client.observed?.browsingBudget
    ? parseBudgetMax(client.observed.browsingBudget)
    : null;
  if (saidMax && doingMax && doingMax > saidMax * 1.15) {
    const pct = Math.round(((doingMax - saidMax) / saidMax) * 100);
    lines.push(`Browsing ${pct}% above stated budget`);
  }

  const saidLoc = client.onboarding.preferredLocation.toLowerCase();
  const browsing = client.observed?.browsingLocations ?? [];
  const mismatchLoc = browsing.find((loc) => !saidLoc.includes(loc.toLowerCase().split(",")[0]));
  if (mismatchLoc && saidLoc) {
    lines.push(`Viewing in ${mismatchLoc}, said ${client.onboarding.preferredLocation}`);
  }
  return lines;
}

export function relativeTime(iso?: string): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 14) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function waDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function waHref(phone: string, text: string): string {
  return `https://wa.me/${waDigits(phone)}?text=${encodeURIComponent(text)}`;
}

/** Readable path segment from a person's name — not a raw record id. */
export function personSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clientProfilePath(name: string): string {
  return `/clients/${personSlug(name)}`;
}
