import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "@/components/ui/icons";
import type { FirstStepId, FirstSteps } from "@/types";
import { cn } from "@/lib/utils";

const STEPS: { id: FirstStepId; label: string; to: string }[] = [
  { id: "triage", label: "Triage a lead", to: "/client-leads" },
  { id: "followUp", label: "Set a follow-up", to: "/notes" },
  { id: "saidDoing", label: "Read Said vs Doing", to: "/clients" },
  { id: "siteVisit", label: "Move a deal to Site Visit", to: "/clients" },
  { id: "walkIn", label: "Add a walk-in client", to: "/clients" },
  { id: "whatsapp", label: "Message on WhatsApp", to: "/messages" },
];

export function FirstStepsWidget({
  steps,
  collapsed,
}: {
  steps: FirstSteps;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const done = STEPS.filter((s) => steps[s.id]).length;
  const total = STEPS.length;
  if (done === total) return null;

  const pct = Math.round((done / total) * 100);

  if (collapsed) {
    return (
      <div className="hidden px-2 pb-2 lg:block">
        <div
          className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-xs font-semibold text-primary"
          title={`First steps ${done}/${total}`}
        >
          {done}/{total}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-hairline px-3 py-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-sidebar"
        aria-expanded={open}
      >
        <span
          className="relative flex h-8 w-8 shrink-0 items-center justify-center"
          aria-hidden
        >
          <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="13" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <circle
              cx="16"
              cy="16"
              r="13"
              fill="none"
              stroke="#124553"
              strokeWidth="3"
              strokeDasharray={`${(pct / 100) * 81.7} 81.7`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-semibold text-primary">
            {done}/{total}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-ink">First steps</span>
          <span className="block text-xs text-ink-muted">Help and first steps</span>
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-ink-muted transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5 pb-1">
          {STEPS.map((step) => (
            <li key={step.id}>
              <NavLink
                to={step.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  steps[step.id] ? "text-ink-muted line-through" : "text-ink hover:bg-sidebar",
                )}
              >
                <span
                  className={cn(
                    "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                    steps[step.id]
                      ? "border-primary bg-primary text-white"
                      : "border-ink-soft",
                  )}
                  aria-hidden
                >
                  {steps[step.id] && <span className="text-[8px] leading-none">✓</span>}
                </span>
                {step.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
