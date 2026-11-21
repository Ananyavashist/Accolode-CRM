export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** User facing copy: no hyphen or dash punctuation (ranges use “to”). */
export function formatDisplayCopy(text: string): string {
  if (!text) return text;
  return text
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, " to ")
    .replace(/\s+-\s+/g, " to ")
    .replace(/(\d)-(\d)/g, "$1 to $2")
    .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])-([A-Za-zÀ-ÖØ-öø-ÿ])/g, "$1 $2")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function formatClientIdDisplay(clientId: string): string {
  const trimmed = clientId?.trim() ?? "";
  if (!trimmed) return "—";
  if (/^ID\s/i.test(trimmed)) return trimmed;
  return `ID ${trimmed}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_BG = [
  "#124553",
  "#6366F1",
  "#0EA5E9",
  "#16A34A",
  "#D97706",
  "#DB2777",
  "#7C3AED",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_BG[Math.abs(hash) % AVATAR_BG.length];
}
