// EmailRepositorySupabase.ts
import { IEmailRepository } from "../repositories/IEmailRepository";
import { EmailServiceSupabase } from "@/infrastructure/EmailServiceSupabase";
import { Email, EmailFormData } from "../entities/Email";

export class EmailRepositorySupabase implements IEmailRepository {
    private service = new EmailServiceSupabase();

    list() { return this.service.getInbox(); }
    getById(id: string) { return this.service.getMessage(id); }
    create(data: EmailFormData) { return this.service.createEmail(data); }
    update(id: string, data: Partial<Email>) { return this.service.updateEmail(id, data); }
    delete(id: string) { return this.service.deleteEmail(id); }
    updateLocation(id: string, state: string, city: string) {
        return this.service.updateEmail(id, { state, city });
    }
    bulkUpdateLocation(updates: Array<{ id: string; state: string; city: string }>) {
        return Promise.all(updates.map(u => this.service.updateEmail(u.id, { state: u.state, city: u.city })));
    }
}
