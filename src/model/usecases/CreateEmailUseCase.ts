// Model Layer - Create Email UseCase

import { Email, EmailFormData } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';

export class CreateEmailUseCase {
  constructor(private emailRepository: IEmailRepository) {}

  async execute(data: EmailFormData): Promise<Email> {
    if (!data.sender || !data.recipient || !data.subject || !data.body) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    return this.emailRepository.create(data);
  }
}
