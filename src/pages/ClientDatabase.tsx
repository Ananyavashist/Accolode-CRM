import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ListFilter,
  MoreVertical,
  Plus,
  RotateCw,
  Search,
} from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { computeClientDatabaseStats } from "@/lib/dashboardMetrics";
import type { ClientCategory } from "@/types";
import { cn } from "@/lib/utils";

const TABS = ["All List", "Active Lead", "Completed Client", "Awaiting Action"] as const;
type Tab = (typeof TABS)[number];

function matchesTab(status: string, tab: Tab): boolean {
  if (tab === "All List") return true;
  if (tab === "Completed Client") return status === "Completed Client" || status === "Completed";
  return status === tab;
}

export function ClientDatabase() {
  const navigate = useNavigate();
  const { clients } = useCrm();
  const { openAddClient } = useUi();
  const [category, setCategory] = useState<ClientCategory>("Renter");
  const [tab, setTab] = useState<Tab>("All List");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    return clients
      .filter((c) => c.category === category)
      .filter((c) => matchesTab(c.status, tab))
      .filter((c) =>
        `${c.name} ${c.location} ${c.propertyType} ${c.clientId}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  }, [clients, category, tab, query]);

  const stats = useMemo(() => computeClientDatabaseStats(clients), [clients]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

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
    <div className="space-y-section p-section">
      <div className="flex flex-col gap-3">
        <h1 className="text-ink">Client Database</h1>
        <div className="inline-flex w-fit rounded-[10px] bg-sidebar p-1">
          {(["Renter", "Buyer"] as ClientCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-[10px] px-5 py-1.5 text-sm font-semibold transition-colors",
                category === cat ? "bg-primary text-white shadow-card" : "text-ink-muted",
              )}
            >
              {cat === "Buyer" ? "Buyers" : "Renter"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Clients" value={stats.total} trend="12.6%" subtitle="compared to last month" />
        <StatCard title="Active Leads" value={stats.active} trend="6.6%" subtitle="compared to last month" />
        <StatCard title="Completed Clients" value={stats.completed} trend="2%" subtitle="compared to last month" />
        <StatCard
          title="Awaiting Action"
          value={stats.awaiting}
          trend="2.6%"
          trendDirection="down"
          subtitle="compared to last month"
        />
      </div>

      <div className="section-card">
        <div className="flex flex-col gap-3 border-b border-hairline p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-[10px] bg-sidebar p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors",
                  tab === t ? "bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center gap-2 rounded-[10px] border border-hairline bg-surface px-2.5 text-ink-muted">
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-[4px] border",
                  allSelected ? "border-primary bg-primary text-white" : "border-ink-soft",
                )}
              >
                {allSelected && <span className="text-xs leading-none">✓</span>}
              </span>
              <ChevronDown size={14} />
            </button>
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-40 rounded-[10px] border border-hairline bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-ink-soft focus:border-primary/40 sm:w-56"
              />
            </div>
            <button className="icon-btn rounded-[10px]" aria-label="Filter">
              <ListFilter size={16} />
            </button>
            <button className="icon-btn rounded-[10px]" aria-label="Refresh">
              <RotateCw size={16} />
            </button>
            <button onClick={openAddClient} className="btn-primary">
              Add Client <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-medium text-ink-muted">
                <th className="w-10 px-4 py-3">
                  <button onClick={toggleAll} aria-label="Select all">
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-[4px] border",
                        allSelected ? "border-primary bg-primary text-white" : "border-ink-soft",
                      )}
                    >
                      {allSelected && <span className="text-xs leading-none">✓</span>}
                    </span>
                  </button>
                </th>
                <th className="px-2 py-3 font-medium">Client Name</th>
                <th className="px-2 py-3 font-medium">Conversion Status</th>
                <th className="px-2 py-3 font-medium">Property Type Preferred</th>
                <th className="px-2 py-3 font-medium">Preferred Location</th>
                <th className="px-2 py-3 font-medium">Budget</th>
                <th className="px-2 py-3 font-medium">Client ID</th>
                <th className="px-2 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-ink-soft">
                    No clients in this view yet. Accept a lead from Client Leads to add one.
                  </td>
                </tr>
              ) : (
                rows.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="cursor-pointer border-t border-hairline text-sm transition-colors hover:bg-sidebar"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => toggleOne(client.id)} aria-label={`Select ${client.name}`}>
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-[4px] border",
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
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={client.name} src={client.avatar} size={32} />
                        <span className="font-medium text-ink">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-2 py-3 text-ink-muted">{client.propertyType}</td>
                    <td className="px-2 py-3 text-ink-muted">{client.location}</td>
                    <td className="px-2 py-3 text-ink-muted">{client.budget}</td>
                    <td className="px-2 py-3 text-ink-muted">{client.clientId}</td>
                    <td className="px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button className="text-ink-soft transition-colors hover:text-ink" aria-label="Actions">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
