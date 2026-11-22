import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OnboardingStepPanel } from "@/components/onboarding/OnboardingStepPanel";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { ChevronLeft, ChevronRight, Navigation } from "@/components/ui/icons";
import { validateOnboardingStep, type BrokerFieldErrors } from "@/lib/brokerOnboardingValidation";
import { useBroker } from "@/store/BrokerContext";
import type { BrokerProfile } from "@/types/broker";
import { cn } from "@/lib/utils";

const STEP_TITLES = [
  "Personal information",
  "Area coverage",
  "What you handle",
  "How you work with clients",
  "Your listings",
] as const;

export function BrokerOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "1";
  const { profile: saved, completeOnboarding, session, isOnboardingComplete } = useBroker();
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [profile, setProfile] = useState<BrokerProfile>(saved);
  const [errors, setErrors] = useState<BrokerFieldErrors>({});
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [slideKey, setSlideKey] = useState(0);

  useEffect(() => {
    if (!session) navigate("/login", { replace: true });
    else if (isOnboardingComplete && !isEditMode) navigate("/", { replace: true });
  }, [session, isOnboardingComplete, isEditMode, navigate]);

  useEffect(() => {
    setProfile(saved);
  }, [saved]);

  if (!session || (isOnboardingComplete && !isEditMode)) return null;

  const patch = (p: Partial<BrokerProfile>) => setProfile((prev) => ({ ...prev, ...p }));

  const goNext = () => {
    const stepErrors = validateOnboardingStep(step, profile);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setBannerError("Fix the highlighted fields to continue.");
      return;
    }
    setErrors({});
    setBannerError(null);
    if (step === 4) {
      completeOnboarding(profile);
      navigate(isEditMode ? "/broker/profile" : "/", { replace: true });
      return;
    }
    const next = step + 1;
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
    setSlideKey((k) => k + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setErrors({});
    setBannerError(null);
    setStep((s) => s - 1);
    setSlideKey((k) => k + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <aside className="flex w-full flex-col border-b border-hairline bg-sidebar px-6 py-8 lg:w-[320px] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="mb-8 flex items-center gap-2">
          <span className="icon-btn border-primary/20 bg-primary/5 text-primary">
            <Navigation size={16} />
          </span>
          <span className="text-base font-semibold text-swatch-charcoal">Accolade</span>
        </div>
        <OnboardingStepper activeStep={step} maxReached={maxReached} />
        <p className="mt-auto hidden pt-8 text-xs text-ink-muted lg:block">
          Step {step + 1} of {STEP_TITLES.length}
        </p>
      </aside>

      <main className="flex min-h-0 flex-1 flex-col px-6 py-8 lg:px-12 lg:py-10">
        <div
          key={slideKey}
          className="mx-auto flex w-full max-w-xl flex-1 flex-col transition-opacity duration-300"
        >
          <h1 className="text-xl font-bold text-ink">{STEP_TITLES[step]}</h1>
          <p className="page-lede mt-1">Tell clients how you work. Fields marked with * are required.</p>

          {bannerError && (
            <p className="mt-4 rounded-lg border border-status-awaiting/30 bg-status-awaitingBg px-3 py-2 text-sm text-status-awaiting" role="alert">
              {bannerError}
            </p>
          )}

          <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-6">
            <OnboardingStepPanel step={step} profile={profile} onChange={patch} errors={errors} />
          </div>

          <div className="mt-auto space-y-4 border-t border-hairline pt-4">
            <div className="flex gap-1.5" aria-hidden>
              {STEP_TITLES.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= step ? "bg-primary" : "bg-hairline",
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between gap-3">
              <button type="button" onClick={goBack} className="btn-outline !w-auto gap-1.5" disabled={step === 0}>
                Back
                <ChevronLeft size={16} />
              </button>
              <button type="button" onClick={goNext} className="btn-primary !w-auto gap-1.5">
                {step === 4 ? (isEditMode ? "Save profile" : "Finish") : "Continue"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}