import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  AddClientInput,
  Client,
  ClientSource,
  Conversation,
  FirstStepId,
  FirstSteps,
  Lead,
  ProgressStage,
  Task,
  WhatsAppSend,
} from "@/types";
import { SEED_CLIENTS, SEED_CONVERSATIONS, SEED_LEADS } from "@/data/seed";
import {
  deriveMoveInDate,
  inferClientSource,
  normalizeClientSource,
} from "@/lib/clientSource";
import {
  acceptBlockedReason as getAcceptBlockReason,
  type CapacityBlockReason,
} from "@/lib/brokerCapacity";
import { getPendingRoutedLeads } from "@/lib/brokerRouting";
import { enrichLeadProfile } from "@/lib/leadProfileEnrich";
import { normalizeLead } from "@/lib/leadNormalize";
import {
  addDaysISO,
  normalizeStage,
  personSlug,
  statusFromStage,
  todayISO,
  withDerivedStatus,
} from "@/lib/pipeline";
import type { LeadRejectionReason } from "@/types";

interface CrmState {
  leads: Lead[];
  clients: Client[];
  conversations: Conversation[];
  acceptedLeadIds: string[];
  tasks: Task[];
  whatsappSends: WhatsAppSend[];
  firstSteps: FirstSteps;
}

interface CrmContextValue extends CrmState {
  acceptLead: (leadId: string, followUpDate?: string) => string | undefined;
  undoAccept: (clientId: string, revertLeadStatus?: "new" | "deprioritised") => void;
  deprioritiseLead: (leadId: string) => string | undefined;
  rejectLead: (leadId: string, reason: LeadRejectionReason) => string | undefined;
  capacityBlock: CapacityBlockReason;
  refreshLeadActivity: () => void;
  resurfaceDeprioritisedLead: (leadId: string) => void;
  addClient: (input: AddClientInput) => string;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
  setProgressStage: (id: string, stage: ProgressStage) => void;
  getClient: (id: string) => Client | undefined;
  sendMessage: (conversationId: string, text: string) => void;
  addTask: (task: Omit<Task, "id">) => string;
  toggleTask: (id: string) => void;
  logWhatsApp: (send: Omit<WhatsAppSend, "id" | "sentAt">) => void;
  completeStep: (id: FirstStepId) => void;
  newLeadCount: number;
}

const STORAGE_KEY = "accolode-crm-v7";

const EMPTY_STEPS: FirstSteps = {
  triage: false,
  followUp: false,
  saidDoing: false,
  siteVisit: false,
  walkIn: false,
  whatsapp: false,
};

const CrmContext = createContext<CrmContextValue | null>(null);

function defaultObserved(client: Client): Client["observed"] {
  const first = client.properties[0];
  const mismatch =
    first && !client.onboarding.preferredLocation.toLowerCase().includes(first.location.toLowerCase());
  return {
    browsingBudget: client.budget.includes("80K") ? "₹1.2L" : client.budget,
    browsingLocations: first
      ? mismatch
        ? [first.location]
        : [client.onboarding.preferredLocation]
      : [client.location],
    viewedProperties: client.properties.length || 3,
    lastActiveAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  };
}

function normalizeClient(client: Client): Client {
  const progressStage = normalizeStage(client.progressStage);
  const source = inferClientSource(client);
  const moveInDate = deriveMoveInDate({ ...client, source });
  return {
    ...client,
    progressStage,
    source,
    moveInDate,
    status: statusFromStage(progressStage),
    lastTouchedAt:
      client.lastTouchedAt ??
      new Date(Date.now() - 30 * 86_400_000).toISOString(),
    observed: client.observed ?? defaultObserved(client),
    onboarding: {
      ...client.onboarding,
      updatedAt: client.onboarding.updatedAt ?? {
        budget: new Date(Date.now() - 14 * 86_400_000).toISOString(),
      },
    },
  };
}

function seedTasks(clients: Client[]): Task[] {
  const first = clients[0];
  const second = clients[1];
  const third = clients[2];
  const tasks: Task[] = [];
  if (first) {
    tasks.push({
      id: "task-overdue",
      clientId: first.id,
      text: `Call ${first.name} about site visit`,
      dueDate: addDaysISO(-1),
      done: false,
    });
  }
  if (second) {
    tasks.push({
      id: "task-today",
      clientId: second.id,
      text: `Send ${second.name} a shortlist`,
      dueDate: todayISO(),
      done: false,
    });
  }
  if (third) {
    tasks.push({
      id: "task-soon",
      clientId: third.id,
      text: `Follow up with ${third.name}`,
      dueDate: addDaysISO(2),
      done: false,
    });
  }
  return tasks;
}

function applyResurface(leads: Lead[]): Lead[] {
  return leads.map((lead) => {
    if (lead.status !== "deprioritised") return lead;
    const baseline = lead.viewedPropertiesAtDeprioritise ?? lead.viewedProperties;
    if (lead.viewedProperties > baseline) {
      const extra = lead.viewedProperties - baseline;
      return {
        ...lead,
        status: "new" as const,
        returnedReason: `Viewed ${extra} more ${extra === 1 ? "property" : "properties"}`,
        deprioritisedAt: undefined,
        viewedPropertiesAtDeprioritise: undefined,
      };
    }
    return lead;
  });
}

/** Backfill new seed fields onto leads restored from localStorage. */
function mergeLeadWithSeed(stored: Lead): Lead {
  const seed = SEED_LEADS.find((s) => s.id === stored.id);
  if (!seed) return stored;
  return enrichLeadProfile({
    ...seed,
    ...stored,
    preference: { ...seed.preference, ...stored.preference },
    mustHaves: stored.mustHaves?.length ? stored.mustHaves : seed.mustHaves,
    inquiryDetails: stored.inquiryDetails ?? seed.inquiryDetails,
  });
}

function loadState(): CrmState {
  const fresh = (): CrmState => {
    const clients = SEED_CLIENTS.map(normalizeClient);
    return {
      leads: SEED_LEADS.map(normalizeLead),
      clients,
      conversations: SEED_CONVERSATIONS,
      acceptedLeadIds: [],
      tasks: seedTasks(clients),
      whatsappSends: [],
      firstSteps: { ...EMPTY_STEPS },
    };
  };

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CrmState>;
        return {
          leads: applyResurface(
            (parsed.leads ?? SEED_LEADS).map((l) => normalizeLead(mergeLeadWithSeed(l))),
          ),
          clients: (parsed.clients ?? SEED_CLIENTS).map(normalizeClient),
          conversations: parsed.conversations ?? SEED_CONVERSATIONS,
          acceptedLeadIds: parsed.acceptedLeadIds ?? [],
          tasks: parsed.tasks ?? seedTasks((parsed.clients ?? SEED_CLIENTS).map(normalizeClient)),
          whatsappSends: parsed.whatsappSends ?? [],
          firstSteps: { ...EMPTY_STEPS, ...parsed.firstSteps },
        };
      }
    } catch {
      // ignore malformed storage
    }
  }
  return fresh();
}

function genClientId(): string {
  return `#${Math.floor(100000 + Math.random() * 899999)}`;
}

function sourceFromLead(lead: Lead): ClientSource {
  if (lead.source === "ShiftHona") return "ShiftHona";
  if (lead.source === "Magicbricks" || lead.source === "99acres") return "Link";
  return "Manual";
}

function clientFromLead(lead: Lead): Client {
  const progressStage = "Qualified" as const;
  return normalizeClient({
    id: `client-${lead.id}`,
    clientId: genClientId(),
    name: lead.name,
    avatar: lead.avatar,
    category: lead.dealType === "Rent" ? "Renter" : "Buyer",
    status: statusFromStage(progressStage),
    propertyType: lead.bhk,
    location: lead.location,
    budget: lead.budget,
    email: lead.email,
    phone: lead.phone,
    city: lead.city,
    progressStage,
    source: sourceFromLead(lead),
    lastTouchedAt: new Date().toISOString(),
    onboarding: {
      preferredLocation: lead.location,
      preferredNeighbour: lead.location,
      propertyType: lead.preference.propertyType,
      bedrooms: lead.bhk,
      furnishing: "Semi Furnished",
      budget: lead.budget,
      shiftingTimeline: lead.preference.timeline,
    },
    properties: lead.properties,
  });
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrmState>(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => {
        const leads = prev.leads.map(normalizeLead);
        const changed = leads.some(
          (l, i) =>
            l.status !== prev.leads[i]?.status ||
            l.movedOnAt !== prev.leads[i]?.movedOnAt,
        );
        return changed ? { ...prev, leads } : prev;
      });
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const completeStep = useCallback((id: FirstStepId) => {
    setState((prev) => {
      if (prev.firstSteps[id]) return prev;
      return { ...prev, firstSteps: { ...prev.firstSteps, [id]: true } };
    });
  }, []);

  const acceptLead = useCallback(
    (leadId: string, followUpDate?: string) => {
      let newClientId: string | undefined;
      setState((prev) => {
        if (getAcceptBlockReason(prev.clients, prev.leads)) return prev;
        const lead = prev.leads.find((l) => l.id === leadId);
        if (!lead || lead.status === "accepted") return prev;
        const client = clientFromLead(lead);
        newClientId = client.id;
        const task: Task | null = followUpDate
          ? {
              id: `task-${Date.now()}`,
              clientId: client.id,
              text: `Follow up with ${lead.name}`,
              dueDate: followUpDate,
              done: false,
            }
          : null;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === leadId
              ? { ...l, status: "accepted" as const, acceptedAt: new Date().toISOString() }
              : l,
          ),
          clients: [client, ...prev.clients],
          acceptedLeadIds: [...prev.acceptedLeadIds, leadId],
          tasks: task ? [task, ...prev.tasks] : prev.tasks,
          firstSteps: {
            ...prev.firstSteps,
            triage: true,
            followUp: task ? true : prev.firstSteps.followUp,
          },
        };
      });
      return newClientId;
    },
    [],
  );

  const undoAccept = useCallback(
    (clientId: string, revertLeadStatus: "new" | "deprioritised" = "new") => {
      setState((prev) => {
        const leadId = clientId.replace(/^client-/, "");
        return {
          ...prev,
          clients: prev.clients.filter((c) => c.id !== clientId),
          tasks: prev.tasks.filter((t) => t.clientId !== clientId),
          leads: prev.leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  status: revertLeadStatus,
                  acceptedAt: undefined,
                  ...(revertLeadStatus === "deprioritised" && !l.deprioritisedAt
                    ? { deprioritisedAt: new Date().toISOString() }
                    : {}),
                }
              : l,
          ),
          acceptedLeadIds: prev.acceptedLeadIds.filter((id) => id !== leadId),
        };
      });
    },
    [],
  );

  const deprioritiseLead = useCallback((leadId: string) => {
    let leadName: string | undefined;
    setState((prev) => {
      const lead = prev.leads.find((l) => l.id === leadId);
      if (!lead) return prev;
      leadName = lead.name;
      return {
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status: "deprioritised" as const,
                deprioritisedAt: new Date().toISOString(),
                viewedPropertiesAtDeprioritise: l.viewedProperties,
                returnedReason: undefined,
              }
            : l,
        ),
        firstSteps: { ...prev.firstSteps, triage: true },
      };
    });
    return leadName;
  }, []);

  const rejectLead = useCallback((leadId: string, reason: LeadRejectionReason) => {
    let leadName: string | undefined;
    setState((prev) => {
      const lead = prev.leads.find((l) => l.id === leadId);
      if (!lead) return prev;
      leadName = lead.name;
      return {
        ...prev,
        leads: prev.leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status: "rejected" as const,
                rejectionReason: reason,
                returnedReason: undefined,
              }
            : l,
        ),
        firstSteps: { ...prev.firstSteps, triage: true },
      };
    });
    return leadName;
  }, []);

  const refreshLeadActivity = useCallback(() => {
    setState((prev) => ({
      ...prev,
      leads: applyResurface(
        prev.leads.map((l) =>
          l.status === "deprioritised"
            ? { ...l, viewedProperties: l.viewedProperties + 2 }
            : l,
        ),
      ),
    }));
  }, []);

  const resurfaceDeprioritisedLead = useCallback((leadId: string) => {
    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((l) =>
        l.id === leadId && l.status === "deprioritised"
          ? {
              ...l,
              status: "new" as const,
              deprioritisedAt: undefined,
              viewedPropertiesAtDeprioritise: undefined,
              assignedAt: new Date().toISOString(),
            }
          : l,
      ),
    }));
  }, []);

  const addClient = useCallback((input: AddClientInput) => {
    const id = `client-new-${Date.now()}`;
    const budgetLabel =
      input.priceMax >= 1000000
        ? `Up to 10L+`
        : `Up to ₹${Math.round(input.priceMax / 1000)}K`;
    const walkInSources: ClientSource[] = ["Manual"];
    const client = normalizeClient({
      id,
      clientId: genClientId(),
      name: input.name,
      category: input.dealType === "Rent" ? "Renter" : "Buyer",
      status: "Active Lead",
      propertyType: `${input.houseType}, ${input.bedrooms}`,
      location: input.locality,
      budget: budgetLabel,
      email: input.email || "None",
      phone: input.phone,
      city: `${input.locality}, ${input.city}`,
      progressStage: "New",
      source: normalizeClientSource(input.source),
      moveInDate: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + Math.max(0, input.availableFromMonths));
        return d.toISOString().slice(0, 10);
      })(),
      lastTouchedAt: new Date().toISOString(),
      onboarding: {
        preferredLocation: input.locality,
        preferredNeighbour: input.locality,
        propertyType: `${input.houseType}, ${input.bedrooms}`,
        bedrooms: input.bedrooms,
        furnishing: input.furnishing,
        budget: budgetLabel,
        shiftingTimeline:
          input.availableFromMonths >= 12
            ? "1 year"
            : `${input.availableFromMonths} months`,
      },
      properties: [],
    });
    setState((prev) => ({
      ...prev,
      clients: [client, ...prev.clients],
      firstSteps: {
        ...prev.firstSteps,
        walkIn: walkInSources.includes(input.source) ? true : prev.firstSteps.walkIn,
      },
    }));
    return id;
  }, []);

  const updateClient = useCallback((id: string, patch: Partial<Client>) => {
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === id ? withDerivedStatus({ ...c, ...patch, lastTouchedAt: new Date().toISOString() }) : c,
      ),
    }));
  }, []);

  const removeClient = useCallback((id: string) => {
    setState((prev) => {
      const leadId = id.replace(/^client-/, "");
      const hadLead = prev.leads.some((l) => l.id === leadId);
      return {
        ...prev,
        clients: prev.clients.filter((c) => c.id !== id),
        tasks: prev.tasks.filter((t) => t.clientId !== id),
        leads: hadLead
          ? prev.leads.map((l) => (l.id === leadId ? { ...l, status: "new" as const } : l))
          : prev.leads,
        acceptedLeadIds: prev.acceptedLeadIds.filter((x) => x !== leadId),
      };
    });
  }, []);

  const setProgressStage = useCallback((id: string, stage: ProgressStage) => {
    const next = normalizeStage(stage);
    setState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === id
          ? withDerivedStatus({
              ...c,
              progressStage: next,
              lastTouchedAt: new Date().toISOString(),
            })
          : c,
      ),
      firstSteps: {
        ...prev.firstSteps,
        siteVisit: next === "Site Visit" ? true : prev.firstSteps.siteVisit,
      },
    }));
  }, []);

  const getClient = useCallback(
    (key: string) =>
      state.clients.find((c) => c.id === key) ??
      state.clients.find((c) => personSlug(c.name) === key),
    [state.clients],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              preview: trimmed,
              time: "now",
              messages: [
                ...conv.messages,
                { id: `m-${Date.now()}`, from: "broker" as const, text: trimmed, time },
              ],
            }
          : conv,
      ),
    }));
  }, []);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    const id = `task-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      tasks: [{ ...task, id }, ...prev.tasks],
      firstSteps: { ...prev.firstSteps, followUp: true },
    }));
    return id;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const logWhatsApp = useCallback((send: Omit<WhatsAppSend, "id" | "sentAt">) => {
    setState((prev) => ({
      ...prev,
      whatsappSends: [
        {
          ...send,
          id: `wa-${Date.now()}`,
          sentAt: new Date().toISOString(),
        },
        ...prev.whatsappSends,
      ],
      firstSteps: { ...prev.firstSteps, whatsapp: true },
    }));
  }, []);

  const newLeadCount = getPendingRoutedLeads(state.leads).length;
  const capacityBlock = getAcceptBlockReason(state.clients, state.leads);

  const value = useMemo<CrmContextValue>(
    () => ({
      ...state,
      acceptLead,
      undoAccept,
      deprioritiseLead,
      rejectLead,
      refreshLeadActivity,
      resurfaceDeprioritisedLead,
      capacityBlock,
      addClient,
      updateClient,
      removeClient,
      setProgressStage,
      getClient,
      sendMessage,
      addTask,
      toggleTask,
      logWhatsApp,
      completeStep,
      newLeadCount,
    }),
    [
      state,
      capacityBlock,
      acceptLead,
      undoAccept,
      deprioritiseLead,
      rejectLead,
      refreshLeadActivity,
      resurfaceDeprioritisedLead,
      addClient,
      updateClient,
      removeClient,
      setProgressStage,
      getClient,
      sendMessage,
      addTask,
      toggleTask,
      logWhatsApp,
      completeStep,
      newLeadCount,
    ],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
