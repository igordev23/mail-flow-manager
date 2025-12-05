// Model Layer - Bulk Update Location UseCase

import { Email } from '../entities';
import { IEmailRepository } from '../repositories';

export class BulkUpdateLocationUseCase {
  constructor(private emailRepository: IEmailRepository) {}

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
