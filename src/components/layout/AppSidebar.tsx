import { useState } from "react"
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Settings,
  Search,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
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
import GlobalSearchDialog from "@/components/search/GlobalSearchDialog"
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
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
      <Sidebar collapsible="left" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <CompanyLogo className="h-8 w-8 shrink-0" />
            {state === "expanded" && (
              <h1 className="text-lg font-semibold text-sidebar-foreground">
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
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsSearchOpen(true)}
                    tooltip={state === "collapsed" ? "Rechercher" : undefined}
                  >
                    <Search className="h-4 w-4" />
                    <span>Rechercher</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                tooltip={state === "collapsed" ? "Déconnexion" : undefined}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                {state === "expanded" && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {auth.currentUser?.name || auth.currentUser?.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Déconnexion
                    </span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <GlobalSearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        projects={projectInfos || []}
        workLogs={workLogs || []}
        teams={teams || []}
      />
    </>
  )
}