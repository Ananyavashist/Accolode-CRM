export type PipelineStage =
  | "Enquiry"
  | "Site visits"
  | "Negotiation"
  | "Documents"
  | "Closed this month";

export interface PipelineDeal {
  id: string;
  name: string;
  summary: string;
  stage: PipelineStage;
  note: string;
  /** ISO date (YYYY-MM-DD) for calendar placement and card label */
  dueDate: string;
  movedThisWeek?: boolean;
  overdue?: boolean;
  extra?: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  "Enquiry",
  "Site visits",
  "Negotiation",
  "Documents",
  "Closed this month",
];

export const PIPELINE_DEALS: PipelineDeal[] = [
  {
    id: "karan-sethi",
    name: "Karan Sethi",
    summary: "Rent · 2BHK · Saket · ₹50K to 60K/mo",
    stage: "Enquiry",
    note: "Call back about budget · today",
    dueDate: "2026-11-19",
  },
  {
    id: "ritu-malhotra",
    name: "Ritu Malhotra",
    summary: "Buy · 3BHK · Greater Kailash · ₹2.2 to 2.6 Cr",
    stage: "Enquiry",
    note: "Share 4 homes · Fri",
    dueDate: "2026-11-21",
  },
  {
    id: "sameer-gill",
    name: "Sameer Gill",
    summary: "Rent · 1BHK · Malviya Nagar · ₹25K to 30K/mo",
    stage: "Enquiry",
    note: "First call · Fri",
    dueDate: "2026-11-21",
  },
  {
    id: "priya-menon-pipe",
    name: "Priya Menon",
    summary: "Rent · 2BHK · Saket · ₹45K to 55K/mo",
    stage: "Site visits",
    note: "Visit at 11:00 · today",
    dueDate: "2026-11-19",
    movedThisWeek: true,
  },
  {
    id: "aman-kohli-pipe",
    name: "Aman Kohli",
    summary: "Rent · 2BHK · Lajpat Nagar · ₹40K to 50K/mo",
    stage: "Site visits",
    note: "Share 3 homes · overdue 1 day",
    dueDate: "2026-11-18",
    overdue: true,
  },
  {
    id: "deepa-arora",
    name: "Deepa Arora",
    summary: "Buy · 2BHK · Hauz Khas · ₹1.4 to 1.7 Cr",
    stage: "Site visits",
    note: "Second visit · Sat",
    dueDate: "2026-11-22",
  },
  {
    id: "vikas-chandra",
    name: "Vikas Chandra",
    summary: "Rent · 3BHK · Hauz Khas · ₹95K/mo",
    stage: "Negotiation",
    note: "Owner's counter offer · Fri",
    dueDate: "2026-11-21",
    movedThisWeek: true,
  },
  {
    id: "isha-kapur",
    name: "Isha Kapur",
    summary: "Buy · 3BHK · Greater Kailash · ₹2.5 Cr",
    stage: "Negotiation",
    note: "Bank valuation · Mon",
    dueDate: "2026-11-24",
  },
  {
    id: "neha-bhalla",
    name: "Neha Bhalla",
    summary: "Rent · 2BHK · Saket · ₹52K/mo",
    stage: "Documents",
    note: "Rent agreement draft · today",
    dueDate: "2026-11-19",
    movedThisWeek: true,
    extra: "1 of 4 items missing",
  },
  {
    id: "rohan-bajaj",
    name: "Rohan Bajaj",
    summary: "Rent · 1BHK · Malviya Nagar · ₹27K/mo",
    stage: "Documents",
    note: "Police verification · Sat",
    dueDate: "2026-11-22",
  },
  {
    id: "tara-sood",
    name: "Tara Sood",
    summary: "Rent · 2BHK · Lajpat Nagar · ₹44K/mo",
    stage: "Closed this month",
    note: "Signed 17 Nov",
    dueDate: "2026-11-17",
    movedThisWeek: true,
  },
  {
    id: "mohit-rana",
    name: "Mohit Rana",
    summary: "Rent · 3BHK · Saket · ₹78K/mo",
    stage: "Closed this month",
    note: "Signed 6 Nov",
    dueDate: "2026-11-06",
  },
];

/** Extra deals not shown as cards ,  reflected in column “N more” links. */
export const PIPELINE_MORE_COUNTS: Record<PipelineStage, number> = {
  Enquiry: 3,
  "Site visits": 2,
  Negotiation: 1,
  Documents: 0,
  "Closed this month": 0,
};