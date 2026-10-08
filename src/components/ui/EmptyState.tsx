import type { ReactNode } from "react";
import { FileText } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <span
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-hairline text-ink-muted"
        aria-hidden
      >
        <FileText size={22} />
      </span>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
