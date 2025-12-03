// View Layer - Stat Card Component

import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning';
}

export function StatCard({ title, value, icon, variant = 'primary' }: StatCardProps) {
  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-classified/10 text-classified',
    warning: 'bg-pending/10 text-pending',
  };

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value.toLocaleString('pt-BR')}</p>
        </div>
        <div className={cn('p-3 rounded-xl', iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
