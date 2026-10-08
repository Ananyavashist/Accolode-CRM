import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCrm } from "@/store/CrmContext";
import { clientProfilePath, personSlug, todayISO } from "@/lib/pipeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { TypeChip } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { DealType } from "@/types";

export function NotesPage() {
  const navigate = useNavigate();
  const { tasks, clients, leads, toggleTask } = useCrm();
  const today = todayISO();

  const { overdue, dueToday, untouched } = useMemo(() => {
    const open = tasks.filter((t) => !t.done);
    return {
      overdue: open.filter((t) => t.dueDate < today),
      dueToday: open.filter((t) => t.dueDate === today),
      untouched: leads.filter((l) => (l.status ?? "new") === "new" && l.daysAgo >= 3),
    };
  }, [tasks, leads, today]);

  const empty = overdue.length + dueToday.length + untouched.length === 0;

  return (
    <div className="page">
      <div>
        <h1 className="text-ink">Notes</h1>
        <p className="page-lede">
          Follow-ups and leads that have gone quiet — open a profile from the name.
        </p>
      </div>

      {empty ? (
        <div className="section-card">
          <EmptyState
            title="Nothing on the list"
            description="Accept a lead and set a follow-up so Notes fills itself."
            action={
              <button onClick={() => navigate("/client-leads")} className="btn-primary">
                Go to Client Leads
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-section">
          {overdue.length > 0 && (
            <NotesGroup title="Overdue" count={overdue.length}>
              {overdue.map((t) => {
                const client = clients.find((c) => c.id === t.clientId);
                return (
                  <NotesRow
                    key={t.id}
                    name={client?.name ?? "Client"}
                    avatar={client?.avatar}
                    detail={t.text}
                    meta={t.dueDate}
                    tone="danger"
                    dealType={client?.category === "Buyer" ? "Buy" : "Rent"}
                    profileTo={client ? clientProfilePath(client.name) : undefined}
                    onToggle={() => toggleTask(t.id)}
                  />
                );
              })}
            </NotesGroup>
          )}
          {dueToday.length > 0 && (
            <NotesGroup title="Due today" count={dueToday.length}>
              {dueToday.map((t) => {
                const client = clients.find((c) => c.id === t.clientId);
                return (
                  <NotesRow
                    key={t.id}
                    name={client?.name ?? "Client"}
                    avatar={client?.avatar}
                    detail={t.text}
                    meta={t.dueDate}
                    tone="warning"
                    dealType={client?.category === "Buyer" ? "Buy" : "Rent"}
                    profileTo={client ? clientProfilePath(client.name) : undefined}
                    onToggle={() => toggleTask(t.id)}
                  />
                );
              })}
            </NotesGroup>
          )}
          {untouched.length > 0 && (
            <NotesGroup title="Leads untouched 3+ days" count={untouched.length}>
              {untouched.map((l) => {
                const client = clients.find(
                  (c) => c.name.toLowerCase() === l.name.toLowerCase(),
                );
                return (
                  <NotesRow
                    key={l.id}
                    name={l.name}
                    avatar={l.avatar}
                    detail={`${l.daysAgo} days without a look`}
                    meta={`${l.intent} intent · ${l.source}`}
                    dealType={l.dealType}
                    tone="muted"
                    profileTo={
                      client
                        ? clientProfilePath(client.name)
                        : `/client-leads/${personSlug(l.name)}`
                    }
                  />
                );
              })}
            </NotesGroup>
          )}
        </div>
      )}
    </div>
  );
}

function NotesGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="section-card" aria-labelledby={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`}>
      <div className="border-b border-hairline px-5 py-3.5">
        <h2 id={`${title.replace(/\s+/g, "-").toLowerCase()}-heading`} className="text-sm font-semibold text-ink">
          {title}
          <span className="ml-2 font-medium text-ink-muted">({count})</span>
        </h2>
      </div>
      <ul className="divide-y divide-hairline">{children}</ul>
    </section>
  );
}

function NotesRow({
  name,
  avatar,
  detail,
  meta,
  tone,
  dealType,
  profileTo,
  onToggle,
}: {
  name: string;
  avatar?: string;
  detail: string;
  meta: string;
  tone: "danger" | "warning" | "muted";
  dealType?: DealType;
  profileTo?: string;
  onToggle?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 px-5 py-3.5">
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-soft"
          aria-label={`Mark done: ${detail}`}
        />
      )}
      <Avatar name={name} src={avatar} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink">{name}</p>
          {dealType && <TypeChip type={dealType} />}
        </div>
        <p className="truncate text-[13px] text-ink-muted">{detail}</p>
        <p
          className={cn(
            "text-xs",
            tone === "danger" && "text-status-awaiting",
            tone === "warning" && "text-status-warning",
            tone === "muted" && "text-ink-muted",
          )}
        >
          {meta}
        </p>
      </div>
      {profileTo && (
        <Link
          to={profileTo}
          className="btn-outline ml-auto h-8 shrink-0 px-2.5 text-xs"
        >
          View profile
        </Link>
      )}
    </li>
  );
}
