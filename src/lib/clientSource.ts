import type { Client, ClientSource } from "@/types";

const SOURCES: ClientSource[] = ["Manual", "ShiftHona", "Link"];

const LEGACY_SOURCE_MAP: Record<string, ClientSource> = {
  Referral: "Manual",
  "Walk-in": "Manual",
  WhatsApp: "Manual",
  Portal: "Link",
  "Broker link": "Link",
  "Shift Hona app": "ShiftHona",
  ShiftHona: "ShiftHona",
  Magicbricks: "Link",
  "99acres": "Link",
};

export function normalizeClientSource(raw?: string): ClientSource {
  if (raw === "Manual" || raw === "ShiftHona" || raw === "Link") return raw;
  if (raw && LEGACY_SOURCE_MAP[raw]) return LEGACY_SOURCE_MAP[raw];
  return "Manual";
}

export function clientSourceLabel(source?: ClientSource): string {
  if (!source) return "—";
  return source;
}

export function inferClientSource(client: Client): ClientSource {
  if (client.source) return normalizeClientSource(client.source);
  const code = client.id.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return SOURCES[code % SOURCES.length]!;
}

export function deriveMoveInDate(client: Client): string {
  if (client.moveInDate) return client.moveInDate;
  const timeline = client.onboarding.shiftingTimeline.toLowerCase();
  let days = 45;
  if (timeline.includes("immediate")) days = 7;
  else if (timeline.includes("1 to 2")) days = 30;
  else if (timeline.includes("2 to 3")) days = 75;
  else if (timeline.includes("3 to 6")) days = 120;
  else if (timeline.includes("year")) days = 300;
  const jitter = client.id.length % 14;
  const d = new Date();
  d.setDate(d.getDate() + days + jitter);
  return d.toISOString().slice(0, 10);
}

export function formatMoveInDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}