// EmailRepositorySupabase.ts
import { IEmailRepository } from "../repositories/IEmailRepository";
import { EmailServiceSupabase } from "@/infrastructure/EmailServiceSupabase";
import { Email, EmailFormData } from "../entities/Email";

export class EmailRepositorySupabase implements IEmailRepository {
  private service = new EmailServiceSupabase();

  private determineStatus(state?: string, city?: string) {
    return state && city ? "classified" : "pending";
  }

  list() {
    return this.service.getInbox();
  }

  getById(id: string) {
    return this.service.getMessage(id);
  }

  async create(data: EmailFormData) {
    const status = this.determineStatus(data.state, data.city);
    return this.service.createEmail({ ...data, status });
  }

  update(id: string, data: Partial<Email>) {
    // Se o update incluir state ou city, recalcular o status
    const status =
      "state" in data || "city" in data
        ? this.determineStatus(data.state, data.city)
        : data.status;
    return this.service.updateEmail(id, { ...data, status });
  }

  delete(id: string) {
    return this.service.deleteEmail(id);
  }

  updateLocation(id: string, state: string, city: string) {
    const status = this.determineStatus(state, city);
    return this.service.updateEmail(id, { state, city, status });
  }

  bulkUpdateLocation(updates: Array<{ id: string; state: string; city: string }>) {
    return Promise.all(
      updates.map(u =>
        this.service.updateEmail(u.id, { ...u, status: this.determineStatus(u.state, u.city) })
      )
    );
  }
}
