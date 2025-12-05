// View Layer - Email History View

import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { EmailTable } from './components/emails/EmailTable';
import { EmailDetailModal } from './components/emails/EmailDetailModal';
import { useEmailContext } from '@/contexts/EmailContext';
import { useEmailHistoryViewModel } from '@/viewmodel';
import { Email } from '@/model/entities';

export default function EmailHistoryView() {
  const { state: baseState, actions: baseActions, locationRepository, emailRepository } = useEmailContext();
  const { state, actions } = useEmailHistoryViewModel(
    baseState.emails,
    locationRepository,
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
          <h1 className="text-2xl font-bold text-foreground">Histórico de E-mails</h1>
          <p className="text-muted-foreground mt-1">
            {state.filteredEmails.length} e-mail(s) encontrado(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={actions.toggleFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" onClick={actions.exportEmails}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Digite para pesquisar..."
          value={state.filter.search || ''}
          onChange={(e) => actions.setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {state.showFilters && (
        <div className="stat-card animate-slide-up">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Status
              </label>
              <Select value={state.filter.status || 'all'} onValueChange={(v) => actions.setStatus(v as 'all' | 'pending' | 'classified')}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="classified">Classificados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Estado
              </label>
              <Select value={state.filter.state || 'all'} onValueChange={(v) => actions.setState(v === 'all' ? undefined : v)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  {state.states.map((stateItem) => (
                    <SelectItem key={stateItem.code} value={stateItem.code}>
                      {stateItem.code} - {stateItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={actions.clearFilters}>
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="stat-card overflow-hidden p-0">
        <EmailTable
          emails={state.filteredEmails}
          onViewEmail={actions.setSelectedEmail}
          onDeleteEmail={setEmailToDelete}
          showStatus
          showDelete
        />
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
