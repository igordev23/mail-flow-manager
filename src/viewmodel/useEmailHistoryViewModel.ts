// ViewModel Layer - Email History ViewModel

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Email, EmailFilter, BrazilianState } from '@/model/entities';
import { ILocationRepository } from '@/model/repositories';
import { FilterEmailsUseCase, ExportEmailsUseCase } from '@/model/usecases';
import { toast } from '@/hooks/use-toast';

// State Type
export interface UseEmailHistoryViewModelState {
  filteredEmails: Email[];
  filter: EmailFilter;
  states: BrazilianState[];
  selectedEmail: Email | null;
  showFilters: boolean;
  loading: boolean;
  error: string | null;
}

// Actions Type
export interface UseEmailHistoryViewModelActions {
  setSearch: (search: string) => void;
  setStatus: (status: 'all' | 'pending' | 'classified') => void;
  setState: (state: string | undefined) => void;
  clearFilters: () => void;
  setSelectedEmail: (email: Email | null) => void;
  toggleFilters: () => void;
  exportEmails: () => void;
}

// ViewModel Return Type
export interface UseEmailHistoryViewModelReturn {
  state: UseEmailHistoryViewModelState;
  actions: UseEmailHistoryViewModelActions;
}

export function useEmailHistoryViewModel(
  emails: Email[],
  locationRepository: ILocationRepository,
  loading: boolean,
  error: string | null
): UseEmailHistoryViewModelReturn {
  const [filter, setFilter] = useState<EmailFilter>({ status: 'all' });
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filterEmailsUseCase = useMemo(() => new FilterEmailsUseCase(), []);
  const exportEmailsUseCase = useMemo(() => new ExportEmailsUseCase(), []);

  // Load states
  useEffect(() => {
    const loadStates = async () => {
      const data = await locationRepository.getStates();
      setStates(data);
    };
    loadStates();
  }, [locationRepository]);

  const filteredEmails = useMemo(
    () => filterEmailsUseCase.execute(emails, filter),
    [emails, filter, filterEmailsUseCase]
  );

  const setSearch = useCallback((search: string) => {
    setFilter(prev => ({ ...prev, search }));
  }, []);

  const setStatus = useCallback((status: 'all' | 'pending' | 'classified') => {
    setFilter(prev => ({ ...prev, status }));
  }, []);

  const setState = useCallback((state: string | undefined) => {
    setFilter(prev => ({ ...prev, state, city: undefined }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({ status: 'all' });
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const exportEmails = useCallback(() => {
    exportEmailsUseCase.execute(filteredEmails);
    toast({
      title: 'Exportação concluída',
      description: `${filteredEmails.length} e-mail(s) exportado(s).`,
    });
  }, [filteredEmails, exportEmailsUseCase]);

  return {
    state: {
      filteredEmails,
      filter,
      states,
      selectedEmail,
      showFilters,
      loading,
      error,
    },
    actions: {
      setSearch,
      setStatus,
      setState,
      clearFilters,
      setSelectedEmail,
      toggleFilters,
      exportEmails,
    },
  };
}
