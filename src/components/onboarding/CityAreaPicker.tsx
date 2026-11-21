import { useState } from "react";
import { BROKER_CITY_OPTIONS, areasForCity } from "@/data/brokerAreas";
import type { BrokerCityCoverage } from "@/types/broker";
import { MultiSelectCombobox } from "@/components/ui/MultiSelectCombobox";
import { Plus, X } from "@/components/ui/icons";

interface CityAreaPickerProps {
  cities: BrokerCityCoverage[];
  onChange: (cities: BrokerCityCoverage[]) => void;
  error?: string;
}

export function CityAreaPicker({ cities, onChange, error }: CityAreaPickerProps) {
  const [pickCity, setPickCity] = useState("");
  const usedCities = new Set(cities.map((c) => c.city));
  const availableToAdd = BROKER_CITY_OPTIONS.filter((c) => !usedCities.has(c));

  const addCity = () => {
    if (!pickCity || usedCities.has(pickCity)) return;
    onChange([...cities, { city: pickCity, areas: [] }]);
    setPickCity("");
  };

  const removeCity = (city: string) => {
    onChange(cities.filter((c) => c.city !== city));
  };

  const setAreas = (city: string, areas: string[]) => {
    onChange(cities.map((c) => (c.city === city ? { ...c, areas } : c)));
  };

  return (
    <div className="space-y-4">
      {cities.map((entry) => (
        <div key={entry.city} className="rounded-xl border border-hairline bg-sidebar/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-ink">{entry.city}</h3>
            <button
              type="button"
              onClick={() => removeCity(entry.city)}
              className="icon-btn-sm text-ink-soft hover:text-status-awaiting"
              aria-label={`Remove ${entry.city}`}
            >
              <X size={14} />
            </button>
          </div>
          <MultiSelectCombobox
            label="Areas you cover"
            options={areasForCity(entry.city)}
            value={entry.areas}
            onChange={(areas) => setAreas(entry.city, areas)}
            required
            placeholder="Search areas, e.g. Saket"
          />
        </div>
      ))}

      {availableToAdd.length > 0 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1">
            <span className="text-sm font-medium text-ink">Add city</span>
            <select
              value={pickCity}
              onChange={(e) => setPickCity(e.target.value)}
              className="input-field mt-1.5"
            >
              <option value="">Select a city</option>
              {availableToAdd.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={addCity} className="btn-outline !w-auto gap-1.5" disabled={!pickCity}>
            <Plus size={16} />
            Add city
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-status-awaiting" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}