
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, BarChart2, Files, Settings, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useApp();
  
  // Check active route
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };
  
  return (
    <header className="flex items-center h-16 px-4 md:px-6 border-b bg-background">
      <Link to="/" className="flex items-center gap-2 font-semibold text-lg sm:text-xl">
        <span className="hidden sm:inline-block text-primary">Suivi Chantier</span>
      </Link>
      
      <nav className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground hover:text-foreground px-2 sm:px-4",
            isActive("/projects") && "bg-accent text-accent-foreground"
          )}
          asChild
        >
          <Link to="/projects">
            <Files className="h-5 w-5 sm:mr-1.5" />
            <span className="hidden sm:inline-block">Chantiers</span>
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground hover:text-foreground px-2 sm:px-4",
            isActive("/worklogs") && "bg-accent text-accent-foreground"
          )}
          asChild
        >
          <Link to="/worklogs">
            <FileText className="h-5 w-5 sm:mr-1.5" />
            <span className="hidden sm:inline-block">Suivis</span>
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground hover:text-foreground px-2 sm:px-4",
            isActive("/reports") && "bg-accent text-accent-foreground"
          )}
          asChild
        >
          <Link to="/reports">
            <BarChart2 className="h-5 w-5 sm:mr-1.5" />
            <span className="hidden sm:inline-block">Bilans</span>
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-muted-foreground hover:text-foreground px-2 sm:px-4",
            isActive("/settings") && "bg-accent text-accent-foreground"
          )}
          asChild
        >
          <Link to="/settings">
            <Settings className="h-5 w-5 sm:mr-1.5" />
            <span className="hidden sm:inline-block">Paramètres</span>
          </Link>
        </Button>

        {auth.auth.isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-2 px-2">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {auth.auth.getCurrentUser()?.name || auth.auth.getCurrentUser()?.username}
                <p className="font-normal text-xs text-muted-foreground">
                  {auth.auth.getCurrentUser()?.role === 'admin' ? 'Administrateur' : 
                   auth.auth.getCurrentUser()?.role === 'manager' ? 'Gestionnaire' : 'Utilisateur'}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
    </header>
  );
};

export default Header;
