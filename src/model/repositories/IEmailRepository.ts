// Model Layer - Email Repository Interface

import { Email, EmailFormData } from '../entities/Email';

export interface IEmailRepository {
  list(): Promise<Email[]>;
  getById(id: string): Promise<Email | null>;
  create(data: EmailFormData): Promise<Email>;
  createFull?(data: Email): Promise<Email>; // 🔹 opcional, só para sync
  update(id: string, data: Partial<Email>): Promise<Email>;
  delete(id: string): Promise<void>;
  updateLocation(id: string, state: string, city: string): Promise<Email>;
  bulkUpdateLocation(updates: Array<{ id: string; state: string; city: string }>): Promise<Email[]>;
}

