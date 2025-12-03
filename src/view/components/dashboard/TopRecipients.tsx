// View Layer - Top Recipients Component

import { TopRecipient } from '@/model/entities';

interface TopRecipientsProps {
  data: TopRecipient[];
}

export function TopRecipients({ data }: TopRecipientsProps) {
  return (
    <div className="stat-card animate-fade-in stagger-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Destinatários Top 3</h3>
      <div className="space-y-3">
        {data.map((recipient, index) => (
          <div 
            key={recipient.email}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {recipient.email}
              </p>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">
              ({recipient.count})
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum destinatário encontrado
          </p>
        )}
      </div>
    </div>
  );
}
