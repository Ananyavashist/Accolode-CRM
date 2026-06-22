import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Client, Conversation, Lead, AddClientInput } from "@/types";
import { SEED_CLIENTS, SEED_CONVERSATIONS, SEED_LEADS } from "@/data/seed";

interface CrmState {
  leads: Lead[];
  clients: Client[];
  conversations: Conversation[];
  acceptedLeadIds: string[];
}

interface CrmContextValue extends CrmState {
  acceptLead: (leadId: string) => string | undefined;
  deprioritiseLead: (leadId: string) => string | undefined;
  addClient: (input: AddClientInput) => string;
  updateClient: (id: string, patch: Partial<Pick<Client, "status" | "progressStage">>) => void;
  getClient: (id: string) => Client | undefined;
  sendMessage: (conversationId: string, text: string) => void;
  newLeadCount: number;
}

const STORAGE_KEY = "deal-meridian-crm-v2";

const CrmContext = createContext<CrmContextValue | null>(null);

function loadState(): CrmState {
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CrmState>;
        return {
          leads: parsed.leads ?? SEED_LEADS,
          clients: parsed.clients ?? SEED_CLIENTS,
          conversations: parsed.conversations ?? SEED_CONVERSATIONS,
          acceptedLeadIds: parsed.acceptedLeadIds ?? [],
        };
      }
    } catch {
      // ignore malformed storage
    }
  }
  return {
    leads: SEED_LEADS,
    clients: SEED_CLIENTS,
    conversations: SEED_CONVERSATIONS,
    acceptedLeadIds: [],
  };
}

function genClientId(): string {
  return `#${Math.floor(100000 + Math.random() * 899999)}`;
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CrmState>(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const acceptLead = useCallback(
    (leadId: string) => {
      let newClientId: string | undefined;
      setState((prev) => {
        const lead = prev.leads.find((l) => l.id === leadId);
        if (!lead) return prev;
        const clientKey = `client-${lead.id}`;
        newClientId = clientKey;
        const client: Client = {
          id: clientKey,
          clientId: genClientId(),
          name: lead.name,
          avatar: lead.avatar,
          category: lead.dealType === "Rent" ? "Renter" : "Buyer",
          status: "Active Lead",
          propertyType: lead.bhk,
          location: lead.location,
          budget: lead.budget,
          email: lead.email,
          phone: lead.phone,
          city: lead.city,
          progressStage: "Qualified",
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
        };
        return {
          ...prev,
          leads: prev.leads.filter((l) => l.id !== leadId),
          clients: [client, ...prev.clients],
          acceptedLeadIds: [...prev.acceptedLeadIds, leadId],
        };
      });
      return newClientId;
    },
    [],
  );

  const deprioritiseLead = useCallback((leadId: string) => {
    let leadName: string | undefined;
    setState((prev) => {
      const lead = prev.leads.find((l) => l.id === leadId);
      if (!lead) return prev;
      leadName = lead.name;
      const updated = { ...lead, intent: "Low" as const };
      const rest = prev.leads.filter((l) => l.id !== leadId);
      return {
        ...prev,
        leads: [...rest, updated],
      };
    });
    return leadName;
  }, []);

  const addClient = useCallback((input: AddClientInput) => {
    const id = `client-new-${Date.now()}`;
    const budgetLabel = `₹${Math.round(input.priceMin / 1000)}K - ${input.priceMax >= 1000000 ? "10L+" : `₹${Math.round(input.priceMax / 1000)}K`}`;
    const client: Client = {
      id,
      clientId: genClientId(),
      name: `${input.locality} ${input.bedrooms} Client`,
      category: input.dealType === "Rent" ? "Renter" : "Buyer",
      status: "Awaiting Action",
      propertyType: `${input.houseType}, ${input.bedrooms}`,
      location: input.locality,
      budget: budgetLabel,
      email: "newclient@email.com",
      phone: "+91 9000000000",
      city: `${input.locality}, ${input.city}`,
      progressStage: "New",
      onboarding: {
        preferredLocation: input.locality,
        preferredNeighbour: input.locality,
        propertyType: `${input.houseType}, ${input.bedrooms}`,
        bedrooms: input.bedrooms,
        furnishing: input.furnishing,
        budget: budgetLabel,
        shiftingTimeline: input.availableFromMonths >= 12 ? "1 year" : `${input.availableFromMonths} months`,
      },
      properties: [],
    };
    setState((prev) => ({
      ...prev,
      clients: [client, ...prev.clients],
    }));
    return id;
  }, []);

  const updateClient = useCallback(
    (id: string, patch: Partial<Pick<Client, "status" | "progressStage">>) => {
      setState((prev) => ({
        ...prev,
        clients: prev.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }));
    },
    [],
  );

  const getClient = useCallback(
    (id: string) => state.clients.find((c) => c.id === id),
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

  const value = useMemo<CrmContextValue>(
    () => ({
      ...state,
      acceptLead,
      deprioritiseLead,
      addClient,
      updateClient,
      getClient,
      sendMessage,
      newLeadCount: state.leads.length,
    }),
    [state, acceptLead, deprioritiseLead, addClient, updateClient, getClient, sendMessage],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
