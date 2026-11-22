import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, DataUpload, FileText, RotateCw, UploadCloud, X } from "@/components/ui/icons";
import { cn, formatDisplayCopy } from "@/lib/utils";

type UploadStatus = "uploading" | "completed";

type UploadItem = {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  status: UploadStatus;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

interface ClientDatabaseUploadModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  titleId?: string;
  onSaved?: (files: { name: string }[]) => void;
}

export function ClientDatabaseUploadModal({
  open,
  onClose,
  title = "Upload files",
  description = "Select and upload the files of your choice",
  titleId = "upload-database-title",
  onSaved,
}: ClientDatabaseUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (open) return;
    setItems([]);
    setDragOver(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const hasUploading = items.some((i) => i.status === "uploading");
    if (!hasUploading) return;
    const id = window.setInterval(() => {
      setItems((prev) =>
        prev.map((row) => {
          if (row.status !== "uploading") return row;
          const next = Math.min(100, row.progress + 10 + Math.random() * 15);
          if (next >= 100) {
            return { ...row, progress: 100, status: "completed" as const };
          }
          return { ...row, progress: next };
        }),
      );
    }, 350);
    return () => window.clearInterval(id);
  }, [items, open]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const next: UploadItem[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      progress: 0,
      status: "uploading",
    }));
    setItems((prev) => [...prev, ...next]);
  }, []);

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-hairline bg-surface shadow-pop"
      >
        <header className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar text-ink-muted">
              <UploadCloud size={20} />
            </span>
            <div>
              <h2 id={titleId} className="text-lg font-semibold text-ink">
                {title}
              </h2>
              <p className="text-sm text-ink-muted">{description}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="space-y-4 px-5 py-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center rounded-xl border border-dashed px-4 py-10 text-center transition-colors",
              dragOver ? "border-primary bg-primary/5" : "border-hairline bg-sidebar/50",
            )}
          >
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-ink-muted shadow-sm">
              <UploadCloud size={18} />
            </span>
            <p className="text-sm font-medium text-ink">Choose a file or drag &amp; drop it here.</p>
            <p className="mt-1 text-xs text-ink-muted">
              JPEG, PNG, PDF, and CSV formats, up to 50&nbsp;MB
            </p>
            <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline mt-4 gap-1.5">
              Browse File
              <DataUpload size={16} />
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".jpeg,.jpg,.png,.pdf,.csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {items.length > 0 && (
            <ul className="max-h-56 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-hairline bg-surface px-3 py-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-awaitingBg text-status-awaiting">
                      <FileText size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium text-ink">{formatDisplayCopy(item.name)}</p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 rounded p-1 text-ink-muted hover:bg-sidebar hover:text-ink"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                        {item.sizeLabel}
                        {item.status === "uploading" ? (
                          <>
                            <RotateCw size={12} className="animate-spin" />
                            Uploading…
                          </>
                        ) : (
                          <>• Completed</>
                        )}
                      </p>
                      {item.status === "uploading" && (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sidebar">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-hairline px-5 py-4">
          <button type="button" onClick={onClose} className="btn-ghost !w-auto gap-1.5">
            Close
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              const completed = items
                .filter((i) => i.status === "completed")
                .map((i) => ({ name: i.name }));
              if (completed.length > 0) onSaved?.(completed);
              onClose();
            }}
            className="btn-primary gap-1.5"
            disabled={items.some((i) => i.status === "uploading") || items.length === 0}
          >
            Save
            <CheckCircle2 size={16} />
          </button>
        </footer>
      </div>
    </div>
  );
}