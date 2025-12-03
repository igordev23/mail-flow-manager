// View Layer - Quick Actions Component

import { Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEmails } from '@/contexts/EmailContext';

export function QuickActions() {
  const navigate = useNavigate();
  const { state } = useEmails();

  return (
    <div className="stat-card animate-fade-in stagger-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Atalhos Rápidos</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start h-12 text-left"
          onClick={() => navigate('/pending')}
        >
          <Clock className="mr-3 h-5 w-5 text-pending" />
          <div className="flex-1">
            <span className="block text-sm font-medium">Ver Pendentes</span>
            <span className="block text-xs text-muted-foreground">
              {state.pendingEmails.length} aguardando
            </span>
          </div>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start h-12 text-left"
          onClick={() => navigate('/new')}
        >
          <PlusCircle className="mr-3 h-5 w-5 text-primary" />
          <div className="flex-1">
            <span className="block text-sm font-medium">Novo Manual</span>
            <span className="block text-xs text-muted-foreground">
              Cadastrar e-mail
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
