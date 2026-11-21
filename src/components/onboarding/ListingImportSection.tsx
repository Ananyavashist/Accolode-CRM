import { useRef, useState } from "react";
import type { BrokerProfile } from "@/types/broker";
import { buildReferralUrl, generateReferralToken, maskReferralUrl } from "@/lib/brokerReferral";
import { PaperclipIcon } from "@/components/ui/icons";
interface ListingImportSectionProps {
  profile: BrokerProfile;
  onChange: (patch: Partial<BrokerProfile>) => void;
  errors: Partial<Record<string, string>>;
}

export function ListingImportSection({ profile, onChange, errors }: ListingImportSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLink, setShowLink] = useState(false);

  const appendFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next = [...profile.listingFiles];
    for (const file of Array.from(files)) {
      if (/\.(xlsx|xls|csv)$/i.test(file.name)) {
        next.push({ name: file.name });
      }
    }
    onChange({ listingFiles: next });
  };

  const generateLink = () => {
    const token = generateReferralToken();
    const url = buildReferralUrl(token);
    onChange({
      referralLink: url,
      referralLinkGeneratedAt: new Date().toISOString(),
    });
    setShowLink(false);
  };

  const displayUrl = profile.referralLink
    ? showLink
      ? profile.referralLink
      : maskReferralUrl(profile.referralLink)
    : "";

  return (
    <div className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">
          How do you want to add listings?<span className="text-status-awaiting"> *</span>
        </legend>
        {(
          [
            ["now", "Import them now"],
            ["later", "Add them later"],
            ["connect", "Connect a listing source"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name="listingImport"
              checked={profile.listingImportChoice === value}
              onChange={() => onChange({ listingImportChoice: value })}
              className="h-4 w-4 accent-primary"
            />
            {label}
          </label>
        ))}
        {errors.listingImportChoice && (
          <p className="text-xs text-status-awaiting" role="alert">
            {errors.listingImportChoice}
          </p>
        )}
      </fieldset>

      {profile.listingImportChoice === "now" && (
        <div>
          <p className="text-sm font-medium text-ink">Upload Excel (optional)</p>
          <p className="mt-0.5 text-xs text-ink-muted">.xlsx or .csv — stored locally in this demo only.</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline bg-sidebar px-4 py-8 text-sm text-ink-muted transition-colors hover:border-primary/40 hover:bg-surface"
          >
            <PaperclipIcon size={20} className="text-primary" />
            Attach listing spreadsheet
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            multiple
            onChange={(e) => appendFiles(e.target.files)}
          />
          {profile.listingFiles.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-ink-muted">
              {profile.listingFiles.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="rounded-xl border border-hairline bg-sidebar/50 p-4">
        <p className="text-sm font-medium text-ink">Personal referral link</p>
        <p className="mt-1 text-xs text-ink-muted">
          Share this encrypted style link with prospects after onboarding.
        </p>
        <button type="button" onClick={generateLink} className="btn-primary mt-3 !w-auto">
          Generate personal link
        </button>
        {profile.referralLink && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <input readOnly value={displayUrl} className="input-field h-9 flex-1 font-mono text-xs" />
              <button
                type="button"
                onClick={() => setShowLink((v) => !v)}
                className="btn-outline !w-auto px-3"
                aria-label={showLink ? "Hide link" : "Show link"}
              >
                {showLink ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        {errors.referralLink && (
          <p className="mt-2 text-xs text-status-awaiting" role="alert">
            {errors.referralLink}
          </p>
        )}
      </div>
    </div>
  );
}