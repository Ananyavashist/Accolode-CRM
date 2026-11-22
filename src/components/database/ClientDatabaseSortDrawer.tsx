import { CheckCircle2, RotateCw, UnfoldMore, X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import {
  DEFAULT_DATABASE_SORT,
  type DatabaseSort,
  type DatabaseSortDirection,
  type DatabaseSortField,
} from "@/components/database/databaseFilters";

type SortSection = {
  field: DatabaseSortField;
  title: string;
  ascLabel: string;
  descLabel: string;
};

const SORT_SECTIONS: SortSection[] = [
  { field: "name", title: "Name", ascLabel: "A–Z", descLabel: "Z–A" },
  { field: "category", title: "Client type", ascLabel: "Renters first", descLabel: "Buyers first" },
  { field: "stage", title: "Stage", ascLabel: "Early → late", descLabel: "Late → early" },
  { field: "location", title: "Location", ascLabel: "A–Z", descLabel: "Z–A" },
  { field: "budget", title: "Budget", ascLabel: "Low → high", descLabel: "High → low" },
  { field: "source", title: "Source", ascLabel: "A–Z", descLabel: "Z–A" },
  { field: "moveInDate", title: "Move-in date", ascLabel: "Soonest first", descLabel: "Latest first" },
  {
    field: "lastTouchedAt",
    title: "Recently updated",
    ascLabel: "Oldest first",
    descLabel: "Newest first",
  },
];

function SortSectionBlock({
  section,
  activeField,
  activeDirection,
  onPick,
}: {
  section: SortSection;
  activeField: DatabaseSortField;
  activeDirection: DatabaseSortDirection;
  onPick: (field: DatabaseSortField, direction: DatabaseSortDirection) => void;
}) {
  return (
    <div className="border-b border-hairline pb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
        <button
          type="button"
          onClick={() => onPick(section.field, "asc")}
          className="text-xs font-medium text-primary hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="space-y-1">
        {(
          [
            ["asc", section.ascLabel],
            ["desc", section.descLabel],
          ] as const
        ).map(([dir, label]) => {
          const selected = activeField === section.field && activeDirection === dir;
          return (
            <label
              key={dir}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                selected ? "bg-primary/5 text-ink" : "text-ink-muted hover:bg-sidebar",
              )}
            >
              <input
                type="radio"
                name={`sort-${section.field}`}
                checked={selected}
                onChange={() => onPick(section.field, dir)}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface ClientDatabaseSortDrawerProps {
  open: boolean;
  draft: DatabaseSort;
  onChange: (next: DatabaseSort) => void;
  onClose: () => void;
  onApply: () => void;
}

export function ClientDatabaseSortDrawer({
  open,
  draft,
  onChange,
  onClose,
  onApply,
}: ClientDatabaseSortDrawerProps) {
  if (!open) return null;

  const pick = (field: DatabaseSortField, direction: DatabaseSortDirection) => {
    onChange({ field, direction });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-hidden />
      <aside
        className="fixed bottom-4 right-4 top-28 z-50 flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-pop"
        aria-label="Sort clients"
      >
        <header className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            <UnfoldMore size={18} className="text-ink-muted" />
            <h2 className="text-base font-semibold text-ink">Sort</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close sort">
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {SORT_SECTIONS.map((section) => (
            <SortSectionBlock
              key={section.field}
              section={section}
              activeField={draft.field}
              activeDirection={draft.direction}
              onPick={pick}
            />
          ))}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-4 py-3">
          <button
            type="button"
            onClick={() => onChange(DEFAULT_DATABASE_SORT)}
            className="btn-ghost !w-auto gap-1.5 text-sm"
          >
            Reset
            <RotateCw size={16} />
          </button>
          <button type="button" onClick={onApply} className="btn-primary !w-auto gap-1.5">
            Apply now
            <CheckCircle2 size={16} />
          </button>
        </footer>
      </aside>
    </>
  );
}