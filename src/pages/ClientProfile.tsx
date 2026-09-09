import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  MoreHorizontal,
  Plus,
  Share2,
} from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PillDropdown } from "@/components/ui/PillDropdown";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { StageBadge, StatusBadge } from "@/components/ui/StatusBadge";
import { useCrm } from "@/store/CrmContext";
import { clientProfilePath, mismatchLines, personSlug, relativeTime } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS, type ProgressStage } from "@/types";
import {
  APPOINTMENTS,
  CLIENT_NOTES,
  DOCUMENTATION,
  LEGAL_RECORDS,
  LOG_HISTORY,
  PROGRESS_HISTORY,
  activityForClient,
} from "@/data/clientProfileContent";
import { cn } from "@/lib/utils";

const TABS = [
  "Overview",
  "Progress History",
  "Client Notes",
  "Appointments",
  "Documentation",
  "Log History",
  "Legal",
] as const;
type Tab = (typeof TABS)[number];

const PINNED_DOCS = [
  {
    title: "Renter Agreement Guidelines",
    sub: "Delivered By: 9th January 2026",
    bg: "bg-doc-rose",
  },
  {
    title: "Mortgage Pre- Approval Letter",
    sub: "Approved By: 29th March 2026",
    bg: "bg-doc-indigo",
  },
  {
    title: "ID & Verification Documents",
    sub: "Verified By: 30th March 2026",
    bg: "bg-doc-cream",
  },
];

function InfoRow({ label, value, hint }: { label: string; value: string; hint?: string | null }) {
  return (
    <div className="grid grid-cols-[125px_1fr] gap-2 py-[7px] text-sm">
      <span className="text-ink-muted">{label}</span>
      <span>
        <span className="font-medium text-ink">{value}</span>
        {hint && <span className="ml-2 text-xs text-ink-muted">{hint}</span>}
      </span>
    </div>
  );
}

function BadgeRow({
  label,
  value,
  options,
  className,
  onChange,
  ariaLabel,
}: {
  label: string;
  value: string;
  options: string[];
  className: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="grid grid-cols-[125px_1fr] items-center gap-2 py-[7px] text-sm">
      <span className="text-ink-muted">{label}</span>
      <PillDropdown
        value={value}
        options={options}
        onChange={onChange}
        className={className}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-ink">{children}</h3>;
}

function TabPanel({ children }: { children: ReactNode }) {
  return <div className="space-y-6 p-4">{children}</div>;
}

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, setProgressStage, completeStep, tasks, toggleTask } = useCrm();
  const client = id ? getClient(id) : undefined;
  const [tab, setTab] = useState<Tab>("Overview");

  useEffect(() => {
    if (client) completeStep("saidDoing");
  }, [client, completeStep]);

  useEffect(() => {
    if (client && id && id !== personSlug(client.name)) {
      navigate(clientProfilePath(client.name), { replace: true });
    }
  }, [client, id, navigate]);

  if (!client) {
    return (
      <div className="p-section">
        <div className="section-card flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
          <p className="font-semibold text-ink">Client not found</p>
          <button onClick={() => navigate("/clients")} className="btn-primary">
            Back to Client Database
          </button>
        </div>
      </div>
    );
  }

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const activity = activityForClient(client.name, client.location);
  const mismatches = mismatchLines(client);
  const budgetHint = relativeTime(client.onboarding.updatedAt?.budget);

  return (
    <div className="page flex min-h-0 flex-1 flex-col lg:overflow-hidden">
      <Breadcrumb
        items={[
          { label: "Client Database", to: "/clients" },
          { label: client.name },
        ]}
      />

      <div className="section-card flex shrink-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/clients")} className="icon-btn" aria-label="Back to Client Database">
            <ArrowLeft size={18} />
          </button>
          <Avatar name={client.name} src={client.avatar} size={48} />
          <div>
            <h1 className="text-[18px] font-semibold leading-snug text-ink">{client.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm text-ink-muted">Client ID: {client.clientId}</p>
              <StageBadge stage={client.progressStage} />
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/messages?client=${personSlug(client.name)}`)}
          className="btn-primary"
        >
          Message on WhatsApp
        </button>
      </div>

      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:overflow-hidden">
        <aside
          className="flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain lg:w-[35%] lg:shrink-0 lg:grow-0"
          aria-label="Client information"
        >
          <div className="section-card p-4">
            <SectionTitle>Personal Information</SectionTitle>
            <div className="mt-2 divide-y divide-hairline">
              <InfoRow label="Client Type" value={client.category} />
              <InfoRow label="Email Address" value={client.email} />
              <InfoRow label="Phone Number" value={client.phone} />
              <InfoRow label="Current City" value={client.city} />
              <div className="grid grid-cols-[125px_1fr] items-center gap-2 py-[7px] text-sm">
                <span className="text-ink-muted">Conversion</span>
                <StatusBadge status={client.status} />
              </div>
              <BadgeRow
                label="Progress Stage"
                value={String(client.progressStage)}
                options={[...PROGRESS_STAGE_OPTIONS.filter((s) => s !== "Inquiry")]}
                className="bg-status-activeBg text-status-active"
                ariaLabel="Progress stage"
                onChange={(progressStage) =>
                  setProgressStage(client.id, progressStage as ProgressStage)
                }
              />
            </div>
          </div>

          <div className="section-card p-4">
            <SectionTitle>Client Onboarding Details</SectionTitle>
            <div className="mt-2 divide-y divide-hairline">
              <InfoRow label="Preferred Location" value={client.onboarding.preferredLocation} />
              <InfoRow label="Preferred Neighbour" value={client.onboarding.preferredNeighbour} />
              <InfoRow label="Property Type" value={client.onboarding.propertyType} />
              <InfoRow label="Bedrooms" value={client.onboarding.bedrooms} />
              <InfoRow label="Furnishing" value={client.onboarding.furnishing} />
              <InfoRow
                label="Budget"
                value={client.onboarding.budget}
                hint={budgetHint ? `changed ${budgetHint}` : null}
              />
              <InfoRow label="Shifting Timeline" value={client.onboarding.shiftingTimeline} />
            </div>
          </div>

          <div className="section-card p-4">
            <SectionTitle>Preference Signals</SectionTitle>
            <p className="mt-0.5 text-xs text-ink-muted">Said on the left. Doing on the right.</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-ink-muted">Said</p>
                <p className="mt-1 text-ink">{client.onboarding.budget}</p>
                <p className="text-ink">{client.onboarding.preferredLocation}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted">Doing</p>
                <p className="mt-1 text-ink">{client.observed?.browsingBudget ?? "—"}</p>
                <p className="text-ink">
                  {(client.observed?.browsingLocations ?? []).join(", ") || "—"}
                </p>
              </div>
            </div>
            {mismatches.length > 0 && (
              <ul className="mt-3 space-y-1">
                {mismatches.map((line) => (
                  <li
                    key={line}
                    className="rounded-md bg-status-warningBg px-2 py-1.5 text-xs text-status-warning"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="section-card p-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Pinned Documents</SectionTitle>
              <button className="text-xs font-semibold text-primary hover:underline">
                View all
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {PINNED_DOCS.map((doc) => (
                <div
                  key={doc.title}
                  className={cn(
                    "flex items-center gap-3 rounded-[10px] border border-hairline p-3",
                    doc.bg,
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-ink-muted">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{doc.title}</p>
                    <p className="truncate text-xs text-ink-muted">{doc.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="section-card flex min-h-[480px] min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
          <div className="flex shrink-0 items-center gap-2 border-b border-hairline p-3">
            <div className="flex flex-1 items-center gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn("tab-underline", tab === t && "tab-underline-active")}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white transition-colors hover:bg-primary-700"
              aria-label="Add"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "Overview" && (
            <TabPanel>
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <SectionTitle>Documented Report</SectionTitle>
                    <p className="mt-0.5 text-sm text-ink-muted">Last Updated: 12th February 2026</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-outline">
                      Download <Download size={16} />
                    </button>
                    <button className="icon-btn rounded-[10px]" aria-label="Share">
                      <Share2 size={16} />
                    </button>
                    <button className="icon-btn rounded-[10px]" aria-label="More">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-hairline" />

              <div>
                <SectionTitle>Latest Tasks</SectionTitle>
                <div className="mt-2 space-y-1">
                  {clientTasks.length === 0 && (
                    <p className="text-sm text-ink-muted">No follow-ups yet. Accept a lead with a date to add one.</p>
                  )}
                  {clientTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-center gap-2.5 py-1.5 text-left text-sm"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                          task.done
                            ? "border-primary bg-primary text-white"
                            : "border-ink-soft",
                        )}
                      >
                        {task.done && <span className="text-[10px] leading-none">✓</span>}
                      </span>
                      <span className={cn("text-ink", task.done && "text-ink-muted line-through")}>
                        {task.text}
                        <span className="ml-2 text-xs text-ink-muted">Due {task.dueDate}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <SectionTitle>Property Preferences</SectionTitle>
                  <button className="text-xs font-semibold text-primary hover:underline">
                    View all
                  </button>
                </div>
                <div className="mt-3 min-w-0 overflow-x-auto pb-1">
                  <div className="flex gap-3">
                    {client.properties.map((property) => (
                      <PropertyCard key={property.id} property={property} className="w-56 shrink-0" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <SectionTitle>Latest Activity</SectionTitle>
                <div className="mt-3 space-y-4 border-l border-hairline pl-5">
                  {activity.map((item, i) => (
                    <div key={item.date} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-surface",
                          i === 0 ? "bg-accentAmber" : "bg-accentGreen",
                        )}
                      />
                      <p className="text-sm text-ink">
                        <span className="font-semibold">{item.date}:</span> {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabPanel>
          )}

          {tab === "Progress History" && (
            <TabPanel>
              <SectionTitle>Progress History</SectionTitle>
              <div className="mt-3 space-y-3">
                {PROGRESS_HISTORY.map((item) => (
                  <div key={item.date} className="rounded-[10px] border border-hairline p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">{item.stage}</span>
                      <span className="text-xs text-ink-soft">{item.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{item.note}</p>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}

          {tab === "Client Notes" && (
            <TabPanel>
              <SectionTitle>Client Notes</SectionTitle>
              <div className="mt-3 space-y-3">
                {CLIENT_NOTES.map((note) => (
                  <div key={note.date} className="rounded-[10px] bg-sidebar p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{note.author}</span>
                      <span className="text-xs text-ink-soft">{note.date}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-ink-muted">{note.text}</p>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}

          {tab === "Appointments" && (
            <TabPanel>
              <SectionTitle>Upcoming Appointments</SectionTitle>
              <div className="mt-3 space-y-2">
                {APPOINTMENTS.map((appt) => (
                  <div
                    key={`${appt.date}-${appt.time}`}
                    className="flex flex-col gap-1 rounded-[10px] border border-hairline p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{appt.title}</p>
                      <p className="text-xs text-ink-muted">{appt.location}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium text-ink">{appt.date}</p>
                      <p className="text-ink-soft">{appt.time} · {appt.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}

          {tab === "Documentation" && (
            <TabPanel>
              <SectionTitle>Documentation</SectionTitle>
              <div className="mt-3 divide-y divide-hairline rounded-[10px] border border-hairline">
                {DOCUMENTATION.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between gap-3 px-3 py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-ink-soft">Updated {doc.updated}</p>
                    </div>
                    <span className="pill bg-status-activeBg text-status-active">{doc.status}</span>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}

          {tab === "Log History" && (
            <TabPanel>
              <SectionTitle>Log History</SectionTitle>
              <div className="mt-3 space-y-3 border-l border-hairline pl-5">
                {LOG_HISTORY.map((log, i) => (
                  <div key={log.time} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-surface",
                        i === 0 ? "bg-accentAmber" : "bg-accentGreen",
                      )}
                    />
                    <p className="text-sm text-ink">{log.action}</p>
                    <p className="text-xs text-ink-soft">{log.time} · {log.by}</p>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}

          {tab === "Legal" && (
            <TabPanel>
              <SectionTitle>Legal</SectionTitle>
              <div className="mt-3 space-y-2">
                {LEGAL_RECORDS.map((record) => (
                  <div
                    key={record.title}
                    className="flex flex-col gap-1 rounded-[10px] border border-hairline p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm font-medium text-ink">{record.title}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="pill bg-doc-cream text-primary">{record.status}</span>
                      <span className="text-ink-soft">Reviewed {record.lastReview}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
