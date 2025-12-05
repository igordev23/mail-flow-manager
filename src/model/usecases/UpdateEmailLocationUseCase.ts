// Model Layer - Update Email Location UseCase

import { EmailRepositorySupabase } from '../repositories/EmailRepositorySupabase';
import { Email } from '../entities';

export class UpdateEmailLocationUseCase {
  // Sempre usa EmailRepositorySupabase
  private emailRepository = new EmailRepositorySupabase();

  async execute(id: string, state: string, city: string): Promise<Email> {
    if (!state || !city) {
      throw new Error('Estado e cidade são obrigatórios');
    }

    // Atualiza estado, cidade e automaticamente o status para 'classified'
    return this.emailRepository.updateLocation(id, state, city);
  }
}
