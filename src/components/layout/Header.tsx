
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDaysIcon } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { CompanyLogo } from '@/components/ui/company-logo';
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
  const { currentUser, logout } = useAuth();
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

  const userInitials = currentUser && currentUser.name 
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const filteredNavItems = navItems.filter(item => {
    // Filter items based on user permissions
    if (item.adminOnly && currentUser?.role !== 'admin') {
      return false;
    }
    // Filter module-specific items
    if (item.requiredModule && currentUser?.permissions) {
      return !!currentUser.permissions[item.requiredModule];
    }
    return true;
  });

  return (
    <header className="border-b shadow-sm bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <CompanyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {filteredNavItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive(item.path) 
                      ? 'bg-green-100 text-green-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                  {item.path === '/schedule' && (
                    <CalendarDaysIcon className="inline-block ml-1 w-4 h-4" />
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-200 text-green-800">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {currentUser?.name || currentUser?.username}
                </div>
                <div className="px-2 py-1 text-xs text-gray-500">
                  {currentUser?.email}
                </div>
                <DropdownMenuSeparator />
                
                {isMobile && (
                  <>
                    {filteredNavItems.map((item) => (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link to={item.path} className="cursor-pointer">
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
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

export default Header;
