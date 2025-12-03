import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary/5 border-primary/20',
  success: 'bg-classified-bg border-classified/20',
  warning: 'bg-pending-bg border-pending/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-classified/10 text-classified',
  warning: 'bg-pending/10 text-pending',
};

export function StatCard({ title, value, icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      "stat-card animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-classified" : "text-destructive"
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% vs ontem
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          iconStyles[variant]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
