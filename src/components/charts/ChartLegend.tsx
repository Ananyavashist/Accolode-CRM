import type { PieSlice } from "@/lib/dashboardMetrics";
import { ACQUISITION_COLORS, BAR_COLORS, DATA_PALETTE } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const ACQUISITION_SERIES = [
  { key: "direct", label: "Direct Leads", color: ACQUISITION_COLORS.direct },
  { key: "social", label: "Social Media", color: ACQUISITION_COLORS.social },
  { key: "platform", label: "Property platform", color: ACQUISITION_COLORS.platform },
] as const;

export const PROPERTIES_SERIES = [
  { key: "rent", label: "Rent", color: BAR_COLORS.rent },
  { key: "sold", label: "Sold", color: BAR_COLORS.sold },
] as const;

interface ChartLegendProps {
  items: ReadonlyArray<{ label: string; color: string }>;
  className?: string;
}

export function ChartLegend({ items, className }: ChartLegendProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-hairline pt-3",
        className,
      )}
      role="list"
      aria-label="Chart legend"
    >
      {items.map((item) => (
        <div key={item.label} role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
            aria-hidden
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DonutDetailLegend({
  data,
  total,
  unit = "clients",
  className,
  layout = "side",
}: {
  data: PieSlice[];
  total: number;
  unit?: string;
  className?: string;
  layout?: "side" | "below";
}) {
  if (layout === "below") {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center">
          <p className="text-xs text-ink-soft">Total</p>
          <p className="text-lg font-bold text-ink">
            {total} {unit}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2" role="list">
          {data.map((item) => (
            <div
              key={item.name}
              role="listitem"
              className="flex items-center gap-1.5 text-xs text-ink-muted"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
              <span className="font-semibold text-ink">{item.value}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-1 flex-col justify-center", className)}>
      <p className="text-xs text-ink-soft">Total</p>
      <p className="text-xl font-bold text-ink">
        {total} {unit}
      </p>
      <div className="mt-3 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <span className="w-5 shrink-0 font-semibold text-ink">{item.value}</span>
            <span className="truncate text-xs text-ink-muted">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DATA_PALETTE };
