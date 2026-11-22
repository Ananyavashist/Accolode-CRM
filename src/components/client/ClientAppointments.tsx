import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ConfirmDialog, useConfirmAction } from "@/components/ui/ConfirmDialog";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Phone,
  VideoIcon,
} from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import {
  appointmentsForClient,
  type ClientAppointmentRecord,
  type AppointmentMedium,
} from "@/data/clientProfileContent";
import type { Client } from "@/types";
import { cn } from "@/lib/utils";

function RichName({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function MediumIcon({ medium }: { medium: AppointmentMedium }) {
  const Icon = medium === "call" ? Phone : VideoIcon;
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar text-ink-muted">
      <Icon size={18} />
    </span>
  );
}

function AppointmentMetaGrid({ item }: { item: ClientAppointmentRecord }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
      <MetaCell label="Reminder" value={item.reminder} />
      <MetaCell label="Duration" value={item.duration} />
      <MetaCell label="Location" value={item.location} />
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-surface px-3 py-2.5">
      <span className="text-[12px] text-ink-muted">{label}</span>
      <span className="text-[14px] font-medium text-ink">{value}</span>
    </div>
  );
}

type AppointmentMenuAction = "edit" | "cancel" | "reschedule";

const APPOINTMENT_MENU_ITEMS: {
  action: AppointmentMenuAction;
  label: string;
  tone?: "danger";
}[] = [
  { action: "edit", label: "Edit" },
  { action: "reschedule", label: "Reschedule" },
  { action: "cancel", label: "Cancel", tone: "danger" },
];

function AppointmentOptionsMenu({
  onSelect,
}: {
  onSelect: (action: AppointmentMenuAction) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (action: AppointmentMenuAction) => {
    setOpen(false);
    onSelect(action);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        className="icon-btn"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label="Appointment actions"
          className="absolute right-0 z-50 mt-1 min-w-[172px] overflow-hidden rounded-[10px] border border-hairline bg-white py-1 shadow-pop"
        >
          {APPOINTMENT_MENU_ITEMS.map(({ action, label, tone }) => (
            <li key={action} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  choose(action);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-[14px] transition-colors hover:bg-sidebar",
                  tone === "danger" ? "text-status-awaiting" : "text-ink",
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CardShell({
  item,
  expanded,
  onToggle,
  onMenuAction,
  children,
}: {
  item: ClientAppointmentRecord;
  expanded: boolean;
  onToggle?: () => void;
  onMenuAction: (action: AppointmentMenuAction) => void;
  children?: ReactNode;
}) {
  const HeaderTag = onToggle ? "button" : "div";
  return (
    <article className="overflow-hidden rounded-[10px] border border-hairline bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-hairline px-3 py-2.5">
        <HeaderTag
          type={onToggle ? "button" : undefined}
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          aria-expanded={onToggle ? expanded : undefined}
        >
          {expanded ? (
            <ChevronDown size={18} className="shrink-0 text-ink-muted" />
          ) : (
            <ChevronRight size={18} className="shrink-0 text-ink-muted" />
          )}
          <Avatar name={item.scheduledBy} size={24} />
          <span className="truncate text-[14px] text-ink">
            Meeting by <RichName text={`**${item.scheduledBy}**`} />
          </span>
        </HeaderTag>
        <WhenBadge label={item.whenDisplay} />
        <AppointmentOptionsMenu onSelect={onMenuAction} />
      </div>
      {children}
    </article>
  );
}

function WhenBadge({ label }: { label: string }) {
  return (
    <span className="hidden shrink-0 items-center gap-1.5 text-[13px] text-ink-muted sm:inline-flex">
      <Calendar size={14} />
      {label}
    </span>
  );
}

function MeetingBody({
  item,
  showMeta,
  showNotes,
}: {
  item: ClientAppointmentRecord;
  showMeta: boolean;
  showNotes: boolean;
}) {
  return (
    <div className="px-3 py-3">
      <div className="flex gap-3">
        <MediumIcon medium={item.medium} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-snug text-ink">
            Meeting scheduled with <RichName text={`**${item.withName}**`} />
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{item.summary}</p>
        </div>
      </div>
      {showMeta && <AppointmentMetaGrid item={item} />}
      {showNotes && (
        <div className="mt-4 rounded-lg bg-sidebar px-3 py-2.5">
          <p className="text-[12px] font-medium text-ink-muted">Notes</p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink">{item.notes}</p>
        </div>
      )}
    </div>
  );
}

export function ClientAppointments({
  client,
  brokerName,
  onViewNotes,
}: {
  client: Client;
  brokerName: string;
  onViewNotes: () => void;
}) {
  const { upcoming, historyByDate } = appointmentsForClient(client.name, brokerName);
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set());
  const { confirmRequest, askConfirm, closeConfirm } = useConfirmAction();

  const handleMenuAction = (item: ClientAppointmentRecord, action: AppointmentMenuAction) => {
    const when = item.whenDisplay;
    if (action === "edit") {
      askConfirm({
        title: "Edit appointment",
        message: `Update details for the meeting on ${when}.`,
        confirmLabel: "Continue",
        onConfirm: () => {},
      });
      return;
    }
    if (action === "reschedule") {
      askConfirm({
        title: "Reschedule appointment",
        message: `Choose a new date and time. Current slot: ${when}.`,
        confirmLabel: "Choose time",
        onConfirm: () => {},
      });
      return;
    }
    askConfirm({
      title: "Cancel this appointment?",
      message: `The meeting on ${when} will be cancelled. ${item.withName} can be notified from your calendar.`,
      confirmLabel: "Cancel appointment",
      cancelLabel: "Keep",
      onConfirm: () => {},
    });
  };

  const toggleHistory = (id: string) => {
    setExpandedHistory((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-base font-semibold text-ink">Upcoming meeting</h3>
        {upcoming ? (
          <div className="mt-3">
            <CardShell
              item={upcoming}
              expanded={true}
              onMenuAction={(action) => handleMenuAction(upcoming, action)}
            >
              <MeetingBody item={upcoming} showMeta showNotes />
            </CardShell>
          </div>
        ) : (
          <p className="mt-2 text-[14px] text-ink-muted">No upcoming meetings scheduled.</p>
        )}
      </section>

      <section>
        <h3 className="text-base font-semibold text-ink">Meeting history</h3>
        <div className="mt-3 space-y-6">
          {historyByDate.map((group) => (
            <div key={group.dateLabel}>
              <p className="text-[14px] font-medium text-ink-muted">{group.dateLabel}</p>
              <p className="mt-2 text-[14px] font-semibold text-ink">Meetings</p>
              <ul className="mt-2 space-y-2">
                {group.items.map((item) => {
                  const open = expandedHistory.has(item.id);
                  return (
                    <li key={item.id}>
                      <CardShell
                        item={item}
                        expanded={open}
                        onToggle={() => toggleHistory(item.id)}
                        onMenuAction={(action) => handleMenuAction(item, action)}
                      >
                        {open ? (
                          <MeetingBody item={item} showMeta={false} showNotes={false} />
                        ) : (
                          <div className="px-3 py-3">
                            <div className="flex gap-3">
                              <MediumIcon medium={item.medium} />
                              <div className="min-w-0">
                                <p className="text-[15px] text-ink">
                                  Meeting scheduled with{" "}
                                  <RichName text={`**${item.withName}**`} />
                                </p>
                                <p className="mt-1 line-clamp-2 text-[14px] text-ink-muted">
                                  {item.summary}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardShell>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onViewNotes}
          className={cn(
            "mt-4 text-[14px] font-semibold text-primary underline-offset-2 hover:underline",
          )}
        >
          View notes
        </button>
      </section>
      <ConfirmDialog request={confirmRequest} onClose={closeConfirm} />
    </div>
  );
}