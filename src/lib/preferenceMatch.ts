import type { Client, PropertyPreference } from "@/types";

export type PreferenceMatchLevel = "strong" | "partial" | "weak";

export type PreferenceMatchRow = {
  id: string;
  label: string;
  cells: { value: string; level: PreferenceMatchLevel }[];
};

export type PreferenceMatchTable = {
  properties: PropertyPreference[];
  rows: PreferenceMatchRow[];
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[₹,\s]/g, "");
}

function priceToMonthlyThousands(price: string): number | null {
  const raw = price.replace(/[₹,\s]/g, "").toLowerCase();
  const match = raw.match(/([\d.]+)\s*(k|l|cr|lac|lacs)?/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  if (!Number.isFinite(n)) return null;
  const unit = match[2] ?? "";
  if (unit === "cr") return n * 100000;
  if (unit === "l" || unit === "lac" || unit === "lacs") return n * 100;
  if (unit === "k") return n;
  if (n >= 1000) return n / 1000;
  return n;
}

function parseBudgetRange(budget: string): { min: number; max: number } | null {
  const parts = [...budget.matchAll(/([\d.]+)\s*(k|l|cr|lac|lacs)?/gi)];
  if (parts.length < 2) return null;
  const toK = (n: number, unit: string) => {
    const u = unit.toLowerCase();
    if (u === "cr") return n * 100000;
    if (u === "l" || u === "lac" || u === "lacs") return n * 100;
    return n;
  };
  const min = toK(parseFloat(parts[0][1]), parts[0][2] ?? "k");
  const max = toK(parseFloat(parts[1][1]), parts[1][2] ?? "k");
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function budgetMatchLevel(budget: string, price: string): PreferenceMatchLevel {
  const range = parseBudgetRange(budget);
  const priceK = priceToMonthlyThousands(price);
  if (!range || priceK === null) return "partial";
  if (priceK >= range.min && priceK <= range.max) return "strong";
  const margin = range.max * 0.15;
  if (priceK >= range.min - margin && priceK <= range.max + margin) return "partial";
  return "weak";
}

function locationMatchLevel(preferred: string, location: string): PreferenceMatchLevel {
  const a = normalizeText(preferred);
  const b = normalizeText(location);
  if (!a || !b) return "partial";
  if (b.includes(a) || a.includes(b)) return "strong";
  const aTokens = preferred.toLowerCase().split(/[\s,]+/).filter((t) => t.length > 3);
  if (aTokens.some((t) => b.includes(t))) return "partial";
  return "weak";
}

function sizeMatchLevel(bedrooms: string, sqft: string): PreferenceMatchLevel {
  const sq = parseInt(sqft.replace(/\D/g, ""), 10);
  if (!Number.isFinite(sq)) return "partial";
  const wantsLarge = /3bhk|4bhk|5bhk/i.test(bedrooms);
  const wantsSmall = /1bhk|2bhk/i.test(bedrooms);
  if (wantsLarge && sq >= 1100) return "strong";
  if (wantsSmall && sq <= 1000) return "strong";
  if (wantsLarge && sq >= 900) return "partial";
  if (wantsSmall && sq <= 1200) return "partial";
  return "weak";
}

function accessMatchLevel(tag: string, furnishing: string): PreferenceMatchLevel {
  if (!tag.trim()) return "weak";
  if (/metro|transit|access/i.test(tag)) return "strong";
  if (/furnish/i.test(furnishing) && /furnish/i.test(tag)) return "strong";
  return "partial";
}

function propertyScore(client: Client, property: PropertyPreference): number {
  const o = client.onboarding;
  const levels = [
    budgetMatchLevel(o.budget, property.price),
    locationMatchLevel(o.preferredLocation, property.location),
    sizeMatchLevel(o.bedrooms, property.sqft),
    accessMatchLevel(property.tag, o.furnishing),
  ];
  const weight = { strong: 3, partial: 2, weak: 1 };
  return levels.reduce((sum, l) => sum + weight[l], 0);
}

export function topMatchedProperties(client: Client, limit = 4): PropertyPreference[] {
  const ranked = [...client.properties].sort(
    (a, b) => propertyScore(client, b) - propertyScore(client, a),
  );
  const seen = new Set<string>();
  const out: PropertyPreference[] = [];
  for (const p of ranked) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export function preferenceMatchTableForClient(client: Client): PreferenceMatchTable {
  const properties = topMatchedProperties(client, 4);
  const o = client.onboarding;

  const rows: PreferenceMatchRow[] = [
    {
      id: "budget",
      label: `Budget ${o.budget}`,
      cells: properties.map((p) => ({
        value: `₹ ${p.price}`,
        level: budgetMatchLevel(o.budget, p.price),
      })),
    },
    {
      id: "location",
      label: `Location ${o.preferredLocation}`,
      cells: properties.map((p) => ({
        value: p.location,
        level: locationMatchLevel(o.preferredLocation, p.location),
      })),
    },
    {
      id: "size",
      label: "Size",
      cells: properties.map((p) => ({
        value: p.sqft,
        level: sizeMatchLevel(o.bedrooms, p.sqft),
      })),
    },
    {
      id: "access",
      label: "Access",
      cells: properties.map((p) => ({
        value: p.tag,
        level: accessMatchLevel(p.tag, o.furnishing),
      })),
    },
  ];

  return { properties, rows };
}