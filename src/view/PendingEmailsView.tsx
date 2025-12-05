// View Layer - Pending Emails View

import { Save, Download, Search, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationSelect } from './components/emails/LocationSelect';
import { EmailDetailModal } from './components/emails/EmailDetailModal';
import { useEmailContext } from '@/contexts/EmailContext';
import { usePendingEmailsViewModel } from '@/viewmodel';
import { Email } from '@/model/entities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PendingEmailsView() {
  const { state: baseState, actions: baseActions, emailRepository } = useEmailContext();
  const { state, actions } = usePendingEmailsViewModel(
    baseState.emails,
    emailRepository,
    baseActions.refreshEmails,
    baseState.loading,
    baseState.error
  );

  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);

  const handleConfirmDelete = async () => {
    if (emailToDelete) {
      await actions.deleteEmail(emailToDelete);
      setEmailToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">E-mails Pendentes</h1>
          <p className="text-muted-foreground mt-1">
            {state.pendingEmails.length} e-mail(s) aguardando classificação
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actions.exportEmails}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={actions.saveAll} disabled={state.validUpdateCount === 0}>
            <Save className="mr-2 h-4 w-4" />
            Salvar ({state.validUpdateCount})
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por remetente, destinatário ou assunto..."
          value={state.searchTerm}
          onChange={(e) => actions.setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="stat-card overflow-hidden p-0">
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Data
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Local
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {state.filteredEmails.map((email) => {
                const update = state.updates[email.id] || { state: '', city: '' };
                return (
                  <tr key={email.id} className="table-row-hover">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground truncate block max-w-[150px]">
                        {email.sender}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground truncate block max-w-[150px]">
                        {email.recipient}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(email.date, "dd/MM", { locale: ptBR })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <LocationSelect
                        selectedState={update.state}
                        selectedCity={update.city}
                        onStateChange={(emailState) => actions.handleStateChange(email.id, emailState)}
                        onCityChange={(city) => actions.handleCityChange(email.id, city)}
                        compact
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => actions.setSelectedEmail(email)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEmailToDelete(email)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {state.filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {state.searchTerm
                ? 'Nenhum e-mail encontrado com os critérios de busca'
                : 'Nenhum e-mail pendente'}
            </p>
          </div>
        )}
      </div>

      {state.selectedEmail && (
        <EmailDetailModal
          email={state.selectedEmail}
          onClose={() => actions.setSelectedEmail(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!emailToDelete} onOpenChange={(open) => !open && setEmailToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este e-mail? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
