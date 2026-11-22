import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/Avatar";
import { ClientStagePicker } from "@/components/database/ClientStagePicker";
import { DATABASE_STAGE_PASTEL } from "@/components/database/ClientStagePicker";
import { clientProfilePath, normalizeStage, progressStageLabel } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS, type Client, type ProgressStage } from "@/types";
import { cn, formatClientIdDisplay, formatDisplayCopy } from "@/lib/utils";

interface ClientDatabaseKanbanProps {
  rows: Client[];
  onStageChange: (clientId: string, stage: ProgressStage) => void;
}

export function ClientDatabaseKanban({ rows, onStageChange }: ClientDatabaseKanbanProps) {
  const navigate = useNavigate();

  const byStage = useMemo(() => {
    const map = new Map<ProgressStage, Client[]>();
    for (const stage of PROGRESS_STAGE_OPTIONS) map.set(stage, []);
    for (const client of rows) {
      const stage = normalizeStage(client.progressStage);
      map.get(stage)?.push(client);
    }
    return map;
  }, [rows]);

  return (
    <div className="flex w-full gap-3 overflow-x-auto px-3 pb-4 pt-2">
      {PROGRESS_STAGE_OPTIONS.map((stage) => {
        const column = byStage.get(stage) ?? [];
        const headerClass = DATABASE_STAGE_PASTEL[stage];
        return (
          <div
            key={stage}
            className="kanban-column flex min-w-[220px] flex-1 basis-0 flex-col p-3"
          >
            <p
              className={cn(
                "mb-3 inline-flex w-fit items-center rounded-md px-[10px] py-1.5 text-sm font-semibold",
                headerClass,
              )}
            >
              {progressStageLabel(stage)}
              <span className="ml-2 text-xs font-medium opacity-80">{column.length}</span>
            </p>
            <ul className="flex min-h-[120px] flex-col gap-2">
              {column.map((client) => (
                <li key={client.id}>
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(clientProfilePath(client.name))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate(clientProfilePath(client.name));
                    }}
                    className="cursor-pointer rounded-xl border border-hairline bg-surface p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={client.name} src={client.avatar} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {formatDisplayCopy(client.name)}
                        </p>
                        <p className="truncate text-xs font-normal text-ink-muted">
                          {formatClientIdDisplay(client.clientId)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 truncate text-xs text-ink-muted">
                      {formatDisplayCopy(client.location)} · {formatDisplayCopy(client.budget)}
                    </p>
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <ClientStagePicker
                        clientId={client.id}
                        stage={client.progressStage}
                        onChange={(next) => onStageChange(client.id, next)}
                      />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}