// test-crud-direct.js

const BASE_URL = "http://localhost:3000/emails";

async function testCRUDDirect() {
  try {
    console.log("=== CRIAR EMAIL ===");
    // Criar email
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "teste@exemplo.com",
        recipient: "destinatario@exemplo.com",
        subject: "Teste CRUD",
        body: "Corpo do email de teste",
        status: "pending",
        is_manual: true
      }),
    });
    const newEmail = await createRes.json();
    console.log("Email criado:", newEmail);

    const emailId = newEmail.id;

    console.log("\n=== LISTAR TODOS OS EMAILS ===");
    const inboxRes = await fetch(BASE_URL);
    const inbox = await inboxRes.json();
    console.log("Inbox:", inbox.map(e => ({ id: e.id, subject: e.subject })));

    console.log("\n=== BUSCAR EMAIL PELO ID ===");
    const getRes = await fetch(`${BASE_URL}/${emailId}`);
    const fetchedEmail = await getRes.json();
    console.log("Email buscado:", fetchedEmail);

    console.log("\n=== ATUALIZAR EMAIL ===");
    const updateRes = await fetch(`${BASE_URL}/${emailId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: "Teste CRUD - atualizado",
        body: "Corpo atualizado"
      }),
    });
    const updatedEmail = await updateRes.json();
    console.log("Email atualizado:", updatedEmail);

    

  } catch (err) {
    console.error("Erro no CRUD direto:", err);
  }
}

testCRUDDirect();
