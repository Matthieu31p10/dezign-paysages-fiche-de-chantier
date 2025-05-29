
import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDaysIcon, LogOut, Settings } from 'lucide-react';
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
  { path: '/projects', label: 'Chantiers', icon: null },
  { path: '/schedule', label: 'Agenda', icon: CalendarDaysIcon },
  { path: '/worklogs', label: 'Suivis', icon: null },
  { path: '/blank-worksheets', label: 'Fiches vierges', requiredModule: 'blanksheets', icon: null },
  { path: '/reports', label: 'Rapports', icon: null },
  { path: '/settings', label: 'Paramètres', adminOnly: true, icon: Settings }
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

  const userInitials = useMemo(() => {
    return auth.currentUser && auth.currentUser.name 
      ? auth.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  }, [auth.currentUser]);

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => {
      // Filter items based on user permissions
      if (item.adminOnly && auth.currentUser?.role !== 'admin') {
        return false;
      }
      // Filter module-specific items
      if (item.requiredModule && auth.currentUser?.permissions) {
        return !!auth.currentUser.permissions[item.requiredModule];
      }
      return true;
    });
  }, [auth.currentUser]);

  return (
    <header className="border-b border-green-100 shadow-sm bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center transition-transform duration-200 hover:scale-105">
              <CompanyLogo className="h-8 w-auto" />
            </Link>
          </div>

          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 hover:scale-105
                      ${isActive(item.path) 
                        ? 'bg-green-100 text-green-800 shadow-sm' 
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative rounded-full h-10 w-10 p-0 transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <Avatar className="h-10 w-10 border-2 border-green-200">
                    <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-800 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 p-2 border border-green-100 shadow-lg bg-white/95 backdrop-blur-sm"
              >
                <div className="px-3 py-2 bg-green-50 rounded-lg mb-2">
                  <div className="font-medium text-green-800">
                    {auth.currentUser?.name || auth.currentUser?.username}
                  </div>
                  <div className="text-xs text-green-600">
                    {auth.currentUser?.email}
                  </div>
                  <div className="text-xs text-green-500 mt-1 capitalize">
                    {auth.currentUser?.role || 'Utilisateur'}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-green-100" />
                
                {isMobile && (
                  <>
                    {filteredNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link 
                            to={item.path} 
                            className="cursor-pointer flex items-center space-x-2 py-2 px-3 rounded-md transition-colors duration-200 hover:bg-green-50"
                          >
                            {Icon && <Icon className="w-4 h-4 text-green-600" />}
                            <span>{item.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator className="bg-green-100" />
                  </>
                )}
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-2 py-2 px-3 rounded-md transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
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
