import { Sparkles } from "@/components/ui/icons";
import { formatTrialDaysLeft, trialDaysRemaining } from "@/lib/trial";
import { useBroker } from "@/store/BrokerContext";

interface SidebarUpgradeCardProps {
  collapsed: boolean;
}

export function SidebarUpgradeCard({ collapsed }: SidebarUpgradeCardProps) {
  const { profile, session } = useBroker();
  const trialStart = profile.onboardingCompletedAt ?? session?.signedInAt ?? profile.updatedAt;
  const daysLeft = trialDaysRemaining(trialStart);
  const daysLabel = formatTrialDaysLeft(daysLeft);

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary-700"
          aria-label={`Upgrade to Pro · ${daysLabel}`}
          title={`Upgrade to Pro · ${daysLabel}`}
        >
          <Sparkles size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/15 bg-primary-50 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-surface text-primary">
          <Sparkles size={18} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-ink-muted">Current plan:</p>
          <p className="text-sm font-bold text-ink">Free trial</p>
          <p className="mt-0.5 text-xs font-semibold text-primary">{daysLabel}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted">
        Upgrade to Pro to get the latest and exclusive features before your trial ends.
      </p>
      <button
        type="button"
        className="btn-primary mt-4 w-full"
        onClick={() => {
          /* demo CTA */
        }}
      >
        Upgrade to Pro
      </button>
    </div>
  );
}