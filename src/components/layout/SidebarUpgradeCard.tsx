import { Sparkles } from "@/components/ui/icons";
import { SidebarIconTooltip } from "@/components/layout/SidebarIconTooltip";
import { formatTrialDaysLeft, trialDaysRemaining } from "@/lib/trial";
import { useBroker } from "@/store/BrokerContext";

interface SidebarUpgradeCardProps {
  collapsed: boolean;
  showTooltips?: boolean;
}

export function SidebarUpgradeCard({ collapsed, showTooltips = false }: SidebarUpgradeCardProps) {
  const { profile, session } = useBroker();
  const trialStart = profile.onboardingCompletedAt ?? session?.signedInAt ?? profile.updatedAt;
  const daysLeft = trialDaysRemaining(trialStart);
  const daysLabel = formatTrialDaysLeft(daysLeft);

  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <SidebarIconTooltip show={showTooltips} label={`Upgrade to Pro · ${daysLabel}`}>
          <button
            type="button"
            className="btn-primary flex !h-10 !w-10 shrink-0 items-center justify-center !rounded-full !p-0 shadow-sm"
            aria-label={`Upgrade to Pro · ${daysLabel}`}
          >
            <Sparkles size={18} />
          </button>
        </SidebarIconTooltip>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary bg-surface text-primary shadow-sm">
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
        className="btn-primary mt-4 w-full gap-1.5"
        onClick={() => {
          /* demo CTA */
        }}
      >
        Upgrade to Pro
        <Sparkles size={16} />
      </button>
    </div>
  );
}