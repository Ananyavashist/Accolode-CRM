import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { normalizeStage, progressStageLabel } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS, type ProgressStage } from "@/types";
import { cn } from "@/lib/utils";

export const DATABASE_STAGE_PASTEL: Record<ProgressStage, string> = {
  Inquiry: "bg-[#DDF4E8] text-[#1B6B45]",
  "Site Visit": "bg-[#EDE4FF] text-[#5B3FA8]",
  Negotiation: "bg-[#FFE8D6] text-[#9A4D12]",
  Documentation: "bg-[#FCE4F0] text-[#9D2463]",
  Closed: "bg-[#DCEBFF] text-[#1E4A8C]",
};

interface ClientStagePickerProps {
  clientId: string;
  stage: string;
  onChange: (stage: ProgressStage) => void;
}

export function ClientStagePicker({ clientId, stage, onChange }: ClientStagePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const label = normalizeStage(stage);
  const pillClass = DATABASE_STAGE_PASTEL[label] ?? "bg-sidebar text-ink-muted";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        id={`stage-trigger-${clientId}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-[10px] py-1.5 text-sm font-medium leading-none transition-colors hover:opacity-90",
          pillClass,
        )}
      >
        {progressStageLabel(label)}
        <ChevronDown size={14} className={cn("opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Change stage"
          className="absolute left-0 z-50 mt-1 min-w-[160px] overflow-hidden rounded-[10px] border border-hairline bg-surface py-1 shadow-pop"
        >
          {PROGRESS_STAGE_OPTIONS.map((opt) => (
            <li key={opt} role="option" aria-selected={opt === label}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-left text-sm hover:bg-sidebar",
                  opt === label && "bg-primary/5 font-medium text-primary",
                )}
              >
                <span
                  className={cn(
                    "inline-flex rounded-md px-[10px] py-1 text-xs font-medium",
                    DATABASE_STAGE_PASTEL[opt],
                  )}
                >
                  {progressStageLabel(opt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}