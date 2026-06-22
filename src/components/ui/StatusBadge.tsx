import type { ConversionStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  "Awaiting Action": "bg-status-awaitingBg text-status-awaiting",
  "Active Lead": "bg-status-activeBg text-status-active",
  "Completed Client": "bg-status-completedBg text-status-completed",
  Completed: "bg-status-completedBg text-status-completed",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ConversionStatus | string;
  className?: string;
}) {
  return (
    <span className={cn("pill", STATUS_STYLES[status] ?? "bg-hairline text-ink-muted", className)}>
      {status}
    </span>
  );
}
