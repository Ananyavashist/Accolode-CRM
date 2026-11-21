export type BrokerPracticeType = "agency" | "independent";
export type OutsideAreasPolicy = "yes" | "budget_only" | "no";
export type BrokerDealType = "rent" | "buy";
export type ListingImportChoice = "now" | "later" | "connect";

export type BrokerPropertyType =
  | "Apartment"
  | "Builder floor"
  | "Independent house"
  | "Villa"
  | "Commercial";

export type BrokerBhkSize = "1BHK" | "2BHK" | "3BHK" | "4BHK+";

export type BrokerFurnishing =
  | "Furnished"
  | "Semi furnished"
  | "Unfurnished"
  | "Any";

export interface BrokerCityCoverage {
  city: string;
  areas: string[];
}

export interface BrokerListingFileMeta {
  name: string;
}

export interface BrokerProfile {
  photoUrl?: string;
  fullName: string;
  phone: string;
  email: string;
  practiceType: BrokerPracticeType;
  agencyName?: string;
  reraNumber: string;
  yearsInRealEstate: number;
  cities: BrokerCityCoverage[];
  outsideAreasPolicy: OutsideAreasPolicy;
  dealTypes: BrokerDealType[];
  propertyTypes: BrokerPropertyType[];
  bhkSizes: BrokerBhkSize[];
  furnishingOptions: BrokerFurnishing[];
  languages: string[];
  techComfort: boolean;
  clientsManagedOnline: number;
  clientsManagedInPerson: number;
  listingCount: number;
  listingImportChoice: ListingImportChoice;
  listingFiles: BrokerListingFileMeta[];
  referralLink?: string;
  referralLinkGeneratedAt?: string;
  onboardingCompletedAt?: string;
  updatedAt: string;
}

export interface BrokerAuthSession {
  email: string;
  signedInAt: string;
}

export interface BrokerPersistedState {
  profile: BrokerProfile;
  session: BrokerAuthSession | null;
}

export const BROKER_STORAGE_KEY = "accolade-broker-v1";