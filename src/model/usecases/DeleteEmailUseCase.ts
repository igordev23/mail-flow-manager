// Model Layer - Delete Email UseCase

import { IEmailRepository } from '../repositories';

// DeleteEmailUseCase.ts
export class DeleteEmailUseCase {
  constructor(private emailRepository: IEmailRepository) {}

  async execute(id: string): Promise<void> {
    console.log("ID usado para deletar:", id);
    await this.emailRepository.delete(id);
  }
}

