import { Info, ArrowDown, ArrowUp } from "@/components/ui/icons";
import { cn, formatDisplayCopy } from "@/lib/utils";

const STAT_INFO_BY_TITLE: Record<string, string> = {
  "New Leads":
    "Client Leads still in the New stage. Review them in Client Leads before you qualify or accept.",
  "Qualified Leads":
    "High intent entries in Client Leads plus clients at the Qualified progress stage.",
  "Scheduled Visits": "Active leads in Client Database with a visit or follow up in motion.",
  "Negotiation stage":
    "Clients awaiting your next action, such as a site visit or negotiation step.",
  "Clients not responding":
    "Qualified leads with no scheduled visit and not in negotiation — follow up or release the slot.",
  "Rejected leads":
    "Leads you reviewed in Client Leads but did not accept (capacity full or poor fit). This count is not limited to 20 monthly slots.",
  "Total Clients": "Everyone saved in Client Database, every status.",
  Active: "Active Lead clients or listings marked active in this view.",
  Closed: "Completed clients and closed deals in the book.",
  "Awaiting action": "Clients who need a site visit, call, or negotiation step.",
  "High Intent": "Leads in the New list scored as high intent.",
  "Medium Intent": "Leads in the New list scored as medium intent.",
  "Low Intent": "Leads in the New list scored as low intent.",
  "Total Listed": "Properties on your listed inventory.",
  "For Rent": "Listings currently advertised for rent.",
  "For Sale": "Listings currently advertised for sale.",
};

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down";
  subtitle?: string;
  info?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  trendDirection = "up",
  subtitle,
  info,
  className,
}: StatCardProps) {
  const isUp = trendDirection === "up";
  const infoCopy = formatDisplayCopy(info ?? STAT_INFO_BY_TITLE[title] ?? subtitle ?? title);
  return (
    <div className={cn("section-card flex flex-col gap-4 p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="min-w-0 truncate text-base font-bold text-ink">{formatDisplayCopy(title)}</h2>
        <span className="relative z-[1] inline-flex shrink-0">
          <button
            type="button"
            className="peer icon-btn-sm text-ink-soft hover:text-ink"
            aria-label={`About ${formatDisplayCopy(title)}`}
          >
            <Info size={14} strokeWidth={1.5} />
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 hidden w-[min(240px,calc(100vw-3rem))] rounded-xl border border-hairline bg-surface px-3 py-2 text-left text-xs font-normal leading-snug text-ink shadow-pop peer-hover:block peer-focus-visible:block"
          >
            {infoCopy}
          </span>
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-[28px] font-semibold leading-none tracking-tight text-ink">{value}</span>
        {trend && (
          <span
            className={cn(
              "pill",
              isUp
                ? "bg-status-completedBg text-status-completed"
                : "bg-status-awaitingBg text-status-awaiting",
            )}
          >
            {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-ink-muted">{formatDisplayCopy(subtitle)}</p>}
    </div>
  );
}
