// ViewModel Layer - Location Management Logic

import { useState, useCallback, useEffect } from 'react';
import { BrazilianState, BrazilianCity } from '@/model/entities';
import { ILocationRepository } from '@/model/repositories';

// State Type
export interface UseLocationViewModelState {
  states: BrazilianState[];
  cities: BrazilianCity[];
  selectedState: string;
  selectedCity: string;
  loading: boolean;
}

// Actions Type
export interface UseLocationViewModelActions {
  setSelectedState: (stateCode: string) => void;
  setSelectedCity: (city: string) => void;
  loadCities: (stateCode: string) => Promise<void>;
  reset: () => void;
}

// ViewModel Return Type
export interface UseLocationViewModelReturn {
  state: UseLocationViewModelState;
  actions: UseLocationViewModelActions;
}

export function useLocationViewModel(
  locationRepository: ILocationRepository,
  initialState?: string,
  initialCity?: string
): UseLocationViewModelReturn {
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [cities, setCities] = useState<BrazilianCity[]>([]);
  const [selectedState, setSelectedState] = useState(initialState || '');
  const [selectedCity, setSelectedCity] = useState(initialCity || '');
  const [loading, setLoading] = useState(false);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      const data = await locationRepository.getStates();
      setStates(data);
    };
    loadStates();
  }, [locationRepository]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      loadCities(selectedState);
    } else {
      setCities([]);
    }
  }, [selectedState]);

  // Load cities for a state
  const loadCities = useCallback(async (stateCode: string) => {
    setLoading(true);
    try {
      const data = await locationRepository.getCitiesByState(stateCode);
      setCities(data);
    } finally {
      setLoading(false);
    }
  }, [locationRepository]);

  // Handle state change
  const handleStateChange = useCallback((stateCode: string) => {
    setSelectedState(stateCode);
    setSelectedCity(''); // Reset city when state changes
  }, []);

  // Reset selections
  const reset = useCallback(() => {
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
  }, []);

  return {
    state: {
      states,
      cities,
      selectedState,
      selectedCity,
      loading,
    },
    actions: {
      setSelectedState: handleStateChange,
      setSelectedCity,
      loadCities,
      reset,
    },
  };
}
