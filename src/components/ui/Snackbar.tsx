import { cn } from "@/lib/utils";

export function Snackbar({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-[10px] border border-hairline bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-pop",
        className,
      )}
    >
      {message}
    </div>
  );
}
