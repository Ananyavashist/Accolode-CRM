import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from "@/components/ui/icons";
import { AddEventModal, type CalEvent, type EventType } from "@/components/modals/AddEventModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<EventType, { chip: string; dot: string }> = {
  Tour: { chip: "bg-primary/10 text-primary", dot: "bg-primary" },
  Call: { chip: "bg-status-completedBg text-status-completed", dot: "bg-status-completed" },
  Meeting: { chip: "bg-primary/5 text-primary", dot: "bg-primary-700" },
  Documentation: { chip: "bg-primary/10 text-primary-800", dot: "bg-primary-800" },
};

const SEED_EVENTS: CalEvent[] = [
  { date: "2026-06-18", time: "10:00 AM", title: "Property tour - Emerald Park", client: "Aman Verma", location: "Chandni Chowk", type: "Tour" },
  { date: "2026-06-19", time: "02:30 PM", title: "Budget revision call", client: "Shaurya Sharma", location: "Phone", type: "Call" },
  { date: "2026-06-21", time: "11:00 AM", title: "Site visit - Lakeside Villa", client: "Rohit Verma", location: "South Delhi", type: "Tour" },
  { date: "2026-06-21", time: "04:00 PM", title: "Documentation handover", client: "Kritika Ahuja", location: "Office", type: "Documentation" },
  { date: "2026-06-23", time: "01:00 PM", title: "Negotiation meeting", client: "Noopur Divekar", location: "Guru Nanak Chowk", type: "Meeting" },
  { date: "2026-06-24", time: "10:30 AM", title: "Follow-up call", client: "Krishna Desai", location: "Phone", type: "Call" },
  { date: "2026-06-26", time: "03:00 PM", title: "Property tour - Maple Street", client: "Akshay Kumar", location: "Near Saket Mall", type: "Tour" },
  { date: "2026-06-29", time: "12:00 PM", title: "Closing meeting", client: "Ananyaa Panday", location: "Office", type: "Meeting" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function parseLocal(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

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

export function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState({ year: 2026, month: 5 });
  const [selected, setSelected] = useState(fmt(new Date(2026, 5, 21)));
  const [events, setEvents] = useState<CalEvent[]>(SEED_EVENTS);
  const [addOpen, setAddOpen] = useState(false);

  const cells = useMemo(() => buildMonth(view.year, view.month), [view]);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const goPrev = () =>
    setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 }));
  const goNext = () =>
    setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 }));

  const selectedEvents = eventsByDate.get(selected) ?? [];
  const upcoming = [...events].filter((e) => e.date >= fmt(today)).sort((a, b) => a.date.localeCompare(b.date));

  const handleAddEvent = (event: CalEvent) => {
    setEvents((prev) => [...prev, event]);
    setSelected(event.date);
    const [y, m] = event.date.split("-").map(Number);
    setView({ year: y, month: m - 1 });
  };

  return (
    <div className="page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Calendar</h1>
          <p className="page-lede">Track tours, calls and meetings with your clients</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          Add Event <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-section lg:grid-cols-[1fr_330px]">
        <div className="section-card flex flex-col p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button onClick={goPrev} className="icon-btn rounded-[10px]" aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <h2 className="min-w-[150px] text-center text-ink">
                {MONTHS[view.month]} {view.year}
              </h2>
              <button onClick={goNext} className="icon-btn rounded-[10px]" aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {(Object.keys(TYPE_STYLES) as EventType[]).map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span className={cn("h-2 w-2 rounded-full", TYPE_STYLES[t].dot)} /> {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 border-b border-hairline pb-2 text-center text-xs font-medium text-ink-muted">
            {WEEKDAYS.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid flex-1 grid-cols-7 grid-rows-6">
            {cells.map(({ date, current }, i) => {
              const key = fmt(date);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isSelected = key === selected;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(key)}
                  className={cn(
                    "flex min-h-[78px] flex-col gap-1 border-b border-r border-hairline p-1.5 text-left transition-colors",
                    i % 7 === 0 && "border-l",
                    !current && "bg-sidebar/50",
                    isSelected && "bg-primary/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      current ? "text-ink" : "text-ink-soft",
                      isSelected && "ring-2 ring-primary ring-offset-1",
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex flex-col gap-1">
                    {dayEvents.slice(0, 2).map((e, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "truncate rounded-[6px] px-1.5 py-0.5 text-[12px] font-medium",
                          TYPE_STYLES[e.type].chip,
                        )}
                      >
                        {e.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="px-1 text-xs text-ink-soft">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="section-card flex flex-col p-4">
          <h2 className="text-ink">
            {selectedEvents.length > 0 ? "Schedule" : "Upcoming Schedule"}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            {selectedEvents.length > 0
              ? parseLocal(selected).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Next events on your calendar"}
          </p>

          <div className="mt-3 space-y-2.5 overflow-y-auto lg:max-h-[560px]">
            {(selectedEvents.length > 0 ? selectedEvents : upcoming).map((e, i) => (
              <div key={`${e.date}-${e.time}-${e.title}-${i}`} className="rounded-[10px] border border-hairline p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("pill", TYPE_STYLES[e.type].chip)}>{e.type}</span>
                  <span className="flex items-center gap-1 text-xs text-ink-soft">
                    <Clock size={12} /> {e.time}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{e.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <span>{e.client}</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {e.location}
                  </span>
                  {selectedEvents.length === 0 && (
                    <span>
                      {parseLocal(e.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {selectedEvents.length === 0 && upcoming.length === 0 && (
              <EmptyState
                title="No upcoming events"
                description="Add a tour or call so the week is not empty."
                className="py-8"
                action={
                  <button onClick={() => setAddOpen(true)} className="btn-primary">
                    Add event
                  </button>
                }
              />
            )}
          </div>
        </div>
      </div>

      <AddEventModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddEvent}
        defaultDate={selected}
      />
    </div>
  );
}
