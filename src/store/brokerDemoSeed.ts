import type { BrokerProfile } from "@/types/broker";

function nowIso(): string {
  return new Date().toISOString();
}

export const DEMO_BROKER_PROFILE: BrokerProfile = {
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

/** Pre-filled broker answers for sign-up onboarding (demo / prototype). */
export function createOnboardingDemoProfile(email: string): BrokerProfile {
  const profile: BrokerProfile = {
    ...DEMO_BROKER_PROFILE,
    email: email.trim(),
    updatedAt: nowIso(),
  };
  delete profile.onboardingCompletedAt;
  delete profile.referralLink;
  delete profile.referralLinkGeneratedAt;
  return profile;
}