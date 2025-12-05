// Model Layer - Delete Email UseCase

import { IEmailRepository } from '../repositories';

export class DeleteEmailUseCase {
  constructor(private emailRepository: IEmailRepository) {}

  async execute(id: string): Promise<void> {
    await this.emailRepository.delete(id);
  }
}
