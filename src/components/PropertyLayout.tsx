import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Home, 
  FileText, 
  Users, 
  Wrench, 
  MessageSquare, 
  Settings,
  LogOut,
  User,
  Crown,
  BarChart3,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/property', label: 'Übersicht', icon: BarChart3 },
  { href: '/property/buildings', label: 'Gebäude', icon: Building2 },
  { href: '/property/units', label: 'Einheiten', icon: Home },
  { href: '/property/leases', label: 'Mietverträge', icon: FileText },
  { href: '/property/tenants', label: 'Mieter', icon: Users },
  { href: '/property/meters', label: 'Zähler', icon: Gauge },
  { href: '/property/tasks', label: 'Aufgaben', icon: Wrench },
  { href: '/property/messages', label: 'Nachrichten', icon: MessageSquare },
];

export function PropertyLayout({ children }: PropertyLayoutProps) {
  const { user, profile, signOut, isPremium } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-background border-r flex flex-col fixed h-screen">
        <div className="p-4 border-b">
          <Link to="/property" className="text-xl font-bold gradient-text">
            Fintutto Immobilien
          </Link>
          {profile?.organization_id && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Organisation aktiv
            </p>
          )}
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/property' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link
            to="/property/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              location.pathname === '/property/settings'
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Settings className="h-4 w-4" />
            Einstellungen
          </Link>
          <Link
            to="/dashboard/formulare"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <FileText className="h-4 w-4" />
            Formulare & Rechner
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-background border-b sticky top-0 z-50">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => 
                location.pathname === item.href || 
                (item.href !== '/property' && location.pathname.startsWith(item.href))
              )?.label || 'Immobilienverwaltung'}
            </h1>
            <div className="flex items-center gap-4">
              {isPremium && (
                <span className="flex items-center gap-1 text-sm text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                  <Crown className="h-4 w-4" />
                  Premium
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {profile?.full_name || user?.email}
              </span>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/profil">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
