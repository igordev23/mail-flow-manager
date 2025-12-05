// ViewModel Layer - Pending Emails ViewModel

import { useState, useCallback, useMemo } from 'react';
import { Email } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';
import { SavePendingEmailsUseCase, ExportEmailsUseCase, DeleteEmailUseCase } from '@/model/usecases';
import { toast } from '@/hooks/use-toast';

// State Type
export interface PendingUpdate {
  id: string;
  state: string;
  city: string;
}

export interface UsePendingEmailsViewModelState {
  pendingEmails: Email[];
  filteredEmails: Email[];
  updates: Record<string, PendingUpdate>;
  searchTerm: string;
  selectedEmail: Email | null;
  validUpdateCount: number;
  loading: boolean;
  error: string | null;
}

// Actions Type
export interface UsePendingEmailsViewModelActions {
  setSearchTerm: (term: string) => void;
  setSelectedEmail: (email: Email | null) => void;
  handleStateChange: (emailId: string, state: string) => void;
  handleCityChange: (emailId: string, city: string) => void;
  saveAll: () => Promise<void>;
  exportEmails: () => void;
  deleteEmail: (email: Email) => Promise<void>;
}

// ViewModel Return Type
export interface UsePendingEmailsViewModelReturn {
  state: UsePendingEmailsViewModelState;
  actions: UsePendingEmailsViewModelActions;
}

export function usePendingEmailsViewModel(
  emails: Email[],
  emailRepository: IEmailRepository,
  onEmailsUpdated: () => void,
  loading: boolean,
  error: string | null
): UsePendingEmailsViewModelReturn {
  const [updates, setUpdates] = useState<Record<string, PendingUpdate>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const savePendingEmailsUseCase = useMemo(
    () => new SavePendingEmailsUseCase(emailRepository),
    [emailRepository]
  );
  const exportEmailsUseCase = useMemo(() => new ExportEmailsUseCase(), []);
  const deleteEmailUseCase = useMemo(() => new DeleteEmailUseCase(emailRepository), [emailRepository]);

  const pendingEmails = useMemo(
    () => emails.filter(e => e.status === 'pending'),
    [emails]
  );

  const filteredEmails = useMemo(() => {
    if (!searchTerm) return pendingEmails;
    const term = searchTerm.toLowerCase();
    return pendingEmails.filter(
      email =>
        email.sender.toLowerCase().includes(term) ||
        email.recipient.toLowerCase().includes(term) ||
        email.subject.toLowerCase().includes(term)
    );
  }, [pendingEmails, searchTerm]);

  const validUpdateCount = useMemo(
    () => Object.values(updates).filter(u => u.state && u.city).length,
    [updates]
  );

  const handleStateChange = useCallback((emailId: string, state: string) => {
    setUpdates(prev => ({
      ...prev,
      [emailId]: { id: emailId, state, city: '' },
    }));
  }, []);

  const handleCityChange = useCallback((emailId: string, city: string) => {
    setUpdates(prev => ({
      ...prev,
      [emailId]: { ...prev[emailId], city },
    }));
  }, []);

  const saveAll = useCallback(async () => {
    try {
      const validUpdates = Object.values(updates).filter(u => u.state && u.city);
      const result = await savePendingEmailsUseCase.execute(validUpdates);
      if (result.length > 0) {
        toast({
          title: 'E-mails salvos',
          description: `${result.length} e-mail(s) classificado(s) com sucesso.`,
        });
        setUpdates({});
        onEmailsUpdated();
      }
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar os e-mails.',
        variant: 'destructive',
      });
    }
  }, [updates, savePendingEmailsUseCase, onEmailsUpdated]);

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
      onEmailsUpdated();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o e-mail.',
        variant: 'destructive',
      });
    }
  }, [deleteEmailUseCase, onEmailsUpdated]);

  return {
    state: {
      pendingEmails,
      filteredEmails,
      updates,
      searchTerm,
      selectedEmail,
      validUpdateCount,
      loading,
      error,
    },
    actions: {
      setSearchTerm,
      setSelectedEmail,
      handleStateChange,
      handleCityChange,
      saveAll,
      exportEmails,
      deleteEmail,
    },
  };
}
