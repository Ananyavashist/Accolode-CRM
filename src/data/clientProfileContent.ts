export const PROGRESS_HISTORY = [
  { date: "12 Jun 2026", stage: "Qualified", note: "Client confirmed budget and preferred locations after second call." },
  { date: "5 Jun 2026", stage: "Site Visit", note: "Tour completed at Emerald Park and Skyline Heights. Client preferred Emerald Park layout." },
  { date: "28 May 2026", stage: "New", note: "Lead accepted from Client Leads. Initial preferences captured during onboarding." },
  { date: "20 May 2026", stage: "Inquiry", note: "Filled detailed inquiry form via ShiftHona with 3BHK requirement." },
];

export const PINNED_DOCUMENTS = [
  {
    id: "pin-1",
    name: "Renter Agreement Guidelines",
    updated: "9 Jan 2026",
    iconWrap: "bg-[#FFF0E5] text-[#C2410C]",
  },
  {
    id: "pin-2",
    name: "Mortgage Pre-Approval Letter",
    updated: "29 Mar 2026",
    iconWrap: "bg-[#F0E8FF] text-[#7C3AED]",
  },
  {
    id: "pin-3",
    name: "ID & Verification Documents",
    updated: "30 Mar 2026",
    iconWrap: "bg-[#E8F2FF] text-[#2563EB]",
  },
];

export const CLIENT_NOTES = [
  { date: "11 Jun 2026", author: "Rakesh Verma", text: "Client prefers properties within 2 km of metro. Parking is a must have." },
  { date: "4 Jun 2026", author: "Priya Nair", text: "Discussed furnishing options , leaning toward semi furnished with modular kitchen." },
  { date: "29 May 2026", author: "Rakesh Verma", text: "Family of four. Needs 3BHK with separate study room or convertible space." },
  { date: "22 May 2026", author: "Arjun Mehta", text: "First call ,  responsive on WhatsApp. Best time to reach: 6 to 8 PM." },
];

export type AppointmentMedium = "call" | "video" | "in_person";

export type ClientAppointmentRecord = {
  id: string;
  scheduledBy: string;
  withName: string;
  headline: string;
  summary: string;
  whenDisplay: string;
  historyGroupDate: string;
  isUpcoming: boolean;
  medium: AppointmentMedium;
  reminder: string;
  duration: string;
  location: string;
  notes: string;
};

export type MeetingNoteEntry = {
  appointmentId: string;
  title: string;
  when: string;
  location: string;
  notes: string;
};

const DEMO_APPOINTMENTS: Omit<
  ClientAppointmentRecord,
  "withName" | "scheduledBy"
>[] = [
  {
    id: "appt-upcoming",
    headline: "Property tour at Emerald Park",
    summary:
      "Walk through 3BHK units, confirm parking and metro access. Client wants a breakdown of maintenance and one-time costs.",
    whenDisplay: "Today, 11:00 AM",
    historyGroupDate: "14 Jun 2026",
    isUpcoming: true,
    medium: "in_person",
    reminder: "20 min before",
    duration: "1 hour",
    location: "Chandni Chowk, New Delhi",
    notes:
      "Walk through 3BHK units, confirm parking and metro access. Client wants a breakdown of maintenance and one-time costs.",
  },
  {
    id: "appt-h1",
    headline: "Budget revision call",
    summary:
      "Review revised rent band and narrow localities to metro-linked corridors. Share comparison sheet after the call.",
    whenDisplay: "16 Jun 2026, 4:30 PM",
    historyGroupDate: "12 Jun 2026",
    isUpcoming: false,
    medium: "call",
    reminder: "15 min before",
    duration: "45 min",
    location: "Phone",
    notes:
      "Client comfortable stretching to ₹1.2L if furnishing is semi-complete. Send updated shortlist same day.",
  },
  {
    id: "appt-h2",
    headline: "Documentation review",
    summary:
      "Walk through renter agreement draft, ID proofs, and employer reference timeline before site visits continue.",
    whenDisplay: "10 Jun 2026, 10:00 AM",
    historyGroupDate: "12 Jun 2026",
    isUpcoming: false,
    medium: "video",
    reminder: "30 min before",
    duration: "1 hour",
    location: "Accolade Office · Video",
    notes:
      "All documents verified except employer reference letter. Client will upload by Friday.",
  },
  {
    id: "appt-h3",
    headline: "Follow up on Lakeside Villa",
    summary:
      "Second viewing for layout preference. Discuss society rules and move-in window vs shifting timeline.",
    whenDisplay: "8 Jun 2026, 2:00 PM",
    historyGroupDate: "8 Jun 2026",
    isUpcoming: false,
    medium: "in_person",
    reminder: "20 min before",
    duration: "1 hour",
    location: "Guru Nanak Chowk",
    notes: "Client liked natural light but concerned about lift maintenance charges.",
  },
];

export function appointmentsForClient(
  clientName: string,
  scheduledBy: string,
): { upcoming: ClientAppointmentRecord | null; historyByDate: { dateLabel: string; items: ClientAppointmentRecord[] }[] } {
  const records: ClientAppointmentRecord[] = DEMO_APPOINTMENTS.map((a) => ({
    ...a,
    withName: clientName,
    scheduledBy,
  }));

  const upcoming = records.find((a) => a.isUpcoming) ?? null;
  const past = records.filter((a) => !a.isUpcoming);

  const groups = new Map<string, ClientAppointmentRecord[]>();
  for (const item of past) {
    const list = groups.get(item.historyGroupDate) ?? [];
    list.push(item);
    groups.set(item.historyGroupDate, list);
  }

  const historyByDate = [...groups.entries()].map(([dateLabel, items]) => ({
    dateLabel,
    items,
  }));

  return { upcoming, historyByDate };
}

export function meetingNotesForClient(
  clientName: string,
  scheduledBy: string,
): MeetingNoteEntry[] {
  const { upcoming, historyByDate } = appointmentsForClient(clientName, scheduledBy);
  const all = [
    ...(upcoming ? [upcoming] : []),
    ...historyByDate.flatMap((g) => g.items),
  ];
  return all
    .filter((a) => a.notes.trim().length > 0)
    .map((a) => ({
      appointmentId: a.id,
      title: a.headline,
      when: a.whenDisplay,
      location: a.location,
      notes: a.notes,
    }));
}

/** @deprecated Use appointmentsForClient */
export const APPOINTMENTS = [
  { date: "14 Jun 2026", time: "11:00 AM", title: "Property tour ,  Emerald Park", location: "Chandni Chowk, New Delhi", type: "Site Visit" },
  { date: "16 Jun 2026", time: "4:30 PM", title: "Budget revision call", location: "Phone", type: "Call" },
  { date: "19 Jun 2026", time: "10:00 AM", title: "Documentation review", location: "Accolade Office", type: "Meeting" },
  { date: "22 Jun 2026", time: "2:00 PM", title: "Follow up on Lakeside Villa", location: "Guru Nanak Chowk", type: "Site Visit" },
];

export type ClientDocumentationRecord = {
  id: string;
  name: string;
  status: string;
  updated: string;
  iconWrap: string;
};

export const DOCUMENT_ICON_COLORS = [
  "bg-[#E8F2FF] text-[#2563EB]",
  "bg-[#E6F6EF] text-[#0D8A5B]",
  "bg-[#F0E8FF] text-[#7C3AED]",
  "bg-[#FFF0E5] text-[#C2410C]",
  "bg-[#FFE8E8] text-[#E11D48]",
  "bg-[#F5F3F0] text-ink-muted",
] as const;

export const DOCUMENTATION: ClientDocumentationRecord[] = [
  {
    id: "doc-1",
    name: "Renter Agreement Draft",
    status: "Pending Review",
    updated: "10 Jun 2026",
    iconWrap: DOCUMENT_ICON_COLORS[0],
  },
  {
    id: "doc-2",
    name: "ID Proof ,  Aadhaar & PAN",
    status: "Verified",
    updated: "30 Mar 2026",
    iconWrap: DOCUMENT_ICON_COLORS[1],
  },
  {
    id: "doc-3",
    name: "Income Proof ,  Salary Slips",
    status: "Verified",
    updated: "29 Mar 2026",
    iconWrap: DOCUMENT_ICON_COLORS[2],
  },
  {
    id: "doc-4",
    name: "Address Proof",
    status: "Submitted",
    updated: "5 Jun 2026",
    iconWrap: DOCUMENT_ICON_COLORS[3],
  },
  {
    id: "doc-5",
    name: "Reference Letter ,  Employer",
    status: "Awaiting",
    updated: "—",
    iconWrap: DOCUMENT_ICON_COLORS[4],
  },
];

export const LOG_HISTORY = [
  { time: "12 Jun 2026, 3:42 PM", action: "Status updated to Active Lead", by: "Rakesh Verma" },
  { time: "10 Jun 2026, 11:15 AM", action: "Shared 4 property listings via email", by: "Rakesh Verma" },
  { time: "8 Jun 2026, 6:20 PM", action: "WhatsApp message sent ,  tour confirmation", by: "System" },
  { time: "5 Jun 2026, 2:00 PM", action: "Progress stage changed to Qualified", by: "Priya Nair" },
  { time: "28 May 2026, 9:30 AM", action: "Client profile created from Client Leads", by: "Rakesh Verma" },
];

export const LEGAL_RECORDS = [
  { title: "Tenancy Agreement Template", status: "Ready", lastReview: "1 Jun 2026" },
  { title: "Background Verification", status: "In Progress", lastReview: "8 Jun 2026" },
  { title: "Society NOC Requirement", status: "Not Started", lastReview: ", " },
  { title: "Stamp Duty Estimate", status: "Shared with Client", lastReview: "3 Jun 2026" },
];

export function tasksForClient(name: string): string[] {
  const short = name.split(" ")[0];
  return [
    `Schedule property tour for Emerald Park with ${short}`,
    "Share mortgage pre approval options and bank tie up list",
    `Connect with legal team for documentation for ${name}`,
    "Send updated rent comparison sheet for Chandni Chowk area",
  ];
}

export function activityForClient(name: string, location: string) {
  return [
    { date: "Jun 12, 2026", text: `Scheduled site visit at Emerald Park, ${location}.` },
    { date: "Jun 8, 2026", text: "Shared 7 new listings via email ,  client liked layout but raised pricing concerns." },
    { date: "Jun 4, 2026", text: "Call to revise budget range and narrow location to metro accessible areas." },
    { date: "May 29, 2026", text: "Mortgage pre approval letter received and uploaded to documentation." },
    { date: "May 25, 2026", text: "Initial consultation completed. Onboarding preferences saved to profile." },
    { date: "May 22, 2026", text: `${name} added to client database from Client Leads.` },
  ];
}
