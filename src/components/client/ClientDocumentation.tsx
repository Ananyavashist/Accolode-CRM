import { useCallback, useMemo, useState } from "react";
import { DataUpload, FileText, LayoutGrid, Notes } from "@/components/ui/icons";
import { ClientDatabaseUploadModal } from "@/components/database/ClientDatabaseUploadModal";
import { DocumentStatusDropdown } from "@/components/client/DocumentStatusDropdown";
import {
  DOCUMENTATION,
  DOCUMENT_ICON_COLORS,
  type ClientDocumentationRecord,
} from "@/data/clientProfileContent";
import {
  DOCUMENT_STAGES,
  docStageIdFromStatus,
  docStatusFromStage,
  type DocStageId,
} from "@/data/clientDocumentationStages";
import { cn, formatDisplayCopy } from "@/lib/utils";

const DRAG_MIME = "application/x-doc-stage";

type DocView = "list" | "kanban";

type DragPayload = { docId: string; fromStage: DocStageId };

function parseDragPayload(dt: DataTransfer): DragPayload | null {
  const raw = dt.getData(DRAG_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
}

function todayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DocIcon({ iconWrap }: { iconWrap: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        iconWrap,
      )}
    >
      <FileText size={16} />
    </span>
  );
}

function DraggableDocCard({
  doc,
  stageId,
  isDragging,
  justDropped,
  onDragStart,
  onDragEnd,
}: {
  doc: ClientDocumentationRecord;
  stageId: DocStageId;
  isDragging: boolean;
  justDropped: boolean;
  onDragStart: (docId: string, fromStage: DocStageId) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        onDragStart(doc.id, stageId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(DRAG_MIME, JSON.stringify({ docId: doc.id, fromStage: stageId }));
        if (e.currentTarget instanceof HTMLElement) {
          e.dataTransfer.setDragImage(e.currentTarget, 24, 24);
        }
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "flex cursor-grab gap-2.5 rounded-lg border border-hairline bg-surface p-2.5 shadow-sm transition-all duration-300 ease-in-out active:cursor-grabbing",
        isDragging && "property-stage-card-dragging scale-[1.02] opacity-45 shadow-none",
        !isDragging && "hover:-translate-y-0.5 hover:shadow-md",
        justDropped && "property-stage-card-drop",
      )}
    >
      <DocIcon iconWrap={doc.iconWrap} />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-ink">
          {formatDisplayCopy(doc.name)}
        </p>
        <p className="mt-0.5 text-[12px] text-ink-muted">Updated {doc.updated}</p>
      </div>
    </div>
  );
}

export function ClientDocumentation() {
  const [docs, setDocs] = useState<ClientDocumentationRecord[]>(() => [...DOCUMENTATION]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [view, setView] = useState<DocView>("kanban");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DocStageId | null>(null);
  const [droppedIds, setDroppedIds] = useState<Set<string>>(() => new Set());

  const setDocStatus = useCallback((docId: string, status: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, status, updated: todayLabel() } : d,
      ),
    );
  }, []);

  const markDropped = useCallback((docId: string) => {
    setDroppedIds((prev) => new Set(prev).add(docId));
    window.setTimeout(() => {
      setDroppedIds((prev) => {
        const next = new Set(prev);
        next.delete(docId);
        return next;
      });
    }, 400);
  }, []);

  const moveDocToStage = useCallback(
    (docId: string, stageId: DocStageId) => {
      const status = docStatusFromStage(stageId);
      setDocs((prev) =>
        prev.map((d) =>
          d.id === docId ? { ...d, status, updated: todayLabel() } : d,
        ),
      );
      markDropped(docId);
    },
    [markDropped],
  );

  const docsByStage = useMemo(() => {
    const map = Object.fromEntries(
      DOCUMENT_STAGES.map((s) => [s.id, [] as ClientDocumentationRecord[]]),
    ) as Record<DocStageId, ClientDocumentationRecord[]>;
    for (const doc of docs) {
      const stage = docStageIdFromStatus(doc.status);
      map[stage].push(doc);
    }
    return map;
  }, [docs]);

  const handleSaved = (files: { name: string }[]) => {
    setDocs((prev) => {
      const next = [...prev];
      files.forEach((file, i) => {
        const base = file.name.replace(/\.[^.]+$/, "");
        next.push({
          id: `doc-upload-${Date.now()}-${i}`,
          name: base,
          status: "Submitted",
          updated: todayLabel(),
          iconWrap: DOCUMENT_ICON_COLORS[(prev.length + i) % DOCUMENT_ICON_COLORS.length],
        });
      });
      return next;
    });
  };

  const handleDropOnColumn = (toStage: DocStageId, payload: DragPayload | null) => {
    if (!payload) return;
    moveDocToStage(payload.docId, toStage);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">Documentation</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex shrink-0 gap-0.5 rounded-lg border border-hairline bg-sidebar p-1"
            role="group"
            aria-label="Documentation view"
          >
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                view === "list" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              List
              <Notes size={15} />
            </button>
            <button
              type="button"
              onClick={() => setView("kanban")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                view === "kanban" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
              )}
            >
              Kanban
              <LayoutGrid size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="btn-outline !w-auto gap-1.5 text-sm"
          >
            Upload
            <DataUpload size={16} />
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className="mt-3 divide-y divide-hairline rounded-[10px] border border-hairline">
          {docs.map((doc) => (
            <div key={doc.id} className="flex flex-wrap items-center gap-3 px-3 py-3">
              <DocIcon iconWrap={doc.iconWrap} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{formatDisplayCopy(doc.name)}</p>
                <p className="text-xs text-ink-soft">Updated {doc.updated}</p>
              </div>
              <DocumentStatusDropdown
                value={doc.status}
                onChange={(status) => setDocStatus(doc.id, status)}
                ariaLabel={`Status for ${doc.name}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {DOCUMENT_STAGES.map((col) => {
            const items = docsByStage[col.id];
            const isDropTarget = dragOverStage === col.id;
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverStage(col.id);
                }}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setDragOverStage((prev) => (prev === col.id ? null : prev));
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropOnColumn(col.id, parseDragPayload(e.dataTransfer));
                  setDragOverStage(null);
                  setDraggingId(null);
                }}
                className={cn(
                  "kanban-column property-stage-column flex min-h-[140px] flex-col p-3 transition-all duration-300 ease-in-out",
                  isDropTarget && "property-stage-column-active ring-2 ring-primary/35 ring-offset-2",
                )}
              >
                <p className="text-sm font-semibold text-ink">
                  {col.label} · {items.length}
                </p>
                <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
                  {items.length === 0 ? (
                    <div
                      className={cn(
                        "flex flex-1 items-center justify-center rounded-lg border border-dashed border-hairline bg-surface/60 px-2 py-6 text-center text-xs text-ink-muted transition-colors duration-300 ease-in-out",
                        isDropTarget && "border-primary/40 bg-primary/5 text-ink",
                      )}
                    >
                      {isDropTarget ? "Release to update status" : "Drag documents here"}
                    </div>
                  ) : (
                    items.map((doc) => (
                      <DraggableDocCard
                        key={doc.id}
                        doc={doc}
                        stageId={col.id}
                        isDragging={draggingId === doc.id}
                        justDropped={droppedIds.has(doc.id)}
                        onDragStart={(id) => setDraggingId(id)}
                        onDragEnd={() => {
                          setDraggingId(null);
                          setDragOverStage(null);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ClientDatabaseUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload files"
        description="Add client documents — agreements, ID proofs, and supporting files"
        titleId="client-documentation-upload-title"
        onSaved={handleSaved}
      />
    </div>
  );
}