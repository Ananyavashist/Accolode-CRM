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
    <div
      className={cn(
        "flex shrink-0 flex-col overflow-hidden rounded-xl border border-hairline bg-surface",
        className,
      )}
    >
      <div className="p-1.5">
        <img
          src={property.image}
          alt={property.name}
          className="h-28 w-full rounded-lg object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold leading-snug text-ink">{property.name}</p>
            <p className="truncate text-[14px] text-ink-muted">{property.location}</p>
          </div>
          <span className="shrink-0 text-[14px] font-bold text-ink">₹ {property.price}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-[14px] text-ink-muted">
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
