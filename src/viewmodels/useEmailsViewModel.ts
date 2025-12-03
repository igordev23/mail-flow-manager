// ViewModel Layer - Email Management Logic

import { useState, useCallback, useMemo } from 'react';
import { Email, EmailFilter, EmailFormData, DashboardData } from '@/types/email';
import { mockEmails, getDashboardData, brazilianCities } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export function useEmailsViewModel() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [filter, setFilter] = useState<EmailFilter>({ status: 'all' });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // Dashboard data
  const dashboardData: DashboardData = useMemo(() => getDashboardData(emails), [emails]);

  // Filtered emails
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      if (filter.status && filter.status !== 'all' && email.status !== filter.status) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSender = email.sender.toLowerCase().includes(searchLower);
        const matchesRecipient = email.recipient.toLowerCase().includes(searchLower);
        const matchesSubject = email.subject.toLowerCase().includes(searchLower);
        if (!matchesSender && !matchesRecipient && !matchesSubject) {
          return false;
        }
      }
      if (filter.sender && !email.sender.toLowerCase().includes(filter.sender.toLowerCase())) {
        return false;
      }
      if (filter.state && email.state !== filter.state) {
        return false;
      }
      if (filter.city && email.city !== filter.city) {
        return false;
      }
      if (filter.startDate && email.date < filter.startDate) {
        return false;
      }
      if (filter.endDate && email.date > filter.endDate) {
        return false;
      }
      return true;
    });
  }, [emails, filter]);

  // Pending emails
  const pendingEmails = useMemo(() => 
    emails.filter(e => e.status === 'pending'), 
    [emails]
  );

  // Update email location
  const updateEmailLocation = useCallback((id: string, state: string, city: string) => {
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        return {
          ...email,
          state,
          city,
          status: 'classified' as const,
          updatedAt: new Date(),
        };
      }
      return email;
    }));
    toast({
      title: "E-mail classificado",
      description: "Localização atualizada com sucesso.",
    });
  }, []);

  // Create manual email
  const createEmail = useCallback((data: EmailFormData) => {
    const newEmail: Email = {
      id: Date.now().toString(),
      ...data,
      status: data.state && data.city ? 'classified' : 'pending',
      isManual: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEmails(prev => [newEmail, ...prev]);
    toast({
      title: "E-mail cadastrado",
      description: "O e-mail foi adicionado com sucesso.",
    });
    return newEmail;
  }, []);

  // Bulk save pending emails
  const savePendingEmails = useCallback((updates: Array<{ id: string; state: string; city: string }>) => {
    setEmails(prev => prev.map(email => {
      const update = updates.find(u => u.id === email.id);
      if (update && update.state && update.city) {
        return {
          ...email,
          state: update.state,
          city: update.city,
          status: 'classified' as const,
          updatedAt: new Date(),
        };
      }
      return email;
    }));
    const validUpdates = updates.filter(u => u.state && u.city);
    if (validUpdates.length > 0) {
      toast({
        title: "E-mails salvos",
        description: `${validUpdates.length} e-mail(s) classificado(s) com sucesso.`,
      });
    }
  }, []);

  // Get cities for a state
  const getCitiesByState = useCallback((stateCode: string) => {
    return brazilianCities.filter(c => c.stateCode === stateCode);
  }, []);

  // Export emails to CSV
  const exportEmails = useCallback(() => {
    const headers = ['Remetente', 'Destinatário', 'Assunto', 'Data', 'Estado', 'Município', 'Status'];
    const rows = filteredEmails.map(email => [
      email.sender,
      email.recipient,
      email.subject,
      email.date.toLocaleDateString('pt-BR'),
      email.state || '-',
      email.city || '-',
      email.status === 'classified' ? 'Classificado' : 'Pendente',
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `emails_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: "Exportação concluída",
      description: `${filteredEmails.length} e-mail(s) exportado(s).`,
    });
  }, [filteredEmails]);

  return {
    // Data
    emails,
    filteredEmails,
    pendingEmails,
    dashboardData,
    selectedEmail,
    filter,
    
    // Actions
    setFilter,
    setSelectedEmail,
    updateEmailLocation,
    createEmail,
    savePendingEmails,
    getCitiesByState,
    exportEmails,
  };
}
