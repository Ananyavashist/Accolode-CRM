import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Messages, Pencil, Plus } from "@/components/ui/icons";
import { PillDropdown } from "@/components/ui/PillDropdown";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Avatar } from "@/components/ui/Avatar";
import { TypeChip } from "@/components/ui/StatusBadge";
import { useCrm } from "@/store/CrmContext";
import { clientProfilePath, personSlug, relativeTime } from "@/lib/pipeline";
import { PROGRESS_STAGE_OPTIONS, type ProgressStage } from "@/types";
import { PINNED_DOCUMENTS, meetingNotesForClient } from "@/data/clientProfileContent";
import { cn, formatDisplayCopy, initials } from "@/lib/utils";
import { ConfirmDialog, useConfirmAction } from "@/components/ui/ConfirmDialog";
import { ClientActivityFeed } from "@/components/client/ClientActivityFeed";
import { ClientAppointments } from "@/components/client/ClientAppointments";
import { ClientDocumentation } from "@/components/client/ClientDocumentation";
import { ClientHomesByStage } from "@/components/client/ClientHomesByStage";
import { ClientPreferenceMatchTable } from "@/components/client/ClientPreferenceMatchTable";
import { ClientProgressStageBar } from "@/components/client/ClientProgressStageBar";
import { type UserClientNote } from "@/components/client/ClientAddNotePanel";
import { ClientNotes, type NotesSection } from "@/components/client/ClientNotes";
import { useBroker } from "@/store/BrokerContext";

const TABS = [
  "Overview",
  "Activity",
  "Property stage",
  "Notes",
  "Appointments",
  "Documentation",
] as const;
type Tab = (typeof TABS)[number];

function isProfileTab(value: string | null): value is Tab {
  return Boolean(value && (TABS as readonly string[]).includes(value));
}

function profileTabSlug(t: Tab): string {
  return t.toLowerCase().replace(/\s+/g, "-");
}

function profileTabId(t: Tab): string {
  return `client-profile-tab-${profileTabSlug(t)}`;
}

function profilePanelId(t: Tab): string {
  return `client-profile-panel-${profileTabSlug(t)}`;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-base font-semibold text-ink">{children}</h3>;
}

function OnboardingInfoRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string | null;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,42%)_1fr] gap-2 py-2 text-[14px]">
      <span className="text-ink-muted">{label}</span>
      <span>
        <span className="font-medium text-ink">{formatDisplayCopy(value)}</span>
        {hint && <span className="mt-0.5 block text-[12px] text-ink-muted">{hint}</span>}
      </span>
    </div>
  );
}

function ProfileTabPanel({
  name,
  selected,
  children,
}: {
  name: Tab;
  selected: Tab;
  children: ReactNode;
}) {
  if (selected !== name) return null;
  return (
    <div
      role="tabpanel"
      id={profilePanelId(name)}
      aria-labelledby={profileTabId(name)}
      className="space-y-6 p-4"
    >
      {children}
    </div>
  );
}

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getClient, setProgressStage, completeStep, tasks, toggleTask } = useCrm();
  const { profile: brokerProfile } = useBroker();
  const client = id ? getClient(id) : undefined;
  const [tab, setTab] = useState<Tab>(() => {
    const fromUrl = searchParams.get("tab");
    return isProfileTab(fromUrl) ? fromUrl : "Overview";
  });
  const [userNotes, setUserNotes] = useState<UserClientNote[]>([]);
  const [notesSection, setNotesSection] = useState<NotesSection>("my");
  const { confirmRequest, askConfirm, closeConfirm } = useConfirmAction();

  const selectTab = (next: Tab) => {
    setTab(next);
    setSearchParams({ tab: next }, { replace: true });
  };

  useEffect(() => {
    const fromUrl = searchParams.get("tab");
    if (isProfileTab(fromUrl)) setTab(fromUrl);
  }, [searchParams]);

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
          <button onClick={() => navigate("/clients")} className="btn-primary gap-1.5">
            Back to Database
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    );
  }

  const clientTasks = tasks.filter((t) => t.clientId === client.id);
  const inboxPath = `/inbox?client=${personSlug(client.name)}`;
  const dealType = client.category === "Renter" ? "Rent" : "Buy";
  const label14 = "text-[14px] leading-none";
  const budgetHint = relativeTime(client.onboarding.updatedAt?.budget);
  const brokerName = brokerProfile.fullName.trim() || "Rakesh Verma";
  const meetingNotes = meetingNotesForClient(client.name, brokerName);
  const showOnboardingSidebar = tab === "Overview";

  return (
    <div className="page flex min-h-0 flex-1 flex-col gap-3 lg:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-[10px]">
      <div className="section-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex shrink-0 items-start gap-2">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="icon-btn mt-0.5 shrink-0"
              aria-label="Back to Database"
            >
              <ArrowLeft size={18} />
            </button>
            {client.avatar ? (
              <Avatar name={client.name} src={client.avatar} size={48} />
            ) : (
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e6dc] text-base font-semibold text-ink"
                aria-hidden
              >
                {initials(client.name)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-ink">{client.name}</h1>
                <TypeChip
                  type={dealType}
                  label={client.category}
                  showDot={false}
                  className={label14}
                />
                <PillDropdown
                  value={String(client.progressStage)}
                  options={[...PROGRESS_STAGE_OPTIONS]}
                  onChange={(progressStage) =>
                    setProgressStage(client.id, progressStage as ProgressStage)
                  }
                  className={cn("bg-status-activeBg text-status-active", label14)}
                  ariaLabel="Progress stage"
                />
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectTab("Notes")}
                  className="btn-outline !w-auto gap-1.5 text-[14px] text-ink-muted"
                >
                  Edit
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(inboxPath)}
                  className="btn-outline !w-auto gap-1.5 text-[14px] text-ink-muted"
                >
                  Message
                  <Messages size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              {client.clientId} · {client.email} · {client.phone} · {client.city}
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-end justify-between gap-3 border-b border-hairline px-1 pb-0 pt-1 sm:px-0">
        <div
          role="tablist"
          aria-label="Client profile"
          className="flex min-w-0 flex-1 items-end overflow-x-auto"
        >
          {TABS.map((t) => {
            const isSelected = tab === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                id={profileTabId(t)}
                aria-selected={isSelected}
                aria-controls={profilePanelId(t)}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => selectTab(t)}
                className={cn(
                  "profile-category-tab",
                  isSelected && "profile-category-tab-active",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="mb-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary text-white transition-colors hover:bg-primary-700"
          aria-label="Add"
        >
          <Plus size={18} />
        </button>
      </div>

      <div
        className={cn(
          "flex min-h-0 w-full min-w-0 flex-1 gap-[10px] lg:overflow-hidden",
          showOnboardingSidebar ? "flex-col lg:flex-row" : "flex-col",
        )}
      >
        {showOnboardingSidebar && (
        <aside
          className="flex min-h-0 flex-col gap-[10px] overflow-y-auto overscroll-contain lg:w-[min(100%,360px)] lg:shrink-0"
          aria-label="Client onboarding"
        >
          <div className="section-card p-4 sm:p-5">
            <SectionTitle>Client onboarding</SectionTitle>
            <div className="mt-2 divide-y divide-hairline">
              <OnboardingInfoRow
                label="Preferred location"
                value={client.onboarding.preferredLocation}
              />
              <OnboardingInfoRow
                label="Preferred neighbour"
                value={client.onboarding.preferredNeighbour}
              />
              <OnboardingInfoRow label="Property type" value={client.onboarding.propertyType} />
              <OnboardingInfoRow label="Bedrooms" value={client.onboarding.bedrooms} />
              <OnboardingInfoRow label="Furnishing" value={client.onboarding.furnishing} />
              <OnboardingInfoRow
                label="Budget"
                value={client.onboarding.budget}
                hint={budgetHint ? `Changed ${budgetHint}` : null}
              />
              <OnboardingInfoRow
                label="Shifting timeline"
                value={client.onboarding.shiftingTimeline}
              />
            </div>
          </div>
          <div className="section-card p-4 sm:p-5">
            <SectionTitle>Pinned documents</SectionTitle>
            <ul className="mt-3 space-y-3">
              {PINNED_DOCUMENTS.map((doc) => (
                <li key={doc.id} className="flex gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      doc.iconWrap,
                    )}
                  >
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-ink">
                      {formatDisplayCopy(doc.name)}
                    </p>
                    <p className="mt-0.5 text-[14px] text-ink-muted">Updated {doc.updated}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        )}

        <div className="section-card flex min-h-[400px] min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0">
          <div className="min-h-0 flex-1 overflow-y-auto">
          <ProfileTabPanel name="Overview" selected={tab}>
              <ClientProgressStageBar client={client} />
              <div>
                <SectionTitle>Latest Tasks</SectionTitle>
                <div className="mt-2 space-y-1">
                  {clientTasks.length === 0 && (
                    <p className="text-[14px] text-ink-muted">
                      No follow ups yet. Accept a lead with a date to add one.
                    </p>
                  )}
                  {clientTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() =>
                        askConfirm({
                          title: task.done ? "Mark task incomplete?" : "Mark task complete?",
                          message: task.done
                            ? `Reopen "${task.text}" on the follow up list?`
                            : `Mark "${task.text}" as done?`,
                          confirmLabel: task.done ? "Mark incomplete" : "Mark done",
                          onConfirm: () => toggleTask(task.id),
                        })
                      }
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
                  <button type="button" className="text-sm font-semibold text-ink underline">
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

              <ClientPreferenceMatchTable client={client} />
          </ProfileTabPanel>

          <ProfileTabPanel name="Activity" selected={tab}>
              <ClientActivityFeed client={client} brokerName={brokerName} />
          </ProfileTabPanel>

          <ProfileTabPanel name="Property stage" selected={tab}>
              <ClientHomesByStage
                client={client}
                brokerName={brokerName}
                title="Property stage"
                embedded
              />
          </ProfileTabPanel>

          <ProfileTabPanel name="Notes" selected={tab}>
              <ClientNotes
                clientName={client.name}
                author={brokerName}
                section={notesSection}
                onSectionChange={setNotesSection}
                userNotes={userNotes}
                onAdd={(note) => setUserNotes((prev) => [note, ...prev])}
                meetingNotes={meetingNotes}
              />
          </ProfileTabPanel>

          <ProfileTabPanel name="Appointments" selected={tab}>
              <ClientAppointments
                client={client}
                brokerName={brokerName}
                onViewNotes={() => {
                  setNotesSection("meeting");
                  selectTab("Notes");
                }}
              />
          </ProfileTabPanel>

          <ProfileTabPanel name="Documentation" selected={tab}>
              <ClientDocumentation />
          </ProfileTabPanel>
          </div>
        </div>
      </div>
      </div>
      <ConfirmDialog request={confirmRequest} onClose={closeConfirm} />
    </div>
  );
}
