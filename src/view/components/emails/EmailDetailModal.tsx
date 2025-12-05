// View Layer - Email Detail Modal Component

import { useState, useCallback, useMemo } from 'react';
import { Email } from '@/model/entities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, MapPin, Calendar, User, Mail, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSelect } from './LocationSelect';
import { useEmailContext } from '@/contexts/EmailContext';
import { UpdateEmailLocationUseCase, BulkUpdateLocationUseCase, DeleteEmailUseCase } from '@/model/usecases';
import { toast } from '@/hooks/use-toast';
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
import { EmailRepositorySupabase } from '@/model/repositories/EmailRepositorySupabase';
import { useEffect } from 'react';

interface EmailDetailModalProps {
  email: Email;
  onClose: () => void;
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const { emailRepository, state: contextState, actions } = useEmailContext();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedState, setSelectedState] = useState(email.state || '');
  const [selectedCity, setSelectedCity] = useState(email.city || '');
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [similarEmails, setSimilarEmails] = useState<Email[]>([]);

  const updateLocationUseCase = useMemo(
    () => new UpdateEmailLocationUseCase(),
    [emailRepository]
  );

  const bulkUpdateUseCase = useMemo(
    () => new BulkUpdateLocationUseCase(),
    [emailRepository]
  );

  const deleteEmailUseCase = useMemo(
    () => new DeleteEmailUseCase(new EmailRepositorySupabase()),
    [emailRepository]
  );
   // 🔹 SINCRONIZAÇÃO AUTOMÁTICA COM O CONTEXTO
  useEffect(() => {
  if (!isEditing) {
    const updatedEmail = contextState.emails.find(e => e.id === email.id);
    if (updatedEmail) {
      setSelectedState(updatedEmail.state || '');
      setSelectedCity(updatedEmail.city || '');
    }
  }
}, [contextState.emails, email.id, isEditing]);



  const handleSaveLocation = useCallback(async () => {
    if (selectedState && selectedCity) {
      // Check for similar emails
      const similar = bulkUpdateUseCase.findSimilarEmails(
        contextState.emails,
        email.sender,
        email.recipient,
        email.id
      );

      const pendingSimilar = (await similar).filter(e => e.status === 'pending');

      if (pendingSimilar.length > 0) {
        setSimilarEmails(pendingSimilar);
        setShowBulkDialog(true);
      } else {
        await saveSingleEmail();
      }
    }
  }, [email, selectedState, selectedCity, contextState.emails, bulkUpdateUseCase]);

  const saveSingleEmail = useCallback(async () => {
    try {
      await updateLocationUseCase.execute(email.id, selectedState, selectedCity);
      toast({
        title: 'E-mail classificado',
        description: 'Localização atualizada com sucesso.',
      });
      actions.refreshEmails();
      setIsEditing(false);
      setShowBulkDialog(false);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a localização.',
        variant: 'destructive',
      });
    }
  }, [email.id, selectedState, selectedCity, updateLocationUseCase, actions]);

  const saveAllSimilarEmails = useCallback(async () => {
    try {
      const allIds = [email.id, ...similarEmails.map(e => e.id)];
      await bulkUpdateUseCase.execute(allIds, selectedState, selectedCity);
      toast({
        title: 'E-mails classificados',
        description: `${allIds.length} e-mail(s) atualizado(s) com sucesso.`,
      });
      actions.refreshEmails();
      setIsEditing(false);
      setShowBulkDialog(false);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar os e-mails.',
        variant: 'destructive',
      });
    }
  }, [email.id, similarEmails, selectedState, selectedCity, bulkUpdateUseCase, actions]);

  const handleDelete = useCallback(async () => {
    try {
      await deleteEmailUseCase.execute(email.id);
      toast({
        title: 'E-mail excluído',
        description: 'O e-mail foi removido com sucesso.',
      });
      actions.refreshEmails();
      onClose();
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o e-mail.',
        variant: 'destructive',
      });
    }
  }, [email.id, deleteEmailUseCase, actions, onClose]);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
        <div 
          className="w-full max-w-2xl bg-card rounded-xl shadow-float border border-border animate-scale-in max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Detalhes do E-mail</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Metadata */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Remetente</p>
                  <p className="text-sm font-medium text-foreground">{email.sender}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destinatário</p>
                  <p className="text-sm font-medium text-foreground">{email.recipient}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Data</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(email.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Localização</p>
                  <p className="text-sm font-medium text-foreground">
                    {email.state && email.city 
                      ? `${email.state} - ${email.city}`
                      : 'Não classificado'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Assunto</p>
                <p className="text-sm font-semibold text-foreground">{email.subject}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Mensagem</p>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {email.body}
              </p>
            </div>

            {/* Edit Location */}
            {isEditing ? (
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                <p className="text-sm font-medium text-foreground">Editar Localização</p>
                <LocationSelect
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={setSelectedState}
                  onCityChange={setSelectedCity}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveLocation} disabled={!selectedState || !selectedCity}>
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <MapPin className="mr-2 h-4 w-4" />
                Editar Local
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t border-border bg-muted/30">
            <Button variant="outline" onClick={onClose}>
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Update Dialog */}
      <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar múltiplos e-mails?</AlertDialogTitle>
            <AlertDialogDescription>
              Encontramos <strong>{similarEmails.length}</strong> outro(s) e-mail(s) pendente(s) com o mesmo remetente ({email.sender}) e destinatário ({email.recipient}).
              <br /><br />
              Deseja atualizar a localização de todos eles para <strong>{selectedState} - {selectedCity}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <Button variant="outline" onClick={saveSingleEmail}>
              Apenas este
            </Button>
            <AlertDialogAction onClick={saveAllSimilarEmails}>
              Atualizar todos ({similarEmails.length + 1})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
