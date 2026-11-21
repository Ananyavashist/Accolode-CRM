import type { ReactNode } from "react";
import { cn, formatDisplayCopy } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  trailing?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, trailing, className }: PageHeaderProps) {
  const heading = (
    <div className="min-w-0">
      <h1 className="text-[24px] font-bold leading-tight text-ink">{formatDisplayCopy(title)}</h1>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {formatDisplayCopy(description)}
        </p>
      ) : null}
    </div>
  );

  if (trailing) {
    return (
      <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
        {heading}
        {trailing}
      </div>
    );
  }

  return <div className={cn(className)}>{heading}</div>;
}