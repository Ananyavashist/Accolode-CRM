import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface PeriodDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

export function PeriodDropdown({ value, options, onChange, className }: PeriodDropdownProps) {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) setFocusIndex(-1);
  }, [open]);

  const select = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setFocusIndex(options.indexOf(value));
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIndex((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusIndex >= 0) select(options[focusIndex]);
    }
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        className="btn-outline text-xs font-medium text-ink-muted"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Select time period"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        {value}
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Select period"
          className="absolute right-0 z-50 mt-1 min-w-[140px] overflow-hidden rounded-[10px] border border-hairline bg-white py-1 shadow-pop"
        >
          {options.map((opt, i) => (
            <li key={opt} role="option" aria-selected={value === opt}>
              <button
                type="button"
                onClick={() => select(opt)}
                onMouseEnter={() => setFocusIndex(i)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors",
                  (value === opt || focusIndex === i) && "bg-primary/5 font-medium text-primary",
                  value !== opt && focusIndex !== i && "text-ink hover:bg-sidebar",
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
