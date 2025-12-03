import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { brazilianStates } from '@/data/mockData';
import { useEmails } from '@/contexts/EmailContext';

interface LocationSelectProps {
  selectedState?: string;
  selectedCity?: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  compact?: boolean;
}

export function LocationSelect({
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  compact = false,
}: LocationSelectProps) {
  const { getCitiesByState } = useEmails();
  const [cities, setCities] = useState<Array<{ name: string; stateCode: string }>>([]);

  useEffect(() => {
    if (selectedState) {
      setCities(getCitiesByState(selectedState));
    } else {
      setCities([]);
    }
  }, [selectedState, getCitiesByState]);

  const handleStateChange = (value: string) => {
    onStateChange(value);
    onCityChange('');
  };

  return (
    <div className={compact ? "flex gap-2" : "grid gap-4 sm:grid-cols-2"}>
      <Select value={selectedState || ''} onValueChange={handleStateChange}>
        <SelectTrigger className={compact ? "w-[100px]" : ""}>
          <SelectValue placeholder="Estado (UF)" />
        </SelectTrigger>
        <SelectContent>
          {brazilianStates.map((state) => (
            <SelectItem key={state.code} value={state.code}>
              {state.code} - {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedCity || ''} 
        onValueChange={onCityChange}
        disabled={!selectedState}
      >
        <SelectTrigger className={compact ? "w-[140px]" : ""}>
          <SelectValue placeholder="Município" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
