import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Users } from "@/components/ui/icons";
import { ClientCapacityBarChart } from "@/components/charts/ClientCapacityBarChart";
import {
  type ClientCapacityView,
  clientCapacityChartYear,
  filterClientCapacity,
} from "@/data/charts";
import { cn } from "@/lib/utils";

const VIEWS: { id: ClientCapacityView; label: string }[] = [
  { id: "1 year", label: "1Y" },
  { id: "9 months", label: "9M" },
  { id: "6 months", label: "6M" },
];

const CUSTOM_YEARS = [2024, 2025, 2026] as const;

export function ClientCapacityCard({ className }: { className?: string }) {
  const [view, setView] = useState<ClientCapacityView>("1 year");
  const [customOpen, setCustomOpen] = useState(false);
  const customRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => filterClientCapacity(view), [view]);
  const chartYear = useMemo(() => clientCapacityChartYear(view), [view]);

  const isCustomYear = typeof view === "string" && view.startsWith("year-");

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (customRef.current && !customRef.current.contains(e.target as Node)) {
        setCustomOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={cn("section-card flex h-full min-h-0 w-full flex-col p-4", className)}>
      <div className="relative z-[1] flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="icon-btn shrink-0 bg-surface text-primary"
            role="img"
            aria-label="Client capacity"
          >
            <Users size={18} />
          </span>
          <h2 id="client-capacity-title" className="text-base font-bold leading-snug">
            Client capacity
          </h2>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-hairline bg-surface p-1">
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
          <Link
            to="/clients"
            aria-label="More details"
            className="icon-btn shrink-0 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
          >
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <ClientCapacityBarChart data={data} chartYear={chartYear} />
      </div>
    </div>
  );
}