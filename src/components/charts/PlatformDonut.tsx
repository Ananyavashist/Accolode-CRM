import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { platformLeads } from "@/data/charts";

export function PlatformDonut() {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            data={platformLeads}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={2}
            cornerRadius={6}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {platformLeads.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-ink">20%</span>
        <span className="max-w-[110px] text-xs leading-tight text-ink-soft">
          Increase in Monthly leads
        </span>
      </div>
    </div>
  );
}
