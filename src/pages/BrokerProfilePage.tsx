import { useState, type ReactNode } from "react";
import { OnboardingStepPanel } from "@/components/onboarding/OnboardingStepPanel";
import { Pencil, Share2 } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/Avatar";
import { validateOnboardingStep, type BrokerFieldErrors } from "@/lib/brokerOnboardingValidation";
import type { BrokerProfile } from "@/types/broker";
import { useBroker } from "@/store/BrokerContext";
import { cn, formatDisplayCopy } from "@/lib/utils";

function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("section-card flex h-full min-h-0 flex-col p-4", className)}>
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <div className="mt-3 flex flex-1 flex-col gap-3">{children}</div>
    </section>
  );
}

function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-hairline bg-sidebar/40 px-3 py-2.5">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{formatDisplayCopy(value) || "—"}</p>
    </div>
  );
}

function mergeProfileValidation(profile: BrokerProfile): BrokerFieldErrors {
  const merged: BrokerFieldErrors = {};
  for (let step = 0; step <= 4; step++) {
    Object.assign(merged, validateOnboardingStep(step, profile));
  }
  return merged;
}

const PROFILE_SECTION_STEPS = [
  { title: "Personal information", step: 0 },
  { title: "Area coverage", step: 1 },
  { title: "What you handle", step: 2 },
  { title: "How you work with clients", step: 3 },
  { title: "Your listings", step: 4 },
] as const;

export function BrokerProfilePage() {
  const { profile, setProfile } = useBroker();
  const [shareCopied, setShareCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<BrokerProfile>(profile);
  const [errors, setErrors] = useState<BrokerFieldErrors>({});
  const [saveError, setSaveError] = useState<string | null>(null);

  const display = isEditing ? draft : profile;

  const startEditing = () => {
    setDraft(profile);
    setErrors({});
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setErrors({});
    setSaveError(null);
    setIsEditing(false);
  };

  const patchDraft = (patch: Partial<BrokerProfile>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const saveProfile = () => {
    const stepErrors = mergeProfileValidation(draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setSaveError("Fix the highlighted fields to save your profile.");
      return;
    }
    setErrors({});
    setSaveError(null);
    setProfile(draft);
    setIsEditing(false);
  };

  const copyReferral = async () => {
    if (!profile.referralLink) return;
    try {
      await navigator.clipboard.writeText(profile.referralLink);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareLink = async () => {
    if (!profile.referralLink) return;
    try {
      await navigator.clipboard.writeText(profile.referralLink);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const outsideLabel =
    display.outsideAreasPolicy === "yes"
      ? "Yes"
      : display.outsideAreasPolicy === "budget_only"
        ? "Only if budget fits"
        : "No";

  const importLabel =
    display.listingImportChoice === "now"
      ? "Import now"
      : display.listingImportChoice === "later"
        ? "Add later"
        : "Connect source";

  return (
    <div className="page w-full max-w-none">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={display.fullName} src={display.photoUrl} size={64} />
          <div>
            <h1 className="text-2xl font-bold text-ink">{display.fullName || "Your profile"}</h1>
            <p className="text-sm text-ink-muted">{display.email}</p>
            {isEditing && (
              <p className="mt-1 text-xs font-medium text-primary">Editing — changes are not saved until you save.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <button type="button" onClick={cancelEditing} className="btn-outline !w-auto">
                Cancel
              </button>
              <button type="button" onClick={saveProfile} className="btn-primary !w-auto">
                Save profile
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={startEditing} className="btn-secondary !w-auto gap-1.5">
                <Pencil size={16} />
                Edit
              </button>
              <button
                type="button"
                onClick={shareLink}
                disabled={!profile.referralLink}
                className="btn-primary !w-auto gap-1.5 disabled:opacity-50"
              >
                <Share2 size={16} />
                {shareCopied ? "Link copied" : "Share my link"}
              </button>
            </>
          )}
        </div>
      </header>

      {saveError && (
        <p
          className="mt-4 rounded-lg border border-status-awaiting/30 bg-status-awaitingBg px-3 py-2 text-sm text-status-awaiting"
          role="alert"
        >
          {saveError}
        </p>
      )}

      <div className="mt-section flex flex-col gap-section">
        {isEditing ? (
          <>
            <div className="grid gap-section lg:grid-cols-2 lg:items-stretch">
              {PROFILE_SECTION_STEPS.slice(0, 4).map(({ title, step }) => (
                <Section key={title} title={title}>
                  <OnboardingStepPanel step={step} profile={draft} onChange={patchDraft} errors={errors} />
                </Section>
              ))}
            </div>
            <Section title="Your listings">
              <OnboardingStepPanel step={4} profile={draft} onChange={patchDraft} errors={errors} />
            </Section>
          </>
        ) : (
          <>
            <div className="grid gap-section lg:grid-cols-2 lg:items-stretch">
              <Section title="Personal information">
                <FieldRow>
                  <Field label="Phone" value={profile.phone} />
                  <Field label="Email" value={profile.email} />
                </FieldRow>
                <FieldRow>
                  <Field
                    label="Practice"
                    value={
                      profile.practiceType === "agency"
                        ? `Agency · ${profile.agencyName ?? ""}`
                        : "Independent"
                    }
                  />
                  <Field label="RERA registration" value={profile.reraNumber} />
                </FieldRow>
                <FieldRow>
                  <Field label="Years in real estate" value={String(profile.yearsInRealEstate)} />
                  <Field label="Full name" value={profile.fullName} />
                </FieldRow>
              </Section>

              <Section title="Area coverage">
                {profile.cities.map((c) => (
                  <FieldRow key={c.city}>
                    <Field label="City" value={c.city} />
                    <Field label="Areas" value={c.areas.join(", ")} />
                  </FieldRow>
                ))}
                <FieldRow>
                  <Field label="Leads outside areas" value={outsideLabel} />
                </FieldRow>
              </Section>

              <Section title="What you handle">
                <FieldRow>
                  <Field
                    label="Rent, buy, or both"
                    value={profile.dealTypes.map((d) => (d === "rent" ? "Rent" : "Buy")).join(", ")}
                  />
                  <Field label="Property types" value={profile.propertyTypes.join(", ")} />
                </FieldRow>
                <FieldRow>
                  <Field label="Home sizes" value={profile.bhkSizes.join(", ")} />
                  <Field label="Furnishing" value={profile.furnishingOptions.join(", ")} />
                </FieldRow>
              </Section>

              <Section title="How you work with clients">
                <FieldRow>
                  <Field label="Languages" value={profile.languages.join(", ")} />
                  <Field label="Knowledge of tech" value={profile.techComfort ? "Yes" : "No"} />
                </FieldRow>
                <FieldRow>
                  <Field label="Clients managed online" value={String(profile.clientsManagedOnline)} />
                  <Field
                    label="Clients managed in person"
                    value={String(profile.clientsManagedInPerson)}
                  />
                </FieldRow>
              </Section>
            </div>

            <Section title="Your listings">
              <FieldRow>
                <Field label="Properties on hand" value={String(profile.listingCount)} />
                <Field label="Import preference" value={importLabel} />
              </FieldRow>
              {profile.referralLink && (
                <div className="rounded-lg border border-hairline bg-sidebar/40 px-3 py-2.5">
                  <p className="text-xs font-medium text-ink-soft">Referral link</p>
                  <div className="mt-1.5 flex min-w-0 items-center gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink" title={profile.referralLink}>
                      {profile.referralLink}
                    </p>
                    <button
                      type="button"
                      onClick={copyReferral}
                      className="btn-outline !w-auto shrink-0 px-3 py-1.5 text-xs font-medium"
                    >
                      {linkCopied ? "Copied to clipboard" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  );
}