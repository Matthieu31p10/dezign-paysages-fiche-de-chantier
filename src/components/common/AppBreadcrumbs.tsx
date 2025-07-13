import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, FolderOpen, Calendar, FileText, Settings, ClipboardList, LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon?: LucideIcon;
}

const routeConfig: Record<string, { label: string; icon?: LucideIcon }> = {
  '/': { label: 'Accueil', icon: Home },
  '/projects': { label: 'Projets', icon: FolderOpen },
  '/projects/new': { label: 'Nouveau projet' },
  '/worklogs': { label: 'Journaux de travail', icon: ClipboardList },
  '/worklogs/new': { label: 'Nouveau journal' },
  '/blank-worksheets': { label: 'Fiches vierges', icon: FileText },
  '/blank-worksheets/new': { label: 'Nouvelle fiche' },
  '/schedule': { label: 'Planning', icon: Calendar },
  '/reports': { label: 'Rapports', icon: FileText },
  '/settings': { label: 'Paramètres', icon: Settings },
};

const AppBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { path: '/', label: 'Accueil', icon: Home }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const config = routeConfig[currentPath as keyof typeof routeConfig];
      
      if (config) {
        breadcrumbs.push({
          path: currentPath,
          label: config.label,
          icon: config.icon
        });
      } else {
        // Handle dynamic routes (like /projects/:id)
        if (segment.match(/^[a-f0-9-]{36}$/)) {
          // This is likely a UUID, show a generic label
          const previousPath = breadcrumbs[breadcrumbs.length - 1]?.path;
          if (previousPath === '/projects') {
            breadcrumbs.push({
              path: currentPath,
              label: 'Détails du projet'
            });
          } else if (previousPath === '/worklogs') {
            breadcrumbs.push({
              path: currentPath,
              label: 'Détails du journal'
            });
          }
        } else if (segment === 'edit') {
          breadcrumbs.push({
            path: currentPath,
            label: 'Modification'
          });
        }
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // If we have more than 3 items, collapse the middle ones
  const shouldCollapse = breadcrumbs.length > 3;
  const displayBreadcrumbs = shouldCollapse 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-2)]
    : breadcrumbs;
  const collapsedItems = shouldCollapse 
    ? breadcrumbs.slice(1, -2)
    : [];

  return (
    <div className="px-6 py-3 border-b bg-card/50">
      <Breadcrumb>
        <BreadcrumbList>
          {displayBreadcrumbs.map((breadcrumb, index) => {
            const isLast = index === displayBreadcrumbs.length - 1;
            const IconComponent = breadcrumb.icon;
            
            return (
              <React.Fragment key={breadcrumb.path}>
                {/* Show collapsed items dropdown before the last items */}
                {shouldCollapse && index === 1 && collapsedItems.length > 0 && (
                  <>
                    <BreadcrumbItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center">
                          <BreadcrumbEllipsis className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {collapsedItems.map((item) => {
                            const ItemIcon = item.icon;
                            return (
                              <DropdownMenuItem key={item.path}>
                                <Link to={item.path} className="flex items-center gap-2">
                                  {ItemIcon && <ItemIcon className="h-4 w-4" />}
                                  {item.label}
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {breadcrumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.path} className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {breadcrumb.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AppBreadcrumbs;