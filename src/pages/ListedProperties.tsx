import { useMemo, useState } from "react";
import { Building2, MapPin, Plus, Search, SlidersHorizontal } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { LISTED_PROPERTIES } from "@/data/listings";
import type { ListingStatus } from "@/types";
import { LISTING_CHIP } from "@/lib/theme";
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
    const active = LISTED_PROPERTIES.filter((p) => p.status === "Active").length;
    return { total, rent, sale, active };
  }, []);

  const rows = useMemo(() => {
    return LISTED_PROPERTIES.filter((p) => {
      if (typeTab !== "All" && p.type !== typeTab) return false;
      const haystack = `${p.name} ${p.location} ${p.city} ${p.bhk} ${p.brokerName ?? ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [typeTab, query]);

  return (
    <div className="space-y-section p-section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Listed Properties</h1>
          <p className="mt-1 text-ink-muted">
            Manage your active listings, track offers, and monitor rent vs sale inventory
          </p>
        </div>
        <button className="btn-primary">
          Add Property <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Listed" value={stats.total} trend="4.2%" subtitle="across all cities" />
        <StatCard title="For Rent" value={stats.rent} trend="2.1%" subtitle="active rental listings" />
        <StatCard title="For Sale" value={stats.sale} trend="1.8%" subtitle="sale inventory" />
        <StatCard title="Active" value={stats.active} trend="6.0%" subtitle="currently on market" />
      </div>

      <div className="section-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeTab(tab)}
                className={cn(
                  "rounded-[10px] px-3 py-2 text-sm font-medium transition-colors",
                  typeTab === tab
                    ? "bg-primary text-white"
                    : "bg-sidebar text-ink-muted hover:bg-hairline hover:text-ink",
                )}
              >
                {tab === "Sale" ? "For Sale" : tab === "Rent" ? "For Rent" : tab}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by property, city, or broker"
                className="h-10 w-full rounded-[10px] border border-hairline bg-sidebar pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary/30 focus:bg-surface"
              />
            </label>
            <button className="btn-outline shrink-0">
              Filters <SlidersHorizontal size={16} />
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
                <span
                  className="absolute left-3 top-3 pill font-medium"
                  style={{
                    backgroundColor:
                      property.type === "Rent" ? LISTING_CHIP.rent.bg : LISTING_CHIP.sold.bg,
                    color: property.type === "Rent" ? LISTING_CHIP.rent.text : LISTING_CHIP.sold.text,
                  }}
                >
                  {property.type === "Rent" ? "For Rent" : "For Sale"}
                </span>
              </div>
              <div className="space-y-2 px-3 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-ink">{property.name}</h3>
                    <p className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-ink-muted">
                      <MapPin size={12} className="shrink-0" />
                      {property.location}, {property.city}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-primary">{property.price}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  <span className="pill bg-sidebar text-ink-muted">{property.bhk}</span>
                  <span className="pill bg-sidebar text-ink-muted">{property.sqft}</span>
                  <span className="pill bg-sidebar text-ink-muted">{property.tag}</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-hairline pt-2">
                  <span className={cn("pill", STATUS_STYLES[property.status])}>{property.status}</span>
                  <span className="truncate text-xs text-ink-soft">Listed {property.listedDate}</span>
                </div>
                {property.brokerName && (
                  <p className="text-xs text-ink-muted">
                    Broker handling: <span className="font-medium text-ink">{property.brokerName}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Building2 size={22} />
            </span>
            <p className="font-semibold text-ink">No properties match your filters</p>
            <p className="text-sm text-ink-muted">Try adjusting the search or type filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
