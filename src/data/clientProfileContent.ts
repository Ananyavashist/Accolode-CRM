export const PROGRESS_HISTORY = [
  { date: "12 Jun 2026", stage: "Qualified", note: "Client confirmed budget and preferred locations after second call." },
  { date: "5 Jun 2026", stage: "Site Visit", note: "Tour completed at Emerald Park and Skyline Heights. Client preferred Emerald Park layout." },
  { date: "28 May 2026", stage: "New", note: "Lead accepted from Client Leads. Initial preferences captured during onboarding." },
  { date: "20 May 2026", stage: "Inquiry", note: "Filled detailed inquiry form via ShiftHona with 3BHK requirement." },
];

export const CLIENT_NOTES = [
  { date: "11 Jun 2026", author: "Rakesh Verma", text: "Client prefers properties within 2 km of metro. Parking is a must-have." },
  { date: "4 Jun 2026", author: "Priya Nair", text: "Discussed furnishing options — leaning toward semi-furnished with modular kitchen." },
  { date: "29 May 2026", author: "Rakesh Verma", text: "Family of four. Needs 3BHK with separate study room or convertible space." },
  { date: "22 May 2026", author: "Arjun Mehta", text: "First call — responsive on WhatsApp. Best time to reach: 6–8 PM." },
];

export const APPOINTMENTS = [
  { date: "14 Jun 2026", time: "11:00 AM", title: "Property tour — Emerald Park", location: "Chandni Chowk, New Delhi", type: "Site Visit" },
  { date: "16 Jun 2026", time: "4:30 PM", title: "Budget revision call", location: "Phone", type: "Call" },
  { date: "19 Jun 2026", time: "10:00 AM", title: "Documentation review", location: "Accolode Office", type: "Meeting" },
  { date: "22 Jun 2026", time: "2:00 PM", title: "Follow-up on Lakeside Villa", location: "Guru Nanak Chowk", type: "Site Visit" },
];

export const DOCUMENTATION = [
  { name: "Renter Agreement Draft", status: "Pending Review", updated: "10 Jun 2026" },
  { name: "ID Proof — Aadhaar & PAN", status: "Verified", updated: "30 Mar 2026" },
  { name: "Income Proof — Salary Slips", status: "Verified", updated: "29 Mar 2026" },
  { name: "Address Proof", status: "Submitted", updated: "5 Jun 2026" },
  { name: "Reference Letter — Employer", status: "Awaiting", updated: "—" },
];

export const LOG_HISTORY = [
  { time: "12 Jun 2026, 3:42 PM", action: "Status updated to Active Lead", by: "Rakesh Verma" },
  { time: "10 Jun 2026, 11:15 AM", action: "Shared 4 property listings via email", by: "Rakesh Verma" },
  { time: "8 Jun 2026, 6:20 PM", action: "WhatsApp message sent — tour confirmation", by: "System" },
  { time: "5 Jun 2026, 2:00 PM", action: "Progress stage changed to Qualified", by: "Priya Nair" },
  { time: "28 May 2026, 9:30 AM", action: "Client profile created from Client Leads", by: "Rakesh Verma" },
];

export const LEGAL_RECORDS = [
  { title: "Tenancy Agreement Template", status: "Ready", lastReview: "1 Jun 2026" },
  { title: "Background Verification", status: "In Progress", lastReview: "8 Jun 2026" },
  { title: "Society NOC Requirement", status: "Not Started", lastReview: "—" },
  { title: "Stamp Duty Estimate", status: "Shared with Client", lastReview: "3 Jun 2026" },
];

export function tasksForClient(name: string): string[] {
  const short = name.split(" ")[0];
  return [
    `Schedule property tour for Emerald Park with ${short}`,
    "Share mortgage pre-approval options and bank tie-up list",
    `Connect with legal team for documentation for ${name}`,
    "Send updated rent comparison sheet for Chandni Chowk area",
  ];
}

export function activityForClient(name: string, location: string) {
  return [
    { date: "Jun 12, 2026", text: `Scheduled site visit at Emerald Park, ${location}.` },
    { date: "Jun 8, 2026", text: "Shared 7 new listings via email — client liked layout but raised pricing concerns." },
    { date: "Jun 4, 2026", text: "Call to revise budget range and narrow location to metro-accessible areas." },
    { date: "May 29, 2026", text: "Mortgage pre-approval letter received and uploaded to documentation." },
    { date: "May 25, 2026", text: "Initial consultation completed. Onboarding preferences saved to profile." },
    { date: "May 22, 2026", text: `${name} added to client database from Client Leads.` },
  ];
}
