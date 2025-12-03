// Model Layer - In-Memory Email Repository Implementation

import { Email, EmailFormData } from '../../entities/Email';
import { IEmailRepository } from '../IEmailRepository';

const generateDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 10) + 8);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

const initialEmails: Email[] = [
  {
    id: '1',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Proposta Comercial X',
    body: 'Prezados,\n\nSegue em anexo a proposta referente ao projeto X conforme conversamos.\n\nFico no aguardo do de acordo.\n\nAtenciosamente,\nJoão Silva',
    date: generateDate(0),
    state: 'PI',
    city: 'Piripiri',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '2',
    sender: 'maria@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Fatura Mensal - Dezembro',
    body: 'Prezado cliente,\n\nSegue em anexo a fatura referente aos serviços prestados no mês de dezembro.\n\nAtenciosamente,\nMaria Santos',
    date: generateDate(0),
    state: 'CE',
    city: 'Fortaleza',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '3',
    sender: 'ana@empresa.com',
    recipient: 'clienteD@dominio.com',
    subject: 'Agendamento de Reunião',
    body: 'Olá,\n\nGostaria de agendar uma reunião para discutirmos os próximos passos do projeto.\n\nPor favor, me informe sua disponibilidade.\n\nAbraços,\nAna Oliveira',
    date: generateDate(0),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '4',
    sender: 'pedro@empresa.com',
    recipient: 'clienteC@dominio.com',
    subject: 'Relatório Técnico',
    body: 'Prezados,\n\nEncaminho o relatório técnico conforme solicitado.\n\nQualquer dúvida, estou à disposição.\n\nAtenciosamente,\nPedro Costa',
    date: generateDate(0),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(0),
    updatedAt: generateDate(0),
  },
  {
    id: '5',
    sender: 'joao@empresa.com',
    recipient: 'clienteE@dominio.com',
    subject: 'Orçamento Atualizado',
    body: 'Prezado cliente,\n\nConforme solicitado, segue o orçamento atualizado para o projeto.\n\nAguardo retorno.\n\nAtt,\nJoão Silva',
    date: generateDate(1),
    state: 'MA',
    city: 'São Luís',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(1),
    updatedAt: generateDate(1),
  },
  {
    id: '6',
    sender: 'maria@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Confirmação de Pagamento',
    body: 'Prezado,\n\nConfirmamos o recebimento do pagamento referente à fatura #123.\n\nAgradecemos a parceria.\n\nAtenciosamente,\nMaria Santos',
    date: generateDate(1),
    state: 'SP',
    city: 'São Paulo',
    status: 'classified',
    isManual: true,
    createdAt: generateDate(1),
    updatedAt: generateDate(1),
  },
  {
    id: '7',
    sender: 'carlos@empresa.com',
    recipient: 'clienteF@dominio.com',
    subject: 'Suporte Técnico - Ticket #456',
    body: 'Olá,\n\nSeu chamado foi registrado com sucesso. Nossa equipe entrará em contato em breve.\n\nAtt,\nCarlos Mendes',
    date: generateDate(2),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(2),
    updatedAt: generateDate(2),
  },
  {
    id: '8',
    sender: 'ana@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Material de Treinamento',
    body: 'Prezados,\n\nSegue o material do treinamento realizado ontem.\n\nQualquer dúvida, estou à disposição.\n\nAbraços,\nAna Oliveira',
    date: generateDate(2),
    state: 'RJ',
    city: 'Rio de Janeiro',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(2),
    updatedAt: generateDate(2),
  },
  {
    id: '9',
    sender: 'pedro@empresa.com',
    recipient: 'clienteG@dominio.com',
    subject: 'Contrato de Prestação de Serviços',
    body: 'Prezado cliente,\n\nSegue em anexo o contrato para análise e assinatura.\n\nFico no aguardo.\n\nAtenciosamente,\nPedro Costa',
    date: generateDate(3),
    state: 'PI',
    city: 'Teresina',
    status: 'classified',
    isManual: false,
    createdAt: generateDate(3),
    updatedAt: generateDate(3),
  },
  {
    id: '10',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Follow-up Proposta',
    body: 'Prezado,\n\nGostaria de saber se teve oportunidade de analisar nossa proposta.\n\nAguardo retorno.\n\nAtt,\nJoão Silva',
    date: generateDate(4),
    status: 'pending',
    isManual: false,
    createdAt: generateDate(4),
    updatedAt: generateDate(4),
  },
];

export class EmailRepositoryMemory implements IEmailRepository {
  private emails: Email[];

  constructor(emails: Email[] = initialEmails) {
    this.emails = [...emails];
  }

  async list(): Promise<Email[]> {
    return [...this.emails];
  }

  async getById(id: string): Promise<Email | null> {
    return this.emails.find(e => e.id === id) || null;
  }

  async create(data: EmailFormData): Promise<Email> {
    const newEmail: Email = {
      id: Date.now().toString(),
      ...data,
      status: data.state && data.city ? 'classified' : 'pending',
      isManual: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emails = [newEmail, ...this.emails];
    return newEmail;
  }

  async update(id: string, data: Partial<Email>): Promise<Email> {
    const index = this.emails.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Email not found');
    
    this.emails[index] = {
      ...this.emails[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.emails[index];
  }

  async delete(id: string): Promise<void> {
    this.emails = this.emails.filter(e => e.id !== id);
  }

  async updateLocation(id: string, state: string, city: string): Promise<Email> {
    return this.update(id, { state, city, status: 'classified' });
  }

  async bulkUpdateLocation(updates: Array<{ id: string; state: string; city: string }>): Promise<Email[]> {
    const results: Email[] = [];
    for (const update of updates) {
      if (update.state && update.city) {
        const email = await this.updateLocation(update.id, update.state, update.city);
        results.push(email);
      }
    }
    return results;
  }
}
