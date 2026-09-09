import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { StageBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { computeClientDatabaseStats } from "@/lib/dashboardMetrics";
import { PIPELINE_TABS, clientProfilePath, normalizeStage, type PipelineTab } from "@/lib/pipeline";
import type { ClientCategory } from "@/types";
import { cn } from "@/lib/utils";

export function ClientDatabase() {
  const navigate = useNavigate();
  const { clients } = useCrm();
  const { openAddClient } = useUi();
  const [category, setCategory] = useState<ClientCategory>("Renter");
  const [tab, setTab] = useState<PipelineTab>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return clients
      .filter((c) => c.category === category)
      .filter((c) => (tab === "All" ? true : normalizeStage(c.progressStage) === tab))
      .filter((c) =>
        `${c.name} ${c.location} ${c.propertyType} ${c.clientId} ${c.progressStage}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  }, [clients, category, tab, query]);

  const stats = useMemo(() => computeClientDatabaseStats(clients), [clients]);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = query.length > 0 || tab !== "All";

  const toggleAll = () => {
    setSelected((prev) => {
      if (rows.every((r) => prev.has(r.id))) return new Set();
      return new Set(rows.map((r) => r.id));
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="page">
      <div className="flex flex-col gap-3">
        <h1 className="text-ink">Client Database</h1>
        <p className="page-lede">Everyone in the book, filtered by progress stage.</p>
        <div className="inline-flex w-fit rounded-lg bg-sidebar p-1">
          {(["Renter", "Buyer"] as ClientCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-md px-5 py-1.5 text-sm font-medium transition-colors",
                category === cat ? "bg-surface text-ink" : "text-ink-muted",
              )}
            >
              {cat === "Buyer" ? "Buyers" : "Renters"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Clients" value={stats.total} subtitle="in the book" />
        <StatCard title="Active" value={stats.active} subtitle="New or Qualified" />
        <StatCard title="Closed" value={stats.completed} subtitle="Completed deals" />
        <StatCard title="Awaiting action" value={stats.awaiting} subtitle="Site visit or negotiation" />
      </div>

      <div className="section-card">
        <div className="flex flex-col gap-3 border-b border-hairline px-3 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1">
            {PIPELINE_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn("tab-underline", tab === t && "tab-underline-active")}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pb-2 lg:pb-0">
            <div className="relative">
              <label htmlFor="client-search" className="sr-only">
                Search clients
              </label>
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="client-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="input-field w-40 pl-9 sm:w-56"
              />
            </div>
            <button onClick={openAddClient} className="btn-primary">
              Add Client <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-medium text-ink-muted">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} aria-label="Select all">
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        allSelected ? "border-primary bg-primary text-white" : "border-ink-soft",
                      )}
                    >
                      {allSelected && <span className="text-xs leading-none">✓</span>}
                    </span>
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Progress Stage</th>
                <th className="px-4 py-3 font-medium">Property type</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Client ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    {filtersActive ? (
                      <EmptyState
                        title="No clients match"
                        description="Clear the search or stage tab to see everyone."
                        action={
                          <button
                            className="btn-outline"
                            onClick={() => {
                              setQuery("");
                              setTab("All");
                            }}
                          >
                            Clear filters
                          </button>
                        }
                      />
                    ) : (
                      <EmptyState
                        title="Add your first client"
                        description="Accept a lead or add a walk-in so the book is not empty."
                        action={
                          <button onClick={openAddClient} className="btn-primary">
                            Add Client
                          </button>
                        }
                      />
                    )}
                  </td>
                </tr>
              ) : (
                rows.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(clientProfilePath(client.name))}
                    className="cursor-pointer border-t border-hairline text-sm transition-colors hover:bg-sidebar"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOne(client.id)} aria-label={`Select ${client.name}`}>
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border",
                            selected.has(client.id)
                              ? "border-primary bg-primary text-white"
                              : "border-ink-soft",
                          )}
                        >
                          {selected.has(client.id) && (
                            <span className="text-xs leading-none">✓</span>
                          )}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={client.name} src={client.avatar} size={32} />
                        <span className="font-medium text-ink">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={client.progressStage} />
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink-muted">{client.propertyType}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-muted">{client.location}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-muted">{client.budget}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-muted">{client.clientId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-hairline md:hidden">
          {rows.length === 0 ? (
            <EmptyState
              title={filtersActive ? "No clients match" : "Add your first client"}
              description={
                filtersActive
                  ? "Clear the search or stage tab."
                  : "Accept a lead or add a walk-in."
              }
            />
          ) : (
            rows.map((client) => (
              <button
                key={client.id}
                onClick={() => navigate(clientProfilePath(client.name))}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <Avatar name={client.name} src={client.avatar} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{client.name}</span>
                  <span className="block truncate text-xs text-ink-muted">
                    {client.location} · {client.budget}
                  </span>
                </span>
                <StageBadge stage={client.progressStage} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
