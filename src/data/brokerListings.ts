import { LISTED_PROPERTIES } from "@/data/listings";
import type { ListedProperty, ListingStatus } from "@/types";

const AVAILABLE: ListingStatus[] = ["Active", "Under Offer"];

export function listingsForBroker(brokerName: string): ListedProperty[] {
  const key = brokerName.trim().toLowerCase();
  const mine = LISTED_PROPERTIES.filter(
    (p) => p.brokerName?.toLowerCase() === key && AVAILABLE.includes(p.status),
  );
  if (mine.length > 0) return mine;
  return LISTED_PROPERTIES.filter((p) => AVAILABLE.includes(p.status));
}