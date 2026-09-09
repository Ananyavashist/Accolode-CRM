import { NavLink } from "react-router-dom";
import { useCrm } from "@/store/CrmContext";
import { cn } from "@/lib/utils";
import type { FirstStepId } from "@/types";

const STEPS: { id: FirstStepId; label: string; detail: string; to: string }[] = [
  {
    id: "triage",
    label: "Triage a lead",
    detail: "Accept or deprioritise a lead so the overnight pile stays clear.",
    to: "/client-leads",
  },
  {
    id: "followUp",
    label: "Set a follow-up",
    detail: "When you accept a lead, pick a date so it lands in Notes.",
    to: "/notes",
  },
  {
    id: "saidDoing",
    label: "Read Said vs Doing",
    detail: "Open a client profile and compare stated preferences with observed browsing.",
    to: "/clients",
  },
  {
    id: "siteVisit",
    label: "Move a deal to Site Visit",
    detail: "Change the stage, or book a tour — booking advances the pipeline.",
    to: "/calendar",
  },
  {
    id: "walkIn",
    label: "Add a walk-in client",
    detail: "Capture name, phone, and source for referrals and office walk-ins.",
    to: "/clients",
  },
  {
    id: "whatsapp",
    label: "Message on WhatsApp",
    detail: "Open a pre-filled WhatsApp message with matched properties, then log the send.",
    to: "/messages",
  },
];

export function HelpPage() {
  const { firstSteps } = useCrm();
  const done = STEPS.filter((s) => firstSteps[s.id]).length;

  return (
    <div className="page mx-auto max-w-2xl">
      <div>
        <h1 className="text-ink">First steps</h1>
        <p className="page-lede">
          {done} of {STEPS.length} jobs done. These are the six things Accolode is built for.
        </p>
      </div>
      <ul className="section-card divide-y divide-hairline">
        {STEPS.map((step) => (
          <li key={step.id}>
            <NavLink
              to={step.to}
              className="flex items-start gap-3 px-4 py-3 hover:bg-sidebar"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs",
                  firstSteps[step.id]
                    ? "border-primary bg-primary text-white"
                    : "border-ink-soft text-ink-muted",
                )}
                aria-hidden
              >
                {firstSteps[step.id] ? "✓" : ""}
              </span>
              <span>
                <span
                  className={cn(
                    "block text-sm font-medium",
                    firstSteps[step.id] ? "text-ink-muted line-through" : "text-ink",
                  )}
                >
                  {step.label}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">{step.detail}</span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
