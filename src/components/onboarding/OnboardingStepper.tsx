import { CheckCircle2, LayoutGrid, MapPin, Messages, Sparkles, Users } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Personal information",
    description: "Name, contact, agency, and RERA",
    icon: Users,
  },
  {
    title: "Area coverage",
    description: "Cities and localities you serve",
    icon: MapPin,
  },
  {
    title: "What you handle",
    description: "Rent, buy, property types, sizes",
    icon: LayoutGrid,
  },
  {
    title: "How you work",
    description: "Languages, tech, client volume",
    icon: Messages,
  },
  {
    title: "Your listings",
    description: "Inventory and referral link",
    icon: Sparkles,
  },
] as const;

export function OnboardingStepper({
  activeStep,
  maxReached,
}: {
  activeStep: number;
  maxReached: number;
}) {
  return (
    <ol className="space-y-1" aria-label="Onboarding steps">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isComplete = index < activeStep || index <= maxReached - 1;
        const isUpcoming = index > activeStep;

        return (
          <li key={step.title}>
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border px-3 py-[8px] transition-all duration-300",
                isActive && "border-hairline bg-surface shadow-sm",
                isComplete && !isActive && "border-transparent",
                isUpcoming && "border-transparent opacity-70",
              )}
            >
              <span
                className={cn(
                  "icon-btn h-8 w-8 shrink-0 border",
                  isActive && "border-primary/30 bg-primary/5 text-primary",
                  isComplete && !isActive && "border-primary/25 bg-primary-50 text-primary",
                  isUpcoming && "border-hairline bg-sidebar text-ink-soft",
                )}
              >
                {isComplete && !isActive ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </span>
              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-ink" : isComplete ? "text-ink-muted" : "text-ink-soft",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-ink-muted">{step.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}