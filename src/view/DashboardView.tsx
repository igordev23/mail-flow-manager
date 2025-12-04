// View Layer - Dashboard View

import { Mail, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEmailContext } from '@/contexts/EmailContext';
import { useDashboardViewModel } from '@/viewmodel';
import { StatCard } from './components/dashboard/StatCard';
import { EmailsByStateChart } from './components/dashboard/EmailsByStateChart';
import { EmailsTrendChart } from './components/dashboard/EmailsTrendChart';
import { TopRecipients } from './components/dashboard/TopRecipients';
import { QuickActions } from './components/dashboard/QuickActions';

export default function DashboardView() {
  const { state: baseState } = useEmailContext();
  const { state } = useDashboardViewModel(
    baseState.emails,
    baseState.loading,
    baseState.error
  );

  const { stats, emailsByState, emailsByDay, topRecipients } = state.dashboardData;
  const today = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumo geral - {today}</p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <EmailsByStateChart data={emailsByState} />
        <EmailsTrendChart data={emailsByDay} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopRecipients data={topRecipients} />
        <QuickActions />
      </div>
    </div>
  );
}
