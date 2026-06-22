export type DealType = "Rent" | "Buy";
export type Intent = "High" | "Medium" | "Low";
export type ConversionStatus =
  | "Active Lead"
  | "Awaiting Action"
  | "Completed Client"
  | "Completed";
export type ClientCategory = "Renter" | "Buyer";
export type ProgressStage =
  | "Inquiry"
  | "New"
  | "Qualified"
  | "Site Visit"
  | "Negotiation"
  | "Closed";

export const CONVERSION_STATUS_OPTIONS: ConversionStatus[] = [
  "Active Lead",
  "Awaiting Action",
  "Completed Client",
  "Completed",
];

export const PROGRESS_STAGE_OPTIONS: ProgressStage[] = [
  "Inquiry",
  "New",
  "Qualified",
  "Site Visit",
  "Negotiation",
  "Closed",
];

export interface PropertyPreference {
  id: string;
  name: string;
  location: string;
  price: string;
  sqft: string;
  tag: string;
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  avatar?: string;
  daysAgo: number;
  dealType: DealType;
  intent: Intent;
  budget: string;
  location: string;
  bhk: string;
  inquiryFilled: boolean;
  viewedProperties: number;
  source: string;
  email: string;
  phone: string;
  city: string;
  signals: string[];
  preference: {
    budget: string;
    location: string;
    propertyType: string;
    timeline: string;
  };
  properties: PropertyPreference[];
}

export interface Client {
  id: string;
  clientId: string;
  name: string;
  avatar?: string;
  category: ClientCategory;
  status: ConversionStatus;
  propertyType: string;
  location: string;
  budget: string;
  email: string;
  phone: string;
  city: string;
  progressStage: ProgressStage | string;
  onboarding: {
    preferredLocation: string;
    preferredNeighbour: string;
    propertyType: string;
    bedrooms: string;
    furnishing: string;
    budget: string;
    shiftingTimeline: string;
  };
  properties: PropertyPreference[];
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  time: string;
  preview: string;
  online: boolean;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  from: "client" | "broker";
  text: string;
  time: string;
}

export interface AddClientInput {
  dealType: DealType;
  city: string;
  locality: string;
  houseType: string;
  bedrooms: string;
  furnishing: string;
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  availableFromMonths: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: "lead" | "message" | "client" | "calendar";
}

export type ListingType = "Rent" | "Sale";
export type ListingStatus = "Active" | "Under Offer" | "Sold" | "Rented";

export interface ListedProperty {
  id: string;
  name: string;
  location: string;
  city: string;
  type: ListingType;
  bhk: string;
  price: string;
  sqft: string;
  tag: string;
  image: string;
  status: ListingStatus;
  listedDate: string;
  clientName?: string;
  brokerName?: string;
}
