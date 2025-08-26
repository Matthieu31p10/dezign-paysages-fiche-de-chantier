
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDaysIcon, Menu, Search } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import CompanyLogo from '@/components/ui/company-logo';
import GlobalSearchDialog from '@/components/search/GlobalSearchDialog';
import { useKeyboardShortcuts, createCommonShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavigationDropdown } from './NavigationDropdown';

const navItems = [
  { path: '/projects', label: 'Chantiers', color: 'emerald' },
  { path: '/passages', label: 'Passages', color: 'green' },
  { path: '/worklogs', label: 'Suivis', color: 'teal' },
  { path: '/blank-worksheets', label: 'Fiches vierges', requiredModule: 'blanksheets', color: 'lime' },
  { path: '/reports', label: 'Rapports', color: 'forest' },
  { path: '/settings', label: 'Paramètres', adminOnly: true, color: 'sage' }
];

const Header: React.FC = () => {
  const { auth, logout } = useAuth();
  const { projectInfos, teams } = useApp();
  const { workLogs } = useWorkLogs();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: createCommonShortcuts({
      onSearch: () => setIsSearchOpen(true),
      onEscape: () => setIsSearchOpen(false)
    })
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const userInitials = auth.currentUser && auth.currentUser.name 
    ? auth.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && auth.currentUser?.role !== 'admin') {
      return false;
    }
    if (item.requiredModule && auth.currentUser?.permissions) {
      return !!auth.currentUser.permissions[item.requiredModule];
    }
    return true;
  });

  const getButtonStyles = (item: any, isActive: boolean) => {
    const baseStyles = "relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2";
    
    const colorStyles = {
      blue: isActive 
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-blue-200" 
        : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-blue-100 hover:border-blue-300",
      emerald: isActive 
        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-emerald-200" 
        : "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-200 hover:from-emerald-200 hover:to-emerald-100 hover:border-emerald-300",
      green: isActive 
        ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-green-200" 
        : "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-200 hover:from-green-200 hover:to-green-100 hover:border-green-300",
      teal: isActive 
        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-600 shadow-teal-200" 
        : "bg-gradient-to-r from-teal-100 to-teal-50 text-teal-800 border-teal-200 hover:from-teal-200 hover:to-teal-100 hover:border-teal-300",
      lime: isActive 
        ? "bg-gradient-to-r from-lime-500 to-lime-600 text-white border-lime-600 shadow-lime-200" 
        : "bg-gradient-to-r from-lime-100 to-lime-50 text-lime-800 border-lime-200 hover:from-lime-200 hover:to-lime-100 hover:border-lime-300",
      forest: isActive 
        ? "bg-gradient-to-r from-green-700 to-green-800 text-white border-green-800 shadow-green-300" 
        : "bg-gradient-to-r from-green-50 to-green-25 text-green-900 border-green-200 hover:from-green-100 hover:to-green-50 hover:border-green-300",
      sage: isActive 
        ? "bg-gradient-to-r from-green-600 to-green-700 text-white border-green-700 shadow-green-200" 
        : "bg-gradient-to-r from-green-50 to-slate-50 text-green-900 border-green-200 hover:from-green-100 hover:to-slate-100 hover:border-green-300"
    };
    
    return `${baseStyles} ${colorStyles[item.color] || colorStyles.green}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-lg transition-all duration-300" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-all duration-200 transform hover:scale-105"
              aria-label="Retour à l'accueil"
            >
              <CompanyLogo className="h-8 w-auto" />
            </Link>
            <NavigationDropdown />
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-2" role="navigation" aria-label="Navigation principale">
              {filteredNavItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={getButtonStyles(item, isActive(item.path))}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-label={`Aller à ${item.label}`}
                >
                  <span className="relative z-10 flex items-center">
                    {item.label}
                    {item.path === '/passages' && (
                      <CalendarDaysIcon className="inline-block ml-1.5 w-4 h-4" aria-hidden="true" />
                    )}
                  </span>
                  {isActive(item.path) && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur opacity-75" aria-hidden="true" />
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Rechercher...</span>
              <div className="ml-auto flex gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden h-10 w-10 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative rounded-full h-10 w-10 p-0 hover:bg-green-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
                  aria-label={`Menu utilisateur - ${auth.currentUser?.name || auth.currentUser?.username}`}
                >
                  <Avatar className="h-9 w-9 ring-2 ring-green-200 ring-offset-2 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-50 text-green-700 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background border shadow-xl rounded-xl p-2 animate-in slide-in-from-top-2 duration-200 z-50"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-green-25 rounded-lg mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {auth.currentUser?.name || auth.currentUser?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth.currentUser?.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="my-2" />
                
                {isMobile && (
                  <>
                    {filteredNavItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link 
                          to={item.path} 
                          className={`cursor-pointer transition-colors duration-200 ${
                            isActive(item.path) ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                          {item.path === '/passages' && (
                            <CalendarDaysIcon className="ml-auto h-4 w-4" aria-hidden="true" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="my-2" />
                  </>
                )}
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200"
                  aria-label="Se déconnecter de l'application"
                >
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projectInfos || []}
        workLogs={workLogs || []}
        teams={teams || []}
      />
    </header>
  );
};

export default React.memo(Header);
