// Model Layer - Email Types

export interface Email {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  date: Date;
  state?: string;
  city?: string;
  status: 'pending' | 'classified';
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailStats {
  total: number;
  classified: number;
  pending: number;
}

export interface EmailsByState {
  state: string;
  count: number;
}

export interface EmailsByDay {
  date: string;
  count: number;
}

export interface TopRecipient {
  email: string;
  count: number;
}

export interface DashboardData {
  stats: EmailStats;
  emailsByState: EmailsByState[];
  emailsByDay: EmailsByDay[];
  topRecipients: TopRecipient[];
}

export interface BrazilianState {
  code: string;
  name: string;
}

export interface BrazilianCity {
  name: string;
  stateCode: string;
}

export type EmailFormData = Omit<Email, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'isManual'>;

export interface EmailFilter {
  search?: string;
  sender?: string;
  startDate?: Date;
  endDate?: Date;
  state?: string;
  city?: string;
  status?: 'pending' | 'classified' | 'all';
}
