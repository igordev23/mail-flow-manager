import { useState, useCallback, useEffect, useMemo } from "react";
import { Email } from "@/model/entities";
import { IEmailRepository } from "@/model/repositories";
import { IEmailService } from "@/model/services/IEmailService";
import { EmailServiceSupabase } from "@/infrastructure/EmailServiceSupabase";

export interface UseEmailsBaseViewModelState {
  emails: Email[];
  loading: boolean;
  error: string | null;
}

export interface UseEmailsBaseViewModelActions {
  refreshEmails: () => Promise<void>;
}

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

  // EmailService estável
  const emailService: IEmailService = useMemo(() => new EmailServiceSupabase(), []);

  const cleanBody = (text: string) => {
    if (!text) return "";

    let cleaned = text.replace(/[\\][A-Z]+/g, "");
    const lines = cleaned.split("\n");

    const filtered: string[] = [];
    const onWroteRegex = /^On\s.+?wrote:$/i;

    for (const line of lines) {
      const trimmed = line.trim();

      if (
        trimmed === "" ||
        trimmed.startsWith(">") ||
        onWroteRegex.test(trimmed) ||
        /^From:/i.test(trimmed) ||
        /^Sent:/i.test(trimmed) ||
        /^To:/i.test(trimmed) ||
        /^Subject:/i.test(trimmed)
      ) {
        break;
      }

      filtered.push(line);
    }

    return filtered.join("\n").trim();
  };

  const refreshEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const inboxEmails = await emailService.getInbox();
      setEmails(inboxEmails);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erro ao carregar e-mails");
    } finally {
      setLoading(false);
    }
  }, [emailService]);

  useEffect(() => {
    refreshEmails();

    const interval = setInterval(() => {
      refreshEmails();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshEmails]);

  return {
    state: { emails, loading, error },
    actions: { refreshEmails },
  };
}
