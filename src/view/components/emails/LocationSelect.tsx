// View Layer - Location Select Component

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locationRepository } from '@/contexts/EmailContext';
import { BrazilianState, BrazilianCity } from '@/model/entities';

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
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [cities, setCities] = useState<BrazilianCity[]>([]);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      const data = await locationRepository.getStates();
      setStates(data);
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedState) {
        const data = await locationRepository.getCitiesByState(selectedState);
        setCities(data);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [selectedState]);

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
          {states.map((state) => (
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
