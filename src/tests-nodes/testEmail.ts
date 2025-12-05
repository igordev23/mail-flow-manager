// Test file for email service
import { EmailServiceMailtm } from "../infrastructure/EmailServiceMailtm";
import { EmailRepositoryMemory } from "../infrastructure/repositories/memory/EmailRepositoryMemory";

async function testSendEmail() {
  console.log("Iniciando teste de envio de email...\n");

  const emailService = new EmailServiceMailtm();
  const emailRepository = new EmailRepositoryMemory();

  try {
    console.log("Buscando emails da inbox...");

    // Buscar emails via Mail.tm
    const emails = await emailService.getInbox();

    console.log("\nEmails recebidos:");
    console.log(emails);

    // Registro no repositório
    if (emails.length > 0) {
      console.log("\nRegistrando primeiro email no sistema...");
      const firstEmail = emails[0];
      const savedEmail = await emailRepository.create({
        sender: firstEmail.sender,
        recipient: firstEmail.recipient,
        subject: firstEmail.subject,
        body: firstEmail.body,
        date: firstEmail.date,
        state: "",
        city: "",
      });

      console.log("\nEmail gravado com sucesso no repositório:");
      console.log(savedEmail);
    }

    console.log("\nTeste finalizado com sucesso!");

  } catch (error: any) {
    console.error("\n⚠ Erro no teste:");
    console.error(error);
  }
}

testSendEmail();
