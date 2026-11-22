import type { Client } from "@/types";

export type ClientActivityType = "call" | "visit" | "task" | "email";

export type ClientActivityFeedItem = {
  id: string;
  type: ClientActivityType;
  at: string;
  /** Primary line with **bold** markers */
  headline: string;
  detail?: string;
  callMeta?: string;
  taskCard?: {
    title: string;
    priority: "Low" | "Medium" | "High";
    status: "Overdue" | "Open" | "Done";
    dueDate: string;
    checklist?: string[];
  };
};

export function activityFeedForClient(client: Client, brokerName: string): ClientActivityFeedItem[] {
  const { name, location, onboarding, progressStage } = client;
  const visitLocation = onboarding.preferredLocation || location;
  const broker = brokerName.trim() || "Rakesh Verma";

  return [
    {
      id: "act-1",
      type: "visit",
      at: "Jun 18, 2026 at 11:00 AM",
      headline: `Site visit scheduled · **${visitLocation}**`,
      detail: `Emerald Park and Skyline Heights · ${client.city}. Broker: **${broker}**.`,
    },
    {
      id: "act-2",
      type: "call",
      at: "Jun 16, 2026 at 04:30 PM",
      headline: `Phone call with **${name}**`,
      detail: "Confirmed tour date and parking at society gate.",
      callMeta: "18 min · Budget and furnishing discussed",
    },
    {
      id: "act-3",
      type: "task",
      at: "Jun 14, 2026 at 10:15 AM",
      headline: "Task created",
      taskCard: {
        title: `Prepare shortlist for ${name}`,
        priority: "High",
        status: "Open",
        dueDate: "Jun 17, 2026",
        checklist: [
          "Match listings to ₹80K–₹2L budget",
          "Filter 3BHK with metro access",
          "Attach floor plans to client folder",
        ],
      },
    },
    {
      id: "act-4",
      type: "email",
      at: "Jun 12, 2026 at 09:40 AM",
      headline: `Email sent to **${name}**`,
      detail:
        "Shared 7 listings near Chandni Chowk. Asked client to confirm bedroom and furnishing preferences for the next pass.",
    },
    {
      id: "act-5",
      type: "visit",
      at: "Jun 12, 2026 at 11:00 AM",
      headline: `Site visit completed · **Near ${visitLocation}**`,
      detail: "Walk-through at Emerald Park. Client noted strong natural light; follow-up on maintenance charges.",
    },
    {
      id: "act-6",
      type: "call",
      at: "Jun 10, 2026 at 06:15 PM",
      headline: `Phone call with **${name}**`,
      detail: `Logged by **${broker}**. Client asked for options closer to ${onboarding.preferredNeighbour}.`,
      callMeta: "26 min · Location and timeline",
    },
    {
      id: "act-7",
      type: "task",
      at: "Jun 8, 2026 at 03:00 PM",
      headline: "Task created",
      taskCard: {
        title: "Update client preferences in CRM",
        priority: "Medium",
        status: "Done",
        dueDate: "Jun 9, 2026",
        checklist: [
          "Record furnishing: fully furnished",
          "Note shifting timeline: 3–6 months",
          "Save must-have: metro access",
        ],
      },
    },
    {
      id: "act-8",
      type: "email",
      at: "Jun 5, 2026 at 11:20 AM",
      headline: `Email sent to **${name}**`,
      detail:
        "Onboarding summary: budget, locations, and property type from intake form. Invited client to reply with any changes.",
    },
    {
      id: "act-9",
      type: "call",
      at: "Jun 3, 2026 at 02:00 PM",
      headline: `Phone call with **${name}**`,
      detail: "First qualification after lead accept. Captured rent range and areas in North Delhi.",
      callMeta: "32 min · Inquiry intake",
    },
    {
      id: "act-10",
      type: "email",
      at: "May 28, 2026 at 04:45 PM",
      headline: `Email sent to **${name}**`,
      detail: `Welcome message and broker introduction. Current stage on file: **${progressStage}**.`,
    },
  ];
}