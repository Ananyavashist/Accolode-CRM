import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { PropertiesPoint } from "@/data/charts";
import { ArrowDown, ArrowUp } from "@/components/ui/icons";
import { PROPERTY_OVERVIEW_COLORS, CHART } from "@/lib/theme";
import { cn } from "@/lib/utils";

const CHART_YEAR = 2026;
const BAR_CATEGORY_GAP_PX = 6;
const CHART_MARGIN_LEFT = 32;
const CHART_MARGIN_RIGHT = 12;
const BAR_SIZE_MAX = 56;
const BAR_SIZE_MIN = 12;
const PROPERTY_CHART_Y_MAX = 100;
const PROPERTY_CHART_Y_STEP = 20;
const PROPERTY_CHART_THRESHOLD = 50;
const PROPERTY_Y_TICKS = Array.from(
  { length: PROPERTY_CHART_Y_MAX / PROPERTY_CHART_Y_STEP + 1 },
  (_, i) => i * PROPERTY_CHART_Y_STEP,
);

function barWidthForPlot(plotWidth: number, categoryCount: number): number {
  if (plotWidth <= 0 || categoryCount <= 0) return BAR_SIZE_MAX;
  const bandSize = plotWidth / categoryCount;
  const size = Math.floor(bandSize - BAR_CATEGORY_GAP_PX);
  return Math.max(BAR_SIZE_MIN, Math.min(BAR_SIZE_MAX, size));
}

function abbrevMonth(month: string): string {
  return month.length > 3 ? month.slice(0, 3) : month;
}

function momPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function formatUnits(value: number): string {
  return value.toLocaleString("en-IN");
}

interface ChartRow extends PropertiesPoint {
  total: number;
}

function PropertyOverviewTooltip({
  active,
  payload,
  data,
}: TooltipProps<number, string> & { data: ChartRow[] }) {
  if (!active || !payload?.length) return null;
  const month = payload[0]?.payload?.month as string | undefined;
  if (!month) return null;

  const index = data.findIndex((d) => d.month === month);
  const row = data[index];
  const prev = index > 0 ? data[index - 1] : undefined;
  if (!row) return null;

  const rentTrend = momPercent(row.rent, prev?.rent ?? 0);
  const soldTrend = momPercent(row.sold, prev?.sold ?? 0);

  return (
    <div className="min-w-[200px] rounded-2xl border border-hairline bg-surface px-4 py-3 shadow-pop">
      <p className="text-sm font-semibold text-ink">
        {month} {CHART_YEAR}
      </p>
      <TooltipMetricRow
        color={PROPERTY_OVERVIEW_COLORS.rent}
        value={row.rent}
        trend={rentTrend}
      />
      <TooltipMetricRow
        color={PROPERTY_OVERVIEW_COLORS.sold}
        value={row.sold}
        trend={soldTrend}

      />
    </div>
  );
}

function TooltipMetricRow({
  color,
  value,
  trend,
  className,
}: {
  color: string;
  value: number;
  trend: number;
  className?: string;
}) {
  const up = trend >= 0;
  return (
    <div className={cn("mt-2 flex items-center justify-between gap-3 text-sm", className)}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium text-ink">{formatUnits(value)} units</span>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 text-xs font-medium",
          up ? "text-status-completed" : "text-status-awaiting",
        )}
      >
        {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {Math.abs(trend).toFixed(1)}%
      </span>
    </div>
  );
}

function XMonthTick({
  x,
  y,
  payload,
  activeMonth,
}: {
  x: number;
  y: number;
  payload: { value: string };
  activeMonth: string | null;
}) {
  const isActive = payload.value === activeMonth;
  return (
    <text
      x={x}
      y={y + 14}
      textAnchor="middle"
      className={cn("text-xs", isActive ? "fill-ink font-semibold" : "fill-ink-soft font-normal")}
    >
      {abbrevMonth(payload.value)}
    </text>
  );
}

export function PropertiesBarChart({
  data,
  className,
}: {
  data: PropertiesPoint[];
  className?: string;
}) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(0);

  const rows = useMemo(
    () => data.map((d) => ({ ...d, total: d.rent + d.sold })),
    [data],
  );

  useEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth - CHART_MARGIN_LEFT - CHART_MARGIN_RIGHT;
      setPlotWidth(Math.max(0, w));
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const barSize = useMemo(
    () => barWidthForPlot(plotWidth, rows.length),
    [plotWidth, rows.length],
  );

  const highlightedMonth = activeMonth ?? rows[Math.floor(rows.length / 2)]?.month ?? null;

  return (
    <div className={cn("flex h-full min-h-[260px] w-full flex-col", className)}>
      <div ref={plotRef} className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 20, right: CHART_MARGIN_RIGHT, left: 0, bottom: 4 }}
          barCategoryGap={0}
          barGap={0}
          onMouseMove={(state) => {
            if (state?.activeLabel) setActiveMonth(String(state.activeLabel));
          }}
          onMouseLeave={() => setActiveMonth(null)}
        >
          <CartesianGrid vertical={false} stroke={CHART.grid} strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={(props) => (
              <XMonthTick
                x={props.x}
                y={props.y}
                payload={props.payload}
                activeMonth={highlightedMonth}
              />
            )}
            height={28}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            domain={[0, PROPERTY_CHART_Y_MAX]}
            ticks={PROPERTY_Y_TICKS}
            tickFormatter={(v) => (v === 0 ? "0" : `${v}`)}
            tick={{ fontSize: 11, fill: CHART.tick }}
            width={36}
          />
          <ReferenceLine
            y={PROPERTY_CHART_THRESHOLD}
            stroke={CHART.tick}
            strokeDasharray="4 4"
            strokeWidth={1}
            ifOverflow="extendDomain"
          />
          <Tooltip cursor={false} content={<PropertyOverviewTooltip data={rows} />} />
          <Bar
            dataKey="rent"
            stackId="properties"
            fill={PROPERTY_OVERVIEW_COLORS.rent}
            radius={[0, 0, 0, 0]}
            barSize={barSize}
          >
            {rows.map((entry) => (
              <Cell
                key={`rent-${entry.month}`}
                stroke={entry.month === highlightedMonth ? "#1B4332" : "transparent"}
                strokeWidth={entry.month === highlightedMonth ? 1.5 : 0}
              />
            ))}
          </Bar>
          <Bar
            dataKey="sold"
            stackId="properties"
            fill={PROPERTY_OVERVIEW_COLORS.sold}
            radius={[8, 8, 0, 0]}
            barSize={barSize}
          >
            {rows.map((entry) => (
              <Cell
                key={`sold-${entry.month}`}
                stroke={entry.month === highlightedMonth ? "#1B4332" : "transparent"}
                strokeWidth={entry.month === highlightedMonth ? 1.5 : 0}
              />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-1 flex shrink-0 items-center justify-center gap-6"
        role="list"
        aria-label="Chart legend"
      >
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: PROPERTY_OVERVIEW_COLORS.rent }}
          />
          Rent
        </div>
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: PROPERTY_OVERVIEW_COLORS.sold }}
          />
          Sale
        </div>
      </div>
    </div>
  );
}