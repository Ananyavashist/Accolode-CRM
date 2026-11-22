import { useMemo, useState } from "react";
import {
  Calendar,
  LayoutGrid,
  DataImport,
  ListFilter,
  Notes,
  Search,
  UnfoldMore,
} from "@/components/ui/icons";
import { PillDropdown } from "@/components/ui/PillDropdown";
import {
  PIPELINE_DEALS,
  PIPELINE_MORE_COUNTS,
  PIPELINE_STAGES,
  type PipelineDeal,
} from "@/data/dealPipeline";
import { cn, formatDisplayCopy } from "@/lib/utils";

type PipelineView = "kanban" | "table" | "list" | "calendar";
export type PipelineDateRange = "Today" | "One week" | "One month";

const PIPELINE_TODAY = "2026-11-19";
const PIPELINE_RANGE_OPTIONS: PipelineDateRange[] = ["Today", "One week", "One month"];

const VIEWS: { id: PipelineView; label: string; icon: typeof LayoutGrid }[] = [
  { id: "kanban", label: "Kanban", icon: LayoutGrid },
  { id: "table", label: "Table", icon: UnfoldMore },
  { id: "list", label: "List", icon: Notes },
  { id: "calendar", label: "Calendar", icon: Calendar },
];

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatPipelineDateLabel(iso: string): string {
  if (iso === PIPELINE_TODAY) return "Today";
  const date = parseIsoDate(iso);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatCalendarWeekday(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString("en-US", { weekday: "short" });
}

function calendarWeekDays(anchorIso: string): string[] {
  const anchor = parseIsoDate(anchorIso);
  const day = anchor.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  });
}

function PipelineDealCard({ deal }: { deal: PipelineDeal }) {
  const dateLabel = formatPipelineDateLabel(deal.dueDate);
  return (
    <article className="rounded-xl border border-hairline bg-surface p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
        <Calendar size={13} className="shrink-0 text-ink-soft" />
        <span>{dateLabel}</span>
      </div>
      <h3 className="text-sm font-semibold text-ink">{formatDisplayCopy(deal.name)}</h3>
      <p className="card-lede mt-1 leading-snug">{formatDisplayCopy(deal.summary)}</p>
      {deal.extra && <p className="card-lede mt-2 text-ink-soft">{formatDisplayCopy(deal.extra)}</p>}
    </article>
  );
}

function KanbanBoard({
  deals,
  query,
  range,
}: {
  deals: PipelineDeal[];
  query: string;
  range: PipelineDateRange;
}) {
  const filtered = useMemo(() => filterPipelineDeals(deals, query, range), [deals, query, range]);
  const showMoreLinks = range === "One month";

  return (
    <div className="flex w-full gap-3 overflow-x-auto pb-1 pt-1">
      {PIPELINE_STAGES.map((stage) => {
        const column = filtered.filter((d) => d.stage === stage);
        const more = PIPELINE_MORE_COUNTS[stage];
        return (
          <div
            key={stage}
            className="kanban-column flex min-w-[200px] flex-1 basis-0 flex-col p-3"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-ink">{formatDisplayCopy(stage)}</h3>
              <span className="text-xs font-medium text-ink-muted">{column.length + more}</span>
            </div>
            <ul className="flex flex-col gap-2">
              {column.map((deal) => (
                <li key={deal.id}>
                  <PipelineDealCard deal={deal} />
                </li>
              ))}
            </ul>
            {showMoreLinks && more > 0 && (
              <button type="button" className="mt-2 text-left text-xs font-medium text-primary hover:underline">
                {more} more
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TableView({
  deals,
  query,
  range,
}: {
  deals: PipelineDeal[];
  query: string;
  range: PipelineDateRange;
}) {
  const filtered = useMemo(() => filterPipelineDeals(deals, query, range), [deals, query, range]);
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-hairline bg-sidebar/60 text-xs font-medium text-ink-muted">
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Deal</th>
            <th className="px-4 py-3">Next step</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((deal) => (
            <tr key={deal.id} className="border-b border-hairline last:border-0">
              <td className="px-4 py-3 text-ink-muted">{formatPipelineDateLabel(deal.dueDate)}</td>
              <td className="px-4 py-3 font-medium text-ink">{formatDisplayCopy(deal.name)}</td>
              <td className="px-4 py-3 text-ink-muted">{formatDisplayCopy(deal.stage)}</td>
              <td className="px-4 py-3 text-ink-muted">{formatDisplayCopy(deal.summary)}</td>
              <td className={cn("px-4 py-3", deal.overdue && "text-status-awaiting")}>
                {formatDisplayCopy(deal.note)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListView({
  deals,
  query,
  range,
}: {
  deals: PipelineDeal[];
  query: string;
  range: PipelineDateRange;
}) {
  const filtered = useMemo(() => filterPipelineDeals(deals, query, range), [deals, query, range]);
  return (
    <ul className="divide-y divide-hairline rounded-xl border border-hairline">
      {filtered.map((deal) => (
        <li key={deal.id} className="p-3">
          <PipelineDealCard deal={deal} />
        </li>
      ))}
    </ul>
  );
}

function CalendarView({
  deals,
  query,
  range,
}: {
  deals: PipelineDeal[];
  query: string;
  range: PipelineDateRange;
}) {
  const filtered = useMemo(() => filterPipelineDeals(deals, query, range), [deals, query, range]);
  const weekDays = useMemo(() => {
    if (range === "Today") return [PIPELINE_TODAY];
    return calendarWeekDays(PIPELINE_TODAY);
  }, [range]);
  const byDate = useMemo(() => {
    const map = new Map<string, PipelineDeal[]>();
    for (const iso of weekDays) map.set(iso, []);
    const outside: PipelineDeal[] = [];
    for (const deal of filtered) {
      const bucket = map.get(deal.dueDate);
      if (bucket) bucket.push(deal);
      else outside.push(deal);
    }
    return { map, outside };
  }, [filtered, weekDays]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((iso) => {
          const isToday = iso === PIPELINE_TODAY;
          const items = byDate.map.get(iso) ?? [];
          return (
            <div
              key={iso}
              className={cn(
                "flex min-h-[200px] flex-col rounded-xl border border-hairline p-2",
                isToday ? "bg-primary/[0.04]" : "bg-sidebar/50",
              )}
            >
              <p className={cn("text-xs font-semibold", isToday ? "text-primary" : "text-ink")}>
                {formatCalendarWeekday(iso)}
              </p>
              <p className="text-[11px] text-ink-muted">{formatPipelineDateLabel(iso)}</p>
              <ul className="mt-2 flex flex-1 flex-col gap-2">
                {items.map((deal) => (
                  <li key={deal.id}>
                    <PipelineDealCard deal={deal} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {byDate.outside.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-muted">Outside this week</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {byDate.outside.map((deal) => (
              <li key={deal.id}>
                <PipelineDealCard deal={deal} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function filterDealsByRange(deals: PipelineDeal[], range: PipelineDateRange): PipelineDeal[] {
  if (range === "One month") return deals;
  if (range === "Today") {
    return deals.filter((d) => d.dueDate === PIPELINE_TODAY);
  }
  const weekDays = new Set(calendarWeekDays(PIPELINE_TODAY));
  return deals.filter((d) => weekDays.has(d.dueDate));
}

function filterDeals(deals: PipelineDeal[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return deals;
  return deals.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.stage.toLowerCase().includes(q) ||
      d.note.toLowerCase().includes(q),
  );
}

function filterPipelineDeals(deals: PipelineDeal[], query: string, range: PipelineDateRange) {
  return filterDeals(filterDealsByRange(deals, range), query);
}

export function DealPipelineWorkspace() {
  const [view, setView] = useState<PipelineView>("kanban");
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<PipelineDateRange>("One month");

  return (
    <div className="section-card flex w-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 border-b border-hairline pb-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 xl:gap-4">
          <div className="flex shrink-0 items-center gap-2.5">
            <span
              className="icon-btn shrink-0 bg-surface text-primary"
              role="img"
              aria-label="Deal pipeline"
            >
              <LayoutGrid size={18} />
            </span>
            <h2 className="text-base font-bold leading-none">Deal pipeline</h2>
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Pipeline view">
            {VIEWS.map((v) => {
              const Icon = v.icon;
              const active = view === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={cn(
                    "tab-underline inline-flex items-center gap-1.5",
                    active && "tab-underline-active",
                  )}
                >
                  <Icon size={16} />
                  {v.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto">
          <label className="relative min-w-0 w-full flex-1 sm:min-w-[180px] xl:w-52">
            <span className="sr-only">Search pipeline</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here…"
              className="input-field h-9 w-full pl-9"
            />
          </label>
          <PillDropdown
            value={dateRange}
            options={[...PIPELINE_RANGE_OPTIONS]}
            onChange={(value) => setDateRange(value as PipelineDateRange)}
            ariaLabel="Pipeline date range"
            className="h-9 w-full shrink-0 gap-1.5 border border-hairline bg-surface px-3 text-sm font-medium text-ink sm:w-auto"
          />
          <button type="button" className="btn-outline gap-1.5">
            Filter
            <ListFilter size={16} />
          </button>
          <button type="button" className="btn-outline gap-1.5">
            Import
            <DataImport size={16} />
          </button>
        </div>
      </div>

      <div className="min-h-[320px]">
        {view === "kanban" && (
          <KanbanBoard deals={PIPELINE_DEALS} query={query} range={dateRange} />
        )}
        {view === "table" && <TableView deals={PIPELINE_DEALS} query={query} range={dateRange} />}
        {view === "list" && <ListView deals={PIPELINE_DEALS} query={query} range={dateRange} />}
        {view === "calendar" && (
          <CalendarView deals={PIPELINE_DEALS} query={query} range={dateRange} />
        )}
      </div>
    </div>
  );
}