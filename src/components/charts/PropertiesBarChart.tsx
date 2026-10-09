import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { PropertiesPoint } from "@/data/charts";

import { BAR_COLORS, CHART } from "@/lib/theme";

function BarTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.[0]) return null;
  const entry = payload[0];
  const isRent = entry.dataKey === "rent";
  const value = entry.value ?? 0;
  return (
    <div className="rounded-[10px] border border-hairline bg-surface px-3 py-2 shadow-pop">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="text-sm text-ink-muted">
        {value} Units {isRent ? "rented" : "sold"}
      </p>
    </div>
  );
}

export function PropertiesBarChart({ data }: { data: PropertiesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 16, right: 16, left: 4, bottom: 8 }}
        barCategoryGap="32%"
        barGap={10}
      >
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: CHART.tick }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: CHART.tick }} />
        <Tooltip content={<BarTooltip />} shared={false} cursor={{ fill: "rgba(18,69,83,0.06)" }} />
        <Bar dataKey="rent" fill={BAR_COLORS.rent} radius={[6, 6, 0, 0]} barSize={40} />
        <Bar dataKey="sold" fill={BAR_COLORS.sold} radius={[6, 6, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
