import { useState } from 'react';
import { Email } from '@/types/email';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, MapPin, Calendar, User, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationSelect } from './LocationSelect';
import { useEmails } from '@/contexts/EmailContext';

interface EmailDetailModalProps {
  email: Email;
  onClose: () => void;
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const { updateEmailLocation } = useEmails();
  const [isEditing, setIsEditing] = useState(false);
  const [state, setState] = useState(email.state || '');
  const [city, setCity] = useState(email.city || '');

  const handleSaveLocation = () => {
    if (state && city) {
      updateEmailLocation(email.id, state, city);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-card rounded-xl shadow-float border border-border animate-scale-in max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Detalhes do E-mail</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
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
                selectedState={state}
                selectedCity={city}
                onStateChange={setState}
                onCityChange={setCity}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveLocation} disabled={!state || !city}>
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
  );
}
