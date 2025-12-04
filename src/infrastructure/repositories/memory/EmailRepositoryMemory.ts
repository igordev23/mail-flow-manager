// Infrastructure Layer - Email Repository Memory Implementation

import { Email, EmailFormData } from '@/model/entities';
import { IEmailRepository } from '@/model/repositories';

// Mock data
const mockEmails: Email[] = [
  {
    id: '1',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Proposta Comercial X',
    body: 'Prezados,\n\nSegue em anexo a proposta referente ao projeto X conforme conversamos.\n\nFico no aguardo do de acordo.\n\nAtenciosamente,\nJoão Silva',
    date: new Date('2025-12-05T09:42:00'),
    state: 'PI',
    city: 'Piripiri',
    status: 'classified',
    isManual: false,
    createdAt: new Date('2025-12-05T09:42:00'),
    updatedAt: new Date('2025-12-05T09:42:00'),
  },
  {
    id: '2',
    sender: 'maria@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Fatura Dezembro',
    body: 'Prezado cliente,\n\nSegue a fatura referente ao mês de dezembro.\n\nAtenciosamente,\nMaria Santos',
    date: new Date('2025-12-05T10:15:00'),
    state: 'CE',
    city: 'Fortaleza',
    status: 'classified',
    isManual: false,
    createdAt: new Date('2025-12-05T10:15:00'),
    updatedAt: new Date('2025-12-05T10:15:00'),
  },
  {
    id: '3',
    sender: 'ana@empresa.com',
    recipient: 'clienteD@dominio.com',
    subject: 'Agendamento de Reunião',
    body: 'Olá,\n\nGostaria de agendar uma reunião para discutir os próximos passos do projeto.\n\nAguardo retorno.\n\nAna',
    date: new Date('2025-12-05T11:30:00'),
    status: 'pending',
    isManual: false,
    createdAt: new Date('2025-12-05T11:30:00'),
    updatedAt: new Date('2025-12-05T11:30:00'),
  },
  {
    id: '4',
    sender: 'pedro@empresa.com',
    recipient: 'clienteC@dominio.com',
    subject: 'Relatório Mensal',
    body: 'Prezados,\n\nSegue o relatório de atividades do mês de novembro.\n\nQualquer dúvida estou à disposição.\n\nPedro',
    date: new Date('2025-12-05T14:00:00'),
    state: 'MA',
    city: 'São Luís',
    status: 'classified',
    isManual: false,
    createdAt: new Date('2025-12-05T14:00:00'),
    updatedAt: new Date('2025-12-05T14:00:00'),
  },
  {
    id: '5',
    sender: 'joao@empresa.com',
    recipient: 'clienteA@dominio.com',
    subject: 'Atualização do Projeto',
    body: 'Prezados,\n\nInformamos que o projeto está em andamento conforme planejado.\n\nAtenciosamente,\nJoão',
    date: new Date('2025-12-04T16:20:00'),
    status: 'pending',
    isManual: false,
    createdAt: new Date('2025-12-04T16:20:00'),
    updatedAt: new Date('2025-12-04T16:20:00'),
  },
  {
    id: '6',
    sender: 'maria@empresa.com',
    recipient: 'clienteB@dominio.com',
    subject: 'Orçamento Atualizado',
    body: 'Prezado cliente,\n\nSegue o orçamento atualizado conforme solicitado.\n\nAtenciosamente,\nMaria',
    date: new Date('2025-12-04T09:00:00'),
    state: 'SP',
    city: 'São Paulo',
    status: 'classified',
    isManual: false,
    createdAt: new Date('2025-12-04T09:00:00'),
    updatedAt: new Date('2025-12-04T09:00:00'),
  },
  {
    id: '7',
    sender: 'ana@empresa.com',
    recipient: 'clienteE@dominio.com',
    subject: 'Confirmação de Pedido',
    body: 'Olá,\n\nConfirmamos o recebimento do seu pedido.\n\nObrigada,\nAna',
    date: new Date('2025-12-03T11:45:00'),
    state: 'RJ',
    city: 'Rio de Janeiro',
    status: 'classified',
    isManual: false,
    createdAt: new Date('2025-12-03T11:45:00'),
    updatedAt: new Date('2025-12-03T11:45:00'),
  },
  {
    id: '8',
    sender: 'pedro@empresa.com',
    recipient: 'clienteF@dominio.com',
    subject: 'Suporte Técnico',
    body: 'Prezado,\n\nRecebemos sua solicitação de suporte e estamos analisando.\n\nAtenciosamente,\nPedro',
    date: new Date('2025-12-03T15:30:00'),
    status: 'pending',
    isManual: false,
    createdAt: new Date('2025-12-03T15:30:00'),
    updatedAt: new Date('2025-12-03T15:30:00'),
  },
];

export class EmailRepositoryMemory implements IEmailRepository {
  private emails: Email[] = [...mockEmails];

  async list(): Promise<Email[]> {
    return [...this.emails];
  }

  async getById(id: string): Promise<Email | null> {
    return this.emails.find(e => e.id === id) || null;
  }

  async create(data: EmailFormData): Promise<Email> {
    const now = new Date();
    const newEmail: Email = {
      id: String(Date.now()),
      sender: data.sender,
      recipient: data.recipient,
      subject: data.subject,
      body: data.body,
      date: data.date,
      state: data.state,
      city: data.city,
      status: data.state && data.city ? 'classified' : 'pending',
      isManual: true,
      createdAt: now,
      updatedAt: now,
    };
    this.emails.unshift(newEmail);
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

  async updateLocation(id: string, state: string, city: string): Promise<Email> {
    const index = this.emails.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Email not found');
    
    this.emails[index] = {
      ...this.emails[index],
      state,
      city,
      status: 'classified',
      updatedAt: new Date(),
    };
    return this.emails[index];
  }

  async bulkUpdateLocation(updates: Array<{ id: string; state: string; city: string }>): Promise<Email[]> {
    const updatedEmails: Email[] = [];
    
    for (const update of updates) {
      const index = this.emails.findIndex(e => e.id === update.id);
      if (index !== -1) {
        this.emails[index] = {
          ...this.emails[index],
          state: update.state,
          city: update.city,
          status: 'classified',
          updatedAt: new Date(),
        };
        updatedEmails.push(this.emails[index]);
      }
    }
    
    return updatedEmails;
  }

  async delete(id: string): Promise<void> {
    const index = this.emails.findIndex(e => e.id === id);
    if (index !== -1) {
      this.emails.splice(index, 1);
    }
  }
}
