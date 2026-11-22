import { StatusBadge } from "@/components/ui/StatusBadge";
import { normalizeStage, stageRank } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS, type Client } from "@/types";
import { cn } from "@/lib/utils";

type SegmentState = "complete" | "current" | "upcoming";

function segmentState(index: number, currentIndex: number): SegmentState {
  if (index < currentIndex) return "complete";
  if (index > currentIndex) return "upcoming";
  if (currentIndex === PROGRESS_STAGE_OPTIONS.length - 1) return "complete";
  return "current";
}

export function ClientProgressStageBar({ client }: { client: Client }) {
  const stage = normalizeStage(String(client.progressStage));
  const currentIndex = stageRank(stage);

  return (
    <div className="rounded-[10px] border border-hairline bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] font-semibold text-ink">
          Progress Stage: {stage}
        </p>
        <StatusBadge status={client.status} className="text-[14px]" />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
        {PROGRESS_STAGE_OPTIONS.map((opt, index) => {
          const state = segmentState(index, currentIndex);
          const isActive = index === currentIndex;
          return (
            <div key={opt} className="min-w-0">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E1DC]">
                {state === "complete" && <div className="h-full w-full bg-primary" />}
                {state === "current" && (
                  <div className="flex h-full w-full">
                    <div className="h-full w-1/2 bg-primary" aria-hidden />
                    <div className="h-full w-1/2 bg-[#E5E1DC]" aria-hidden />
                  </div>
                )}
              </div>
              <p
                className={cn(
                  "mt-2 truncate text-center text-[13px]",
                  isActive ? "font-semibold text-ink" : "font-medium text-ink-muted",
                )}
              >
                {opt}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}