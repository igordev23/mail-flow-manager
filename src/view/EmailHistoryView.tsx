// View Layer - Email History View

import { useState, useEffect } from 'react';
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
import { EmailTable } from './components/emails/EmailTable';
import { EmailDetailModal } from './components/emails/EmailDetailModal';
import { useEmails } from '@/contexts/EmailContext';
import { Email, BrazilianState } from '@/model/entities';
import { locationRepository } from '@/contexts/EmailContext';

export default function EmailHistoryView() {
  const { state, actions } = useEmails();
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [states, setStates] = useState<BrazilianState[]>([]);

  // Load states for filter
  useEffect(() => {
    const loadStates = async () => {
      const data = await locationRepository.getStates();
      setStates(data);
    };
    loadStates();
  }, []);

  const handleSearchChange = (search: string) => {
    actions.setFilter({ ...state.filter, search });
  };

  const handleStatusChange = (status: string) => {
    actions.setFilter({ 
      ...state.filter, 
      status: status === 'all' ? 'all' : status as 'pending' | 'classified' 
    });
  };

  const handleStateChange = (stateCode: string) => {
    actions.setFilter({ 
      ...state.filter, 
      state: stateCode === 'all' ? undefined : stateCode,
      city: undefined 
    });
  };

  const clearFilters = () => {
    actions.setFilter({ status: 'all' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico de E-mails</h1>
          <p className="text-muted-foreground mt-1">
            {state.filteredEmails.length} e-mail(s) encontrado(s)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline" onClick={actions.exportEmails}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Digite para pesquisar..."
          value={state.filter.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="stat-card animate-slide-up">
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Status
              </label>
              <Select value={state.filter.status || 'all'} onValueChange={handleStatusChange}>
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
              <Select value={state.filter.state || 'all'} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>
                  {states.map((stateItem) => (
                    <SelectItem key={stateItem.code} value={stateItem.code}>
                      {stateItem.code} - {stateItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="stat-card overflow-hidden p-0">
        <EmailTable
          emails={state.filteredEmails}
          onViewEmail={setSelectedEmail}
          showStatus
        />
      </div>

      {/* Detail Modal */}
      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}
    </div>
  );
}
