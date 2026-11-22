/** Accolade logo + UI brand (single source for Tailwind primary and CTAs). */
export const BRAND = {
  DEFAULT: "#124553",
  hover: "#0E3A45",
  dark: "#0A2E38",
  soft: "#E9F3F5",
  softBorder: "#C5DDE3",
} as const;

/** Cool analogous palette anchored on Accolade logo teal (#124553). */
export const DATA_PALETTE = {
  teal: "#124553",
  cyan: "#2A9D8F",
  slate: "#3D5A80",
  seafoam: "#52B788",
  indigo: "#4C6EF5",
  /** Light teal tint for chart fills (contrast on dark teal segments). */
  mint: "#B8DCE4",
} as const;

export const DATA_PALETTE_ORDER = [
  DATA_PALETTE.teal,
  DATA_PALETTE.cyan,
  DATA_PALETTE.slate,
  DATA_PALETTE.seafoam,
  DATA_PALETTE.indigo,
] as const;

export const CHART = {
  primary: DATA_PALETTE.teal,
  grid: "#E5E7EB",
  tick: "#6B7280",
} as const;

export const ACQUISITION_COLORS = {
  direct: DATA_PALETTE.teal,
  social: DATA_PALETTE.cyan,
  platform: DATA_PALETTE.slate,
} as const;

export const PLATFORM_COLORS: Record<string, string> = {
  ShiftHona: DATA_PALETTE.teal,
  Magicbricks: DATA_PALETTE.cyan,
  "99acres": DATA_PALETTE.slate,
};

export const LOCATION_SLICE_COLORS = [
  DATA_PALETTE.teal,
  DATA_PALETTE.cyan,
  DATA_PALETTE.slate,
  DATA_PALETTE.seafoam,
  DATA_PALETTE.indigo,
  DATA_PALETTE.teal,
] as const;

export const BAR_COLORS = {
  rent: DATA_PALETTE.teal,
  sold: DATA_PALETTE.seafoam,
} as const;

/** Stacked property overview — logo teal base + light accessible top. */
export const PROPERTY_OVERVIEW_COLORS = {
  rent: DATA_PALETTE.teal,
  sold: DATA_PALETTE.mint,
} as const;

/** Stack: charcoal → logo teal → cyan (distinct, tone-matched). */
export const CLIENT_CAPACITY_COLORS = {
  activeClients: "#292929",
  leadAccepted: DATA_PALETTE.teal,
  dealClosed: DATA_PALETTE.cyan,
} as const;

/** Placeholder month (no data yet) — full stack reads as one light bar. */
export const CLIENT_CAPACITY_UPCOMING_FILL = "#E5E7EB";

/** Rent / Buy / Sale must not share a teal wash — brokers scan these first. */
export const TYPE_CHIP = {
  Rent: { bg: "#EEF5F7", text: "#124553" },
  Buy: { bg: "#EEF0FE", text: "#4C6EF5" },
  Sale: { bg: "#DCE4EE", text: "#3D5A80" },
} as const;

export const LISTING_CHIP = {
  rent: TYPE_CHIP.Rent,
  sold: TYPE_CHIP.Sale,
} as const;

export const STATUS = {
  completed: "#157A3A",
  active: DATA_PALETTE.teal,
  awaiting: "#B42318",
} as const;

/** Primary series for area / line charts (deals, trends). */
export const CHART_SERIES_PRIMARY = DATA_PALETTE.teal;
