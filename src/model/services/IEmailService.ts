import { Email } from '@/model/entities';


// IEmailService.ts
export interface IEmailService {
  getInbox(): Promise<Email[]>;
  getMessage(messageId: string): Promise<Email>;
}
