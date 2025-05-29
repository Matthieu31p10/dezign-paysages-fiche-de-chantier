
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDaysIcon, Menu } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import CompanyLogo from '@/components/ui/company-logo';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { path: '/projects', label: 'Chantiers' },
  { path: '/schedule', label: 'Agenda' },
  { path: '/worklogs', label: 'Suivis' },
  { path: '/blank-worksheets', label: 'Fiches vierges', requiredModule: 'blanksheets' },
  { path: '/reports', label: 'Rapports' },
  { path: '/settings', label: 'Paramètres', adminOnly: true }
];

const Header: React.FC = () => {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <CompanyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {filteredNavItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105
                    ${isActive(item.path) 
                      ? 'bg-green-100 text-green-800 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {item.label}
                  {item.path === '/schedule' && (
                    <CalendarDaysIcon className="inline-block ml-1.5 w-4 h-4" />
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-10 w-10 p-0 hover:bg-gray-100 transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">
                    {auth.currentUser?.name || auth.currentUser?.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {auth.currentUser?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                
                {isMobile && (
                  <>
                    {filteredNavItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link 
                          to={item.path} 
                          className={`cursor-pointer ${isActive(item.path) ? 'bg-green-50 text-green-700' : ''}`}
                        >
                          {item.label}
                          {item.path === '/schedule' && (
                            <CalendarDaysIcon className="ml-auto h-4 w-4" />
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
