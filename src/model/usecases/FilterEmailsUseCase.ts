// Model Layer - Filter Emails UseCase

import { Email, EmailFilter } from '@/model/entities';
import { EmailService } from '@/model/services';

export class FilterEmailsUseCase {
  execute(emails: Email[], filter: EmailFilter): Email[] {
    return EmailService.filterEmails(emails, filter);
  }
}
