import { useState } from "react"
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Settings,
  Search,
  User,
  Star
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { useFavorites } from '@/hooks/useFavorites'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CompanyLogo from "@/components/ui/company-logo"
import { EnhancedGlobalSearch } from "@/components/search/EnhancedGlobalSearch"
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext'

const navItems = [
  { 
    title: "Accueil", 
    url: "/", 
    icon: Home,
    exact: true
  },
  { 
    title: "Chantiers", 
    url: "/projects", 
    icon: FolderOpen 
  },
  { 
    title: "Passages", 
    url: "/passages", 
    icon: Calendar 
  },
  { 
    title: "Suivis", 
    url: "/worklogs", 
    icon: ClipboardList 
  },
  { 
    title: "Fiches vierges", 
    url: "/blank-worksheets", 
    icon: FileText,
    requiredModule: 'blanksheets'
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: BarChart3 
  },
  { 
    title: "Rapports", 
    url: "/reports", 
    icon: BarChart3 
  },
  { 
    title: "Paramètres", 
    url: "/settings", 
    icon: Settings,
    adminOnly: true
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { auth, logout } = useAuth()
  const { projectInfos, teams } = useApp()
  const { workLogs } = useWorkLogs()
  const isMobile = useIsMobile()
  const { getRecentFavorites } = useFavorites()
  
  const currentPath = location.pathname
  const isActive = (path: string, exact?: boolean) => 
    exact ? currentPath === path : currentPath.startsWith(path)

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && auth.currentUser?.role !== 'admin') {
      return false
    }
    if (item.requiredModule && auth.currentUser?.permissions) {
      return !!auth.currentUser.permissions[item.requiredModule]
    }
    return true
  })

  const userInitials = auth.currentUser && auth.currentUser.name 
    ? auth.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <>
      <Sidebar 
        collapsible="left"
        className="border-r border-sidebar-border"
        variant={isMobile ? "floating" : "sidebar"}
      >
        <SidebarHeader className="border-b border-sidebar-border">
          <div className={`flex items-center gap-2 ${isMobile ? 'px-3 py-3' : 'px-2 py-2'}`}>
            <CompanyLogo className={`${isMobile ? 'h-10 w-10' : 'h-8 w-8'} shrink-0`} />
            {state === "expanded" && (
              <h1 className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold text-sidebar-foreground`}>
                Vertos Chantiers
              </h1>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url, item.exact)}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupContent>
              <div className={isMobile ? 'px-3' : 'px-2'}>
                <EnhancedGlobalSearch 
                  projects={projectInfos || []}
                  workLogs={workLogs || []}
                  teams={teams || []}
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Favorites Section */}
          {getRecentFavorites(4).length > 0 && (
            <>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-yellow-500" />
                  Favoris
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {getRecentFavorites(4).map((favorite) => (
                      <SidebarMenuItem key={favorite.id}>
                        <SidebarMenuButton
                          asChild
                          tooltip={state === "collapsed" ? favorite.title : undefined}
                        >
                          <NavLink 
                            to={`/${favorite.type}s/${favorite.id}`}
                            className="flex items-center gap-2"
                          >
                            <Star className="h-3 w-3 fill-current text-yellow-500" />
                            <span className="truncate text-sm">{favorite.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                tooltip={state === "collapsed" ? "Déconnexion" : undefined}
                className={isMobile ? 'h-12 touch-target' : ''}
              >
                <Avatar className={isMobile ? 'h-8 w-8' : 'h-6 w-6'}>
                  <AvatarFallback className={isMobile ? 'text-sm' : 'text-xs'}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <div className="flex flex-col items-start">
                    <span className={`${isMobile ? 'text-base' : 'text-sm'} font-medium`}>
                      {auth.currentUser?.name || auth.currentUser?.username}
                    </span>
                    <span className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground`}>
                      Déconnexion
                    </span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

    </>
  )
}