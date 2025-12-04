// View Layer - New Email View

import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LocationSelect } from './components/emails/LocationSelect';
import { useEmailContext } from '@/contexts/EmailContext';
import { useNewEmailViewModel } from '@/viewmodel';

export default function NewEmailView() {
  const navigate = useNavigate();
  const { emailRepository, actions: baseActions } = useEmailContext();
  const { state, actions } = useNewEmailViewModel(emailRepository, baseActions.refreshEmails);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await actions.submit();
    if (success) {
      navigate('/history');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Novo E-mail Manual</h1>
        <p className="text-muted-foreground mt-1">Preencha os dados do envio</p>
      </div>

      <form onSubmit={handleSubmit} className="stat-card space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sender">Remetente *</Label>
          <Input
            id="sender"
            type="email"
            placeholder="usuario@empresa.com"
            value={state.formData.sender}
            onChange={(e) => actions.updateField('sender', e.target.value)}
            className={state.errors.sender ? 'border-destructive' : ''}
          />
          {state.errors.sender && (
            <p className="text-xs text-destructive">{state.errors.sender}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Destinatário *</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="cliente@dominio.com"
            value={state.formData.recipient}
            onChange={(e) => actions.updateField('recipient', e.target.value)}
            className={state.errors.recipient ? 'border-destructive' : ''}
          />
          {state.errors.recipient && (
            <p className="text-xs text-destructive">{state.errors.recipient}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data / Hora</Label>
          <Input
            id="date"
            type="datetime-local"
            value={state.formData.date.toISOString().slice(0, 16)}
            onChange={(e) => actions.updateField('date', new Date(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto *</Label>
          <Input
            id="subject"
            placeholder="Assunto do e-mail"
            value={state.formData.subject}
            onChange={(e) => actions.updateField('subject', e.target.value)}
            className={state.errors.subject ? 'border-destructive' : ''}
          />
          {state.errors.subject && (
            <p className="text-xs text-destructive">{state.errors.subject}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Corpo da Mensagem *</Label>
          <Textarea
            id="body"
            placeholder="Conteúdo do e-mail..."
            rows={6}
            value={state.formData.body}
            onChange={(e) => actions.updateField('body', e.target.value)}
            className={state.errors.body ? 'border-destructive' : ''}
          />
          {state.errors.body && (
            <p className="text-xs text-destructive">{state.errors.body}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Localização (opcional)</Label>
          <LocationSelect
            selectedState={state.formData.state}
            selectedCity={state.formData.city}
            onStateChange={(st) => {
              actions.updateField('state', st);
              actions.updateField('city', '');
            }}
            onCityChange={(city) => actions.updateField('city', city)}
          />
          <p className="text-xs text-muted-foreground">
            Se não preenchido, o e-mail será marcado como pendente.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={state.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
