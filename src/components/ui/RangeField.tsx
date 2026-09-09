import { cn } from "@/lib/utils";

interface RangeFieldProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  ticks?: string[];
  disabled?: boolean;
}

export function RangeField({
  label,
  min,
  max,
  value,
  onChange,
  formatValue,
  ticks,
  disabled = false,
}: RangeFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", disabled && "pointer-events-none opacity-50")}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{label}</p>
        <span className="rounded-[6px] border border-hairline bg-sidebar px-2 py-0.5 text-xs font-medium text-ink">
          {formatValue(value)}
        </span>
      </div>
      <div className="relative pt-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-hairline accent-primary"
          style={{
            background: `linear-gradient(to right, #124553 0%, #124553 ${pct}%, #E5E7EB ${pct}%, #E5E7EB 100%)`,
          }}
        />
      </div>
      {ticks && (
        <div className="flex justify-between text-xs text-ink-muted">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
