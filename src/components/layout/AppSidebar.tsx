import { LayoutDashboard, Clock, PlusCircle, List, Mail } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pendentes', href: '/pending', icon: Clock },
  { name: 'Novo E-mail', href: '/new', icon: PlusCircle },
  { name: 'Histórico', href: '/history', icon: List },
];

export function AppSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Mail className="h-8 w-8 text-sidebar-primary" />
        <span className="ml-3 text-lg font-semibold text-sidebar-accent-foreground">
          MailManager
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">
          Sistema de Gestão de E-mails
        </p>
        <p className="text-xs text-sidebar-foreground/40 mt-1">
          v1.0.0 - Hackaton IFPI
        </p>
      </div>
    </aside>
  );
}
