// Model Layer - Export Emails UseCase

import { Email } from '@/model/entities';
import { EmailService } from '@/model/services';

export class ExportEmailsUseCase {
  execute(emails: Email[]): void {
    EmailService.exportToCsv(emails);
  }
}
