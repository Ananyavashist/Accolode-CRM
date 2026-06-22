import { cn } from "@/lib/utils";

interface ChipSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ChipSelect({ options, value, onChange, className, disabled = false }: ChipSelectProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", disabled && "pointer-events-none opacity-50", className)}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(opt)}
            className={cn(
              "rounded-[6px] border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary/5 text-primary"
                : "border-hairline bg-surface text-ink-muted hover:border-primary/30 hover:text-ink",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
