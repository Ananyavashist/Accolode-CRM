import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "@/components/ui/icons";
import { AddPropertyToStageModal } from "@/components/client/AddPropertyToStageModal";
import {
  homeCardFromListing,
  homesByStageForClient,
  type HomeStageCard,
  type HomeStageColumn,
  type HomeStageId,
} from "@/data/clientHomesByStage";
import type { ListedProperty } from "@/types";
import type { Client } from "@/types";
import { cn } from "@/lib/utils";

const DRAG_MIME = "application/x-home-stage";

type DragPayload = { homeId: string; fromStage: HomeStageId };

function parseDragPayload(dt: DataTransfer): DragPayload | null {
  const raw = dt.getData(DRAG_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
}

function moveHomeBetweenColumns(
  columns: HomeStageColumn[],
  homeId: string,
  toStage: HomeStageId,
): HomeStageColumn[] {
  let moving: HomeStageCard | undefined;
  let fromStage: HomeStageId | undefined;
  for (const col of columns) {
    const found = col.items.find((h) => h.id === homeId);
    if (found) {
      moving = found;
      fromStage = col.id;
      break;
    }
  }
  if (!moving || fromStage === undefined || fromStage === toStage) return columns;

  const stripped = columns.map((col) => ({
    ...col,
    items: col.items.filter((h) => h.id !== homeId),
  }));

  return stripped.map((col) =>
    col.id === toStage ? { ...col, items: [...col.items, moving] } : col,
  );
}

function DraggableHomeCard({
  home,
  stageId,
  isDragging,
  justDropped,
  onDragStart,
  onDragEnd,
}: {
  home: HomeStageCard;
  stageId: HomeStageId;
  isDragging: boolean;
  justDropped: boolean;
  onDragStart: (homeId: string, fromStage: HomeStageId) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        onDragStart(home.id, stageId);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(DRAG_MIME, JSON.stringify({ homeId: home.id, fromStage: stageId }));
        if (e.currentTarget instanceof HTMLElement) {
          e.dataTransfer.setDragImage(e.currentTarget, 24, 24);
        }
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "property-stage-card flex cursor-grab gap-2.5 rounded-lg border border-hairline bg-surface p-2.5 shadow-sm transition-all duration-300 ease-in-out active:cursor-grabbing",
        isDragging && "property-stage-card-dragging scale-[1.02] opacity-45 shadow-none",
        !isDragging && "hover:-translate-y-0.5 hover:shadow-md",
        justDropped && "property-stage-card-drop",
      )}
    >
      <img
        src={home.image}
        alt={home.title}
        className="h-12 w-12 shrink-0 rounded-md object-cover"
        loading="lazy"
        draggable={false}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[16px] font-semibold leading-snug text-ink">{home.title}</p>
        <p className="mt-0.5 truncate text-[14px] text-ink-muted">
          {home.price} · {home.meta}
        </p>
      </div>
    </div>
  );
}

export function ClientHomesByStage({
  client,
  brokerName,
  title = "Property stage",
  embedded = false,
}: {
  client: Client;
  brokerName: string;
  title?: string;
  embedded?: boolean;
}) {
  const [columns, setColumns] = useState<HomeStageColumn[]>(() => homesByStageForClient(client));
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<HomeStageId | null>(null);
  const [droppedIds, setDroppedIds] = useState<Set<string>>(() => new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<HomeStageId>("interested");

  useEffect(() => {
    setColumns(homesByStageForClient(client));
    setDraggingId(null);
    setDragOverStage(null);
    setDroppedIds(new Set());
  }, [client.id]);

  const excludeListingIds = useMemo(() => {
    const ids = new Set<string>();
    for (const col of columns) {
      for (const item of col.items) {
        if (item.listingId) ids.add(item.listingId);
      }
    }
    return ids;
  }, [columns]);

  const openModal = useCallback((stage: HomeStageId) => {
    setModalStage(stage);
    setModalOpen(true);
  }, []);

  const markDropped = useCallback((homeId: string) => {
    setDroppedIds((prev) => new Set(prev).add(homeId));
    window.setTimeout(() => {
      setDroppedIds((prev) => {
        const next = new Set(prev);
        next.delete(homeId);
        return next;
      });
    }, 400);
  }, []);

  const handleDropOnColumn = useCallback(
    (toStage: HomeStageId, payload: DragPayload | null) => {
      if (!payload) return;
      setColumns((prev) => {
        const next = moveHomeBetweenColumns(prev, payload.homeId, toStage);
        if (next !== prev) markDropped(payload.homeId);
        return next;
      });
    },
    [markDropped],
  );

  const handleAddListing = useCallback(
    (listing: ListedProperty, stage: HomeStageId) => {
      const card = homeCardFromListing(listing, stage);
      setColumns((prev) =>
        prev.map((col) => (col.id === stage ? { ...col, items: [...col.items, card] } : col)),
      );
      markDropped(card.id);
      setModalOpen(false);
    },
    [markDropped],
  );

  return (
    <div className={embedded ? undefined : "section-card p-4 sm:p-5"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <button
          type="button"
          className="btn-primary !h-9 !w-auto gap-1.5 px-4 text-sm"
          onClick={() => openModal("interested")}
        >
          Add a property
          <Plus size={16} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {columns.map((col) => {
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
                const payload = parseDragPayload(e.dataTransfer);
                handleDropOnColumn(col.id, payload);
                setDragOverStage(null);
                setDraggingId(null);
              }}
              className={cn(
                "kanban-column property-stage-column flex min-h-[160px] flex-col p-3 transition-all duration-300 ease-in-out",
                isDropTarget && "property-stage-column-active ring-2 ring-primary/35 ring-offset-2",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <p className="text-sm font-semibold text-ink">
                  {col.label} · {col.items.length}
                </p>
                <button
                  type="button"
                  className="icon-btn !h-7 !w-7 shrink-0 text-ink-muted hover:text-primary"
                  aria-label={`Add property to ${col.label}`}
                  onClick={() => openModal(col.id)}
                >
                  <Plus size={15} />
                </button>
              </div>
              <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2">
                {col.items.length === 0 ? (
                  <div
                    className={cn(
                      "flex flex-1 items-center justify-center rounded-lg border border-dashed border-hairline bg-surface/60 px-2 py-6 text-center text-xs text-ink-muted transition-colors duration-300 ease-in-out",
                      isDropTarget && "border-primary/40 bg-primary/5 text-ink",
                    )}
                  >
                    {isDropTarget ? "Release to add here" : "Drag a property here or tap +"}
                  </div>
                ) : (
                  col.items.map((home) => (
                    <DraggableHomeCard
                      key={home.id}
                      home={home}
                      stageId={col.id}
                      isDragging={draggingId === home.id}
                      justDropped={droppedIds.has(home.id)}
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

      <AddPropertyToStageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        brokerName={brokerName}
        targetStage={modalStage}
        onStageChange={setModalStage}
        excludeListingIds={excludeListingIds}
        onSelect={handleAddListing}
      />
    </div>
  );
}