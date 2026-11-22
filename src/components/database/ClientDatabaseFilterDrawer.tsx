import type { ReactNode } from "react";
import { CheckCircle2, ListFilter, RotateCw, Search, X } from "@/components/ui/icons";
import { progressStageLabel } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS } from "@/types";
import { EMPTY_DATABASE_FILTERS, type DatabaseFilters } from "@/components/database/databaseFilters";

function FilterSection({
  title,
  onReset,
  children,
}: {
  title: string;
  onReset: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-hairline pb-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button type="button" onClick={onReset} className="text-xs font-medium text-primary hover:underline">
          Reset
        </button>
      </div>
      {children}
    </div>
  );
}

interface ClientDatabaseFilterDrawerProps {
  open: boolean;
  draft: DatabaseFilters;
  propertyTypes: string[];
  locations: string[];
  onChange: (next: DatabaseFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onSave: () => void;
}

export function ClientDatabaseFilterDrawer({
  open,
  draft,
  propertyTypes,
  locations,
  onChange,
  onClose,
  onApply,
  onSave,
}: ClientDatabaseFilterDrawerProps) {
  if (!open) return null;

  const patch = (partial: Partial<DatabaseFilters>) => onChange({ ...draft, ...partial });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} aria-hidden />
      <aside
        className="fixed bottom-4 right-4 top-28 z-50 flex w-[min(100vw-2rem,400px)] flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-pop"
        aria-label="Filter clients"
      >
        <header className="flex items-center justify-between gap-2 border-b border-hairline px-4 py-3">
          <div className="flex items-center gap-2">
            <ListFilter size={18} className="text-ink-muted" />
            <h2 className="text-base font-semibold text-ink">Filter</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close filter">
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <FilterSection title="Name" onReset={() => patch({ name: "" })}>
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
                placeholder="Search by name or email"
                className="input-field h-9 w-full pl-9"
              />
            </div>
          </FilterSection>

          <FilterSection title="Stage" onReset={() => patch({ stage: "" })}>
            <select
              value={draft.stage}
              onChange={(e) => patch({ stage: e.target.value })}
              className="input-field h-9 w-full"
              aria-label="Filter by stage"
            >
              <option value="">Any stage</option>
              {PROGRESS_STAGE_OPTIONS.map((stage) => (
                <option key={stage} value={stage}>
                  {progressStageLabel(stage)}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Property type" onReset={() => patch({ propertyType: "" })}>
            <select
              value={draft.propertyType}
              onChange={(e) => patch({ propertyType: e.target.value })}
              className="input-field h-9 w-full"
              aria-label="Filter by property type"
            >
              <option value="">Any property type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Location" onReset={() => patch({ location: "" })}>
            <select
              value={draft.location}
              onChange={(e) => patch({ location: e.target.value })}
              className="input-field h-9 w-full"
              aria-label="Filter by location"
            >
              <option value="">Any location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </FilterSection>

          <FilterSection title="Budget" onReset={() => patch({ budget: "" })}>
            <input
              value={draft.budget}
              onChange={(e) => patch({ budget: e.target.value })}
              placeholder="e.g. ₹50K or 2 Cr"
              className="input-field h-9 w-full"
            />
          </FilterSection>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-4 py-3">
          <button
            type="button"
            onClick={() => onChange(EMPTY_DATABASE_FILTERS)}
            className="btn-ghost !w-auto gap-1.5 text-sm"
          >
            Reset
            <RotateCw size={16} />
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onSave} className="btn-outline !w-auto gap-1.5">
              Save
              <CheckCircle2 size={16} />
            </button>
            <button type="button" onClick={onApply} className="btn-primary !w-auto gap-1.5">
              Apply now
              <CheckCircle2 size={16} />
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}