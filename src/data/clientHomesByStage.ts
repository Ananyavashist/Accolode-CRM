import type { Client } from "@/types";
import { PROPERTY_IMAGES } from "./images";

export type HomeStageId = "interested" | "shortlisted" | "visited" | "selected";

export type HomeStageCard = {
  id: string;
  listingId?: string;
  title: string;
  price: string;
  meta: string;
  image: string;
};

export const HOME_STAGE_LABELS: Record<HomeStageId, string> = {
  interested: "Interested",
  shortlisted: "Shortlisted",
  visited: "Visited",
  selected: "Selected",
};

export function homeCardFromListing(
  listing: { id: string; name: string; price: string; image: string; bhk: string; city: string },
  stageId: HomeStageId,
): HomeStageCard {
  return {
    id: `home-${listing.id}-${Date.now()}`,
    listingId: listing.id,
    title: listing.name,
    price: listing.price,
    meta: `${listing.bhk} · ${listing.city} · ${HOME_STAGE_LABELS[stageId].toLowerCase()}`,
    image: listing.image,
  };
}

export type HomeStageColumn = {
  id: HomeStageId;
  label: string;
  items: HomeStageCard[];
};

function homeCardFromPreference(
  prop: Client["properties"][number],
  id: string,
  meta: string,
): HomeStageCard {
  return {
    id,
    listingId: prop.id,
    title: prop.name,
    price: prop.price.startsWith("₹") ? prop.price : `₹ ${prop.price}`,
    meta,
    image: prop.image,
  };
}

export function homesByStageForClient(client: Client): HomeStageColumn[] {
  const props = client.properties;
  const fallback = (idx: number): HomeStageCard => ({
    id: `h-fallback-${idx}`,
    title: "Emerald Park",
    price: "₹ 89K",
    meta: "viewed in Shift Hona",
    image: PROPERTY_IMAGES[idx % PROPERTY_IMAGES.length],
  });

  const p = (index: number) => props[index];

  return [
    {
      id: "interested",
      label: "Interested",
      items: p(0) ? [homeCardFromPreference(p(0)!, "h-1", "viewed in Shift Hona")] : [fallback(0)],
    },
    {
      id: "shortlisted",
      label: "Shortlisted",
      items: [
        ...(p(1) ? [homeCardFromPreference(p(1)!, "h-2a", "shared Jun 8")] : []),
        ...(p(2) ? [homeCardFromPreference(p(2)!, "h-2b", "shared Jun 8")] : []),
      ],
    },
    {
      id: "visited",
      label: "Visited",
      items: p(3) ? [homeCardFromPreference(p(3)!, "h-3", "visit Jun 12")] : [],
    },
    {
      id: "selected",
      label: "Selected",
      items: [],
    },
  ];
}