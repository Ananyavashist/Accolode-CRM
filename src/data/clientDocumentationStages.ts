export const DOCUMENT_STAGES = [
  { id: "awaiting", label: "Awaiting" },
  { id: "submitted", label: "Submitted" },
  { id: "pending_review", label: "Pending Review" },
  { id: "verified", label: "Verified" },
] as const;

export type DocStageId = (typeof DOCUMENT_STAGES)[number]["id"];

export const DOCUMENT_STATUS_OPTIONS = DOCUMENT_STAGES.map((s) => s.label);

const STAGE_BY_LABEL = new Map(
  DOCUMENT_STAGES.map((s) => [s.label.toLowerCase(), s.id] as const),
);

export function docStageIdFromStatus(status: string): DocStageId {
  const key = status.trim().toLowerCase();
  const id = STAGE_BY_LABEL.get(key);
  if (id) return id;
  if (key.includes("pending")) return "pending_review";
  if (key.includes("verified")) return "verified";
  if (key.includes("submit")) return "submitted";
  return "awaiting";
}

export function docStatusFromStage(stageId: DocStageId): string {
  return DOCUMENT_STAGES.find((s) => s.id === stageId)?.label ?? "Awaiting";
}
