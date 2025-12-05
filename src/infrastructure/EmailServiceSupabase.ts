import { Email } from "@/model/entities/Email";
import { IEmailService } from "@/model/services/IEmailService";

export class EmailServiceSupabase implements IEmailService {
  baseUrl = "https://server-mailmanager.onrender.com/emails";

  // -----------------------------
  // LISTAR TODOS
  // -----------------------------
  async getInbox(): Promise<Email[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error("Erro ao buscar emails");

    const data = await res.json();
    return data.map((e: any) => this.toEmail(e));
  }

  // -----------------------------
  // BUSCAR 1 EMAIL
  // -----------------------------
  async getMessage(id: string): Promise<Email> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar email");

    const e = await res.json();
    return this.toEmail(e);
  }

  // -----------------------------
  // CRIAR EMAIL
  // -----------------------------
  async createEmail(email: Partial<Email>): Promise<Email> {
    const payload = {
      sender: email.sender ?? null,
      recipient: email.recipient ?? null,
      subject: email.subject ?? null,
      body: email.body ?? null,
      date: email.date ?? new Date(),
      state: email.state ?? null,
      city: email.city ?? null,
      status: email.status ?? "pending",
      is_manual: email.isManual ?? true,
    };

    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao criar email");

    const data = await res.json();
    return this.toEmail(data);
  }

  // -----------------------------
  // ATUALIZAR EMAIL
  // -----------------------------
 // -----------------------------
// ATUALIZAR EMAIL
// -----------------------------
async updateEmail(id: string, update: Partial<Email>): Promise<Email> {
  const payload: any = { ...update };

  // Se state e city estiverem preenchidos e status não for "classified", atualiza status
  if (update.state && update.city && update.status !== 'classified') {
    payload.status = 'classified';
  }

  // Mapear camelCase → snake_case
  if (update.isManual !== undefined) payload.is_manual = update.isManual;
  if (update.updatedAt) payload.updated_at = update.updatedAt;
  delete payload.isManual;
  delete payload.createdAt;

  const res = await fetch(`${this.baseUrl}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Erro ao atualizar email");

  const data = await res.json();
  return this.toEmail(data);
}

  // -----------------------------
  // DELETAR EMAIL
  // -----------------------------
  async deleteEmail(id: string): Promise<void> {
    const cleanId = String(id).trim();

    const res = await fetch(`${this.baseUrl}/${cleanId}`, { method: "DELETE" });

    if (!res.ok) {
      let errMsg = `Erro ao deletar email: ${res.status} ${res.statusText}`;
      try {
        const errData = await res.json();
        if (errData?.error) errMsg += ` - ${JSON.stringify(errData.error)}`;
      } catch {}
      throw new Error(errMsg);
    }
  }

  // -----------------------------
  // HELPERS DE CONVERSÃO DE DATA
  // -----------------------------
  private toEmail(e: any): Email {
    return {
      id: e.id,
      sender: e.sender,
      recipient: e.recipient,
      subject: e.subject,
      body: e.body,
      date: e.date ? new Date(e.date) : new Date(),
      state: e.state,
      city: e.city,
      status: e.status,
      isManual: e.is_manual,
      createdAt: e.created_at ? new Date(e.created_at) : new Date(),
      updatedAt: e.updated_at ? new Date(e.updated_at) : new Date(),
    };
  }
}
