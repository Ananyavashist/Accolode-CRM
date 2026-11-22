import { useEffect, useMemo, useState } from "react";
import { Search, X } from "@/components/ui/icons";
import { PillDropdown } from "@/components/ui/PillDropdown";
import { listingsForBroker } from "@/data/brokerListings";
import { HOME_STAGE_LABELS, type HomeStageId } from "@/data/clientHomesByStage";
import type { ListedProperty } from "@/types";

const STAGE_OPTIONS = (Object.keys(HOME_STAGE_LABELS) as HomeStageId[]).map(
  (id) => HOME_STAGE_LABELS[id],
);

interface AddPropertyToStageModalProps {
  open: boolean;
  onClose: () => void;
  brokerName: string;
  targetStage: HomeStageId;
  onStageChange: (stage: HomeStageId) => void;
  excludeListingIds: Set<string>;
  onSelect: (listing: ListedProperty, stage: HomeStageId) => void;
}

function stageIdFromLabel(label: string): HomeStageId {
  const entry = (Object.entries(HOME_STAGE_LABELS) as [HomeStageId, string][]).find(
    ([, l]) => l === label,
  );
  return entry?.[0] ?? "interested";
}

export function AddPropertyToStageModal({
  open,
  onClose,
  brokerName,
  targetStage,
  onStageChange,
  excludeListingIds,
  onSelect,
}: AddPropertyToStageModalProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [bhkFilter, setBhkFilter] = useState("All layouts");
  const [cityFilter, setCityFilter] = useState("All cities");

  const inventory = useMemo(() => listingsForBroker(brokerName), [brokerName]);

  const bhkOptions = useMemo(
    () => ["All layouts", ...new Set(inventory.map((p) => p.bhk))].sort(),
    [inventory],
  );
  const cityOptions = useMemo(
    () => ["All cities", ...new Set(inventory.map((p) => p.city))].sort(),
    [inventory],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setTypeFilter("All types");
      setBhkFilter("All layouts");
      setCityFilter("All cities");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inventory.filter((p) => {
      if (excludeListingIds.has(p.id)) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) {
        return false;
      }
      if (typeFilter !== "All types" && p.type !== typeFilter) return false;
      if (bhkFilter !== "All layouts" && p.bhk !== bhkFilter) return false;
      if (cityFilter !== "All cities" && p.city !== cityFilter) return false;
      return true;
    });
  }, [inventory, query, typeFilter, bhkFilter, cityFilter, excludeListingIds]);

  if (!open) return null;

  const stageLabel = HOME_STAGE_LABELS[targetStage];

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="add-property-stage-title"
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[min(640px,calc(100vh-2rem))] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] border border-hairline bg-surface shadow-pop"
      >
        <div className="shrink-0 border-b border-hairline p-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="add-property-stage-title" className="text-lg font-semibold text-ink">
                Add a property
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">
                Pick from your listings to add to the client&apos;s pipeline.
              </p>
            </div>
            <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close">
              <X size={18} />
            </button>
          </div>
          <div className="mt-4">
            <PillDropdown
              value={stageLabel}
              options={STAGE_OPTIONS}
              onChange={(label) => onStageChange(stageIdFromLabel(label))}
              ariaLabel="Target stage"
              className="bg-sidebar text-ink"
            />
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by property name or area"
                className="input-field pl-9"
                autoFocus
              />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <PillDropdown
              value={typeFilter}
              options={["All types", "Rent", "Sale"]}
              onChange={setTypeFilter}
              ariaLabel="Deal type filter"
              className="bg-sidebar text-ink-muted"
            />
            <PillDropdown
              value={bhkFilter}
              options={bhkOptions}
              onChange={setBhkFilter}
              ariaLabel="Layout filter"
              className="bg-sidebar text-ink-muted"
            />
            <PillDropdown
              value={cityFilter}
              options={cityOptions}
              onChange={setCityFilter}
              ariaLabel="City filter"
              className="bg-sidebar text-ink-muted"
            />
          </div>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto p-3">
          {filtered.length === 0 && (
            <li className="px-2 py-8 text-center text-sm text-ink-muted">
              No listings match your search. Try clearing filters.
            </li>
          )}
          {filtered.map((listing) => (
            <li
              key={listing.id}
              className="flex gap-3 rounded-[10px] border border-transparent p-2 transition-colors hover:border-hairline hover:bg-sidebar/80"
            >
              <img
                src={listing.image}
                alt=""
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-ink">{listing.name}</p>
                <p className="mt-0.5 truncate text-[13px] text-ink-muted">
                  {listing.price} · {listing.bhk} · {listing.city}
                </p>
                <p className="mt-0.5 text-[12px] text-ink-soft">{listing.location}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(listing, targetStage)}
                className="btn-primary !h-9 shrink-0 self-center !px-3 text-sm"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}