
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      name: "Fiches chantier",
      path: "/projects",
      icon: <FileText className="w-5 h-5 mr-2" />,
    },
    {
      name: "Suivi des travaux",
      path: "/worklogs",
      icon: <Calendar className="w-5 h-5 mr-2" />,
    },
    {
      name: "Bilans",
      path: "/reports",
      icon: <BarChart3 className="w-5 h-5 mr-2" />,
    }
  ];

  return (
    <header className="relative z-50 w-full">
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              {/* Logo */}
              <div 
                className="flex-shrink-0 cursor-pointer" 
                onClick={() => navigate('/')}
              >
                <h1 className="text-lg font-semibold text-brand-600">
                  Vertos
                  <span className="text-brand-800 ml-1">Chantiers</span>
                </h1>
              </div>
            </div>

            {/* Navigation for Desktop */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={location.pathname.includes(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "text-sm transition-all duration-200",
                      location.pathname.includes(item.path)
                        ? "bg-brand-500 hover:bg-brand-600 text-white"
                        : "text-gray-700 hover:text-brand-600"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                ))}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-brand-100 animate-scale-in z-50">
          <div className="pt-2 pb-4 space-y-1 px-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname.includes(item.path) ? "default" : "ghost"}
                size="lg"
                className={cn(
                  "w-full justify-start text-left mb-2",
                  location.pathname.includes(item.path)
                    ? "bg-brand-500 hover:bg-brand-600 text-white"
                    : "text-gray-700 hover:text-brand-600"
                )}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
