import { Mail, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEmails } from '@/contexts/EmailContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmailsByStateChart } from '@/components/dashboard/EmailsByStateChart';
import { EmailsTrendChart } from '@/components/dashboard/EmailsTrendChart';
import { TopRecipients } from '@/components/dashboard/TopRecipients';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  const { dashboardData } = useEmails();
  const { stats, emailsByState, emailsByDay, topRecipients } = dashboardData;

  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumo geral - {today}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de E-mails"
          value={stats.total}
          icon={<Mail className="h-6 w-6" />}
          variant="primary"
        />
        <StatCard
          title="Classificados"
          value={stats.classified}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EmailsByStateChart data={emailsByState} />
        <EmailsTrendChart data={emailsByDay} />
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopRecipients data={topRecipients} />
        <QuickActions />
      </div>
    </div>
  );
}
