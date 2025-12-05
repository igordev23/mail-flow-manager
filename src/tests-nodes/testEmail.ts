import { EmailServiceMaligun } from "../model/services/EmailServiceMaligun";
import { EmailRepositoryMemory } from "../infrastructure/repositories/memory/EmailRepositoryMemory";

async function testSendEmail() {
  console.log("Iniciando teste de envio de email...\n");

  const emailService = new EmailServiceMaligun();
  const emailRepository = new EmailRepositoryMemory();

  // Dados do email
  const emailData = {
    from: "igor.dev89898@gmail.com",
    to: ["francisco.igor89898@gmail.com"],
    subject: "Teste de Envio de Email",
    text: "Este é um teste de envio de email usando o Mailgun e salvando no repositório.",
  };

  try {
    console.log("Enviando email via Mailgun...");

    // Envio real via Mailgun
    const response = await emailService.sendSimpleMessage(
      emailData.from,
      emailData.to,
      emailData.subject,
      emailData.text
    );

    console.log("\nEmail enviado com sucesso:");
    console.log(response);

    // Registro no repositório
    console.log("\nRegistrando email no sistema...");
    const savedEmail = await emailRepository.create({
      sender: emailData.from,
      recipient: emailData.to[0],
      subject: emailData.subject,
      body: emailData.text,
      date: new Date(),
      state: "",
      city: "",
    });

    console.log("\nEmail gravado com sucesso no repositório:");
    console.log(savedEmail);

    console.log("\nTeste finalizado com sucesso!");

  } catch (error: any) {
    console.error("\n⚠ Erro no teste de envio de email:");
    console.error(error);
  }
}

testSendEmail();
