import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  FileText, 
  User, 
  Menu, 
  X,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface ShopHeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  showSearch?: boolean;
}

export function ShopHeader({ onSearch, searchValue = '', showSearch = true }: ShopHeaderProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg hidden sm:inline-block">
            FinTuttO <span className="text-primary">Formulare</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/vermieter" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Für Vermieter
          </Link>
          <Link 
            to="/mieter" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Für Mieter
          </Link>
          <Link 
            to="/#bundles" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Bundles
          </Link>
        </nav>

        {/* Search */}
        {showSearch && (
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Formular suchen..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/meine-formulare">Meine Formulare</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profil">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Anmelden
              </Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden border-t",
        isMobileMenuOpen ? "block" : "hidden"
      )}>
        <nav className="container py-4 flex flex-col gap-2">
          {showSearch && (
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Formular suchen..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
          )}
          <Link 
            to="/vermieter" 
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Für Vermieter
          </Link>
          <Link 
            to="/mieter" 
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Für Mieter
          </Link>
          <Link 
            to="/#bundles" 
            className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Bundles
          </Link>
          {user && (
            <Link 
              to="/meine-formulare" 
              className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Meine Formulare
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
