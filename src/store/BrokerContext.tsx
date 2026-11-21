import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BROKER_STORAGE_KEY,
  type BrokerAuthSession,
  type BrokerPersistedState,
  type BrokerProfile,
} from "@/types/broker";

function nowIso(): string {
  return new Date().toISOString();
}

export function createEmptyBrokerProfile(partial?: Partial<BrokerProfile>): BrokerProfile {
  return {
    fullName: "",
    phone: "",
    email: "",
    practiceType: "independent",
    agencyName: "",
    reraNumber: "",
    yearsInRealEstate: 0,
    cities: [],
    outsideAreasPolicy: "budget_only",
    dealTypes: [],
    propertyTypes: [],
    bhkSizes: [],
    furnishingOptions: [],
    languages: [],
    techComfort: false,
    clientsManagedOnline: 0,
    clientsManagedInPerson: 0,
    listingCount: 0,
    listingImportChoice: "later",
    listingFiles: [],
    updatedAt: nowIso(),
    ...partial,
  };
}

const DEMO_SEED: BrokerProfile = {
  fullName: "Rakesh Verma",
  phone: "+91 98765 43210",
  email: "rakesh@accolade.demo",
  practiceType: "independent",
  reraNumber: "DLRERA2024-001",
  yearsInRealEstate: 8,
  cities: [{ city: "Delhi", areas: ["Connaught Place", "Saket"] }],
  outsideAreasPolicy: "budget_only",
  dealTypes: ["rent", "buy"],
  propertyTypes: ["Apartment", "Builder floor", "Villa"],
  bhkSizes: ["2BHK", "3BHK", "4BHK+"],
  furnishingOptions: ["Any"],
  languages: ["English", "Hindi"],
  techComfort: true,
  clientsManagedOnline: 120,
  clientsManagedInPerson: 85,
  listingCount: 24,
  listingImportChoice: "later",
  listingFiles: [],
  updatedAt: nowIso(),
};

function loadState(): BrokerPersistedState {
  try {
    const raw = localStorage.getItem(BROKER_STORAGE_KEY);
    if (!raw) {
      return { profile: DEMO_SEED, session: null };
    }
    return JSON.parse(raw) as BrokerPersistedState;
  } catch {
    return { profile: DEMO_SEED, session: null };
  }
}

function saveState(state: BrokerPersistedState) {
  localStorage.setItem(BROKER_STORAGE_KEY, JSON.stringify(state));
}

interface BrokerContextValue {
  profile: BrokerProfile;
  session: BrokerAuthSession | null;
  isOnboardingComplete: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  patchProfile: (patch: Partial<BrokerProfile>) => void;
  setProfile: (profile: BrokerProfile) => void;
  completeOnboarding: (profile: BrokerProfile) => void;
}

const BrokerContext = createContext<BrokerContextValue | null>(null);

export function BrokerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrokerPersistedState>(loadState);

  const persist = useCallback((next: BrokerPersistedState) => {
    setState(next);
    saveState(next);
  }, []);

  const login = useCallback(
    (email: string) => {
      const session: BrokerAuthSession = { email: email.trim(), signedInAt: nowIso() };
      const profile = state.profile.onboardingCompletedAt
        ? { ...state.profile, email: email.trim(), updatedAt: nowIso() }
        : createEmptyBrokerProfile({ email: email.trim() });
      persist({ profile, session });
      return Boolean(profile.onboardingCompletedAt);
    },
    [persist, state.profile],
  );

  const logout = useCallback(() => {
    persist({ ...state, session: null });
  }, [persist, state]);

  const patchProfile = useCallback(
    (patch: Partial<BrokerProfile>) => {
      persist({
        ...state,
        profile: { ...state.profile, ...patch, updatedAt: nowIso() },
      });
    },
    [persist, state],
  );

  const setProfile = useCallback(
    (profile: BrokerProfile) => {
      persist({ ...state, profile: { ...profile, updatedAt: nowIso() } });
    },
    [persist, state],
  );

  const completeOnboarding = useCallback(
    (profile: BrokerProfile) => {
      persist({
        session: state.session,
        profile: {
          ...profile,
          onboardingCompletedAt: nowIso(),
          updatedAt: nowIso(),
        },
      });
    },
    [persist, state.session],
  );

  const value = useMemo(
    () => ({
      profile: state.profile,
      session: state.session,
      isOnboardingComplete: Boolean(state.profile.onboardingCompletedAt),
      login,
      logout,
      patchProfile,
      setProfile,
      completeOnboarding,
    }),
    [state, login, logout, patchProfile, setProfile, completeOnboarding],
  );

  return <BrokerContext.Provider value={value}>{children}</BrokerContext.Provider>;
}

export function useBroker(): BrokerContextValue {
  const ctx = useContext(BrokerContext);
  if (!ctx) throw new Error("useBroker must be used within BrokerProvider");
  return ctx;
}