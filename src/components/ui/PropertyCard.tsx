import { Maximize2, TrainFront } from "@/components/ui/icons";
import type { PropertyPreference } from "@/types";
import { cn } from "@/lib/utils";

export function PropertyCard({
  property,
  className,
}: {
  property: PropertyPreference;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-hairline bg-surface", className)}>
      <div className="p-1.5">
        <img
          src={property.image}
          alt={property.name}
          className="h-28 w-full rounded-lg object-cover"
          loading="lazy"
        />
      </div>
      <div className="px-3 pb-3 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{property.name}</p>
            <p className="truncate text-xs text-ink-soft">{property.location}</p>
          </div>
          <span className="shrink-0 text-sm font-bold text-ink">₹ {property.price}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <Maximize2 size={12} /> {property.sqft}
          </span>
          <span className="inline-flex items-center gap-1">
            <TrainFront size={12} /> {property.tag}
          </span>
        </div>
      </div>
    </div>
  );
}
