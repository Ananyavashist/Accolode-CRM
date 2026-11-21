import type { BrokerProfile } from "@/types/broker";

export type BrokerFieldErrors = Partial<Record<string, string>>;

export function validateOnboardingStep(step: number, profile: BrokerProfile): BrokerFieldErrors {
  const errors: BrokerFieldErrors = {};

  if (step === 0) {
    if (!profile.fullName.trim()) errors.fullName = "Full name is required";
    if (!profile.phone.trim()) errors.phone = "Phone number is required";
    if (!profile.email.trim()) errors.email = "Email is required";
    if (profile.practiceType === "agency" && !profile.agencyName?.trim()) {
      errors.agencyName = "Agency name is required";
    }
    if (!profile.reraNumber.trim()) errors.reraNumber = "RERA registration number is required";
    if (!profile.yearsInRealEstate || profile.yearsInRealEstate < 0) {
      errors.yearsInRealEstate = "Enter years in real estate";
    }
  }

  if (step === 1) {
    if (profile.cities.length === 0) {
      errors.cities = "Add at least one city";
    } else {
      const missingAreas = profile.cities.some((c) => c.areas.length === 0);
      if (missingAreas) errors.cities = "Select at least one area per city";
    }
    if (!profile.outsideAreasPolicy) {
      errors.outsideAreasPolicy = "Choose how you handle leads outside your areas";
    }
  }

  if (step === 2) {
    if (profile.dealTypes.length === 0) errors.dealTypes = "Select rent, buy, or both";
    if (profile.propertyTypes.length === 0) errors.propertyTypes = "Select at least one property type";
    if (profile.bhkSizes.length === 0) errors.bhkSizes = "Select at least one home size";
    if (profile.furnishingOptions.length === 0) {
      errors.furnishingOptions = "Select furnishing preference";
    }
  }

  if (step === 3) {
    if (profile.languages.length === 0) errors.languages = "Select at least one language";
    if (profile.clientsManagedOnline < 0) errors.clientsManagedOnline = "Enter a valid number";
    if (profile.clientsManagedInPerson < 0) errors.clientsManagedInPerson = "Enter a valid number";
  }

  if (step === 4) {
    if (profile.listingCount < 0) errors.listingCount = "Enter how many properties you currently have";
    if (!profile.listingImportChoice) errors.listingImportChoice = "Choose an import option";
    if (!profile.referralLink) {
      errors.referralLink = "Generate your personal referral link before finishing";
    }
  }

  return errors;
}