import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LocationSelect } from '@/components/emails/LocationSelect';
import { useEmails } from '@/contexts/EmailContext';
import { toast } from '@/hooks/use-toast';

export default function NewEmail() {
  const navigate = useNavigate();
  const { createEmail } = useEmails();

  const [formData, setFormData] = useState({
    sender: '',
    recipient: '',
    subject: '',
    body: '',
    date: new Date(),
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.sender.trim()) {
      newErrors.sender = 'Remetente é obrigatório';
    } else if (!formData.sender.includes('@')) {
      newErrors.sender = 'E-mail inválido';
    }
    
    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Destinatário é obrigatório';
    } else if (!formData.recipient.includes('@')) {
      newErrors.recipient = 'E-mail inválido';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Corpo da mensagem é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    createEmail({
      sender: formData.sender.trim(),
      recipient: formData.recipient.trim(),
      subject: formData.subject.trim(),
      body: formData.body.trim(),
      date: formData.date,
      state: formData.state || undefined,
      city: formData.city || undefined,
    });

    navigate('/history');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Novo E-mail Manual</h1>
        <p className="text-muted-foreground mt-1">Preencha os dados do envio</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="stat-card space-y-6">
        {/* Sender */}
        <div className="space-y-2">
          <Label htmlFor="sender">Remetente *</Label>
          <Input
            id="sender"
            type="email"
            placeholder="usuario@empresa.com"
            value={formData.sender}
            onChange={(e) => setFormData(prev => ({ ...prev, sender: e.target.value }))}
            className={errors.sender ? 'border-destructive' : ''}
          />
          {errors.sender && (
            <p className="text-xs text-destructive">{errors.sender}</p>
          )}
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <Label htmlFor="recipient">Destinatário *</Label>
          <Input
            id="recipient"
            type="email"
            placeholder="cliente@dominio.com"
            value={formData.recipient}
            onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
            className={errors.recipient ? 'border-destructive' : ''}
          />
          {errors.recipient && (
            <p className="text-xs text-destructive">{errors.recipient}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Data / Hora</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date.toISOString().slice(0, 16)}
            onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto *</Label>
          <Input
            id="subject"
            placeholder="Assunto do e-mail"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            className={errors.subject ? 'border-destructive' : ''}
          />
          {errors.subject && (
            <p className="text-xs text-destructive">{errors.subject}</p>
          )}
        </div>

        {/* Body */}
        <div className="space-y-2">
          <Label htmlFor="body">Corpo da Mensagem *</Label>
          <Textarea
            id="body"
            placeholder="Conteúdo do e-mail..."
            rows={6}
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            className={errors.body ? 'border-destructive' : ''}
          />
          {errors.body && (
            <p className="text-xs text-destructive">{errors.body}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Localização (opcional)</Label>
          <LocationSelect
            selectedState={formData.state}
            selectedCity={formData.city}
            onStateChange={(state) => setFormData(prev => ({ ...prev, state, city: '' }))}
            onCityChange={(city) => setFormData(prev => ({ ...prev, city }))}
          />
          <p className="text-xs text-muted-foreground">
            Se não preenchido, o e-mail será marcado como pendente.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
