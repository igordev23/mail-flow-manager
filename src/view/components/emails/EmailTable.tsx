// View Layer - Email Table Component

import { Eye } from 'lucide-react';
import { Email } from '@/model/entities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmailTableProps {
  emails: Email[];
  onViewEmail: (email: Email) => void;
  showStatus?: boolean;
}

export function EmailTable({ emails, onViewEmail, showStatus = false }: EmailTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Remetente
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Destinatário
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
              Assunto
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Local
            </th>
            {showStatus && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
            )}
            <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Ação
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {emails.map((email) => (
            <tr key={email.id} className="table-row-hover">
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-foreground truncate block max-w-[150px]">
                  {email.sender}
                </span>
                <span className="text-xs text-muted-foreground sm:hidden">
                  {format(email.date, "dd/MM", { locale: ptBR })}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-foreground truncate block max-w-[150px]">
                  {email.recipient}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span className="text-sm text-foreground truncate block max-w-[200px]">
                  {email.subject}
                </span>
              </td>
              <td className="px-4 py-3">
                {email.state && email.city ? (
                  <span className="text-sm text-foreground whitespace-nowrap">
                    {email.state} / {email.city}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </td>
              {showStatus && (
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      email.status === 'classified'
                        ? "bg-classified/10 text-classified"
                        : "bg-pending/10 text-pending"
                    )}
                  >
                    {email.status === 'classified' ? 'Classificado' : 'Pendente'}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewEmail(email)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {emails.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum e-mail encontrado</p>
        </div>
      )}
    </div>
  );
}
