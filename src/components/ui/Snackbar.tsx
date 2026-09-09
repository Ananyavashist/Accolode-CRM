import { cn } from "@/lib/utils";

export function Snackbar({
  message,
  actionLabel,
  onAction,
  className,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-lg border border-hairline bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-pop",
        className,
      )}
    >
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-md bg-white/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide hover:bg-white/25"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
