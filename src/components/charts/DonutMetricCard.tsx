import type { ReactNode } from "react";
import { InteractiveDonut } from "@/components/charts/InteractiveDonut";
import { DonutDetailLegend } from "@/components/charts/ChartLegend";
import { PeriodDropdown } from "@/components/ui/PeriodDropdown";
import type { PieSlice } from "@/lib/dashboardMetrics";
import { cn } from "@/lib/utils";

const DONUT_PERIODS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Month"] as const;

interface DonutMetricCardProps {
  title: string;
  data: PieSlice[];
  total: number;
  unit?: string;
  emptyLabel?: string;
  className?: string;
  period?: string;
  onPeriodChange?: (value: string) => void;
  headerExtra?: ReactNode;
  variant?: "full" | "semicircle";
}

export function DonutMetricCard({
  title,
  data,
  total,
  unit,
  emptyLabel,
  className,
  period = "Last 30 Days",
  onPeriodChange,
  variant = "full",
}: DonutMetricCardProps) {
  return (
    <div className={cn("section-card flex min-h-0 flex-col p-4", className)}>
      <div className="flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-base font-semibold leading-snug text-ink">{title}</h2>
        {onPeriodChange && (
          <PeriodDropdown
            value={period}
            options={[...DONUT_PERIODS]}
            onChange={onPeriodChange}
          />
        )}
      </div>

      <div className={cn("flex flex-col items-center", variant === "semicircle" ? "mt-2" : "mt-4")}>
        <InteractiveDonut
          data={data}
          total={total}
          unit={unit}
          emptyLabel={emptyLabel}
          stacked
          variant={variant}
        />
        <DonutDetailLegend
          data={data}
          total={total}
          unit={unit}
          layout="below"
          className={variant === "semicircle" ? "mt-6" : "mt-3"}
        />
      </div>
    </div>
  );
}
