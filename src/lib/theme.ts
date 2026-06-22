/** Brand data palette — earthy tones with accessible contrast on white. */
export const DATA_PALETTE = {
  green: "#607456",
  cream: "#EEE0CC",
  terracotta: "#BA6A4C",
  burgundy: "#7B2525",
} as const;

export const DATA_PALETTE_ORDER = [
  DATA_PALETTE.burgundy,
  DATA_PALETTE.green,
  DATA_PALETTE.terracotta,
  DATA_PALETTE.cream,
] as const;

export const CHART = {
  primary: DATA_PALETTE.green,
  grid: "#E8E8E8",
  tick: "#5C6670",
} as const;

/** Lead acquisition & line chart series */
export const ACQUISITION_COLORS = {
  direct: DATA_PALETTE.burgundy,
  social: DATA_PALETTE.green,
  platform: DATA_PALETTE.terracotta,
} as const;

/** Property platform donut slices */
export const PLATFORM_COLORS: Record<string, string> = {
  ShiftHona: DATA_PALETTE.burgundy,
  Magicbricks: DATA_PALETTE.green,
  "99acres": DATA_PALETTE.terracotta,
};

/** Client-in-progress location slices */
export const LOCATION_SLICE_COLORS = [
  DATA_PALETTE.burgundy,
  DATA_PALETTE.green,
  DATA_PALETTE.terracotta,
  DATA_PALETTE.cream,
  DATA_PALETTE.burgundy,
  DATA_PALETTE.green,
] as const;

/** Properties bar chart */
export const BAR_COLORS = {
  rent: DATA_PALETTE.green,
  sold: DATA_PALETTE.terracotta,
} as const;

/** Listed property type chips — solid backgrounds */
export const LISTING_CHIP = {
  rent: { bg: "#E4EBE0", text: BAR_COLORS.rent },
  sold: { bg: "#F3E0D8", text: BAR_COLORS.sold },
} as const;

export const STATUS = {
  completed: "#157A3A",
  active: "#1A5F6B",
  awaiting: "#B42318",
} as const;
