import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  DataExport,
  DataUpload,
  LayoutGrid,
  ListFilter,
  Notes,
  Pencil,
  Search,
  UnfoldMore,
} from "@/components/ui/icons";
import { ClientDatabaseKanban } from "@/components/database/ClientDatabaseKanban";
import { ConfirmDialog, useConfirmAction } from "@/components/ui/ConfirmDialog";
import { ClientDatabaseFilterDrawer } from "@/components/database/ClientDatabaseFilterDrawer";
import { ClientDatabaseSortDrawer } from "@/components/database/ClientDatabaseSortDrawer";
import { ClientDatabaseUploadModal } from "@/components/database/ClientDatabaseUploadModal";
import {
  EMPTY_DATABASE_FILTERS,
  DEFAULT_DATABASE_SORT,
  clientMatchesFilters,
  compareClients,
  exportClientsExcel,
  exportClientsPdf,
  filtersAreActive,
  type DatabaseFilters,
  type DatabaseSort,
} from "@/components/database/databaseFilters";
import { clientSourceLabel, formatMoveInDate } from "@/lib/clientSource";
import { StatCard } from "@/components/ui/StatCard";
import { ClientStagePicker } from "@/components/database/ClientStagePicker";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { computeClientDatabaseStats } from "@/lib/dashboardMetrics";
import {
  PIPELINE_TABS,
  clientProfilePath,
  normalizeStage,
  pipelineTabLabel,
  type PipelineTab,
} from "@/lib/pipeline";
import type { ClientCategory } from "@/types";

type DatabaseAudience = "All" | ClientCategory;

const AUDIENCE_TABS: { id: DatabaseAudience; label: string }[] = [
  { id: "All", label: "All" },
  { id: "Renter", label: "Renters" },
  { id: "Buyer", label: "Buyers" },
];
import { cn, formatClientIdDisplay, formatDisplayCopy } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";

function ToolbarIconTip({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        className={cn("icon-btn peer", active && "border-primary/30 bg-primary/5 text-primary")}
        aria-label={label}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-hairline bg-surface px-2 py-1 text-xs font-medium text-ink shadow-pop peer-hover:block peer-focus-visible:block"
      >
        {label}
      </span>
    </span>
  );
}

export function ClientDatabase() {
  const navigate = useNavigate();
  const { clients, tasks, removeClient, setProgressStage } = useCrm();
  const { openAddClient } = useUi();
  const { confirmRequest, askConfirm, closeConfirm } = useConfirmAction();
  const [audience, setAudience] = useState<DatabaseAudience>("All");
  const [tab, setTab] = useState<PipelineTab>("All");
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<DatabaseFilters>(EMPTY_DATABASE_FILTERS);
  const [draftFilters, setDraftFilters] = useState<DatabaseFilters>(EMPTY_DATABASE_FILTERS);
  const [appliedSort, setAppliedSort] = useState<DatabaseSort>(DEFAULT_DATABASE_SORT);
  const [draftSort, setDraftSort] = useState<DatabaseSort>(DEFAULT_DATABASE_SORT);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [listView, setListView] = useState<"table" | "kanban">("table");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const exportRef = useRef<HTMLDivElement>(null);

  const propertyTypes = useMemo(
    () => [...new Set(clients.map((c) => c.propertyType))].sort(),
    [clients],
  );
  const locations = useMemo(() => [...new Set(clients.map((c) => c.location))].sort(), [clients]);

  const rows = useMemo(() => {
    const list = clients
      .filter((c) => (audience === "All" ? true : c.category === audience))
      .filter((c) => (tab === "All" ? true : normalizeStage(c.progressStage) === tab))
      .filter((c) => clientMatchesFilters(c, appliedFilters))
      .filter((c) =>
        `${c.name} ${c.location} ${c.propertyType} ${c.clientId} ${c.progressStage}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    return [...list].sort((a, b) => compareClients(a, b, appliedSort));
  }, [clients, audience, tab, query, appliedFilters, appliedSort]);

  const audienceClients = useMemo(
    () => clients.filter((c) => (audience === "All" ? true : c.category === audience)),
    [clients, audience],
  );
  const stats = useMemo(
    () => computeClientDatabaseStats(audienceClients, tasks),
    [audienceClients, tasks],
  );
  const allRowsSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const filtersActive =
    query.length > 0 || tab !== "All" || filtersAreActive(appliedFilters);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openFilter = () => {
    setDraftFilters(appliedFilters);
    setSortOpen(false);
    setExportOpen(false);
    setFilterOpen(true);
  };

  const openSort = () => {
    setDraftSort(appliedSort);
    setFilterOpen(false);
    setExportOpen(false);
    setSortOpen(true);
  };

  const refreshView = () => {
    setTab("All");
    setQuery("");
    setAppliedFilters(EMPTY_DATABASE_FILTERS);
    setDraftFilters(EMPTY_DATABASE_FILTERS);
    setAppliedSort(DEFAULT_DATABASE_SORT);
    setDraftSort(DEFAULT_DATABASE_SORT);
    setFilterOpen(false);
    setSortOpen(false);
    setExportOpen(false);
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
  };

  const saveFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const applySort = () => {
    setAppliedSort(draftSort);
    setSortOpen(false);
  };

  const exportBase = `client-database-${audience === "All" ? "all" : audience.toLowerCase()}`;

  const toggleEditMode = () => {
    setEditMode((on) => {
      if (on) setSelected(new Set());
      return !on;
    });
  };

  const toggleRowSelected = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (rows.every((r) => prev.has(r.id))) return new Set();
      return new Set(rows.map((r) => r.id));
    });
  };

  const selectedClients = rows.filter((r) => selected.has(r.id));

  const confirmDeleteSelected = () => {
    if (selectedClients.length === 0) return;
    const names = selectedClients.map((c) => c.name).join(", ");
    askConfirm({
      title: selectedClients.length === 1 ? "Delete client?" : "Delete clients?",
      message:
        selectedClients.length === 1
          ? `Remove ${names} from the database? This cannot be undone.`
          : `Remove ${selectedClients.length} clients (${names})? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        selectedClients.forEach((c) => removeClient(c.id));
        setSelected(new Set());
        setEditMode(false);
      },
    });
  };

  const editSelected = () => {
    const client = selectedClients[0];
    if (!client) return;
    navigate(clientProfilePath(client.name));
    setEditMode(false);
    setSelected(new Set());
  };

  return (
    <div className="page">
      <PageHeader title="Database" />

      <nav
        className="-mb-1 flex flex-wrap gap-6 border-b border-hairline"
        aria-label="Renters and buyers"
      >
        {AUDIENCE_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAudience(id)}
            className={cn("tab-underline pb-3", audience === id && "tab-underline-active")}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total clients" value={stats.total} />
        <StatCard title="Active clients" value={stats.active} />
        <StatCard title="Closed deals" value={stats.closed} />
        <StatCard title="Pending follow ups" value={stats.pendingFollowUps} />
      </div>

      <div className="section-card">
        <div className="flex flex-col gap-3 border-b border-hairline px-3 py-1 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex shrink-0 gap-0.5 rounded-lg border border-hairline bg-sidebar p-1"
              role="group"
              aria-label="Database view"
            >
              <button
                type="button"
                onClick={() => setListView("table")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  listView === "table" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
                )}
              >
                <Notes size={15} />
                Table
              </button>
              <button
                type="button"
                onClick={() => setListView("kanban")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  listView === "kanban" ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
                )}
              >
                <LayoutGrid size={15} />
                Kanban
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
            {PIPELINE_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn("tab-underline", tab === t && "tab-underline-active")}
              >
                {pipelineTabLabel(t)}
              </button>
            ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            <ToolbarIconTip label="Sort" onClick={openSort} active={sortOpen}>
              <UnfoldMore size={16} />
            </ToolbarIconTip>
            <ToolbarIconTip
              label="Filter"
              active={filterOpen || filtersAreActive(appliedFilters)}
              onClick={openFilter}
            >
              <ListFilter size={16} />
            </ToolbarIconTip>
            <div ref={exportRef} className="relative">
              <ToolbarIconTip label="Export" onClick={() => setExportOpen((v) => !v)} active={exportOpen}>
                <DataExport size={16} />
              </ToolbarIconTip>
              {exportOpen && (
                <ul className="absolute right-0 z-50 mt-1 min-w-[148px] overflow-hidden rounded-[10px] border border-hairline bg-surface py-1 shadow-pop">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        exportClientsPdf(
                          rows,
                          `Client database (${AUDIENCE_TABS.find((t) => t.id === audience)?.label ?? "All"})`,
                        );
                        setExportOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-sidebar"
                    >
                      as PDF
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        exportClientsExcel(rows, `${exportBase}.csv`);
                        setExportOpen(false);
                      }}
                      className="w-full bg-primary/5 px-3 py-2 text-left text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      as Excel
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <ToolbarIconTip label="Upload" onClick={() => setUploadOpen(true)}>
              <DataUpload size={16} />
            </ToolbarIconTip>
            <ToolbarIconTip label="Edit" onClick={toggleEditMode} active={editMode}>
              <Pencil size={18} />
            </ToolbarIconTip>
          </div>
        </div>

        {editMode && selected.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline bg-sidebar/60 px-3 py-2">
            <p className="text-sm text-ink-muted">
              {selected.size} selected — choose an action
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-outline !w-auto text-sm"
                disabled={selected.size !== 1}
                onClick={editSelected}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-outline !w-auto text-sm text-status-awaiting"
                onClick={confirmDeleteSelected}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {listView === "kanban" ? (
          <ClientDatabaseKanban rows={rows} onStageChange={setProgressStage} />
        ) : (
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="text-sm text-ink-muted">
                {editMode && (
                  <th className="w-10 px-4 py-3 font-medium">
                    <button type="button" onClick={toggleSelectAll} aria-label="Select all">
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border",
                          allRowsSelected ? "border-primary bg-primary text-white" : "border-ink-soft",
                        )}
                      >
                        {allRowsSelected && <span className="text-xs leading-none">✓</span>}
                      </span>
                    </button>
                  </th>
                )}
                <th className="px-4 py-3 font-semibold text-ink">Name</th>
                <th className="px-4 py-3 font-semibold text-ink">Contact</th>
                <th className="px-4 py-3 font-semibold text-ink">Source</th>
                <th className="px-4 py-3 font-semibold text-ink">Pipeline</th>
                <th className="px-4 py-3 font-semibold text-ink">Property type</th>
                <th className="px-4 py-3 font-semibold text-ink">Location</th>
                <th className="px-4 py-3 font-semibold text-ink">Budget</th>
                <th className="px-4 py-3 font-semibold text-ink">Move-in date</th>
                <th className="px-4 py-3 font-semibold text-ink">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={editMode ? 10 : 9}>
                    {filtersActive ? (
                      <EmptyState
                        title="No clients match"
                        description="Clear the search or stage tab to see everyone."
                        action={
                          <button className="btn-outline" onClick={refreshView}>
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
                    onClick={() => {
                      if (editMode) toggleRowSelected(client.id);
                    }}
                    className={cn(
                      "border-t border-hairline text-sm transition-colors hover:bg-sidebar",
                      editMode && "cursor-default",
                      selected.has(client.id) && "bg-primary/[0.06]",
                    )}
                  >
                    {editMode && (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => toggleRowSelected(client.id)}
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
                    )}
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{formatDisplayCopy(client.name)}</p>
                        <p className="text-sm font-normal text-ink-muted">
                          {formatClientIdDisplay(client.clientId)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink">{formatDisplayCopy(client.phone)}</p>
                      <p className="truncate text-sm text-ink-muted">{formatDisplayCopy(client.email)}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {clientSourceLabel(client.source)}
                    </td>
                    <td className="px-4 py-3">
                      <ClientStagePicker
                        clientId={client.id}
                        stage={client.progressStage}
                        onChange={(next) => setProgressStage(client.id, next)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.propertyType)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.location)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{formatDisplayCopy(client.budget)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {formatMoveInDate(client.moveInDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(clientProfilePath(client.name));
                        }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        )}

        {listView === "table" && (
        <div className="divide-y divide-hairline md:hidden">
          {rows.length === 0 ? (
            <EmptyState
              title={filtersActive ? "No clients match" : "Add your first client"}
              description={
                filtersActive ? "Clear the search or stage tab." : "Accept a lead or add a walk in."
              }
            />
          ) : (
            rows.map((client) => (
              <div
                key={client.id}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{client.name}</span>
                  <span className="block truncate text-sm font-normal text-ink-muted">
                    {formatClientIdDisplay(client.clientId)}
                  </span>
                  <span className="block truncate text-sm text-ink-muted">{client.email}</span>
                </span>
                <ClientStagePicker
                  clientId={client.id}
                  stage={client.progressStage}
                  onChange={(next) => setProgressStage(client.id, next)}
                />
                <button
                  type="button"
                  onClick={() => navigate(clientProfilePath(client.name))}
                  className="shrink-0 text-sm font-medium text-primary hover:underline"
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
        )}
      </div>

      <ClientDatabaseFilterDrawer
        open={filterOpen}
        draft={draftFilters}
        propertyTypes={propertyTypes}
        locations={locations}
        onChange={setDraftFilters}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onSave={saveFilters}
      />
      <ClientDatabaseSortDrawer
        open={sortOpen}
        draft={draftSort}
        onChange={setDraftSort}
        onClose={() => setSortOpen(false)}
        onApply={applySort}
      />
      <ClientDatabaseUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <ConfirmDialog request={confirmRequest} onClose={closeConfirm} />
    </div>
  );
}