// Model Layer - Bulk Update Location UseCase

import { Email } from '../entities';
import { EmailRepositorySupabase } from '../repositories/EmailRepositorySupabase';

export class BulkUpdateLocationUseCase {
  // Agora sempre usa EmailRepositorySupabase
  private emailRepository = new EmailRepositorySupabase();

  async findSimilarEmails(
    emails: Email[],
    sender: string,
    recipient: string,
    excludeId: string
  ): Promise<Email[]> {
    return emails.filter(
      e => e.sender === sender && e.recipient === recipient && e.id !== excludeId
    );
  }

  async execute(
    ids: string[],
    state: string,
    city: string
  ): Promise<Email[]> {
    const updates = ids.map(id => ({ id, state, city }));
    return this.emailRepository.bulkUpdateLocation(updates);
  }
}
