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
    <div className="section-card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
          <span>{title}</span>
          <Info size={14} className="text-ink-soft" />
        </div>
        <button className="text-ink-soft transition-colors hover:text-ink" aria-label="More">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold tracking-tight text-ink">{value}</span>
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

      {subtitle && <p className="text-xs text-ink-soft">{subtitle}</p>}
    </div>
  );
}
