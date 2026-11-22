import { PillDropdown } from "@/components/ui/PillDropdown";
import { DOCUMENT_STATUS_OPTIONS } from "@/data/clientDocumentationStages";
import { cn } from "@/lib/utils";

export function documentStatusPillClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("verified")) return "bg-status-activeBg text-status-active";
  if (s.includes("pending")) return "bg-[#E8F2FF] text-[#2563EB]";
  if (s.includes("awaiting")) return "bg-status-awaitingBg text-status-awaiting";
  if (s.includes("submitted")) return "bg-status-warningBg text-status-warning";
  return "bg-sidebar text-ink-muted";
}

export function DocumentStatusDropdown({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (status: string) => void;
  ariaLabel?: string;
}) {
  const options = (DOCUMENT_STATUS_OPTIONS as readonly string[]).includes(value)
    ? [...DOCUMENT_STATUS_OPTIONS]
    : [value, ...DOCUMENT_STATUS_OPTIONS];

  return (
    <PillDropdown
      value={value}
      options={options}
      onChange={onChange}
      ariaLabel={ariaLabel ?? "Document status"}
      className={cn("text-xs", documentStatusPillClass(value))}
    />
  );
}