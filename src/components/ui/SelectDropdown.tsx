import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SelectDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("space-y-2", disabled && "pointer-events-none opacity-50")}>
      <p className="text-sm font-medium text-ink">{label}</p>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between rounded-[10px] border border-hairline bg-surface px-3 text-sm transition-colors hover:border-primary/30"
      >
        <span className={cn(value ? "text-ink" : "text-ink-soft")}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("text-ink-soft transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul className="max-h-40 overflow-y-auto rounded-[10px] border border-hairline bg-surface py-1 shadow-pop">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar",
                  value === opt && "bg-primary/5 font-medium text-primary",
                )}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
