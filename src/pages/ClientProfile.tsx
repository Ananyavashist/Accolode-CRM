import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Share2,
} from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PillDropdown } from "@/components/ui/PillDropdown";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { useCrm } from "@/store/CrmContext";
import { messagesPathForClient } from "@/lib/clientChat";
import {
  CONVERSION_STATUS_OPTIONS,
  PROGRESS_STAGE_OPTIONS,
  type ConversionStatus,
  type ProgressStage,
} from "@/types";
import {
  APPOINTMENTS,
  CLIENT_NOTES,
  DOCUMENTATION,
  LEGAL_RECORDS,
  LOG_HISTORY,
  PROGRESS_HISTORY,
  activityForClient,
  tasksForClient,
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[125px_1fr] gap-2 py-[7px] text-sm">
      <span className="text-ink-soft">{label}</span>
      <span className="font-medium text-ink">: {value}</span>
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
      <span className="text-ink-soft">{label}</span>
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

const STATUS_PILL_STYLES: Record<string, string> = {
  "Awaiting Action": "bg-status-awaitingBg text-status-awaiting",
  "Active Lead": "bg-status-activeBg text-status-active",
  "Completed Client": "bg-status-completedBg text-status-completed",
  Completed: "bg-status-completedBg text-status-completed",
};

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-ink">{children}</h3>;
}

function TabPanel({ children }: { children: ReactNode }) {
  return <div className="space-y-6 p-4">{children}</div>;
}

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClient, conversations, updateClient } = useCrm();
  const client = id ? getClient(id) : undefined;
  const [tab, setTab] = useState<Tab>("Overview");
  const [doneTasks, setDoneTasks] = useState<Set<number>>(new Set());

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

  const tasks = tasksForClient(client.name);
  const activity = activityForClient(client.name, client.location);

  return (
    <div className="space-y-section p-section">
      <Breadcrumb
        items={[
          { label: "Client Database", to: "/clients" },
          { label: client.name },
        ]}
      />

      <div className="section-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/clients")} className="icon-btn" aria-label="Back to Client Database">
            <ArrowLeft size={18} />
          </button>
          <Avatar name={client.name} src={client.avatar} size={48} />
          <div>
            <h1 className="text-ink">{client.name}</h1>
            <p className="text-sm text-ink-muted">Client ID: {client.clientId}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(messagesPathForClient(client.name, conversations))}
          className="btn-primary"
        >
          messages <MessageSquare size={16} />
        </button>
      </div>

      <div className="flex w-full min-w-0 flex-col gap-section lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-col gap-section lg:w-[35%] lg:shrink-0 lg:grow-0">
          <div className="section-card p-4">
            <SectionTitle>Personal Information</SectionTitle>
            <div className="mt-2 divide-y divide-hairline">
              <InfoRow label="Client Type" value={client.category} />
              <InfoRow label="Email Address" value={client.email} />
              <InfoRow label="Phone Number" value={client.phone} />
              <InfoRow label="Current City" value={client.city} />
              <BadgeRow
                label="Conversion Status"
                value={client.status}
                options={[...CONVERSION_STATUS_OPTIONS]}
                className={STATUS_PILL_STYLES[client.status] ?? "bg-hairline text-ink-muted"}
                ariaLabel="Conversion status"
                onChange={(status) =>
                  updateClient(client.id, { status: status as ConversionStatus })
                }
              />
              <BadgeRow
                label="Progress Stage"
                value={client.progressStage}
                options={[...PROGRESS_STAGE_OPTIONS]}
                className="bg-doc-cream text-primary"
                ariaLabel="Progress stage"
                onChange={(progressStage) =>
                  updateClient(client.id, { progressStage: progressStage as ProgressStage })
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
              <InfoRow label="Budget" value={client.onboarding.budget} />
              <InfoRow label="Shifting Timeline" value={client.onboarding.shiftingTimeline} />
            </div>
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
        </div>

        <div className="section-card flex min-h-[640px] min-w-0 flex-1 flex-col overflow-hidden lg:min-h-[720px]">
          <div className="flex shrink-0 items-center gap-2 border-b border-hairline p-3">
            <div className="flex flex-1 items-center gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "whitespace-nowrap rounded-[10px] px-3 py-2 text-sm font-medium transition-colors",
                    tab === t
                      ? "bg-primary/5 text-primary"
                      : "text-ink-muted hover:bg-sidebar hover:text-ink",
                  )}
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
                  {tasks.map((task, i) => (
                    <button
                      key={task}
                      onClick={() =>
                        setDoneTasks((prev) => {
                          const next = new Set(prev);
                          next.has(i) ? next.delete(i) : next.add(i);
                          return next;
                        })
                      }
                      className="flex w-full items-center gap-2.5 py-1.5 text-left text-sm"
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                          doneTasks.has(i)
                            ? "border-primary bg-primary text-white"
                            : "border-ink-soft",
                        )}
                      >
                        {doneTasks.has(i) && <span className="text-[10px] leading-none">✓</span>}
                      </span>
                      <span className={cn("text-ink", doneTasks.has(i) && "line-through text-ink-soft")}>
                        {task}
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
