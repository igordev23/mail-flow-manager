// ViewModel Layer - Email History ViewModel (Supabase)

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Email, EmailFilter, BrazilianState } from '@/model/entities';
import { ILocationRepository } from '@/model/repositories';
import { FilterEmailsUseCase, ExportEmailsUseCase, DeleteEmailUseCase } from '@/model/usecases';
import { toast } from '@/hooks/use-toast';

// State Type
export interface UseEmailHistoryViewModelState {
  emails: Email[];
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
  deleteEmail: (email: Email) => Promise<void>;
  refreshEmails: () => Promise<void>;
}

// ViewModel Return Type
export interface UseEmailHistoryViewModelReturn {
  state: UseEmailHistoryViewModelState;
  actions: UseEmailHistoryViewModelActions;
}

/**
 * Atualizado para receber emails e refresh do contexto
 */
export function useEmailHistoryViewModel(
  locationRepository: ILocationRepository,
  contextEmails: Email[],                     // emails do contexto
  contextRefreshEmails: () => Promise<void>  // refresh do contexto
): UseEmailHistoryViewModelReturn {
  const filterEmailsUseCase = useMemo(() => new FilterEmailsUseCase(), []);
  const exportEmailsUseCase = useMemo(() => new ExportEmailsUseCase(), []);

  const [emails, setEmails] = useState<Email[]>(contextEmails);
  const [filter, setFilter] = useState<EmailFilter>({ status: 'all' });
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Sincroniza emails internos com os do contexto
  useEffect(() => {
    setEmails(contextEmails);
  }, [contextEmails]);

  // Carregar estados
  useEffect(() => {
    const loadStates = async () => {
      try {
        const data = await locationRepository.getStates();
        setStates(data);
      } catch (err) {
        console.error('Erro ao carregar estados:', err);
      }
    };
    loadStates();
  }, [locationRepository]);

  const filteredEmails = useMemo(
    () => filterEmailsUseCase.execute(emails, filter),
    [emails, filter, filterEmailsUseCase]
  );

  const setSearch = useCallback((search: string) => setFilter(prev => ({ ...prev, search })), []);
  const setStatus = useCallback((status: 'all' | 'pending' | 'classified') => setFilter(prev => ({ ...prev, status })), []);
  const setState = useCallback((state: string | undefined) => setFilter(prev => ({ ...prev, state, city: undefined })), []);
  const clearFilters = useCallback(() => setFilter({ status: 'all' }), []);
  const toggleFilters = useCallback(() => setShowFilters(prev => !prev), []);

  const exportEmails = useCallback(() => {
    exportEmailsUseCase.execute(filteredEmails);
    toast({
      title: 'Exportação concluída',
      description: `${filteredEmails.length} e-mail(s) exportado(s).`,
    });
  }, [filteredEmails, exportEmailsUseCase]);

  const deleteEmail = useCallback(async (email: Email) => {
    try {
      // 🔹 Usa o refresh do contexto após exclusão
      await contextRefreshEmails();
      toast({
        title: 'E-mail excluído',
        description: 'O e-mail foi removido com sucesso.',
      });
      setSelectedEmail(null);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o e-mail.',
        variant: 'destructive',
      });
    }
  }, [contextRefreshEmails]);

  const refreshEmails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await contextRefreshEmails(); // 🔹 atualiza via contexto
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar e-mails');
    } finally {
      setLoading(false);
    }
  }, [contextRefreshEmails]);

  return {
    state: {
      emails,
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
      deleteEmail,
      refreshEmails,
    },
  };
}
