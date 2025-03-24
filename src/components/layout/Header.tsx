
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, BarChart2, Files, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  
  // Check active route
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
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
      </nav>
    </header>
  );
};

export default Header;
