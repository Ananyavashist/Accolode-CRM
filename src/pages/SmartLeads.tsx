import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ListFilter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
} from "@/components/ui/icons";
import { StatCard } from "@/components/ui/StatCard";
import { TypeChip } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Snackbar } from "@/components/ui/Snackbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { addDaysISO, personSlug } from "@/lib/pipeline";
import type { DealType, Intent, Lead } from "@/types";
import { cn } from "@/lib/utils";
import { ConfirmDialog, useConfirmAction } from "@/components/ui/ConfirmDialog";

function DealBadge({ type }: { type: DealType }) {
  return <TypeChip type={type} />;
}

const INTENT_STYLES: Record<Intent, string> = {
  High: "bg-primary-50 text-primary",
  Medium: "bg-status-activeBg text-status-active",
  Low: "bg-sidebar text-ink-muted",
};

function IntentBadge({ intent }: { intent: Intent }) {
  return <span className={cn("pill", INTENT_STYLES[intent])}>{intent}</span>;
}

function LeadCard({
  lead,
  active,
  selected,
  onSelect,
  onClick,
}: {
  lead: Lead;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-primary/30 bg-primary-50"
          : "border-transparent hover:bg-sidebar",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-ink-soft"
        aria-label={`Select ${lead.name}`}
        aria-pressed={selected}
      >
        {selected && <span className="text-[10px] leading-none text-primary">✓</span>}
      </button>
      <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
        <div className="flex gap-3">
          <Avatar name={lead.name} src={lead.avatar} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
                <p className="text-xs text-ink-muted">Lead from {lead.daysAgo} days back</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                {lead.returnedReason && (
                  <span className="pill bg-status-warningBg text-status-warning" title={lead.returnedReason}>
                    Returned
                  </span>
                )}
                <DealBadge type={lead.dealType} />
                <IntentBadge intent={lead.intent} />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span className="font-medium text-ink">{lead.budget}</span>
              <span>{lead.location}</span>
              <span>{lead.bhk}</span>
              <span>{lead.source}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
              {lead.inquiryFilled && (
                <span className="inline-flex items-center gap-1 text-status-completed">
                  <CheckCircle2 size={13} /> Inquiry filled
                </span>
              )}
              <span>Viewed {lead.viewedProperties} properties</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function PreferenceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink">{value}</p>
    </div>
  );
}

function LeadDetail({
  lead,
  followUpDate,
  onFollowUpDate,
  onAccept,
  onDeprioritise,
  onBack,
}: {
  lead: Lead;
  followUpDate: string;
  onFollowUpDate: (value: string) => void;
  onAccept: () => void;
  onDeprioritise: () => void;
  onBack: () => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onBack} className="icon-btn lg:hidden" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-lg font-semibold text-ink">{lead.name}</h2>
            {lead.returnedReason && (
              <span className="pill bg-status-warningBg text-status-warning">{lead.returnedReason}</span>
            )}
            <DealBadge type={lead.dealType} />
            <span className={cn("pill", INTENT_STYLES[lead.intent])}>{lead.intent} Intent</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Source: {lead.source}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Follow-up</span>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => onFollowUpDate(e.target.value)}
              className="input-field h-9 w-auto"
            />
          </label>
          <button onClick={onAccept} className="btn-primary">
            Accept
          </button>
          <button onClick={onDeprioritise} className="btn-outline">
            Deprioritise
          </button>
          <button
            onClick={() => setBookmarked((v) => !v)}
            className="icon-btn"
            aria-label="Bookmark"
          >
            <Bookmark size={16} className={cn(bookmarked && "fill-primary text-primary")} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="font-medium text-ink">Profile details</span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <Mail size={14} /> {lead.email}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <Phone size={14} /> {lead.phone}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <MapPin size={14} /> {lead.city}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-hairline p-3">
          {lead.signals.map((signal) => (
            <span key={signal} className="inline-flex items-center gap-1.5 text-sm text-ink">
              <CheckCircle2 size={15} className="text-status-completed" /> {signal}
            </span>
          ))}
        </div>

        <h3 className="mt-5 text-ink">Preference pattern</h3>
        <div className="mt-2 grid grid-cols-2 divide-hairline overflow-hidden rounded-lg border border-hairline sm:grid-cols-4 sm:divide-x">
          <PreferenceCell label="Budget" value={lead.preference.budget} />
          <PreferenceCell label="Location" value={lead.preference.location} />
          <PreferenceCell label="Property Type" value={lead.preference.propertyType} />
          <PreferenceCell label="Timeline" value={lead.preference.timeline} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-ink">Property preferences</h3>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {lead.properties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ListTab = "new" | "deprioritised";
type SortKey = "intent" | "recency";

const INTENT_RANK: Record<Intent, number> = { High: 0, Medium: 1, Low: 2 };

export function SmartLeads() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const {
    leads,
    acceptLead,
    undoAccept,
    deprioritiseLead,
    refreshLeadActivity,
  } = useCrm();
  const { openAddClient } = useUi();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ListTab>("new");
  const [sort, setSort] = useState<SortKey>("intent");
  const [intentFilter, setIntentFilter] = useState<Intent | "">("");
  const [dealFilter, setDealFilter] = useState<DealType | "">("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>();
  const [mobileDetail, setMobileDetail] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(addDaysISO(1));
  const [toast, setToast] = useState<{ message: string; undoId?: string } | null>(null);
  const { confirmRequest, askConfirm, closeConfirm } = useConfirmAction();

  const sources = useMemo(
    () => [...new Set(leads.map((l) => l.source))].sort(),
    [leads],
  );

  const newLeads = leads.filter((l) => (l.status ?? "new") === "new");
  const deprioritised = leads.filter((l) => l.status === "deprioritised");
  const pool = tab === "new" ? newLeads : deprioritised;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return pool
      .filter((l) => {
        if (intentFilter && l.intent !== intentFilter) return false;
        if (dealFilter && l.dealType !== dealFilter) return false;
        if (sourceFilter && l.source !== sourceFilter) return false;
        if (!q) return true;
        return `${l.name} ${l.location} ${l.bhk} ${l.budget} ${l.source} ${l.intent}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) =>
        sort === "intent"
          ? INTENT_RANK[a.intent] - INTENT_RANK[b.intent]
          : a.daysAgo - b.daysAgo,
      );
  }, [pool, query, intentFilter, dealFilter, sourceFilter, sort]);

  const selected = useMemo(
    () => filtered.find((l) => l.id === selectedId) ?? filtered[0],
    [filtered, selectedId],
  );

  useEffect(() => {
    if (!slug) return;
    const match = leads.find((l) => personSlug(l.name) === slug);
    if (!match) return;
    setTab((match.status ?? "new") === "deprioritised" ? "deprioritised" : "new");
    setSelectedId(match.id);
    setMobileDetail(true);
  }, [slug, leads]);

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtersActive = Boolean(intentFilter || dealFilter || sourceFilter || query);

  const handleAccept = (lead: Lead) => {
    const clientId = acceptLead(lead.id, followUpDate);
    setMobileDetail(false);
    setToast({
      message: `${lead.name} added to Client Database`,
      undoId: clientId,
    });
  };

  const handleDeprioritise = (lead: Lead) => {
    deprioritiseLead(lead.id);
    setToast({ message: `${lead.name} moved to Deprioritised` });
  };

  const confirmLeadSelection = (lead: Lead) => {
    const isSelected = checked.has(lead.id);
    askConfirm({
      title: isSelected ? "Deselect lead?" : "Select lead?",
      message: isSelected
        ? `Remove ${lead.name} from bulk selection?`
        : `Select ${lead.name} for bulk Accept or Deprioritise?`,
      confirmLabel: isSelected ? "Deselect" : "Select",
      onConfirm: () =>
        setChecked((prev) => {
          const next = new Set(prev);
          next.has(lead.id) ? next.delete(lead.id) : next.add(lead.id);
          return next;
        }),
    });
  };

  const intentCounts = useMemo(
    () => ({
      high: newLeads.filter((l) => l.intent === "High").length,
      medium: newLeads.filter((l) => l.intent === "Medium").length,
      low: newLeads.filter((l) => l.intent === "Low").length,
    }),
    [newLeads],
  );

  return (
    <div className="page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Client Leads</h1>
          <p className="page-lede">Clear the pile. Signals are on the card.</p>
        </div>
        <button onClick={openAddClient} className="btn-primary">
          Add Client <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-3">
        <StatCard title="High Intent" value={intentCounts.high} subtitle="in the New list" />
        <StatCard title="Medium Intent" value={intentCounts.medium} subtitle="in the New list" />
        <StatCard title="Low Intent" value={intentCounts.low} subtitle="in the New list" />
      </div>

      <div className="grid grid-cols-1 gap-section lg:grid-cols-[3fr_7fr]">
        <div className={cn("section-card flex flex-col", mobileDetail && "hidden lg:flex")}>
          <div className="flex gap-4 border-b border-hairline px-3">
            {(
              [
                ["new", "New", newLeads.length],
                ["deprioritised", "Deprioritised", deprioritised.length],
              ] as const
            ).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "tab-underline",
                  tab === key && "tab-underline-active",
                )}
              >
                {label} <span className="text-ink-muted">{count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 p-3">
            <div className="relative min-w-[160px] flex-1">
              <label htmlFor="lead-search" className="sr-only">
                Search leads
              </label>
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                id="lead-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, budget, source, intent"
                className="input-field pl-9"
              />
            </div>
            <button
              className={cn("icon-btn", filtersOpen && "bg-sidebar text-ink")}
              aria-label="Filter leads"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <ListFilter size={16} />
            </button>
            <select
              aria-label="Sort leads"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-field w-auto"
            >
              <option value="intent">Sort by intent</option>
              <option value="recency">Sort by recency</option>
            </select>
          </div>

          {filtersOpen && (
            <div className="grid grid-cols-1 gap-2 px-3 pb-3 sm:grid-cols-3">
              <select
                aria-label="Filter by intent"
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value as Intent | "")}
                className="input-field"
              >
                <option value="">All intent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                aria-label="Filter by deal type"
                value={dealFilter}
                onChange={(e) => setDealFilter(e.target.value as DealType | "")}
                className="input-field"
              >
                <option value="">All deal types</option>
                <option value="Rent">Rent</option>
                <option value="Buy">Buy</option>
              </select>
              <select
                aria-label="Filter by source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All sources</option>
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {checked.size > 0 && (
            <div className="flex items-center gap-2 px-3 pb-2">
              <span className="text-xs text-ink-muted">{checked.size} selected</span>
              <button
                className="btn-primary h-8 text-xs"
                onClick={() => {
                  filtered.filter((l) => checked.has(l.id)).forEach(handleAccept);
                  setChecked(new Set());
                }}
              >
                Accept
              </button>
              <button
                className="btn-outline h-8 text-xs"
                onClick={() => {
                  filtered.filter((l) => checked.has(l.id)).forEach(handleDeprioritise);
                  setChecked(new Set());
                }}
              >
                Deprioritise
              </button>
            </div>
          )}

          {tab === "deprioritised" && deprioritised.length > 0 && (
            <div className="px-3 pb-2">
              <button onClick={refreshLeadActivity} className="btn-ghost h-8 text-xs">
                Refresh activity (resurface if views rose)
              </button>
            </div>
          )}

          <div className="flex max-h-[calc(100vh-320px)] flex-col gap-1 overflow-y-auto px-2 pb-2 lg:max-h-[640px]">
            {filtered.length === 0 ? (
              filtersActive ? (
                <EmptyState
                  title="Nothing matches"
                  description="Clear filters to see the rest of this list."
                  action={
                    <button
                      className="btn-outline"
                      onClick={() => {
                        setQuery("");
                        setIntentFilter("");
                        setDealFilter("");
                        setSourceFilter("");
                      }}
                    >
                      Clear filters
                    </button>
                  }
                  className="py-10"
                />
              ) : tab === "new" ? (
                <EmptyState
                  title="You’re clear"
                  description="Overnight leads will land here. Check Deprioritised or Notes."
                  action={
                    <div className="flex gap-2">
                      <button className="btn-outline" onClick={() => setTab("deprioritised")}>
                        Deprioritised
                      </button>
                      <button className="btn-primary" onClick={() => navigate("/notes")}>
                        Notes
                      </button>
                    </div>
                  }
                  className="py-10"
                />
              ) : (
                <EmptyState
                  title="No deprioritised leads"
                  description="Leads you clear leave the New list and wait here until behaviour changes."
                  className="py-10"
                />
              )
            ) : (
              filtered.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  active={selected?.id === lead.id}
                  selected={checked.has(lead.id)}
                  onSelect={() => confirmLeadSelection(lead)}
                  onClick={() => {
                    setSelectedId(lead.id);
                    setMobileDetail(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div className={cn("section-card", !mobileDetail && "hidden lg:block")}>
          {selected ? (
            <LeadDetail
              lead={selected}
              followUpDate={followUpDate}
              onFollowUpDate={setFollowUpDate}
              onAccept={() => handleAccept(selected)}
              onDeprioritise={() => handleDeprioritise(selected)}
              onBack={() => setMobileDetail(false)}
            />
          ) : (
            <EmptyState
              title="No leads to review"
              description="Accepted leads move to the Client Database."
              action={
                <button onClick={() => navigate("/clients")} className="btn-primary">
                  Go to Client Database
                </button>
              }
            />
          )}
        </div>
      </div>

      <ConfirmDialog request={confirmRequest} onClose={closeConfirm} />

      {toast && (
        <Snackbar
          message={toast.message}
          actionLabel={toast.undoId ? "Undo" : undefined}
          onAction={
            toast.undoId
              ? () => {
                  undoAccept(toast.undoId!);
                  setToast(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
