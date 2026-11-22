import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function buildMonth(year: number, month: number) {
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { date: Date; current: boolean }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, month - 1, prevDays - i), current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), current: true });
  }
  let next = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, next++), current: false });
  }
  return cells;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatPickerLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ClientNoteDatePicker({
  value,
  onChange,
  align = "left",
}: {
  value: Date;
  onChange: (next: Date) => void;
  align?: "left" | "right";
}) {
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [view, setView] = useState({ year: value.getFullYear(), month: value.getMonth() });

  const POPOVER_W = 280;
  const POPOVER_H = 320;

  const updatePosition = () => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    let top = rect.bottom + gap;
    let left = align === "right" ? rect.right - POPOVER_W : rect.left;
    if (top + POPOVER_H > window.innerHeight - gap) {
      top = rect.top - POPOVER_H - gap;
    }
    left = Math.min(Math.max(gap, left), window.innerWidth - POPOVER_W - gap);
    top = Math.min(Math.max(gap, top), window.innerHeight - POPOVER_H - gap);
    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, align, view.month, view.year]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t) || popoverRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    setView({ year: value.getFullYear(), month: value.getMonth() });
  }, [value]);

  const cells = buildMonth(view.year, view.month);
  const today = new Date();

  const pick = (d: Date) => {
    onChange(d);
    setOpen(false);
  };

  const popover = open && coords && (
    <div
      id={listId}
      ref={popoverRef}
      role="dialog"
      aria-label="Choose note date"
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-[200] w-[280px] rounded-[10px] border border-hairline bg-surface p-3 shadow-pop"
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            setView((v) =>
              v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 },
            )
          }
          className="icon-btn"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-[14px] font-semibold text-ink">
          {MONTHS[view.month]} {view.year}
        </p>
        <button
          type="button"
          onClick={() =>
            setView((v) =>
              v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 },
            )
          }
          className="icon-btn"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[11px] font-medium text-ink-muted">
            {d}
          </span>
        ))}
        {cells.map(({ date, current }, i) => {
          const selected = sameDay(date, value);
          const isToday = sameDay(date, today);
          return (
            <button
              key={`${date.toISOString()}-${i}`}
              type="button"
              onClick={() => pick(date)}
              className={cn(
                "flex h-8 w-full items-center justify-center rounded-md text-[13px] transition-colors",
                !current && "text-ink-soft/60",
                current && !selected && "text-ink hover:bg-sidebar",
                selected && "bg-primary font-semibold text-white",
                isToday && !selected && "ring-1 ring-primary/30",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => pick(new Date())}
        className="mt-2 w-full rounded-md py-1.5 text-[13px] font-medium text-primary hover:bg-sidebar"
      >
        Today
      </button>
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-outline !w-auto gap-2 text-[14px] text-ink"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={listId}
      >
        <Calendar size={16} className="text-ink-muted" />
        {formatPickerLabel(value)}
        <ChevronDown
          size={16}
          className={cn("text-ink-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {popover && createPortal(popover, document.body)}
    </div>
  );
}

export function formatNoteDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}