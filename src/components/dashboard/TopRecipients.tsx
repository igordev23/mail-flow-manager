import { TopRecipient } from '@/types/email';
import { User } from 'lucide-react';

interface TopRecipientsProps {
  data: TopRecipient[];
}

export function TopRecipients({ data }: TopRecipientsProps) {
  return (
    <div className="stat-card animate-fade-in stagger-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Top 3 Destinatários</h3>
      <div className="space-y-3">
        {data.map((recipient, index) => (
          <div 
            key={recipient.email}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
                  {recipient.email}
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-primary">
              {recipient.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
