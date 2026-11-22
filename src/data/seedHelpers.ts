import type { PropertyPreference } from "@/types";
import { PROPERTY_IMAGES } from "./images";

const PROPERTY_CATALOG: Omit<PropertyPreference, "id">[] = [
  {
    name: "Emerald Park",
    location: "Near Chandni Chowk",
    price: "89K",
    sqft: "1,250 sqft",
    tag: "Metro Access",
    image: PROPERTY_IMAGES[0],
  },
  {
    name: "Skyline Heights",
    location: "Connaught Place",
    price: "65K",
    sqft: "980 sqft",
    tag: "Furnished",
    image: PROPERTY_IMAGES[1],
  },
  {
    name: "Lakeside Villa",
    location: "Guru Nanak Chowk",
    price: "1.8Cr",
    sqft: "2,100 sqft",
    tag: "Premium",
    image: PROPERTY_IMAGES[2],
  },
  {
    name: "Palm Grove",
    location: "South Delhi",
    price: "1.1L",
    sqft: "1,450 sqft",
    tag: "Pool",
    image: PROPERTY_IMAGES[3],
  },
  {
    name: "West End Duplex",
    location: "Punjabi Bagh",
    price: "1.2Cr",
    sqft: "1,680 sqft",
    tag: "Corner Unit",
    image: PROPERTY_IMAGES[4],
  },
  {
    name: "Dwarka Greens",
    location: "Sector 21",
    price: "95L",
    sqft: "1,520 sqft",
    tag: "Park View",
    image: PROPERTY_IMAGES[1],
  },
  {
    name: "Lajpat Nagar Classic",
    location: "Lajpat Nagar",
    price: "42K",
    sqft: "850 sqft",
    tag: "Market Nearby",
    image: PROPERTY_IMAGES[4],
  },
  {
    name: "Saket Premium",
    location: "Near Saket Mall",
    price: "28K",
    sqft: "780 sqft",
    tag: "Mall Access",
    image: PROPERTY_IMAGES[0],
  },
];

export function makeProperties(count = 4): PropertyPreference[] {
  return Array.from({ length: count }).map((_, i) => {
    const base = PROPERTY_CATALOG[i % PROPERTY_CATALOG.length];
    return {
      id: `prop-${i}`,
      ...base,
    };
  });
}