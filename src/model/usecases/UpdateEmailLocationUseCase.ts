// Model Layer - Update Email Location UseCase

import { Email } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';

export class UpdateEmailLocationUseCase {
  constructor(private emailRepository: IEmailRepository) {}

  async execute(id: string, state: string, city: string): Promise<Email> {
    if (!state || !city) {
      throw new Error('Estado e cidade são obrigatórios');
    }
    return this.emailRepository.updateLocation(id, state, city);
  }
}
