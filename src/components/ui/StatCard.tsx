import { Info, MoreHorizontal, ArrowDown, ArrowUp } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
}: StatCardProps) {
  const isUp = trendDirection === "up";
  return (
    <div className="section-card flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <span>{title}</span>
          <Info size={13} className="text-ink-soft" />
        </div>
        <button className="text-ink-soft transition-colors hover:text-ink" aria-label="More">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-[28px] font-semibold leading-none tracking-tight text-ink">{value}</span>
        {trend && (
          <span
            className={cn(
              "pill",
              isUp
                ? "bg-status-completedBg text-status-completed"
                : "bg-status-awaitingBg text-status-awaiting",
            )}
          >
            {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
    </div>
  );
}
