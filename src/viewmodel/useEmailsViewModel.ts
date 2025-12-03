// ViewModel Layer - Email Management Logic

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Email, EmailFilter, EmailFormData, DashboardData } from '@/model/entities';
import { IEmailRepository, ILocationRepository } from '@/model/repositories';
import { EmailService } from '@/model/services';
import { BrazilianCity } from '@/model/entities/Location';
import { toast } from '@/hooks/use-toast';

// State Type
export interface UseEmailsViewModelState {
  emails: Email[];
  filteredEmails: Email[];
  pendingEmails: Email[];
  dashboardData: DashboardData;
  selectedEmail: Email | null;
  filter: EmailFilter;
  loading: boolean;
  error: string | null;
}

// Actions Type
export interface UseEmailsViewModelActions {
  setFilter: (filter: EmailFilter) => void;
  setSelectedEmail: (email: Email | null) => void;
  updateEmailLocation: (id: string, state: string, city: string) => Promise<void>;
  createEmail: (data: EmailFormData) => Promise<Email>;
  savePendingEmails: (updates: Array<{ id: string; state: string; city: string }>) => Promise<void>;
  getCitiesByState: (stateCode: string) => Promise<BrazilianCity[]>;
  exportEmails: () => void;
  refreshEmails: () => Promise<void>;
}

// ViewModel Return Type
export interface UseEmailsViewModelReturn {
  state: UseEmailsViewModelState;
  actions: UseEmailsViewModelActions;
}

export function useEmailsViewModel(
  emailRepository: IEmailRepository,
  locationRepository: ILocationRepository
): UseEmailsViewModelReturn {
  const [emails, setEmails] = useState<Email[]>([]);
  const [filter, setFilter] = useState<EmailFilter>({ status: 'all' });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load emails on mount
  useEffect(() => {
    refreshEmails();
  }, []);

  // Refresh emails from repository
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

  // Dashboard data (derived state)
  const dashboardData: DashboardData = useMemo(
    () => EmailService.calculateDashboardData(emails),
    [emails]
  );

  // Filtered emails (derived state)
  const filteredEmails = useMemo(
    () => EmailService.filterEmails(emails, filter),
    [emails, filter]
  );

  // Pending emails (derived state)
  const pendingEmails = useMemo(
    () => emails.filter(e => e.status === 'pending'),
    [emails]
  );

  // Update email location
  const updateEmailLocation = useCallback(async (id: string, state: string, city: string) => {
    try {
      const updated = await emailRepository.updateLocation(id, state, city);
      setEmails(prev => prev.map(email => email.id === id ? updated : email));
      toast({
        title: "E-mail classificado",
        description: "Localização atualizada com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a localização.",
        variant: "destructive",
      });
    }
  }, [emailRepository]);

  // Create manual email
  const createEmail = useCallback(async (data: EmailFormData): Promise<Email> => {
    const newEmail = await emailRepository.create(data);
    setEmails(prev => [newEmail, ...prev]);
    toast({
      title: "E-mail cadastrado",
      description: "O e-mail foi adicionado com sucesso.",
    });
    return newEmail;
  }, [emailRepository]);

  // Bulk save pending emails
  const savePendingEmails = useCallback(async (updates: Array<{ id: string; state: string; city: string }>) => {
    const validUpdates = updates.filter(u => u.state && u.city);
    if (validUpdates.length === 0) return;

    try {
      const updatedEmails = await emailRepository.bulkUpdateLocation(validUpdates);
      setEmails(prev => prev.map(email => {
        const updated = updatedEmails.find(e => e.id === email.id);
        return updated || email;
      }));
      toast({
        title: "E-mails salvos",
        description: `${updatedEmails.length} e-mail(s) classificado(s) com sucesso.`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar os e-mails.",
        variant: "destructive",
      });
    }
  }, [emailRepository]);

  // Get cities for a state
  const getCitiesByState = useCallback(async (stateCode: string): Promise<BrazilianCity[]> => {
    return locationRepository.getCitiesByState(stateCode);
  }, [locationRepository]);

  // Export emails to CSV
  const exportEmails = useCallback(() => {
    EmailService.exportToCsv(filteredEmails);
    toast({
      title: "Exportação concluída",
      description: `${filteredEmails.length} e-mail(s) exportado(s).`,
    });
  }, [filteredEmails]);

  // Return state and actions
  return {
    state: {
      emails,
      filteredEmails,
      pendingEmails,
      dashboardData,
      selectedEmail,
      filter,
      loading,
      error,
    },
    actions: {
      setFilter,
      setSelectedEmail,
      updateEmailLocation,
      createEmail,
      savePendingEmails,
      getCitiesByState,
      exportEmails,
      refreshEmails,
    },
  };
}
