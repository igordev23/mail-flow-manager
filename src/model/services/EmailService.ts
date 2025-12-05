// Model Layer - Email Service (Business Logic)

import { Email, DashboardData, EmailStats } from '../entities/Email';

export class EmailService {
  static calculateDashboardData(emails: Email[]): DashboardData {
    const stats: EmailStats = {
      total: emails.length,
      classified: emails.filter(e => e.status === 'classified').length,
      pending: emails.filter(e => e.status === 'pending').length,
    };

    // Emails by state
    const stateCount: Record<string, number> = {};
    emails.forEach(email => {
      if (email.state) {
        stateCount[email.state] = (stateCount[email.state] || 0) + 1;
      }
    });
    const emailsByState = Object.entries(stateCount)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);

    // Emails by day (last 7 days)
    const dayCount: Record<string, number> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    last7Days.forEach(day => { dayCount[day] = 0; });
    emails.forEach(email => {
      const day = email.date.toISOString().split('T')[0];
      if (dayCount[day] !== undefined) {
        dayCount[day]++;
      }
    });
    const emailsByDay = Object.entries(dayCount)
      .map(([date, count]) => ({ date, count }));

    // Top recipients
    const recipientCount: Record<string, number> = {};
    emails.forEach(email => {
      recipientCount[email.recipient] = (recipientCount[email.recipient] || 0) + 1;
    });
    const topRecipients = Object.entries(recipientCount)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return { stats, emailsByState, emailsByDay, topRecipients };
  }

  static filterEmails(
    emails: Email[],
    filter: {
      search?: string;
      sender?: string;
      startDate?: Date;
      endDate?: Date;
      state?: string;
      city?: string;
      status?: 'pending' | 'classified' | 'all';
    }
  ): Email[] {
    return emails.filter(email => {
      if (filter.status && filter.status !== 'all' && email.status !== filter.status) {
        return false;
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const matchesSender = email.sender.toLowerCase().includes(searchLower);
        const matchesRecipient = email.recipient.toLowerCase().includes(searchLower);
        const matchesSubject = email.subject.toLowerCase().includes(searchLower);
        if (!matchesSender && !matchesRecipient && !matchesSubject) {
          return false;
        }
      }
      if (filter.sender && !email.sender.toLowerCase().includes(filter.sender.toLowerCase())) {
        return false;
      }
      if (filter.state && email.state !== filter.state) {
        return false;
      }
      if (filter.city && email.city !== filter.city) {
        return false;
      }
      if (filter.startDate && email.date < filter.startDate) {
        return false;
      }
      if (filter.endDate && email.date > filter.endDate) {
        return false;
      }
      return true;
    });
  }

  static exportToCsv(emails: Email[]): void {
    const headers = ['Remetente', 'Destinatário', 'Assunto', 'Data', 'Estado', 'Município', 'Status'];
    const rows = emails.map(email => [
      email.sender,
      email.recipient,
      email.subject,
      email.date.toLocaleDateString('pt-BR'),
      email.state || '-',
      email.city || '-',
      email.status === 'classified' ? 'Classificado' : 'Pendente',
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `emails_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }
}