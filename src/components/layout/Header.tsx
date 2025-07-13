
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/SupabaseAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Menu, CalendarDaysIcon } from 'lucide-react';
import CompanyLogo from '@/components/ui/company-logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItem {
  path: string;
  label: string;
  color: string;
  adminOnly?: boolean;
  requiredModule?: string;
}

const navItems: MenuItem[] = [
  { path: '/projects', label: 'Chantiers', color: 'emerald' },
  { path: '/schedule', label: 'Agenda', color: 'green' },
  { path: '/worklogs', label: 'Suivis', color: 'teal' },
  { path: '/blank-worksheets', label: 'Fiches vierges', requiredModule: 'blanksheets', color: 'lime' },
  { path: '/reports', label: 'Rapports', color: 'forest' },
  { path: '/settings', label: 'Paramètres', adminOnly: true, color: 'sage' }
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Get user initials from profile
  const userInitials = profile && (profile.first_name || profile.last_name)
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase()
    : profile?.email?.[0]?.toUpperCase() || '?';

  // Check if user has access to menu item
  const hasAccess = (item: MenuItem) => {
    if (item.adminOnly && profile?.role !== 'admin') {
      return false;
    }
    if (item.requiredModule && profile?.permissions) {
      return !!profile.permissions[item.requiredModule];
    }
    return true;
  };

  const filteredNavItems = navItems.filter(hasAccess);

  const getButtonStyles = (item: MenuItem, isActive: boolean) => {
    const baseStyles = "relative px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2";
    
    const colorStyles = {
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
    
    return `${baseStyles} ${colorStyles[item.color as keyof typeof colorStyles] || colorStyles.green}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-lg transition-all duration-300">
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
            <nav className="flex items-center space-x-2">
              {filteredNavItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={getButtonStyles(item, isActive(item.path))}
                >
                  <span className="relative z-10 flex items-center">
                    {item.label}
                    {item.path === '/schedule' && (
                      <CalendarDaysIcon className="inline-block ml-1.5 w-4 h-4" />
                    )}
                  </span>
                  {isActive(item.path) && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-lg blur opacity-75" />
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
                  className="relative rounded-full h-10 w-10 p-0 hover:bg-green-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
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
                className="w-56 bg-white shadow-xl border-0 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.email
                      }
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                
                {isMobile && (
                  <>
                    <DropdownMenuSeparator />
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
                  </>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
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

export default React.memo(Header);
