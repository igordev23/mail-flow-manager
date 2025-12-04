// Model Layer - Save Pending Emails UseCase

import { Email } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';

export interface PendingEmailUpdate {
  id: string;
  state: string;
  city: string;
}

export class SavePendingEmailsUseCase {
  constructor(private emailRepository: IEmailRepository) {}

  async execute(updates: PendingEmailUpdate[]): Promise<Email[]> {
    const validUpdates = updates.filter(u => u.state && u.city);
    if (validUpdates.length === 0) {
      return [];
    }
    return this.emailRepository.bulkUpdateLocation(validUpdates);
  }
}
