import { useEffect, useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ListFilter,
  Mail,
  MapPin,
  Phone,
  Search,
} from "@/components/ui/icons";
import { TypeChip } from "@/components/ui/StatusBadge";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Snackbar } from "@/components/ui/Snackbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCrm } from "@/store/CrmContext";
import { personSlug } from "@/lib/pipeline";
import {
  LEAD_REJECTION_LABELS,
  getAcceptedRoutedLeads,
  getDeprioritisedLeads,
  getPendingRoutedLeads,
} from "@/lib/brokerRouting";
import { capacityBlockMessage } from "@/lib/brokerCapacity";
import { leadSlaFromAssignedAt } from "@/lib/leadSla";
import { LeadRejectModal } from "@/components/leads/LeadRejectModal";
import type { DealType, Lead, LeadRejectionReason } from "@/types";
import { cn, formatDisplayCopy } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";

function DealBadge({ type }: { type: DealType }) {
  return <TypeChip type={type} showDot={false} className="text-[14px] leading-none" />;
}

function LeadMetaChip({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={cn("pill text-[14px] leading-none", className)} style={style}>
      {children}
    </span>
  );
}

function LeadCard({
  lead,
  active,
  onClick,
}: {
  lead: Lead;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary/30 bg-primary-50" : "border-transparent hover:bg-sidebar",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[14px] font-semibold text-ink">{lead.name}</p>
        <DealBadge type={lead.dealType} />
      </div>
    </button>
  );
}

function PreferenceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[14px] font-medium text-ink-muted">{label}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-ink">{formatDisplayCopy(value)}</p>
    </div>
  );
}

function LeadProfileContactRow({ lead }: { lead: Lead }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-[14px] text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <Mail size={14} className="shrink-0" /> {lead.email || "—"}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Phone size={14} className="shrink-0" /> {lead.phone || "—"}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin size={14} className="shrink-0" /> {lead.city || "—"}
      </span>
    </div>
  );
}

function LeadDetail({
  lead,
  onAccept,
  onReject,
  onBack,
  acceptDisabled,
  capacityNote,
  onSendToActive,
  sendToActiveDisabled,
}: {
  lead: Lead;
  onAccept: () => void;
  onReject: () => void;
  onBack: () => void;
  acceptDisabled?: boolean;
  capacityNote?: string;
  onSendToActive?: () => void;
  sendToActiveDisabled?: boolean;
}) {
  const isDeprioritised = lead.status === "deprioritised";
  const canTriage = (lead.status ?? "new") === "new";
  const sla = leadSlaFromAssignedAt(lead.assignedAt);
  const rejectionLabel = lead.rejectionReason
    ? LEAD_REJECTION_LABELS[lead.rejectionReason]
    : null;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-3 border-b border-hairline p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button onClick={onBack} className="icon-btn lg:hidden" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-lg font-semibold text-ink">{lead.name}</h2>
            {lead.returnedReason && (
              <span className="pill bg-status-warningBg text-status-warning text-[14px]">
                {lead.returnedReason}
              </span>
            )}
            <DealBadge type={lead.dealType} />
            <LeadMetaChip className="bg-sidebar text-ink-muted">{lead.source}</LeadMetaChip>
            {sla && canTriage && (
              <LeadMetaChip
                className={cn(
                  "font-medium",
                  sla.pastReminder ? "bg-status-warningBg text-status-warning" : "bg-primary-50 text-primary",
                )}
              >
                {sla.label}
              </LeadMetaChip>
            )}
          </div>
          <div className="mt-1.5">
            <LeadProfileContactRow lead={lead} />
          </div>
          {rejectionLabel && (
            <p className="mt-1 text-xs text-ink-muted">Rejected: {rejectionLabel}</p>
          )}
          {lead.status === "moved_on" && (
            <p className="mt-1 text-xs text-ink-muted">
              No action within 24 hours — routed to the next broker.
            </p>
          )}
          {(capacityNote && canTriage) || (capacityNote && isDeprioritised && onSendToActive) ? (
            <p className="mt-1 text-xs text-status-awaiting">{capacityNote}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isDeprioritised && onSendToActive && (
            <button
              type="button"
              onClick={onSendToActive}
              disabled={sendToActiveDisabled}
              className="btn-primary disabled:opacity-50"
            >
              Send to Active tab
            </button>
          )}
          {canTriage && (
            <>
              <button
                type="button"
                onClick={onAccept}
                disabled={acceptDisabled}
                className="btn-primary disabled:opacity-50"
              >
                Accept
              </button>
              <button type="button" onClick={onReject} className="btn-outline">
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 text-[14px]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-hairline p-3">
          {lead.signals.map((signal) => (
            <span key={signal} className="inline-flex items-center gap-1.5 text-ink">
              <CheckCircle2 size={15} className="text-status-completed" /> {signal}
            </span>
          ))}
        </div>

        <h3 className="mt-5 text-[14px] font-semibold text-ink">Details</h3>
        <div className="mt-2 rounded-lg border border-hairline bg-surface p-3">
          <p className="text-[14px] leading-relaxed text-ink text-pretty">
            {lead.inquiryDetails ?? "No additional details provided."}
          </p>
        </div>

        <h3 className="mt-5 text-[14px] font-semibold text-ink">Preference pattern</h3>
        <div className="mt-2 grid grid-cols-2 divide-hairline overflow-hidden rounded-lg border border-hairline sm:grid-cols-4 sm:divide-x">
          <PreferenceCell label="Budget" value={lead.preference.budget} />
          <PreferenceCell label="Location" value={lead.preference.location} />
          <PreferenceCell label="Property Type" value={lead.preference.propertyType} />
          <PreferenceCell label="Timeline" value={lead.preference.timeline} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-ink">Property preferences</h3>
        </div>
        <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          {lead.properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className="w-[56.25%] max-w-[315px] shrink-0 snap-start"
            />
          ))}
        </div>

        <h3 className="mt-5 text-[14px] font-semibold text-ink">Must-have preferences</h3>
        <div className="mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
          {(lead.mustHaves ?? []).map((item) => (
            <div key={item.label} className="bg-surface px-4 py-3">
              <p className="text-[14px] font-medium text-ink-muted">{item.label}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-ink">{formatDisplayCopy(item.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ListTab = "pending" | "active" | "deprioritised";

export function SmartLeads() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const {
    leads,
    acceptLead,
    undoAccept,
    rejectLead,
    refreshLeadActivity,
    capacityBlock,
  } = useCrm();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ListTab>(() => {
    const view = searchParams.get("view");
    if (view === "active" || view === "accepted" || view === "deprioritised") {
      return view === "accepted" ? "active" : (view as ListTab);
    }
    return "pending";
  });
  const [dealFilter, setDealFilter] = useState<DealType | "">("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [mobileDetail, setMobileDetail] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    undoId?: string;
    undoRevert?: "new" | "deprioritised";
  } | null>(null);

  const ACCEPT_TOAST_MS = 6000;
  const [rejectOpen, setRejectOpen] = useState(false);
  const [, setSlaTick] = useState(0);

  const pendingLeads = useMemo(() => getPendingRoutedLeads(leads), [leads]);
  const acceptedLeads = useMemo(() => getAcceptedRoutedLeads(leads), [leads]);
  const deprioritisedLeads = useMemo(() => getDeprioritisedLeads(leads), [leads]);

  const pool = useMemo(() => {
    if (tab === "pending") return pendingLeads;
    if (tab === "active") return acceptedLeads;
    return deprioritisedLeads;
  }, [tab, pendingLeads, acceptedLeads, deprioritisedLeads]);

  const capacityNote = capacityBlock ? capacityBlockMessage(capacityBlock) : "";

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return pool
      .filter((l) => {
        if (dealFilter && l.dealType !== dealFilter) return false;
        if (!q) return true;
        return `${l.name} ${l.location} ${l.bhk} ${l.budget} ${l.source}`
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        const dealOrder = (d: DealType) => (d === "Rent" ? 0 : 1);
        const byDeal = dealOrder(a.dealType) - dealOrder(b.dealType);
        if (byDeal !== 0) return byDeal;
        const aTime = a.assignedAt ? new Date(a.assignedAt).getTime() : a.daysAgo;
        const bTime = b.assignedAt ? new Date(b.assignedAt).getTime() : b.daysAgo;
        return bTime - aTime;
      });
  }, [pool, query, dealFilter]);

  const selected = useMemo(
    () => filtered.find((l) => l.id === selectedId) ?? filtered[0],
    [filtered, selectedId],
  );

  useEffect(() => {
    if (!slug) return;
    const match = leads.find((l) => personSlug(l.name) === slug);
    if (!match) return;
    const status = match.status ?? "new";
    if (status === "deprioritised") setTab("deprioritised");
    else if (status === "accepted") setTab("active");
    else if (status === "new") setTab("pending");
    setSelectedId(match.id);
    setMobileDetail(true);
  }, [slug, leads]);

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!toast) return;
    const duration = toast.undoId ? ACCEPT_TOAST_MS : 5000;
    const t = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const t = window.setInterval(() => setSlaTick((n) => n + 1), 60_000);
    return () => window.clearInterval(t);
  }, []);

  const filtersActive = Boolean(dealFilter || query);

  const leadAddedToast = (
    lead: Lead,
    clientId: string,
    undoRevert: "new" | "deprioritised",
  ) => {
    setTab("active");
    setSelectedId(lead.id);
    setMobileDetail(false);
    setToast({
      message: `${lead.name} added to Client Database and Active tab`,
      undoId: clientId,
      undoRevert,
    });
  };

  const handleAccept = (lead: Lead) => {
    if (capacityBlock) return;
    const clientId = acceptLead(lead.id);
    if (!clientId) return;
    leadAddedToast(lead, clientId, "new");
  };

  const handleSendDeprioritisedToActive = (lead: Lead) => {
    if (capacityBlock) return;
    const clientId = acceptLead(lead.id);
    if (!clientId) return;
    leadAddedToast(lead, clientId, "deprioritised");
  };

  const handleRejectConfirm = (reason: LeadRejectionReason) => {
    if (!selected) return;
    rejectLead(selected.id, reason);
    setRejectOpen(false);
    setToast({ message: `${selected.name} rejected` });
  };

  const tabCounts = {
    pending: pendingLeads.length,
    active: acceptedLeads.length,
    deprioritised: deprioritisedLeads.length,
  };

  return (
    <div className="page flex min-h-0 flex-1 flex-col overflow-hidden">
      <PageHeader title="Lead Management" className="shrink-0" />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-section lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
        <div
          className={cn(
            "section-card flex min-h-0 flex-col text-[14px]",
            mobileDetail && "hidden lg:flex",
          )}
        >
          <div className="flex gap-4 border-b border-hairline px-3">
            {(
              [
                ["pending", "Pending", tabCounts.pending],
                ["active", "Active", tabCounts.active],
                ["deprioritised", "Deprioritised", tabCounts.deprioritised],
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
                placeholder="Name, budget, source"
                className="input-field pl-9"
              />
            </div>
            <button
              className={cn("icon-btn", filtersOpen && "bg-sidebar text-ink")}
              aria-label="Filter by Rent or Buy"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <ListFilter size={16} />
            </button>
          </div>

          {filtersOpen && (
            <div className="flex flex-wrap gap-2 px-3 pb-3">
              {(
                [
                  ["", "All"],
                  ["Rent", "Rent"],
                  ["Buy", "Buy"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value || "all"}
                  type="button"
                  onClick={() => setDealFilter(value)}
                  className={cn(
                    "pill text-[14px]",
                    dealFilter === value
                      ? "bg-primary-50 font-medium text-primary"
                      : "bg-sidebar text-ink-muted hover:text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {tab === "deprioritised" && deprioritisedLeads.length > 0 && (
            <div className="px-3 pb-2">
              <button type="button" onClick={refreshLeadActivity} className="btn-ghost">
                Refresh activity (resurface if views rose)
              </button>
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 pb-2">
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
                        setDealFilter("");
                      }}
                    >
                      Clear filters
                    </button>
                  }
                  className="py-10"
                />
              ) : tab === "pending" ? (
                <EmptyState
                  title="No pending leads"
                  description="Shift Hona assignments show here until you accept, reject, or they move on after 24h."
                  className="py-10"
                />
              ) : tab === "active" ? (
                <EmptyState
                  title="No active leads"
                  description="Leads you accept move to the Client Database and appear here briefly."
                  className="py-10"
                />
              ) : (
                <EmptyState
                  title="No deprioritised leads"
                  description="Park leads here until activity picks up."
                  className="py-10"
                />
              )
            ) : (
              filtered.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  active={selected?.id === lead.id}
                  onClick={() => {
                    setSelectedId(lead.id);
                    setMobileDetail(true);
                  }}
                />
              ))
            )}
          </div>
        </div>

        <div
          className={cn(
            "section-card flex min-h-0 flex-col overflow-hidden",
            !mobileDetail && "hidden lg:flex",
          )}
        >
          {selected ? (
            <div className="flex min-h-0 flex-1 flex-col">
            <LeadDetail
              lead={selected}
              onAccept={() => handleAccept(selected)}
              onReject={() => setRejectOpen(true)}
              onBack={() => setMobileDetail(false)}
              acceptDisabled={Boolean(capacityBlock)}
              capacityNote={capacityNote}
              onSendToActive={
                tab === "deprioritised" && selected.status === "deprioritised"
                  ? () => handleSendDeprioritisedToActive(selected)
                  : undefined
              }
              sendToActiveDisabled={Boolean(capacityBlock)}
            />
            </div>
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

      <LeadRejectModal
        open={rejectOpen}
        leadName={selected?.name}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleRejectConfirm}
      />

      {toast && (
        <Snackbar
          message={toast.message}
          actionLabel={toast.undoId ? "Undo" : undefined}
          onAction={
            toast.undoId
              ? () => {
                  undoAccept(toast.undoId!, toast.undoRevert ?? "new");
                  setToast(null);
                  if (toast.undoRevert === "deprioritised") setTab("deprioritised");
                  else setTab("pending");
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
