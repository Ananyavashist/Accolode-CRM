import { useId, useState } from "react";
import { ChevronDown, MoreHorizontal, Plus } from "@/components/ui/icons";
import {
  ClientNoteDatePicker,
  formatNoteDate,
} from "@/components/client/ClientNoteDatePicker";
import { cn } from "@/lib/utils";

export type UserClientNote = {
  id: string;
  title: string;
  text: string;
  author: string;
  date: string;
};

function ToolbarButton({ label, ariaLabel }: { label: string; ariaLabel: string }) {
  return (
    <button
      type="button"
      className="flex h-8 min-w-8 items-center justify-center rounded px-1.5 text-[13px] font-semibold text-ink-muted hover:bg-sidebar hover:text-ink"
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}

export function ClientAddNotePanel({
  author,
  onAdd,
}: {
  author: string;
  onAdd: (note: UserClientNote) => void;
}) {
  const bodyId = useId();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [noteDate, setNoteDate] = useState(() => new Date());

  const reset = () => {
    setBody("");
    setNoteDate(new Date());
    setOpen(false);
  };

  const handleAdd = () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    onAdd({
      id: `note-${Date.now()}`,
      title: `Note · ${formatNoteDate(noteDate)}`,
      text: trimmed,
      author,
      date: formatNoteDate(noteDate),
    });
    reset();
  };

  return (
    <div className="rounded-[10px] border border-hairline bg-surface">
      <div className="flex items-center gap-2 border-b border-hairline pr-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-left text-[16px] font-bold text-ink hover:bg-sidebar/60"
          aria-expanded={open}
        >
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-ink-muted transition-transform", open && "rotate-180")}
          />
          Add new note
        </button>
        <div className="shrink-0 py-2" onClick={(e) => e.stopPropagation()}>
          <ClientNoteDatePicker
            value={noteDate}
            onChange={setNoteDate}
            align="right"
          />
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3">
          <label htmlFor={bodyId} className="sr-only">
            Note body
          </label>
          <textarea
            id={bodyId}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add meeting notes, decisions, or follow-ups…"
            rows={4}
            className="w-full resize-y border-0 bg-transparent p-0 text-[14px] leading-relaxed text-ink outline-none placeholder:text-ink-muted"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-hairline pt-2">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5">
              <ToolbarButton label="1." ariaLabel="Numbered list" />
              <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
              <ToolbarButton label="B" ariaLabel="Bold" />
              <ToolbarButton label="I" ariaLabel="Italic" />
              <ToolbarButton label="U" ariaLabel="Underline" />
              <ToolbarButton label="S" ariaLabel="Strikethrough" />
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded text-ink-muted hover:bg-sidebar hover:text-ink"
                aria-label="More formatting"
              >
                <MoreHorizontal size={16} />
              </button>
              <span className="mx-1 h-5 w-px bg-hairline" aria-hidden />
              <ToolbarButton label="🔗" ariaLabel="Insert link" />
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!body.trim()}
              className={cn(
                "btn-primary h-8 !w-auto shrink-0 gap-1.5 px-4 text-[14px]",
                !body.trim() && "pointer-events-none opacity-50",
              )}
            >
              Add note
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}