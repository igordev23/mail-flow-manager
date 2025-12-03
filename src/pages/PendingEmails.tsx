import { useState, useEffect } from 'react';
import { Save, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocationSelect } from '@/components/emails/LocationSelect';
import { useEmails } from '@/contexts/EmailContext';

interface PendingUpdate {
  id: string;
  state: string;
  city: string;
}

export default function PendingEmails() {
  const { pendingEmails, savePendingEmails, exportEmails, setFilter } = useEmails();
  const [updates, setUpdates] = useState<Record<string, PendingUpdate>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilter({ status: 'pending' });
    return () => setFilter({ status: 'all' });
  }, [setFilter]);

  const filteredEmails = pendingEmails.filter(email => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      email.sender.toLowerCase().includes(term) ||
      email.recipient.toLowerCase().includes(term) ||
      email.subject.toLowerCase().includes(term)
    );
  });

  const handleStateChange = (emailId: string, state: string) => {
    setUpdates(prev => ({
      ...prev,
      [emailId]: { id: emailId, state, city: '' },
    }));
  };

  const handleCityChange = (emailId: string, city: string) => {
    setUpdates(prev => ({
      ...prev,
      [emailId]: { ...prev[emailId], city },
    }));
  };

  const handleSaveAll = () => {
    const validUpdates = Object.values(updates).filter(u => u.state && u.city);
    savePendingEmails(validUpdates);
    setUpdates({});
  };

  const validUpdateCount = Object.values(updates).filter(u => u.state && u.city).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">E-mails Pendentes</h1>
          <p className="text-muted-foreground mt-1">
            {pendingEmails.length} e-mail(s) aguardando classificação
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportEmails}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button 
            onClick={handleSaveAll}
            disabled={validUpdateCount === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar ({validUpdateCount})
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por remetente, destinatário ou assunto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
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
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmails.map((email) => {
                const update = updates[email.id] || { state: '', city: '' };
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
                        onStateChange={(state) => handleStateChange(email.id, state)}
                        onCityChange={(city) => handleCityChange(email.id, city)}
                        compact
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Nenhum e-mail encontrado com os critérios de busca'
                : 'Nenhum e-mail pendente'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
