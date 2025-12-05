// Infrastructure Layer - Mail.tm Email Service Implementation
import { IEmailService } from "@/model/services/IEmailService";
import { Email } from "@/model/entities/Email";

export class EmailServiceMailtm implements IEmailService {
  private baseUrl = "http://localhost:3000/mailtm";

  private determineStatus(state?: string, city?: string) {
    return state && city ? "classified" : "pending";
  }

  async getInbox(): Promise<Email[]> {
    console.log("[EmailServiceMailtm] Chamando GET /inbox");

    const response = await fetch(`${this.baseUrl}/inbox`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar inbox do MailTM. Status: ${response.status}`);
    }

    const rawMessages = await response.json();

    return rawMessages.map((msg: any) => {
      const state = msg.state; // se vier do backend
      const city = msg.city;   // se vier do backend
      return {
        id: msg.id,
        sender: msg.sender ?? msg.from?.address ?? "",
        recipient: msg.recipient ?? msg.to?.[0]?.address ?? "",
        subject: msg.subject ?? "",
        body: msg.body ?? msg.intro ?? "",
        date: new Date(msg.createdAt),
        state,
        city,
        status: this.determineStatus(state, city), // status dinâmico
        isManual: false,
        createdAt: new Date(msg.createdAt),
        updatedAt: new Date(msg.updatedAt ?? msg.createdAt),
      };
    });
  }

  async getMessage(messageId: string): Promise<Email> {
    console.log(`[EmailServiceMailtm] Chamando GET /message/${messageId}`);

    const response = await fetch(`${this.baseUrl}/message/${messageId}`);
    if (!response.ok) {
      throw new Error("Erro ao buscar mensagem");
    }

    const msg = await response.json();
    const state = msg.state;
    const city = msg.city;

    return {
      id: msg.id,
      sender: msg.from ?? '',
      recipient: msg.recipient ?? '',
      subject: msg.subject ?? '',
      body: msg.body ?? msg.intro ?? '',
      date: new Date(msg.createdAt),
      state,
      city,
      status: this.determineStatus(state, city), // status dinâmico
      isManual: false,
      createdAt: new Date(msg.createdAt),
      updatedAt: new Date(msg.updatedAt ?? msg.createdAt),
    };
  }
}
