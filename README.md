# Sistema de Gestão de E-mails
## 📋 Identificação dos Integrantes do Grupo

- **Sávyo Francisco Barbosa Nascimento**
- **Mardone Silva Pereira** 
- **Ikaro Herbert Vasconcelos Gomes** 

---
  
## 📋 Descrição do Projeto

Este projeto foi desenvolvido como parte do **Hackaton Sistema de Gestão de E-mails** realizado pelo **IFPI – Curso de Tecnologias em Análise e Desenvolvimento de Sistemas** em **Piripiri – PI, 2025**. O objetivo principal é criar um sistema capaz de gerenciar e organizar e-mails enviados pelos colaboradores de uma empresa, aplicando boas práticas de desenvolvimento, arquitetura de software, banco de dados e design de interface.

O sistema captura automaticamente e-mails enviados pelos colaboradores (com cópia para um endereço específico), registra-os em uma base de dados e permite que informações adicionais, como Estado e Município, sejam associadas a cada e-mail. Além disso, o sistema oferece ferramentas de análise e visualização (dashboard) e suporte para cadastro manual de e-mails.

---

## 🛠️ Funcionalidades

1. **Captura Automática de E-mails**:
   - Captura e-mails enviados com cópia para um endereço específico (ex.: `meusistema@gmail.com`).
   - Registra automaticamente os e-mails na base de dados.

2. **Cadastro Manual de E-mails**:
   - Permite que colaboradores adicionem e-mails manualmente ao sistema.

3. **Gestão de Informações Adicionais**:
   - Possibilidade de associar Estado e Município aos e-mails registrados.

4. **Dashboard de Análise**:
   - Ferramentas de visualização e análise para monitorar os e-mails enviados.

5. **Fluxo de Validação de Dados**:
   - Interface intuitiva para validar e completar informações dos e-mails capturados.

---

## 🧑‍💻 Tecnologias Utilizadas

- **Frontend**: React Native com Expo Router e TailwindCSS.
- **Arquitetura**: MVVM (Model-View-ViewModel).
- **Backend**: Node.js com serviços de e-mail integrados (ex.: Mailgun, Supabase).
- **Banco de Dados**: PostgreSQL.
- **Testes**: Jest para testes unitários e de integração.
- **UI/UX**: Design responsivo e acessível com base em boas práticas de usabilidade.

---

## 📂 Estrutura do Projeto

```bash
src/
├─ app/                # Rotas e navegação
├─ model/              # Entidades, repositórios e serviços
├─ viewmodel/          # Hooks customizados para gerenciar estado e lógica
├─ view/               # Componentes e telas da interface
├─ useCase/            # Casos de uso específicos
├─ infrastructure/     # Serviços de integração com APIs externas
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- Yarn ou npm
- Expo CLI

### Passos para execução

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/sistema-gestao-emails.git
   cd sistema-gestao-emails
Instale as dependências:

Com Yarn:

```bash
yarn install
```
Ou com npm:
```bash
npm install
```
Inicie o servidor de desenvolvimento:

Com Yarn:

```bash
yarn dev
```
Ou com npm:

```bash
npm run dev
```
Acesse o aplicativo:

Abra o navegador e acesse o endereço exibido no terminal (geralmente http://localhost:3000 ou similar).

---

## 📐 Arquitetura MVVM

O projeto segue o padrão **MVVM (Model-View-ViewModel)**, garantindo separação de responsabilidades e maior escalabilidade. A comunicação entre as camadas segue o fluxo:

1. **Usuário** interage com a **View**.
2. A **View** chama as **Actions** da **ViewModel**.
3. A **ViewModel** processa a lógica e atualiza o **Model**.
4. O **Model** retorna os dados processados para a **ViewModel**, que atualiza o estado da **View**.

---

## 🧪 Testes

Os testes são obrigatórios para garantir a qualidade do sistema. As áreas testadas incluem:

1. **ViewModels**:
   - Regras de negócio.
   - Estados gerados.
   - Chamadas de ações.

2. **Serviços e Repositórios**:
   - Simulação de APIs externas.
   - Testes de CRUD.

3. **Fluxos de Cadastro e Atualização**:
   - Validação de dados.
   - Comportamento em cenários de erro.

---

## 📊 Protótipos de Tela

Os protótipos low-fi foram utilizados para validação de fluxo. O design final prioriza uma boa experiência de usuário (UI/UX).

---

## 📂 Repositório do Backend

O repositório do backend está localizado no seguinte endereço: [Backend do Sistema de Gestão de E-mails](https://github.com/igordev23/server_mailmanager).

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE).
