// Infrastructure Layer - Mail.tm Email Service Implementation
import { IEmailService } from "@/model/services/IEmailService";
import { Email } from "@/model/entities/Email";

export class EmailServiceMailtm implements IEmailService {
  private baseUrl = "http://localhost:3000/mailtm";

  /**
   * Busca a caixa de entrada da conta única criada no backend
   */
  async getInbox(): Promise<Email[]> {
    console.log("[EmailServiceMailtm] Chamando GET /inbox");

    const response = await fetch(`${this.baseUrl}/inbox`);
    console.log("[EmailServiceMailtm] Resposta HTTP:", response.status);

    if (!response.ok) {
      const errorMessage = `Erro ao buscar inbox do MailTM. Status: ${response.status}`;
      console.error("[EmailServiceMailtm] Erro:", errorMessage);
      throw new Error(errorMessage);
    }

    const rawMessages = await response.json();
    console.log("[EmailServiceMailtm] Mensagens brutas recebidas:", rawMessages);

    const mappedMessages = rawMessages.map((msg: any) => {
      console.log("[EmailServiceMailtm] Processando mensagem com ID:", msg.id);

      return {
        id: msg.id,
        sender: msg.sender ?? msg.from?.address ?? "",
        recipient: msg.recipient ?? msg.to?.[0]?.address ?? "",
        subject: msg.subject ?? "",
        body: msg.body ?? msg.intro ?? "",
        date: new Date(msg.createdAt),
        state: undefined,
        city: undefined,
        status: "pending",
        isManual: false,
        createdAt: new Date(msg.createdAt),
        updatedAt: new Date(msg.updatedAt ?? msg.createdAt),
      };
    });

    console.log("[EmailServiceMailtm] Mensagens mapeadas:", mappedMessages);
    return mappedMessages;
  }

  /**
   * Busca 1 e-mail específico
   */
  async getMessage(messageId: string): Promise<Email> {
    console.log(`[EmailServiceMailtm] Chamando GET /message/${messageId}`);

    const response = await fetch(`${this.baseUrl}/message/${messageId}`);
    console.log("[EmailServiceMailtm] Resposta HTTP:", response.status);

    if (!response.ok) {
      throw new Error("Erro ao buscar mensagem");
    }

    const msg = await response.json();
    console.log("[EmailServiceMailtm] Mensagem recebida:", msg);

    return {
      id: msg.id,
      sender: msg.from ?? '',
      recipient: msg.recipient ?? '',
      subject: msg.subject ?? '',
      body: msg.body ?? msg.intro ?? '',
      date: new Date(msg.createdAt),
      state: undefined,
      city: undefined,
      status: "pending",
      isManual: false,
      createdAt: new Date(msg.createdAt),
      updatedAt: new Date(msg.updatedAt ?? msg.createdAt),
    };
  }
}
