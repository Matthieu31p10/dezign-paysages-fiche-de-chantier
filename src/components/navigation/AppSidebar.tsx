import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, Calendar, Users, FileText, Settings,
  BarChart3, Search, Bell, Wrench, Archive
} from 'lucide-react';

const navigationItems = [
  { title: 'Tableau de bord', url: '/', icon: Home },
  { title: 'Projets', url: '/projects', icon: FileText },
  { title: 'Calendrier', url: '/calendar', icon: Calendar },
  { title: 'Personnel', url: '/personnel', icon: Users },
  { title: 'Passages', url: '/passages', icon: Wrench },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
  { title: 'Recherche', url: '/search', icon: Search },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Archives', url: '/archives', icon: Archive },
  { title: 'Paramètres', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="w-60" collapsible>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50"
                      }
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}