import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { AcquisitionPoint } from "@/data/charts";

import { CHART } from "@/lib/theme";
import { ACQUISITION_SERIES } from "@/components/charts/ChartLegend";

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-hairline bg-surface p-3 shadow-pop">
      <p className="mb-1.5 text-sm font-semibold text-ink">{label} January</p>
      <div className="space-y-1">
        {payload.map((entry) => {
          const meta = ACQUISITION_SERIES.find((s) => s.key === entry.dataKey);
          return (
            <div key={entry.dataKey} className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta?.color }} />
              <span className="font-medium text-ink">{entry.value}</span>
              <span>{meta?.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LeadAcquisitionChart({ data }: { data: AcquisitionPoint[] }) {
  const maxY = Math.max(
    250,
    ...data.flatMap((d) => [d.direct, d.social, d.platform]),
  );
  const yStep = maxY <= 250 ? 50 : 100;
  const ticks = Array.from({ length: Math.floor(maxY / yStep) + 1 }, (_, i) => i * yStep);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART.tick }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART.tick }}
          domain={[0, maxY]}
          ticks={ticks}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART.tick, strokeDasharray: 4 }} />
        {ACQUISITION_SERIES.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
