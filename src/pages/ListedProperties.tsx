import { useMemo, useState } from "react";
import { MapPin, Plus, RotateCw, Search, SlidersHorizontal } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { LISTED_PROPERTIES } from "@/data/listings";
import type { ListingStatus } from "@/types";
import { TypeChip } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";

const TYPE_TABS = ["All", "Rent", "Sale"] as const;
type TypeTab = (typeof TYPE_TABS)[number];

const STATUS_STYLES: Record<ListingStatus, string> = {
  Active: "bg-status-completedBg text-status-completed",
  "Under Offer": "bg-status-activeBg text-status-active",
  Sold: "bg-doc-indigo text-status-active",
  Rented: "bg-doc-cream text-primary",
};

export function ListedProperties() {
  const [typeTab, setTypeTab] = useState<TypeTab>("All");
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const total = LISTED_PROPERTIES.length;
    const rent = LISTED_PROPERTIES.filter((p) => p.type === "Rent").length;
    const sale = LISTED_PROPERTIES.filter((p) => p.type === "Sale").length;
    const sold = LISTED_PROPERTIES.filter((p) => p.status === "Sold").length;
    return { total, rent, sale, sold };
  }, []);

  const rows = useMemo(() => {
    return LISTED_PROPERTIES.filter((p) => {
      if (typeTab !== "All" && p.type !== typeTab) return false;
      const haystack = `${p.name} ${p.location} ${p.city} ${p.bhk} ${p.brokerName ?? ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [typeTab, query]);

  return (
    <div className="page">
      <PageHeader
        title="Properties"
        trailing={
          <button type="button" className="btn-primary gap-1.5">
            Add Property
            <Plus size={16} />
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Listed" value={stats.total} trend="4.2%" />
        <StatCard title="For Rent" value={stats.rent} trend="2.1%" />
        <StatCard title="For Sale" value={stats.sale} trend="1.8%" />
        <StatCard title="Sold properties" value={stats.sold} trend="6.0%" />
      </div>

      <div className="section-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeTab(tab)}
                className={cn("tab-underline", typeTab === tab && "tab-underline-active")}
              >
                {tab === "Sale" ? "For Sale" : tab === "Rent" ? "For Rent" : tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="listing-search" className="sr-only">
              Search listings
            </label>
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                id="listing-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by property, city, or broker"
                className="input-field pl-9"
              />
            </div>
            <button className="btn-outline shrink-0 gap-1.5">
              Filters
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((property) => (
            <article
              key={property.id}
              className="section-card overflow-hidden transition-shadow hover:shadow-pop"
            >
              <div className="relative p-1.5">
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-40 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <TypeChip
                  type={property.type}
                  label={property.type === "Rent" ? "For Rent" : "For Sale"}
                  className="absolute left-3 top-3 !text-sm"
                />
              </div>
              <div className="space-y-2.5 px-3 pb-4 text-sm text-ink-muted">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-ink">{property.name}</h3>
                    <p className="mt-1 inline-flex items-center gap-1 truncate">
                      <MapPin size={14} className="shrink-0" />
                      {property.location}, {property.city}
                    </p>
                  </div>
                  <span className="shrink-0 text-base font-semibold text-primary">{property.price}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-sidebar px-2 py-1 text-sm text-ink-muted">{property.bhk}</span>
                  <span className="rounded-md bg-sidebar px-2 py-1 text-sm text-ink-muted">{property.sqft}</span>
                  <span className="rounded-md bg-sidebar px-2 py-1 text-sm text-ink-muted">{property.tag}</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-hairline pt-2.5">
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-sm font-medium",
                      STATUS_STYLES[property.status],
                    )}
                  >
                    {property.status}
                  </span>
                  <span className="truncate">Listed {property.listedDate}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {rows.length === 0 && (
          <EmptyState
            title="No properties match your filters"
            description="Clear search or switch type to see listings again."
            action={
              <button
                className="btn-outline gap-1.5"
                onClick={() => {
                  setQuery("");
                  setTypeTab("All");
                }}
              >
                Clear filters
                <RotateCw size={16} />
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
