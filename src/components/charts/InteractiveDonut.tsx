import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import type { TooltipProps } from "recharts";
import type { PieSlice } from "@/lib/dashboardMetrics";
import { slicePercent } from "@/lib/dashboardMetrics";
import { cn } from "@/lib/utils";

interface InteractiveDonutProps {
  data: PieSlice[];
  total: number;
  emptyLabel?: string;
  unit?: string;
  compact?: boolean;
  inline?: boolean;
  stacked?: boolean;
  variant?: "full" | "semicircle";
  className?: string;
}

function DonutTooltip({
  active,
  payload,
  unit = "clients",
}: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload as PieSlice & { percent?: number };
  return (
    <div
      className="rounded-[10px] border border-hairline px-3 py-2 shadow-pop"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <p className="text-sm font-semibold text-ink">{item.name}</p>
      <p className="text-xs text-ink-muted">
        {item.value} {unit} · {item.percent ?? 0}%
      </p>
    </div>
  );
}

function ActiveShape(props: {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
}) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={(outerRadius ?? 0) + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={6}
    />
  );
}

export function InteractiveDonut({
  data,
  total,
  emptyLabel = "No data",
  unit = "clients",
  compact = false,
  inline = false,
  stacked = false,
  variant = "full",
  className,
}: InteractiveDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const semicircle = variant === "semicircle";

  const height = semicircle ? 108 : stacked ? 156 : inline ? 120 : compact ? 168 : 210;
  const innerRadius = semicircle ? 52 : stacked ? 46 : inline ? 36 : compact ? 52 : 68;
  const outerRadius = semicircle ? 72 : stacked ? 64 : inline ? 50 : compact ? 68 : 84;
  const outerRadiusActive = semicircle ? 78 : stacked ? 70 : inline ? 56 : compact ? 74 : 88;

  const enriched = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        percent: slicePercent(d.value, total),
      })),
    [data, total],
  );

  if (enriched.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-ink-soft"
        style={{ height }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className={cn(
        semicircle
          ? "mx-auto mb-2 w-full max-w-[220px] overflow-hidden"
          : stacked
            ? "mx-auto w-full max-w-[200px]"
            : inline
              ? "h-[120px] w-[120px] shrink-0"
              : "relative",
        className,
      )}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={enriched}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy={semicircle ? "92%" : "50%"}
            innerRadius={innerRadius}
            outerRadius={activeIndex !== undefined ? outerRadiusActive : outerRadius}
            paddingAngle={2}
            cornerRadius={6}
            startAngle={semicircle ? 180 : 90}
            endAngle={semicircle ? 0 : -270}
            stroke="none"
            activeIndex={activeIndex}
            activeShape={ActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {enriched.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.45}
              />
            ))}
          </Pie>
          <Tooltip
            content={<DonutTooltip unit={unit} />}
            cursor={false}
            wrapperStyle={{ zIndex: 50, outline: "none" }}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutLegend({
  data,
  className,
  layout = "row",
}: {
  data: PieSlice[];
  className?: string;
  layout?: "row" | "column";
}) {
  return (
    <div
      className={cn(
        layout === "column"
          ? "flex flex-col gap-2"
          : "flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5",
        className,
      )}
    >
      {data.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 text-xs text-ink-muted">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="truncate">{p.name}</span>
        </div>
      ))}
    </div>
  );
}
