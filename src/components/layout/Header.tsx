
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center hover:opacity-80 transition-all duration-200 transform hover:scale-105"
            >
              <CompanyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {filteredNavItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 group
                    ${isActive(item.path) 
                      ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 shadow-sm border border-green-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {item.path === '/schedule' && (
                    <CalendarDaysIcon className="inline-block ml-1.5 w-4 h-4" />
                  )}
                  {!isActive(item.path) && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-50 to-green-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative rounded-full h-10 w-10 p-0 hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-green-100 ring-offset-2 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-50 text-green-700 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white shadow-xl border-0 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200"
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
                          {item.path === '/schedule' && (
                            <CalendarDaysIcon className="ml-auto h-4 w-4" />
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
                >
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
