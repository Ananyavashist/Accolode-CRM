import { useEffect, useMemo, useState } from "react";
import { X } from "@/components/ui/icons";
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

  const localities = useMemo(
    () => (form.city ? LOCALITIES[form.city] ?? [] : []),
    [form.city],
  );

  useEffect(() => {
    if (!addClientOpen) {
      setForm(INITIAL);
      setToast(null);
      setErrors({});
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

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40 sm:items-center sm:p-4"
        onClick={closeAddClient}
        role="presentation"
      >
        <div
          className="section-card flex h-full w-full max-w-4xl flex-col overflow-hidden shadow-pop sm:h-auto sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-client-title"
        >
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <h2 id="add-client-title" className="text-ink">
              Add New Client
            </h2>
            <button
              onClick={closeAddClient}
              className="icon-btn rounded-[10px]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid flex-1 overflow-y-auto lg:grid-cols-2">
            <div className="space-y-5 border-b border-hairline p-5 lg:border-b-0 lg:border-r">
              <label className="block">
                <span className="text-sm font-medium text-ink">Name</span>
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
                <span className="text-sm font-medium text-ink">Phone</span>
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
              />
              <SelectDropdown
                label="Is the client willing to rent or buy a property?"
                value={form.dealType}
                options={["Rent", "Buy"]}
                onChange={(v) => patch({ dealType: v as AddClientInput["dealType"] })}
                disabled={false}
              />
              <SelectDropdown
                label="What city are they looking to shift to?"
                value={form.city}
                options={CITIES}
                onChange={(v) => patch({ city: v, locality: "" })}
                disabled={false}
              />
              <SelectDropdown
                label="Are there any specific localities?"
                value={form.locality}
                options={localities}
                onChange={(v) => patch({ locality: v })}
                placeholder={form.city ? "Select an option" : "Select a city first"}
                disabled={false}
              />

              <div className="space-y-3 pt-1">
                <h3 className="text-ink">Property Specifications</h3>
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted">House Type</p>
                  <ChipSelect
                    options={HOUSE_TYPES}
                    value={form.houseType}
                    onChange={(v) => patch({ houseType: v })}
                    disabled={false}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted">Bedrooms</p>
                  <ChipSelect
                    options={BEDROOMS}
                    value={form.bedrooms}
                    onChange={(v) => patch({ bedrooms: v })}
                    disabled={false}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 p-5">
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm text-ink-muted">Furnishing Preference</p>
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

              <div className="flex justify-end">
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
        </div>
      </div>

      {toast && <Snackbar message={toast} />}
    </>
  );
}
