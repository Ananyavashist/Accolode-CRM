import { BROKER_STORAGE_KEY, type BrokerPersistedState } from "@/types/broker";
import { DEMO_BROKER_PROFILE } from "@/store/brokerDemoSeed";

/**
 * Seed local storage on first visit only. Does not wipe broker session or CRM
 * state on refresh (that was logging users out and resetting onboarding).
 */
export function bootstrapDemoOnPageLoad(): void {
  if (typeof window === "undefined") return;

  const brokerRaw = window.localStorage.getItem(BROKER_STORAGE_KEY);
  if (!brokerRaw) {
    const profile = { ...DEMO_BROKER_PROFILE };
    delete profile.onboardingCompletedAt;
    const state: BrokerPersistedState = {
      session: null,
      profile,
    };
    window.localStorage.setItem(BROKER_STORAGE_KEY, JSON.stringify(state));
  }
}