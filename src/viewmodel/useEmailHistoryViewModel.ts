// ViewModel Layer - Email History ViewModel (Supabase)

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Email, EmailFilter, BrazilianState } from '@/model/entities';
import { ILocationRepository } from '@/model/repositories';
import { FilterEmailsUseCase, ExportEmailsUseCase, DeleteEmailUseCase } from '@/model/usecases';
import { EmailRepositorySupabase } from '@/model/repositories/EmailRepositorySupabase';
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

export function useEmailHistoryViewModel(
  locationRepository: ILocationRepository
): UseEmailHistoryViewModelReturn {
  const emailRepository = useMemo(() => new EmailRepositorySupabase(), []);
  const filterEmailsUseCase = useMemo(() => new FilterEmailsUseCase(), []);
  const exportEmailsUseCase = useMemo(() => new ExportEmailsUseCase(), []);
  const deleteEmailUseCase = useMemo(() => new DeleteEmailUseCase(emailRepository), [emailRepository]);

  const [emails, setEmails] = useState<Email[]>([]);
  const [filter, setFilter] = useState<EmailFilter>({ status: 'all' });
  const [states, setStates] = useState<BrazilianState[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar emails
  const refreshEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const inbox = await emailRepository.list();
      setEmails(inbox);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar e-mails');
    } finally {
      setLoading(false);
    }
  }, [emailRepository]);

  // Carregar estados
  useEffect(() => {
    const loadStates = async () => {
      const data = await locationRepository.getStates();
      setStates(data);
    };
    loadStates();
  }, [locationRepository]);

  useEffect(() => {
    refreshEmails(); // primeira carga
  }, [refreshEmails]);

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
      await deleteEmailUseCase.execute(email.id);
      toast({
        title: 'E-mail excluído',
        description: 'O e-mail foi removido com sucesso.',
      });
      await refreshEmails(); // 🔹 atualiza a lista após exclusão
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o e-mail.',
        variant: 'destructive',
      });
    }
  }, [deleteEmailUseCase, refreshEmails]);

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
