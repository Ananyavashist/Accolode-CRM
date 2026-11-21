import { CityAreaPicker } from "@/components/onboarding/CityAreaPicker";
import { ListingImportSection } from "@/components/onboarding/ListingImportSection";
import { MultiSelectCombobox } from "@/components/ui/MultiSelectCombobox";
import { Avatar } from "@/components/ui/Avatar";
import { BROKER_LANGUAGE_OPTIONS } from "@/data/brokerLanguages";
import type { BrokerFieldErrors } from "@/lib/brokerOnboardingValidation";
import type {
  BrokerBhkSize,
  BrokerDealType,
  BrokerFurnishing,
  BrokerProfile,
  BrokerPropertyType,
} from "@/types/broker";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES: BrokerPropertyType[] = [
  "Apartment",
  "Builder floor",
  "Independent house",
  "Villa",
  "Commercial",
];
const BHK: BrokerBhkSize[] = ["1BHK", "2BHK", "3BHK", "4BHK+"];
const FURNISHING: BrokerFurnishing[] = ["Furnished", "Semi furnished", "Unfurnished", "Any"];

function ChipToggle<T extends string>({
  options,
  value,
  onChange,
  labelFor,
}: {
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  labelFor?: (opt: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() =>
              onChange(on ? value.filter((v) => v !== opt) : [...value, opt])
            }
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              on
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-hairline bg-surface text-ink-muted hover:border-primary/30",
            )}
          >
            {labelFor ? labelFor(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-status-awaiting" role="alert">
      {message}
    </p>
  );
}

interface OnboardingStepPanelProps {
  step: number;
  profile: BrokerProfile;
  onChange: (patch: Partial<BrokerProfile>) => void;
  errors: BrokerFieldErrors;
}

export function OnboardingStepPanel({ step, profile, onChange, errors }: OnboardingStepPanelProps) {
  if (step === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar name={profile.fullName || "Broker"} src={profile.photoUrl} size={56} />
          <label className="block">
            <span className="text-sm font-medium text-ink">Profile photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              className="mt-1.5 block w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border file:border-hairline file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => onChange({ photoUrl: String(reader.result) });
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">
            Full name<span className="text-status-awaiting"> *</span>
          </span>
          <input
            value={profile.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="input-field mt-1.5"
            aria-invalid={Boolean(errors.fullName)}
          />
          <FieldError message={errors.fullName} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Phone<span className="text-status-awaiting"> *</span>
            </span>
            <input
              value={profile.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="input-field mt-1.5"
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldError message={errors.phone} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Email<span className="text-status-awaiting"> *</span>
            </span>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="input-field mt-1.5"
              aria-invalid={Boolean(errors.email)}
            />
            <FieldError message={errors.email} />
          </label>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">
            Practice type<span className="text-status-awaiting"> *</span>
          </legend>
          {(["agency", "independent"] as const).map((value) => (
            <label key={value} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="practice"
                checked={profile.practiceType === value}
                onChange={() => onChange({ practiceType: value })}
                className="h-4 w-4 accent-primary"
              />
              {value === "agency" ? "Agency" : "Independent"}
            </label>
          ))}
        </fieldset>

        {profile.practiceType === "agency" && (
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Agency name<span className="text-status-awaiting"> *</span>
            </span>
            <input
              value={profile.agencyName ?? ""}
              onChange={(e) => onChange({ agencyName: e.target.value })}
              className="input-field mt-1.5"
              aria-invalid={Boolean(errors.agencyName)}
            />
            <FieldError message={errors.agencyName} />
          </label>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">
              RERA registration number<span className="text-status-awaiting"> *</span>
            </span>
            <input
              value={profile.reraNumber}
              onChange={(e) => onChange({ reraNumber: e.target.value })}
              className="input-field mt-1.5"
              aria-invalid={Boolean(errors.reraNumber)}
            />
            <FieldError message={errors.reraNumber} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Years in real estate<span className="text-status-awaiting"> *</span>
            </span>
            <input
              type="number"
              min={0}
              value={profile.yearsInRealEstate || ""}
              onChange={(e) => onChange({ yearsInRealEstate: Number(e.target.value) || 0 })}
              className="input-field mt-1.5"
              aria-invalid={Boolean(errors.yearsInRealEstate)}
            />
            <FieldError message={errors.yearsInRealEstate} />
          </label>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-5">
        <CityAreaPicker
          cities={profile.cities}
          onChange={(cities) => onChange({ cities })}
          error={errors.cities}
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">
            Do you take leads from outside these areas?<span className="text-status-awaiting"> *</span>
          </legend>
          {(
            [
              ["yes", "Yes"],
              ["budget_only", "Only if budget fits"],
              ["no", "No"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="outsideAreas"
                checked={profile.outsideAreasPolicy === value}
                onChange={() => onChange({ outsideAreasPolicy: value })}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
          <FieldError message={errors.outsideAreasPolicy} />
        </fieldset>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-ink">
            Rent, buy, or both?<span className="text-status-awaiting"> *</span>
          </p>
          <div className="mt-2">
            <ChipToggle<BrokerDealType>
              options={["rent", "buy"]}
              value={profile.dealTypes}
              onChange={(dealTypes) => onChange({ dealTypes })}
              labelFor={(o) => (o === "rent" ? "Rent" : "Buy")}
            />
          </div>
          <FieldError message={errors.dealTypes} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            Property types<span className="text-status-awaiting"> *</span>
          </p>
          <div className="mt-2">
            <ChipToggle value={profile.propertyTypes} options={PROPERTY_TYPES} onChange={(propertyTypes) => onChange({ propertyTypes })} />
          </div>
          <FieldError message={errors.propertyTypes} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            Home sizes<span className="text-status-awaiting"> *</span>
          </p>
          <div className="mt-2">
            <ChipToggle value={profile.bhkSizes} options={BHK} onChange={(bhkSizes) => onChange({ bhkSizes })} />
          </div>
          <FieldError message={errors.bhkSizes} />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            Furnishing<span className="text-status-awaiting"> *</span>
          </p>
          <div className="mt-2">
            <ChipToggle
              value={profile.furnishingOptions}
              options={FURNISHING}
              onChange={(furnishingOptions) => onChange({ furnishingOptions })}
            />
          </div>
          <FieldError message={errors.furnishingOptions} />
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-5">
        <MultiSelectCombobox
          label="Languages you speak with clients"
          options={BROKER_LANGUAGE_OPTIONS}
          value={profile.languages}
          onChange={(languages) => onChange({ languages })}
          required
          error={errors.languages}
        />
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-ink">
            Do you have knowledge of tech?<span className="text-status-awaiting"> *</span>
          </legend>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="tech"
              checked={profile.techComfort === true}
              onChange={() => onChange({ techComfort: true })}
              className="h-4 w-4 accent-primary"
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="tech"
              checked={profile.techComfort === false}
              onChange={() => onChange({ techComfort: false })}
              className="h-4 w-4 accent-primary"
            />
            No
          </label>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">Clients managed online</span>
            <input
              type="number"
              min={0}
              value={profile.clientsManagedOnline || ""}
              onChange={(e) => onChange({ clientsManagedOnline: Number(e.target.value) || 0 })}
              className="input-field mt-1.5"
            />
            <FieldError message={errors.clientsManagedOnline} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Clients managed in person</span>
            <input
              type="number"
              min={0}
              value={profile.clientsManagedInPerson || ""}
              onChange={(e) => onChange({ clientsManagedInPerson: Number(e.target.value) || 0 })}
              className="input-field mt-1.5"
            />
            <FieldError message={errors.clientsManagedInPerson} />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-ink">
          How many properties do you currently have?<span className="text-status-awaiting"> *</span>
        </span>
        <input
          type="number"
          min={0}
          value={profile.listingCount || ""}
          onChange={(e) => onChange({ listingCount: Number(e.target.value) || 0 })}
          className="input-field mt-1.5"
        />
        <FieldError message={errors.listingCount} />
      </label>
      <ListingImportSection profile={profile} onChange={onChange} errors={errors} />
    </div>
  );
}