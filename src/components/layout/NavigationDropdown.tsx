import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { useFavorites } from '@/hooks/useFavorites'
import { useWorkLogs } from '@/context/WorkLogsContext/WorkLogsContext'
import { 
  Home, 
  FolderOpen, 
  Calendar, 
  ClipboardList, 
  FileText, 
  BarChart3, 
  Settings,
  Star,
  ChevronDown,
  Menu
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { EnhancedGlobalSearch } from "@/components/search/EnhancedGlobalSearch"

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

export function NavigationDropdown() {
  const location = useLocation()
  const { auth } = useAuth()
  const { projectInfos, teams } = useApp()
  const { workLogs } = useWorkLogs()
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

  const recentFavorites = getRecentFavorites(4)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 h-10 px-3 bg-background border"
        >
          <Menu className="h-4 w-4" />
          <span className="hidden sm:inline">Navigation</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-80 bg-background border shadow-lg z-50"
        sideOffset={8}
      >
        {/* Search Section */}
        <div className="p-3 border-b">
          <EnhancedGlobalSearch 
            projects={projectInfos || []}
            workLogs={workLogs || []}
            teams={teams || []}
          />
        </div>

        {/* Main Navigation */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          {filteredNavItems.map((item) => (
            <DropdownMenuItem key={item.url} asChild>
              <NavLink 
                to={item.url} 
                className={({ isActive: navIsActive }) => 
                  `flex items-center gap-3 px-3 py-2 text-sm cursor-pointer transition-colors ${
                    navIsActive || isActive(item.url, item.exact)
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-muted/50'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        {/* Favorites Section */}
        {recentFavorites.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500" />
                Favoris
              </DropdownMenuLabel>
              {recentFavorites.map((favorite) => (
                <DropdownMenuItem key={favorite.id} asChild>
                  <NavLink 
                    to={`/${favorite.type}s/${favorite.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-muted/50"
                  >
                    <Star className="h-3 w-3 fill-current text-yellow-500" />
                    <span className="truncate">{favorite.title}</span>
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}