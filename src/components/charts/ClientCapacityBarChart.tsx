import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Customized,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ClientCapacityPoint } from "@/data/charts";
import { ArrowDown, ArrowUp, Info } from "@/components/ui/icons";
import { CRM_CURRENT_MONTH } from "@/lib/crmClock";
import {
  CLIENT_CAPACITY_COLORS,
  CLIENT_CAPACITY_UPCOMING_FILL,
  CHART,
} from "@/lib/theme";
import { cn, formatDisplayCopy } from "@/lib/utils";

const CAPACITY_THRESHOLD_HINT = formatDisplayCopy(
  "Half capacity guide at 10 of 20 monthly lead slots. Above this line your pipeline is tight. Close deals to free slots before you accept new leads, up to 6 each week.",
);

const BAR_CATEGORY_GAP_PX = 6;
const CHART_MARGIN_LEFT = 32;
const CHART_MARGIN_RIGHT = 12;
const BAR_SIZE_MAX = 56;
const BAR_SIZE_MIN = 12;
const CAPACITY_CHART_Y_MAX = 20;
const CAPACITY_CHART_Y_STEP = 2;
const CAPACITY_CHART_THRESHOLD = 10;
const CAPACITY_Y_TICKS = Array.from(
  { length: CAPACITY_CHART_Y_MAX / CAPACITY_CHART_Y_STEP + 1 },
  (_, i) => i * CAPACITY_CHART_Y_STEP,
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

interface ChartRow extends ClientCapacityPoint {
  total: number;
}

type CapacitySegment = keyof typeof CLIENT_CAPACITY_COLORS;

function capacityFill(segment: CapacitySegment, entry: ChartRow): string {
  if (entry.isUpcoming) return CLIENT_CAPACITY_UPCOMING_FILL;
  return CLIENT_CAPACITY_COLORS[segment];
}

function capacityStroke(entry: ChartRow, highlighted: boolean): string {
  if (!highlighted) return "transparent";
  if (entry.isUpcoming) return CHART.tick;
  return CLIENT_CAPACITY_COLORS.leadAccepted;
}

function ClientCapacityTooltip({
  active,
  payload,
  data,
  chartYear,
}: TooltipProps<number, string> & { data: ChartRow[]; chartYear: number }) {
  if (!active || !payload?.length) return null;
  const month = payload[0]?.payload?.month as string | undefined;
  if (!month) return null;

  const index = data.findIndex((d) => d.month === month);
  const row = data[index];
  const prev = index > 0 ? data[index - 1] : undefined;
  if (!row) return null;

  if (row.isUpcoming) {
    return (
      <div className="min-w-[200px] rounded-2xl border border-hairline bg-surface px-4 py-3 shadow-pop">
        <p className="text-sm font-semibold text-ink">{row.monthYear ?? `${month} ${chartYear}`}</p>
        <p className="mt-1 text-xs leading-snug text-ink-muted">
          No capacity data yet. This month has not started in your pipeline.
        </p>
      </div>
    );
  }

  const activeTrend = momPercent(row.activeClients, prev?.activeClients ?? 0);
  const acceptedTrend = momPercent(row.leadAccepted, prev?.leadAccepted ?? 0);
  const closedTrend = momPercent(row.dealClosed, prev?.dealClosed ?? 0);

  return (
    <div className="min-w-[220px] rounded-2xl border border-hairline bg-surface px-4 py-3 shadow-pop">
      <p className="text-sm font-semibold text-ink">{row.monthYear ?? `${month} ${chartYear}`}</p>
      <p className="mt-1 text-xs text-ink-muted">
        {row.total} of {CAPACITY_CHART_Y_MAX} monthly slots (max 6 accepts per week)
      </p>
      <TooltipMetricRow
        label="Active clients"
        color={CLIENT_CAPACITY_COLORS.activeClients}
        value={row.activeClients}
        trend={activeTrend}
      />
      <TooltipMetricRow
        label="Lead accepted"
        color={CLIENT_CAPACITY_COLORS.leadAccepted}
        value={row.leadAccepted}
        trend={acceptedTrend}
      />
      <TooltipMetricRow
        label="Deal closed"
        color={CLIENT_CAPACITY_COLORS.dealClosed}
        value={row.dealClosed}
        trend={closedTrend}
      />
    </div>
  );
}

function TooltipMetricRow({
  label,
  color,
  value,
  trend,
  className,
}: {
  label: string;
  color: string;
  value: number;
  trend: number;
  className?: string;
}) {
  const up = trend >= 0;
  return (
    <div className={cn("mt-2 flex items-center justify-between gap-3 text-sm", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-medium text-ink">
          {value} {label.toLowerCase()}
        </span>
      </div>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-0.5 text-xs font-medium",
          up ? "text-status-completed" : "text-status-awaiting",
        )}
      >
        {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {Math.abs(trend).toFixed(1)}%
      </span>
    </div>
  );
}

type ThresholdLayerProps = {
  offset?: { left: number; width: number };
  yAxisMap?: Record<string, { scale: (value: number) => number }>;
};

function createCapacityThresholdLayer(threshold: number) {
  return function CapacityThresholdLayer(props: ThresholdLayerProps) {
    const { offset, yAxisMap } = props;
    if (!offset || !yAxisMap) return null;

    const yAxis = Object.values(yAxisMap)[0];
    if (!yAxis?.scale) return null;

    const y = yAxis.scale(threshold);
    const x1 = offset.left;
    const x2 = offset.left + offset.width;

    return (
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={CLIENT_CAPACITY_COLORS.leadAccepted}
        strokeWidth={1.5}
        strokeDasharray="5 4"
        strokeOpacity={0.9}
        style={{ pointerEvents: "none" }}
      />
    );
  };
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

export function ClientCapacityBarChart({
  data,
  chartYear,
  className,
}: {
  data: ClientCapacityPoint[];
  chartYear: number;
  className?: string;
}) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(0);

  const thresholdLayer = useMemo(
    () => createCapacityThresholdLayer(CAPACITY_CHART_THRESHOLD),
    [],
  );

  const rows = useMemo(
  () =>
      data.map((d) => ({
        ...d,
        total: d.activeClients + d.leadAccepted + d.dealClosed,
      })),
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

  const defaultHighlightMonth = useMemo(() => {
    if (rows.some((r) => r.month === CRM_CURRENT_MONTH)) return CRM_CURRENT_MONTH;
    return rows[rows.length - 1]?.month ?? null;
  }, [rows]);

  const highlightedMonth = activeMonth ?? defaultHighlightMonth;

  return (
    <div className={cn("flex h-full min-h-[260px] w-full flex-col", className)}>
      <div ref={plotRef} className="relative min-h-0 flex-1">
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
              domain={[0, CAPACITY_CHART_Y_MAX]}
              ticks={CAPACITY_Y_TICKS}
              tickFormatter={(v) => (v === 0 ? "0" : `${v}`)}
              tick={{ fontSize: 11, fill: CHART.tick }}
              width={36}
            />
            <Tooltip
              cursor={false}
              content={<ClientCapacityTooltip data={rows} chartYear={chartYear} />}
            />
            <Bar
              dataKey="activeClients"
              stackId="capacity"
              fill={CLIENT_CAPACITY_COLORS.activeClients}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            >
              {rows.map((entry) => (
                <Cell
                  key={`active-${entry.month}`}
                  fill={capacityFill("activeClients", entry)}
                  stroke={capacityStroke(entry, entry.month === highlightedMonth)}
                  strokeWidth={entry.month === highlightedMonth ? 1.5 : 0}
                />
              ))}
            </Bar>
            <Bar
              dataKey="leadAccepted"
              stackId="capacity"
              fill={CLIENT_CAPACITY_COLORS.leadAccepted}
              radius={[0, 0, 0, 0]}
              barSize={barSize}
            >
              {rows.map((entry) => (
                <Cell
                  key={`accepted-${entry.month}`}
                  fill={capacityFill("leadAccepted", entry)}
                  stroke={capacityStroke(entry, entry.month === highlightedMonth)}
                  strokeWidth={entry.month === highlightedMonth ? 1.5 : 0}
                />
              ))}
            </Bar>
            <Bar
              dataKey="dealClosed"
              stackId="capacity"
              fill={CLIENT_CAPACITY_COLORS.dealClosed}
              radius={[8, 8, 0, 0]}
              barSize={barSize}
            >
              {rows.map((entry) => (
                <Cell
                  key={`closed-${entry.month}`}
                  fill={capacityFill("dealClosed", entry)}
                  stroke={capacityStroke(entry, entry.month === highlightedMonth)}
                  strokeWidth={entry.month === highlightedMonth ? 1.5 : 0}
                />
              ))}
            </Bar>
            <Customized component={thresholdLayer} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="mt-1 flex shrink-0 flex-wrap items-center justify-center gap-x-6 gap-y-1"
        role="list"
        aria-label="Chart legend"
      >
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: CLIENT_CAPACITY_COLORS.activeClients }}
          />
          Active clients
        </div>
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: CLIENT_CAPACITY_COLORS.leadAccepted }}
          />
          Lead accepted
        </div>
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: CLIENT_CAPACITY_COLORS.dealClosed }}
          />
          Deal closed
        </div>
        <div role="listitem" className="flex items-center gap-2 text-xs text-ink-muted">
          <span
            className="inline-block h-0 w-5 shrink-0 border-t-[1.5px] border-dashed opacity-90"
            style={{ borderColor: CLIENT_CAPACITY_COLORS.leadAccepted }}
            aria-hidden
          />
          <span>Half capacity ({CAPACITY_CHART_THRESHOLD})</span>
          <span className="relative inline-flex">
            <button
              type="button"
              className="peer inline-flex text-ink-soft transition-colors hover:text-ink"
              aria-label="Half capacity guide"
            >
              <Info size={13} />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-[min(280px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-hairline bg-surface px-3 py-2 text-left text-xs font-normal leading-snug text-ink shadow-pop peer-hover:block peer-focus-visible:block"
            >
              {CAPACITY_THRESHOLD_HINT}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}