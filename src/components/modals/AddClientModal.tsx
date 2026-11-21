import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { ChipSelect } from "@/components/ui/ChipSelect";
import { RangeField } from "@/components/ui/RangeField";
import { Snackbar } from "@/components/ui/Snackbar";
import { useCrm } from "@/store/CrmContext";
import { useUi } from "@/store/UiContext";
import { CLIENT_SOURCE_OPTIONS, type AddClientInput, type ClientSource } from "@/types";

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Gurgaon", "Noida", "Pune"];
const LOCALITIES: Record<string, string[]> = {
  Mumbai: ["Andheri", "Bandra", "Powai", "South Mumbai"],
  Delhi: ["Chandni Chowk", "Connaught Place", "South Delhi", "Rajouri Garden"],
  Bengaluru: ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"],
  Gurgaon: ["Sikandarpur", "DLF Phase 1", "Cyber City"],
  Noida: ["Sector 18", "Sector 62", "Greater Noida"],
  Pune: ["Koregaon Park", "Hinjewadi", "Baner"],
};
const HOUSE_TYPES = ["Villa", "Duplex", "Apartment", "Bungalow", "Office Space"];
const BEDROOMS = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
const FURNISHING = ["Furnished", "Semi-Furnished", "Unfurnished"];

function clientIntakeLink(): string {
  if (typeof window === "undefined") return "https://accolade.app/client-intake";
  return `${window.location.origin}/client-intake`;
}

function formatPrice(v: number): string {
  if (v >= 1000000) return "10+ lacs";
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${Math.round(v / 1000)}K`;
  return `₹${v}`;
}

function formatArea(v: number): string {
  if (v >= 4000) return "4000+ sqft";
  return `${v} sqft`;
}

function formatTimeline(months: number): string {
  if (months >= 12) return "1 year";
  if (months === 0) return "Immediate";
  return `${months} month${months > 1 ? "s" : ""}`;
}

function RequiredMark() {
  return <span className="text-status-awaiting"> *</span>;
}

function RequiredFieldLabel({ children }: { children: string }) {
  return (
    <span className="text-sm font-medium text-ink">
      {children}
      <RequiredMark />
    </span>
  );
}

function RequiredChipLabel({ children }: { children: string }) {
  return (
    <p className="text-sm text-ink-muted">
      {children}
      <RequiredMark />
    </p>
  );
}

const INITIAL = {
  name: "",
  phone: "",
  email: "",
  source: "" as "" | ClientSource,
  dealType: "" as "" | AddClientInput["dealType"],
  city: "",
  locality: "",
  houseType: "",
  bedrooms: "",
  furnishing: "",
  priceMin: 5000,
  priceMax: 5000,
  areaMin: 0,
  areaMax: 0,
  availableFromMonths: 0,
};

export function AddClientModal() {
  const { addClientOpen, closeAddClient } = useUi();
  const { addClient } = useCrm();
  const [form, setForm] = useState(INITIAL);
  const [toast, setToast] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [linkCopied, setLinkCopied] = useState(false);

  const localities = useMemo(
    () => (form.city ? LOCALITIES[form.city] ?? [] : []),
    [form.city],
  );

  useEffect(() => {
    if (!addClientOpen) {
      setForm(INITIAL);
      setToast(null);
      setErrors({});
      setLinkCopied(false);
    }
  }, [addClientOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!addClientOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAddClient();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [addClientOpen, closeAddClient]);

  if (!addClientOpen) return null;

  const patch = (partial: Partial<typeof INITIAL>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const canSave =
    form.name.trim() &&
    form.phone.trim() &&
    form.source &&
    form.dealType &&
    form.city &&
    form.locality &&
    form.houseType &&
    form.bedrooms &&
    form.furnishing;

  const handleSave = () => {
    const next = {
      name: form.name.trim() ? undefined : "Name is required",
      phone: form.phone.trim() ? undefined : "Phone is required",
    };
    setErrors(next);
    if (next.name || next.phone || !canSave || !form.dealType || !form.source) return;
    addClient({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      source: form.source,
      dealType: form.dealType,
    });
    setToast("Client saved to Client Database");
    setTimeout(() => closeAddClient(), 600);
  };

  const handleCopyClientLink = async () => {
    const link = clientIntakeLink();
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setLinkCopied(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40 sm:items-center sm:p-4"
        onClick={closeAddClient}
        role="presentation"
      >
        <div
          className="section-card flex h-full w-full max-w-[1200px] flex-col overflow-hidden shadow-pop sm:h-auto sm:max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-client-title"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline px-5 py-4">
            <h2 id="add-client-title" className="text-ink">
              Add New Client
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleCopyClientLink}
                className={cn(
                  "btn !inline-flex !h-auto !w-auto min-w-[10.5rem] shrink-0 items-center gap-1.5 border !p-2 text-sm transition-colors duration-300",
                  linkCopied
                    ? "border-status-completed/30 bg-status-completedBg text-status-completed hover:bg-status-completedBg"
                    : "btn-secondary",
                )}
                aria-live="polite"
              >
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  <Plus
                    size={16}
                    aria-hidden
                    className={cn(
                      "absolute transition-all duration-300",
                      linkCopied ? "scale-75 opacity-0" : "scale-100 opacity-100",
                    )}
                  />
                  <CheckCircle2
                    size={16}
                    aria-hidden
                    className={cn(
                      "absolute transition-all duration-300",
                      linkCopied ? "scale-100 opacity-100" : "scale-75 opacity-0",
                    )}
                  />
                </span>
                <span className="inline-block h-4 overflow-hidden text-left">
                  <span
                    className={cn(
                      "block transition-transform duration-300 ease-out",
                      linkCopied && "-translate-y-4",
                    )}
                  >
                    <span className="block h-4 leading-4">Onboarding Link</span>
                    <span className="block h-4 leading-4">Copied to clipboard</span>
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={closeAddClient}
                className="icon-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-2">
            <div className="space-y-4 border-b border-hairline p-5 lg:border-b-0 lg:border-r">
              <label className="block">
                <RequiredFieldLabel>Name</RequiredFieldLabel>
                <input
                  value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  className="input-field mt-1.5"
                  autoFocus
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "add-client-name-error" : undefined}
                />
                {errors.name && (
                  <p id="add-client-name-error" className="mt-1 text-xs text-status-awaiting">
                    {errors.name}
                  </p>
                )}
              </label>
              <label className="block">
                <RequiredFieldLabel>Phone</RequiredFieldLabel>
                <input
                  value={form.phone}
                  onChange={(e) => patch({ phone: e.target.value })}
                  className="input-field mt-1.5"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "add-client-phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="add-client-phone-error" className="mt-1 text-xs text-status-awaiting">
                    {errors.phone}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  className="input-field mt-1.5"
                />
              </label>
              <SelectDropdown
                label="Source"
                value={form.source}
                options={[...CLIENT_SOURCE_OPTIONS]}
                onChange={(v) => patch({ source: v as ClientSource })}
                disabled={false}
                required
              />
              <SelectDropdown
                label="Is the client willing to rent or buy a property?"
                value={form.dealType}
                options={["Rent", "Buy"]}
                onChange={(v) => patch({ dealType: v as AddClientInput["dealType"] })}
                disabled={false}
                required
              />
              <SelectDropdown
                label="What city are they looking to shift to?"
                value={form.city}
                options={CITIES}
                onChange={(v) => patch({ city: v, locality: "" })}
                disabled={false}
                required
              />
              <SelectDropdown
                label="Are there any specific localities?"
                value={form.locality}
                options={localities}
                onChange={(v) => patch({ locality: v })}
                placeholder={form.city ? "Select an option" : "Select a city first"}
                disabled={false}
                required
              />
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-ink">Property Specifications</h3>
                  <div className="space-y-2">
                    <RequiredChipLabel>House Type</RequiredChipLabel>
                    <ChipSelect
                      options={HOUSE_TYPES}
                      value={form.houseType}
                      onChange={(v) => patch({ houseType: v })}
                      disabled={false}
                    />
                  </div>
                  <div className="space-y-2">
                    <RequiredChipLabel>Bedrooms</RequiredChipLabel>
                    <ChipSelect
                      options={BEDROOMS}
                      value={form.bedrooms}
                      onChange={(v) => patch({ bedrooms: v })}
                      disabled={false}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <RequiredChipLabel>Furnishing Preference</RequiredChipLabel>
                  <ChipSelect
                    options={FURNISHING}
                    value={form.furnishing}
                    onChange={(v) => patch({ furnishing: v })}
                    disabled={false}
                  />
                </div>

                <RangeField
                  label="Price (up to)"
                  min={5000}
                  max={1000000}
                  value={form.priceMax}
                  onChange={(v) => patch({ priceMax: v })}
                  formatValue={formatPrice}
                  ticks={["5000", "50,000", "10+ lacs"]}
                  disabled={false}
                />
                <RangeField
                  label="Area (up to, sq. ft.)"
                  min={0}
                  max={4000}
                  value={form.areaMax}
                  onChange={(v) => patch({ areaMax: v })}
                  formatValue={formatArea}
                  ticks={["0", "800", "4000+"]}
                  disabled={false}
                />
                <RangeField
                  label="Available from"
                  min={0}
                  max={12}
                  value={form.availableFromMonths}
                  onChange={(v) => patch({ availableFromMonths: v })}
                  formatValue={formatTimeline}
                  ticks={["0", "2 month", "1 year"]}
                  disabled={false}
                />
              </div>
            </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end border-t border-hairline bg-surface px-5 py-4">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Details
            </button>
          </div>
        </div>
      </div>

      {toast && <Snackbar message={toast} />}
    </>
  );
}
