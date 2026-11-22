import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { CRM_CURRENT_MONTH_ABBREV } from "@/lib/crmClock";
import { ArrowUp, Plus, TrendingUp } from "@/components/ui/icons";
import {
  type DealClosedPoint,
  type DealClosedView,
  filterDealClosed,
} from "@/data/charts";
import { CHART, CHART_SERIES_PRIMARY } from "@/lib/theme";
import { cn } from "@/lib/utils";

const DEAL_LINE = CHART_SERIES_PRIMARY;
const VIEWS: { id: DealClosedView; label: string }[] = [
  { id: "1 year", label: "1Y" },
  { id: "9 months", label: "9M" },
  { id: "6 months", label: "6M" },
];

const CUSTOM_YEARS = [2024, 2025, 2026] as const;

function momPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function DealClosedTooltip({
  active,
  payload,
  data,
}: TooltipProps<number, string> & { data: DealClosedPoint[] }) {
  if (!active || !payload?.[0]) return null;
  const row = payload[0].payload as DealClosedPoint;
  const index = data.findIndex((d) => d.monthYear === row.monthYear);
  const prev = index > 0 ? data[index - 1].closed : 0;
  const trend = momPercent(row.closed, prev);

  return (
    <div className="min-w-[120px] rounded-2xl border border-hairline bg-surface p-1 shadow-pop">
      <p className="px-1 text-xs text-ink-muted">{row.monthYear}</p>
      <div className="flex items-center gap-2 p-1">
        <span className="text-2xl font-semibold leading-none text-ink">{row.closed}</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-status-completed">
          <ArrowUp size={12} />
          {trend.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function DealClosedChartCard({ className }: { className?: string }) {
  const gradientId = useId().replace(/:/g, "");
  const [view, setView] = useState<DealClosedView>("1 year");
  const [customOpen, setCustomOpen] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => filterDealClosed(view), [view]);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const yMax = 20;
  const yTicks = [0, 5, 10, 15, 20];

  const highlightedMonth =
    activeMonth ??
    (data.some((d) => d.month === CRM_CURRENT_MONTH_ABBREV)
      ? CRM_CURRENT_MONTH_ABBREV
      : data[data.length - 1]?.month ?? null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (customRef.current && !customRef.current.contains(e.target as Node)) {
        setCustomOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const isCustomYear = typeof view === "string" && view.startsWith("year-");

  return (
    <div className={cn("section-card flex min-h-0 w-full flex-col p-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="icon-btn text-primary">
            <TrendingUp size={18} />
          </span>
          <h2>Deal closed Chart</h2>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-hairline bg-surface p-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setView(v.id);
                setCustomOpen(false);
              }}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium leading-none transition-colors",
                view === v.id && !isCustomYear
                  ? "bg-sidebar text-ink"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {v.label}
            </button>
          ))}
          <div className="relative" ref={customRef}>
            <button
              type="button"
              aria-label="Choose custom year"
              aria-expanded={customOpen}
              onClick={() => setCustomOpen((o) => !o)}
              className={cn(
                "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-sidebar hover:text-ink",
                isCustomYear && "bg-sidebar text-ink",
              )}
            >
              <Plus size={16} />
            </button>
            {customOpen && (
              <ul className="absolute right-0 z-50 mt-1 min-w-[100px] overflow-hidden rounded-[10px] border border-hairline bg-surface py-1 shadow-pop">
                {CUSTOM_YEARS.map((year) => (
                  <li key={year}>
                    <button
                      type="button"
                      onClick={() => {
                        setView(`year-${year}`);
                        setCustomOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-sidebar",
                        view === `year-${year}` && "bg-primary/5 font-medium text-primary",
                      )}
                    >
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 min-h-[240px] flex-1 overflow-hidden rounded-[4px]">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={data}
            margin={{ top: 16, right: 12, left: 0, bottom: 4 }}
            onMouseMove={(state) => {
              const label = state?.activeLabel;
              if (label) setActiveMonth(String(label));
            }}
            onMouseLeave={() => setActiveMonth(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={DEAL_LINE} stopOpacity={0.28} />
                <stop offset="100%" stopColor={DEAL_LINE} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={CHART.grid} strokeDasharray="0" vertical horizontal />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 14}
                  textAnchor="middle"
                  className={cn(
                    "text-xs",
                    payload.value === highlightedMonth
                      ? "fill-ink font-semibold"
                      : "fill-ink-soft font-normal",
                  )}
                >
                  {payload.value}
                </text>
              )}
              height={28}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[0, yMax]}
              ticks={yTicks}
              tick={{ fontSize: 11, fill: CHART.tick }}
              width={36}
            />
            <Tooltip
              cursor={{ stroke: CHART.tick, strokeDasharray: "4 4" }}
              content={<DealClosedTooltip data={data} />}
            />
            <Area
              type="monotoneX"
              dataKey="closed"
              stroke={DEAL_LINE}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                r: 4,
                fill: DEAL_LINE,
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}