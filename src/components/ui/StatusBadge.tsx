import type { ConversionStatus, DealType, ListingType, ProgressStage } from "@/types";
import { normalizeStage } from "@/lib/pipeline";
import { TYPE_CHIP } from "@/lib/theme";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Awaiting Action": "bg-status-warningBg text-status-warning",
  "Active Lead": "bg-status-activeBg text-status-active",
  Completed: "bg-status-completedBg text-status-completed",
  "Completed Client": "bg-status-completedBg text-status-completed",
};

const STAGE_STYLES: Record<string, string> = {
  New: "bg-status-activeBg text-status-active",
  Inquiry: "bg-status-activeBg text-status-active",
  Qualified: "bg-status-activeBg text-status-active",
  "Site Visit": "bg-status-warningBg text-status-warning",
  Negotiation: "bg-status-warningBg text-status-warning",
  Closed: "bg-status-completedBg text-status-completed",
};

function Dot({ className }: { className?: string }) {
  return <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full bg-current", className)} aria-hidden />;
}

export function StatusBadge({
  status,
  className,
}: {
  status: ConversionStatus | string;
  className?: string;
}) {
  return (
    <span className={cn("pill", STATUS_STYLES[status] ?? "bg-sidebar text-ink-muted", className)}>
      <Dot />
      {status === "Completed Client" ? "Completed" : status}
    </span>
  );
}

export function TypeChip({
  type,
  label,
  className,
}: {
  type: DealType | ListingType;
  label?: string;
  className?: string;
}) {
  const chip = TYPE_CHIP[type];
  return (
    <span
      className={cn("pill", className)}
      style={{ backgroundColor: chip.bg, color: chip.text }}
    >
      <Dot />
      {label ?? type}
    </span>
  );
}

export function StageBadge({
  stage,
  className,
}: {
  stage: ProgressStage | string;
  className?: string;
}) {
  const label = normalizeStage(stage);
  return (
    <span className={cn("pill", STAGE_STYLES[label] ?? "bg-sidebar text-ink-muted", className)}>
      <Dot />
      {label}
    </span>
  );
}
