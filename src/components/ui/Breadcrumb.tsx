import { Link } from "react-router-dom";
import { ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-ink-soft" aria-hidden />}
            {item.to && !isLast ? (
              <Link to={item.to} className="font-medium text-ink-muted transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "font-semibold text-ink" : "text-ink-muted")}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
