import { useMemo } from "react";
import { PeriodDropdown } from "@/components/ui/PeriodDropdown";
import { channelDisplayName, computeLeadChannelsMetrics, slicePercent } from "@/lib/dashboardMetrics";
import { PLATFORM_COLORS } from "@/lib/theme";
import type { Lead } from "@/types";
import { cn } from "@/lib/utils";

const CHANNEL_PERIODS = ["1Y", "6M", "1M"] as const;

const PLATFORM_LOGOS: Partial<Record<string, string>> = {
  Magicbricks: "/logos/magicbricks.svg",
  "99acres": "/logos/99acres.svg",
};

function PlatformMark({ name }: { name: string }) {
  const label = channelDisplayName(name);
  const logo = PLATFORM_LOGOS[name];
  if (logo) {
    return (
      <img
        src={logo}
        alt={label}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
        width={28}
        height={28}
      />
    );
  }

  const color = PLATFORM_COLORS[name] ?? "#124553";
  const initials = name.slice(0, 2);

  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

interface PlatformLeadsChannelsCardProps {
  leads: Lead[];
  period: string;
  onPeriodChange: (value: string) => void;
  className?: string;
}

export function PlatformLeadsChannelsCard({
  leads,
  period,
  onPeriodChange,
  className,
}: PlatformLeadsChannelsCardProps) {

  const { slices, total } = useMemo(
    () => computeLeadChannelsMetrics(leads, period),
    [leads, period],
  );

  const barTotal = total || slices.reduce((s, r) => s + r.value, 0);

  return (
    <div className={cn("section-card flex w-full flex-col p-4", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2>Accepted lead Channel</h2>
        </div>
        <PeriodDropdown
          value={period}
          options={[...CHANNEL_PERIODS]}
          onChange={onPeriodChange}
        />
      </div>

      <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-sidebar">
        {slices.map((row) => {
          if (row.value === 0 && barTotal > 0) return null;
          return (
            <div
              key={row.name}
              className="h-full min-w-[4px] first:rounded-l-full last:rounded-r-full"
              style={{
                flex: barTotal > 0 ? row.value : 1,
                backgroundColor: row.color,
              }}
              title={`${channelDisplayName(row.name)} ${slicePercent(row.value, barTotal || 1)}%`}
            />
          );
        })}
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5"
        role="list"
        aria-label="Platform legend"
      >
        {slices.map((row) => (
          <div key={row.name} role="listitem" className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: row.color }}
              aria-hidden
            />
            <span>{channelDisplayName(row.name)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-hairline pt-3">
        <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-0 sm:gap-y-2">
          {slices.map((row, index) => (
            <li
              key={row.name}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 text-sm sm:px-4 sm:first:pl-0 sm:last:pr-0",
                index > 0 && "sm:border-l sm:border-hairline",
              )}
            >
              <PlatformMark name={row.name} />
              <span className="truncate font-medium text-ink">
                {channelDisplayName(row.name)}
              </span>
              <span className="shrink-0 text-ink-muted">
                {slicePercent(row.value, barTotal || 1)}%
              </span>
              <span className="shrink-0 font-medium text-ink">{row.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
