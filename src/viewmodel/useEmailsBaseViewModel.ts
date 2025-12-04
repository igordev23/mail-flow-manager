// ViewModel Layer - Base Emails ViewModel (Shared State)

import { useState, useCallback, useEffect } from 'react';
import { Email } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';

// State Type
export interface UseEmailsBaseViewModelState {
  emails: Email[];
  loading: boolean;
  error: string | null;
}

// Actions Type
export interface UseEmailsBaseViewModelActions {
  refreshEmails: () => Promise<void>;
}

// ViewModel Return Type
export interface UseEmailsBaseViewModelReturn {
  state: UseEmailsBaseViewModelState;
  actions: UseEmailsBaseViewModelActions;
}

export function useEmailsBaseViewModel(
  emailRepository: IEmailRepository
): UseEmailsBaseViewModelReturn {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emailRepository.list();
      setEmails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar e-mails');
    } finally {
      setLoading(false);
    }
  }, [emailRepository]);

  useEffect(() => {
    refreshEmails();
  }, [refreshEmails]);

  return {
    state: {
      emails,
      loading,
      error,
    },
    actions: {
      refreshEmails,
    },
  };
}
