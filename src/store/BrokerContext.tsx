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

import { DEMO_BROKER_PROFILE, createOnboardingDemoProfile } from "./brokerDemoSeed";

function loadState(): BrokerPersistedState {
  try {
    const raw = localStorage.getItem(BROKER_STORAGE_KEY);
    if (!raw) {
      return { profile: DEMO_BROKER_PROFILE, session: null };
    }
    return JSON.parse(raw) as BrokerPersistedState;
  } catch {
    return { profile: DEMO_BROKER_PROFILE, session: null };
  }
}

function saveState(state: BrokerPersistedState) {
  localStorage.setItem(BROKER_STORAGE_KEY, JSON.stringify(state));
}

interface BrokerContextValue {
  profile: BrokerProfile;
  session: BrokerAuthSession | null;
  isOnboardingComplete: boolean;
  login: (email: string, options?: { signup?: boolean }) => boolean;
  logout: () => void;
  patchProfile: (patch: Partial<BrokerProfile>) => void;
  setProfile: (profile: BrokerProfile) => void;
  completeOnboarding: (profile: BrokerProfile) => void;
  enterDemoDashboard: () => void;
}

const BrokerContext = createContext<BrokerContextValue | null>(null);

export function BrokerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrokerPersistedState>(loadState);

  const persist = useCallback((next: BrokerPersistedState) => {
    setState(next);
    saveState(next);
  }, []);

  const login = useCallback(
    (email: string, options?: { signup?: boolean }) => {
      const trimmed = email.trim();
      const session: BrokerAuthSession = { email: trimmed, signedInAt: nowIso() };

      let profile: BrokerProfile;
      if (options?.signup) {
        profile = createOnboardingDemoProfile(trimmed);
      } else {
        if (state.profile.onboardingCompletedAt && state.profile.fullName.trim()) {
          profile = { ...state.profile, email: trimmed, updatedAt: nowIso() };
        } else {
          profile = {
            ...DEMO_BROKER_PROFILE,
            email: trimmed,
            onboardingCompletedAt: nowIso(),
            updatedAt: nowIso(),
          };
        }
      }

      persist({ profile, session });
      return Boolean(profile.onboardingCompletedAt);
    },
    [persist, state.profile, state.session?.email],
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

  const enterDemoDashboard = useCallback(() => {
    persist({
      session: { email: DEMO_BROKER_PROFILE.email, signedInAt: nowIso() },
      profile: {
        ...DEMO_BROKER_PROFILE,
        onboardingCompletedAt: nowIso(),
        updatedAt: nowIso(),
      },
    });
  }, [persist]);

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
      enterDemoDashboard,
    }),
    [state, login, logout, patchProfile, setProfile, completeOnboarding, enterDemoDashboard],
  );

  return <BrokerContext.Provider value={value}>{children}</BrokerContext.Provider>;
}

export function useBroker(): BrokerContextValue {
  const ctx = useContext(BrokerContext);
  if (!ctx) throw new Error("useBroker must be used within BrokerProvider");
  return ctx;
}