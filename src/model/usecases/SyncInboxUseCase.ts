import { Email } from "@/model/entities/Email";
import { IEmailRepository } from "@/model/repositories/IEmailRepository";
import { IEmailService } from "@/model/services/IEmailService";

export class SyncInboxUseCase {
  constructor(
    private emailService: IEmailService,
    private emailRepository: IEmailRepository
  ) {}

  /**
   * Busca emails no MailTM e salva no repositório (localStorage).
   */
  async execute(addressId: string): Promise<Email[]> {
    console.log("[SyncInboxUseCase] Iniciando sincronização do inbox para:", addressId);

    // 1) buscar emails recebidos no serviço externo
    const inboxEmails = await this.emailService.getInbox();
    console.log("[SyncInboxUseCase] Emails recebidos do MailTM:", inboxEmails);

    // 2) pegar emails já salvos no front
    const savedEmails = await this.emailRepository.list();
    console.log("[SyncInboxUseCase] Emails já salvos:", savedEmails);

    // 3) filtrar emails novos (que não estão salvos)
    const novosEmails = inboxEmails.filter(
  (email) =>
    !savedEmails.some(
      (e) =>
        e.id === email.id || // Comparação por ID
        (e.sender === email.sender && e.date.getTime() === email.date.getTime()) // Comparação alternativa
    )
);

    console.log("[SyncInboxUseCase] Novos emails a salvar:", novosEmails);

    // 4) salvar os novos emails
for (const email of novosEmails) {
  console.log("[SyncInboxUseCase] Salvando email:", email.id);

  if (this.emailRepository.createFull) {
    await this.emailRepository.createFull(email); // 🔹 preserva id do backend
  } else {
    // fallback, caso o repositório não implemente createFull
    await this.emailRepository.create({
      sender: email.sender,
      recipient: email.recipient,
      subject: email.subject,
      body: email.body,
      date: email.date,
      state: email.state,
      city: email.city,
    });
  }
}



    // 5) retornar lista atualizada
    const updatedList = await this.emailRepository.list();
    console.log("[SyncInboxUseCase] Lista atualizada de emails:", updatedList);
    return updatedList;
  }
}
