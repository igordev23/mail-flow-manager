import { useState, useCallback, useEffect } from 'react';
import { Email } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';
import { IEmailService } from '@/model/services/IEmailService';
import { EmailServiceMailtm } from '@/model/services/EmailServiceMailtm';

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

  const emailService: IEmailService = new EmailServiceMailtm();
  const cleanBody = (text: string) => {
  if (!text) return '';

  // 1) remover caracteres de escape tipo \ZX\X\X\X\
  let cleaned = text.replace(/[\\][A-Z]+/g, '');

  // 2) dividir em linhas
  const lines = cleaned.split('\n');
  const filtered: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // regex robusta para qualquer linha de quoted text
    const onWroteRegex = /^On\s.+?wrote:$/i;

    if (
      trimmed === '' ||            // linha vazia
      trimmed.startsWith('>') ||   // quote
      onWroteRegex.test(trimmed) || 
      /^From:/i.test(trimmed) ||
      /^Sent:/i.test(trimmed) ||
      /^To:/i.test(trimmed) ||
      /^Subject:/i.test(trimmed)
    ) {
      break; // tudo que vem depois é histórico, não queremos
    }

    filtered.push(line);
  }

  return filtered.join('\n').trim();
};


  // Função para mapear emails recebidos do backend
  const mapIncomingEmailToEntity = (raw: any): Email => ({
    id: raw.id || String(Date.now()),
    sender: raw.from?.address || raw.sender || '',
    recipient: raw.to?.[0]?.address || raw.recipient || '',
    subject: raw.subject || '(Sem assunto)',
body: cleanBody(raw.text || raw.html || raw.intro || raw.body || ''),
    date: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    state: '',
    city: '',
    status: 'pending',
    isManual: false,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
  });

  // Refresh de emails
  const refreshEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Buscar inbox do backend
      const inboxEmailsRaw = await emailService.getInbox() || [];
      const savedEmailsRaw = await emailRepository.list() || [];

      // 2) Filtrar apenas novos emails
      const novosEmails = inboxEmailsRaw.filter(
        (email) => !savedEmailsRaw.some((e) => e.id === email.id)
      );

      // 3) Salvar novos emails no repositório
      for (const email of novosEmails) {
        if (emailRepository.createFull) {
          await emailRepository.createFull(email);
        } else {
          await emailRepository.create(email);
        }
      }

      // 4) Atualizar estado com todos os emails únicos
      const allEmailsRaw = await emailRepository.list() || [];
      const uniqueEmailsMap = new Map<string, Email>();
      allEmailsRaw.forEach((e) => uniqueEmailsMap.set(e.id, e));
      setEmails(Array.from(uniqueEmailsMap.values()));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar e-mails');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [emailRepository, emailService]);

  // 🔹 Polling leve: atualizar automaticamente a cada 30 segundos
  useEffect(() => {
    refreshEmails(); // primeira carga

    const interval = setInterval(() => {
      refreshEmails();
    }, 30000); // 30s, você pode ajustar

    return () => clearInterval(interval); // limpar intervalo ao desmontar
  }, [refreshEmails]);

  return {
    state: { emails, loading, error },
    actions: { refreshEmails },
  };
}
