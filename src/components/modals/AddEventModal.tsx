import { useEffect, useState } from "react";
import { X } from "@/components/ui/icons";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { Snackbar } from "@/components/ui/Snackbar";
import { useCrm } from "@/store/CrmContext";

export type EventType = "Tour" | "Call" | "Meeting" | "Documentation";

export interface CalEvent {
  date: string;
  time: string;
  title: string;
  client: string;
  location: string;
  type: EventType;
}

const EVENT_TYPES: EventType[] = ["Tour", "Call", "Meeting", "Documentation"];
const TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const INITIAL = {
  title: "",
  client: "",
  date: "",
  time: "10:00 AM",
  type: "" as "" | EventType,
  location: "",
};

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: CalEvent) => void;
  defaultDate?: string;
}

export function AddEventModal({ open, onClose, onSubmit, defaultDate }: AddEventModalProps) {
  const { clients } = useCrm();
  const [form, setForm] = useState({ ...INITIAL, date: defaultDate ?? "" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setForm({ ...INITIAL, date: defaultDate ?? "" });
      setToast(null);
    } else if (defaultDate) {
      setForm((prev) => ({ ...prev, date: defaultDate }));
    }
  }, [open, defaultDate]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  if (!open) return null;

  const clientOptions = clients.map((c) => c.name);
  const canSubmit =
    form.title.trim() &&
    form.client &&
    form.date &&
    form.time &&
    form.type &&
    form.location.trim();

  const handleSubmit = () => {
    if (!canSubmit || !form.type) return;
    onSubmit({
      title: form.title.trim(),
      client: form.client,
      date: form.date,
      time: form.time,
      type: form.type,
      location: form.location.trim(),
    });
    setToast("Event added to your calendar");
    setTimeout(() => onClose(), 900);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="add-event-title"
        className="fixed left-1/2 top-1/2 z-50 w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[14px] border border-hairline bg-surface p-5 shadow-pop"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="add-event-title" className="text-lg font-semibold text-ink">
              Add Event
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Schedule a tour, call, or meeting with a client
            </p>
          </div>
          <button onClick={onClose} className="icon-btn shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-ink">Event title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Property tour - Emerald Park"
              className="mt-1.5 h-10 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm outline-none placeholder:text-ink-soft focus:border-primary/40"
            />
          </label>

          <SelectDropdown
            label="Client"
            value={form.client}
            placeholder="Select client"
            options={clientOptions}
            onChange={(client) => setForm((f) => ({ ...f, client }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-medium text-ink">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1.5 h-10 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm outline-none focus:border-primary/40"
              />
            </label>
            <SelectDropdown
              label="Time"
              value={form.time}
              options={TIMES}
              onChange={(time) => setForm((f) => ({ ...f, time }))}
            />
          </div>

          <div>
            <span className="text-sm font-medium text-ink">Event type</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type }))}
                  className={
                    form.type === type
                      ? "pill bg-primary text-white"
                      : "pill border border-hairline bg-sidebar text-ink-muted hover:text-ink"
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-ink">Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Office, phone, or property address"
              className="mt-1.5 h-10 w-full rounded-[10px] border border-hairline bg-surface px-3 text-sm outline-none placeholder:text-ink-soft focus:border-primary/40"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn-primary disabled:opacity-50">
            Save Event
          </button>
        </div>
      </div>

      {toast && <Snackbar message={toast} />}
    </>
  );
}
