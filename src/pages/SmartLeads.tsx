import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Avatar } from "@/components/ui/Avatar";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Snackbar } from "@/components/ui/Snackbar";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import type { DealType, Intent, Lead } from "@/types";
import { cn } from "@/lib/utils";

function DealBadge({ type }: { type: DealType }) {
  return (
    <span
      className={cn(
        "pill border",
        type === "Rent"
          ? "border-accentGreen/50 bg-accentGreen/30 text-primary"
          : "border-status-awaitingBg bg-status-awaitingBg text-status-awaiting",
      )}
    >
      {type}
    </span>
  );
}

const INTENT_STYLES: Record<Intent, string> = {
  High: "border-primary/20 bg-primary/5 text-primary",
  Medium: "border-accentAmber/40 bg-doc-cream text-primary",
  Low: "border-hairline bg-sidebar text-ink-muted",
};

function IntentBadge({ intent }: { intent: Intent }) {
  return <span className={cn("pill border", INTENT_STYLES[intent])}>{intent}</span>;
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
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition-colors",
        active
          ? "border-primary/30 bg-primary/[0.04] shadow-card ring-1 ring-primary/10"
          : "border-transparent hover:bg-hairline/60",
      )}
    >
      <div className="flex gap-3">
        <Avatar name={lead.name} src={lead.avatar} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
              <p className="text-xs text-ink-soft">Lead from {lead.daysAgo} days back</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <DealBadge type={lead.dealType} />
              <IntentBadge intent={lead.intent} />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
            <span className="font-medium text-ink">{lead.budget}</span>
            <span className="text-ink-soft">{lead.location}</span>
            <span className="text-ink-soft">{lead.bhk}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
            {lead.inquiryFilled && (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckCircle2 size={13} /> Inquiry Filled
              </span>
            )}
            <span>Viewed {lead.viewedProperties} properties</span>
          </div>
        </div>
      </div>
    </button>
  );
}

function PreferenceCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink">{value}</p>
    </div>
  );
}

function LeadDetail({
  lead,
  onAccept,
  onDeprioritise,
  onBack,
}: {
  lead: Lead;
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
            <button onClick={onBack} className="icon-btn h-8 w-8 lg:hidden" aria-label="Back">
              <ArrowLeft size={16} />
            </button>
            <h2 className="font-bold text-ink">{lead.name}</h2>
            <DealBadge type={lead.dealType} />
            <span className={cn("pill border", INTENT_STYLES[lead.intent])}>
              {lead.intent} Intent
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Source: {lead.source}</p>
        </div>
        <div className="flex items-center gap-2">
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
          <span className="font-medium text-ink">Profile Details:</span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <Mail size={14} className="text-ink-soft" /> {lead.email}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <Phone size={14} className="text-ink-soft" /> {lead.phone}
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <MapPin size={14} className="text-ink-soft" /> {lead.city}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-hairline p-3">
          {lead.signals.map((signal) => (
            <span key={signal} className="inline-flex items-center gap-1.5 text-sm text-ink">
              <CheckCircle2 size={15} className="text-emerald-500" /> {signal}
            </span>
          ))}
        </div>

        <h3 className="mt-5 text-ink">Preference Pattern</h3>
        <div className="mt-2 grid grid-cols-2 divide-hairline overflow-hidden rounded-xl border border-hairline sm:grid-cols-4 sm:divide-x">
          <PreferenceCell label="Budget" value={lead.preference.budget} />
          <PreferenceCell label="Location" value={lead.preference.location} />
          <PreferenceCell label="Property Type" value={lead.preference.propertyType} />
          <PreferenceCell label="Timeline" value={lead.preference.timeline} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="text-ink">Property Preferences</h3>
          <button className="text-xs font-semibold text-primary hover:underline">View all</button>
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

export function SmartLeads() {
  const navigate = useNavigate();
  const { leads, acceptLead, deprioritiseLead } = useCrm();
  const { openAddClient } = useUi();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(leads[0]?.id);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const intentCounts = useMemo(
    () => ({
      high: leads.filter((l) => l.intent === "High").length,
      medium: leads.filter((l) => l.intent === "Medium").length,
      low: leads.filter((l) => l.intent === "Low").length,
    }),
    [leads],
  );

  const filtered = useMemo(
    () =>
      leads.filter((l) =>
        `${l.name} ${l.location} ${l.bhk}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [leads, query],
  );

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? filtered[0] ?? leads[0],
    [leads, selectedId, filtered],
  );

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAccept = (lead: Lead) => {
    acceptLead(lead.id);
    setToast(`${lead.name} added to Client Database`);
    setMobileDetail(false);
  };

  const handleDeprioritise = (lead: Lead) => {
    deprioritiseLead(lead.id);
    const remaining = leads.filter((l) => l.id !== lead.id);
    if (remaining.length > 0) setSelectedId(remaining[0].id);
    setToast("Listing was deprioritised and moved to low intent");
  };

  return (
    <div className="space-y-section p-section">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-ink">Client Leads</h1>
          <p className="mt-1 text-ink-muted">Prioritized leads based on intent and behaviour</p>
        </div>
        <button onClick={openAddClient} className="btn-primary">
          Add Client <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-section sm:grid-cols-3">
        <StatCard
          title="High Intent Leads"
          value={intentCounts.high}
          trend="12.6%"
          subtitle="compared to last month leads"
        />
        <StatCard
          title="Medium Intent Leads"
          value={intentCounts.medium}
          trend="6.6%"
          subtitle="compared to last month leads"
        />
        <StatCard
          title="Low Intent Leads"
          value={intentCounts.low}
          trend="4%"
          trendDirection="down"
          subtitle="compared to last month leads"
        />
      </div>

      <div className="grid grid-cols-1 gap-section lg:grid-cols-[3fr_7fr]">
        <div className={cn("section-card flex flex-col", mobileDetail && "hidden lg:flex")}>
          <div className="flex items-center gap-2 p-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-hairline bg-surface pl-9 pr-3 text-sm outline-none placeholder:text-ink-soft focus:border-primary/40"
              />
            </div>
            <button className="icon-btn rounded-lg" aria-label="Filter">
              <ListFilter size={16} />
            </button>
          </div>

          <div className="flex max-h-[calc(100vh-320px)] flex-col gap-1 overflow-y-auto px-2 pb-2 lg:max-h-[640px]">
            {filtered.length === 0 ? (
              <div className="px-3 py-10 text-center text-sm text-ink-soft">No leads found.</div>
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

        <div className={cn("section-card", !mobileDetail && "hidden lg:block")}>
          {selected ? (
            <LeadDetail
              lead={selected}
              onAccept={() => handleAccept(selected)}
              onDeprioritise={() => handleDeprioritise(selected)}
              onBack={() => setMobileDetail(false)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-center">
              <p className="text-sm font-medium text-ink">No leads to review</p>
              <p className="text-sm text-ink-muted">All caught up. Accepted leads move to the Client Database.</p>
              <button onClick={() => navigate("/clients")} className="btn-primary mt-2">
                Go to Client Database
              </button>
            </div>
          )}
        </div>
      </div>

      {toast && <Snackbar message={toast} />}
    </div>
  );
}
