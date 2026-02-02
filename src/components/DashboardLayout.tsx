import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calculator, FolderOpen, User, LogOut, Crown } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, signOut, isPremium } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = location.pathname.split('/')[2] || 'formulare';

  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold gradient-text">
            Fintutto Formulare
          </Link>
          <div className="flex items-center gap-4">
            {isPremium && (
              <span className="flex items-center gap-1 text-sm text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                <Crown className="h-4 w-4" />
                Premium
              </span>
            )}
            <span className="text-sm text-muted-foreground hidden sm:inline">
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

      {/* Navigation Tabs */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start h-auto bg-transparent p-0 gap-0">
              <TabsTrigger
                value="formulare"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                <FileText className="h-4 w-4" />
                Formulare
              </TabsTrigger>
              <TabsTrigger
                value="rechner"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                <Calculator className="h-4 w-4" />
                Rechner
              </TabsTrigger>
              <TabsTrigger
                value="dokumente"
                className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                <FolderOpen className="h-4 w-4" />
                Meine Dokumente
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
