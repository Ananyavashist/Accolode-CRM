import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListFilter, Search, UnfoldMore } from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { StageBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { computeClientDatabaseStats } from "@/lib/dashboardMetrics";
import { PIPELINE_TABS, clientProfilePath, normalizeStage, type PipelineTab } from "@/lib/pipeline";
import type { ClientCategory } from "@/types";
import { cn, formatDisplayCopy } from "@/lib/utils";
import { ConfirmDialog, useConfirmAction } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";

export function ClientDatabase() {
  const navigate = useNavigate();
  const { clients } = useCrm();
  const { openAddClient } = useUi();
  const [category, setCategory] = useState<ClientCategory>("Renter");
  const [tab, setTab] = useState<PipelineTab>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"name" | "stage" | "location">("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { confirmRequest, askConfirm, closeConfirm } = useConfirmAction();

  const rows = useMemo(() => {
    const list = clients
      .filter((c) => c.category === category)
      .filter((c) => (tab === "All" ? true : normalizeStage(c.progressStage) === tab))
      .filter((c) => (statusFilter ? c.status === statusFilter : true))
      .filter((c) =>
        `${c.name} ${c.location} ${c.propertyType} ${c.clientId} ${c.progressStage}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    return [...list].sort((a, b) => {
      if (sort === "stage") return String(a.progressStage).localeCompare(String(b.progressStage));
      if (sort === "location") return a.location.localeCompare(b.location);
      return a.name.localeCompare(b.name);
    });
  }, [clients, category, tab, query, sort, statusFilter]);

  const stats = useMemo(() => computeClientDatabaseStats(clients), [clients]);
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive = query.length > 0 || tab !== "All" || Boolean(statusFilter);

  const applyToggleAll = () => {
    setSelected((prev) => {
      if (rows.every((r) => prev.has(r.id))) return new Set();
      return new Set(rows.map((r) => r.id));
    });
  };

  const applyToggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const confirmToggleAll = () => {
    const clearing = allSelected;
    askConfirm({
      title: clearing ? "Clear selection?" : "Select all clients?",
      message: clearing
        ? "Remove selection from every client in this view?"
        : `Select all ${rows.length} client${rows.length === 1 ? "" : "s"} in this view?`,
      confirmLabel: clearing ? "Clear" : "Select all",
      onConfirm: applyToggleAll,
    });
  };

  const confirmToggleOne = (id: string, name: string) => {
    const isSelected = selected.has(id);
    askConfirm({
      title: isSelected ? "Deselect client?" : "Select client?",
      message: isSelected
        ? `Remove ${name} from the current selection?`
        : `Add ${name} to the current selection?`,
      confirmLabel: isSelected ? "Deselect" : "Select",
      onConfirm: () => applyToggleOne(id),
    });
  };

  return (
    <div className="page">
      <PageHeader
        title="Database"
        description="Everyone in the book, filtered by progress stage."
        trailing={
          <div
            className="grid w-full max-w-[220px] shrink-0 grid-cols-2 gap-1 rounded-lg bg-sidebar p-1 sm:w-[220px]"
            role="group"
            aria-label="Client type"
          >
            {(["Renter", "Buyer"] as ClientCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-center text-sm font-medium transition-colors",
                  category === cat ? "bg-surface text-ink" : "text-ink-muted",
                )}
              >
                {cat === "Buyer" ? "Buyers" : "Renters"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Clients" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Closed" value={stats.completed} />
        <StatCard title="Awaiting action" value={stats.awaiting} />
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

          <div className="flex flex-wrap items-center gap-2 pb-2 lg:pb-0">
            <div className="relative min-w-[140px] flex-1 sm:flex-none">
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
                className="input-field h-9 w-full pl-9 sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn("btn-outline !w-auto gap-1.5", filtersOpen && "border-primary/30 bg-primary/5")}
              aria-expanded={filtersOpen}
            >
              <ListFilter size={16} />
              Filter
            </button>
            <div className="relative">
              <label htmlFor="client-sort" className="sr-only">
                Sort clients
              </label>
              <select
                id="client-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="input-field h-9 w-auto gap-1.5 pr-8"
              >
                <option value="name">Sort by name</option>
                <option value="stage">Sort by stage</option>
                <option value="location">Sort by location</option>
              </select>
              <UnfoldMore
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden
              />
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="flex flex-wrap gap-2 border-b border-hairline px-3 py-3">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field h-9 w-auto min-w-[160px]"
            >
              <option value="">All statuses</option>
              <option value="Active Lead">Active Lead</option>
              <option value="Awaiting Action">Awaiting Action</option>
              <option value="Completed">Completed</option>
              <option value="Completed Client">Completed Client</option>
            </select>
            {(statusFilter || query) && (
              <button
                type="button"
                className="btn-ghost !w-auto text-sm"
                onClick={() => {
                  setStatusFilter("");
                  setQuery("");
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="text-sm font-medium text-ink-muted">
                <th className="w-10 px-4 py-3 font-medium">
                  <button type="button" onClick={confirmToggleAll} aria-label="Select all">
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
                              setStatusFilter("");
                            }}
                          >
                            Clear filters
                          </button>
                        }
                      />
                    ) : (
                      <EmptyState
                        title="Add your first client"
                        description="Accept a lead or add a walk in so the book is not empty."
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
                      <button
                        type="button"
                        onClick={() => confirmToggleOne(client.id, client.name)}
                        aria-label={`Select ${client.name}`}
                      >
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
                        <div className="min-w-0">
                          <p className="font-medium text-ink">{formatDisplayCopy(client.name)}</p>
                          <p className="truncate text-sm text-ink-muted">{formatDisplayCopy(client.email)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StageBadge stage={client.progressStage} />
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.propertyType)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.location)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.budget)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{client.clientId}</td>
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
                  : "Accept a lead or add a walk in."
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
                  <span className="block truncate text-sm text-ink-muted">{client.email}</span>
                </span>
                <StageBadge stage={client.progressStage} />
              </button>
            ))
          )}
        </div>
      </div>
      <ConfirmDialog request={confirmRequest} onClose={closeConfirm} />
    </div>
  );
}
