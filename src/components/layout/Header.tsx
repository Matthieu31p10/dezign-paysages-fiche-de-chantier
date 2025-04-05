
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  ClipboardList, 
  Settings, 
  File, 
  LogOut,
  ChevronDown,
  PieChart,
  ClipboardCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation links
  const navLinks = [
    { path: '/projects', label: 'Chantiers', icon: <Home className="h-4 w-4" /> },
    { path: '/worklogs', label: 'Fiches de suivi', icon: <ClipboardList className="h-4 w-4" /> },
    { path: '/worktasks', label: 'Fiches de Travaux', icon: <ClipboardCheck className="h-4 w-4" /> },
    { path: '/reports', label: 'Bilans', icon: <PieChart className="h-4 w-4" /> },
    { path: '/settings', label: 'Paramètres', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center">
            <File className="h-6 w-6 text-primary" />
            <span className="ml-2 text-lg font-medium hidden sm:inline-block">SuiviVert</span>
          </Link>
        </div>
        
        {mobile ? (
          <div className="flex items-center justify-between flex-1">
            <div />
            
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" onClick={toggleMenu}>
                  Menu
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link 
                      to={link.path} 
                      className="flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.icon}
                      <span className="ml-2">{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <Button 
                  key={link.path}
                  asChild
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  className={isActive(link.path) ? "" : "text-muted-foreground"}
                >
                  <Link to={link.path} className="flex items-center">
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Link>
                </Button>
              ))}
            </nav>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
