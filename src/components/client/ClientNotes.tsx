import type { MeetingNoteEntry } from "@/data/clientProfileContent";
import { cn } from "@/lib/utils";
import { ClientAddNotePanel, type UserClientNote } from "@/components/client/ClientAddNotePanel";

export type NotesSection = "my" | "meeting";

const NOTES_TABS: { key: NotesSection; label: string }[] = [
  { key: "my", label: "My Notes" },
  { key: "meeting", label: "Meeting Notes" },
];

export function ClientNotes({
  clientName,
  author,
  section,
  onSectionChange,
  userNotes,
  onAdd,
  meetingNotes,
}: {
  clientName: string;
  author: string;
  section: NotesSection;
  onSectionChange: (next: NotesSection) => void;
  userNotes: UserClientNote[];
  onAdd: (note: UserClientNote) => void;
  meetingNotes: MeetingNoteEntry[];
}) {
  return (
    <div className="space-y-4">
      <div
        role="tablist"
        aria-label="Notes categories"
        className="flex flex-wrap items-end gap-x-1 border-b border-hairline"
      >
        {NOTES_TABS.map(({ key, label }) => {
          const selected = section === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSectionChange(key)}
              className={cn("tab-underline px-2 sm:px-3", selected && "tab-underline-active")}
            >
              {label}
            </button>
          );
        })}
      </div>

      {section === "my" && (
        <div role="tabpanel" aria-label="My Notes" className="space-y-4">
          <ClientAddNotePanel author={author} onAdd={onAdd} />
          <p className="text-[14px] text-ink-muted">Your personal notes about {clientName}.</p>
          <div className="space-y-3">
            {userNotes.length === 0 && (
              <p className="text-[14px] text-ink-muted">No notes yet. Use Add new note above.</p>
            )}
            {userNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-[10px] border border-hairline bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold text-ink">{note.title}</p>
                  <span className="text-[13px] text-ink-soft">{note.date}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">{note.author}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === "meeting" && (
        <div role="tabpanel" aria-label="Meeting Notes" className="space-y-4">
          <p className="text-[14px] text-ink-muted">
            Notes captured from appointments with {clientName}.
          </p>
          <div className="space-y-3">
            {meetingNotes.length === 0 && (
              <p className="text-[14px] text-ink-muted">No meeting notes yet.</p>
            )}
            {meetingNotes.map((entry) => (
              <div
                key={entry.appointmentId}
                className="rounded-[10px] border border-hairline bg-surface p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-[15px] font-semibold text-ink">{entry.title}</p>
                  <span className="text-[13px] text-ink-soft">{entry.when}</span>
                </div>
                <p className="mt-0.5 text-[13px] text-ink-muted">{entry.location}</p>
                <div className="mt-3 rounded-lg bg-sidebar px-3 py-2.5">
                  <p className="text-[12px] font-medium text-ink-muted">Notes</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink">{entry.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}