import type { PropertyPreference } from "@/types";
import { PROPERTY_IMAGES } from "./images";

export function makeProperties(count = 4): PropertyPreference[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `prop-${i}`,
    name: "Emerald Park",
    location: "Near Chandni Chowk",
    price: "89K",
    sqft: "1250 sqft",
    tag: "Metro Access",
    image: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
  }));
}
