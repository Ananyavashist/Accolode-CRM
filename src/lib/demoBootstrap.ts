import { BROKER_STORAGE_KEY, type BrokerPersistedState } from "@/types/broker";
import { DEMO_BROKER_PROFILE } from "@/store/brokerDemoSeed";

export const CRM_STORAGE_KEY = "accolode-crm-v7";

/** Reset CRM + broker session on each full page load for a stable demo entry. */
export function bootstrapDemoOnPageLoad(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CRM_STORAGE_KEY);

  const profile = { ...DEMO_BROKER_PROFILE };
  delete profile.onboardingCompletedAt;
  const state: BrokerPersistedState = {
    session: null,
    profile,
  };
  window.localStorage.setItem(BROKER_STORAGE_KEY, JSON.stringify(state));
}