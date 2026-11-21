import { useMemo, useState } from "react";
import { X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface MultiSelectComboboxProps {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function MultiSelectCombobox({
  label,
  options,
  value,
  onChange,
  required,
  error,
  placeholder = "Type to filter options",
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...options];
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-status-awaiting"> *</span>}
      </p>
      <div
        className={cn(
          "rounded-[10px] border bg-surface p-2",
          error ? "border-status-awaiting" : "border-hairline",
        )}
      >
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {v}
              <button
                type="button"
                onClick={() => toggle(v)}
                className="rounded p-0.5 hover:bg-primary/20"
                aria-label={`Remove ${v}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-field h-9 border-0 bg-sidebar px-2 shadow-none focus:ring-1 focus:ring-primary/30"
        />
        <ul className="mt-2 max-h-36 overflow-y-auto rounded-md border border-hairline">
          {filtered.map((opt) => {
            const selected = value.includes(opt);
            return (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => toggle(opt)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar",
                    selected && "bg-primary/5 font-medium text-primary",
                  )}
                >
                  {opt}
                  {selected && <span className="text-xs text-primary">Selected</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {error && (
        <p className="text-xs text-status-awaiting" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}