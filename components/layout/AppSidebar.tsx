'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FaChartLine, FaBox, FaShoppingBag, FaExchangeAlt, FaUsers, FaFileInvoice, FaClock, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { useAuthStore } from '@/store/authStore'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { UserMenu } from '@/components/auth/UserMenu'
import { ThemeSwitch } from '@/components/theme/ThemeSwitch'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()
  const [isArticlesMenuOpen, setIsArticlesMenuOpen] = useState(
    pathname === '/articles' || pathname === '/pending-articles'
  )

  const navItems = [
    {
      label: 'Mouvements',
      href: '/stock-movements',
      icon: FaExchangeAlt,
    },
    {
      label: 'Clients',
      href: '/clients',
      icon: FaUsers,
    },
    {
      label: 'Factures',
      href: '/invoices',
      icon: FaFileInvoice,
    },
  ]

  const articlesSubItems = [
    {
      label: 'Liste des articles',
      href: '/articles',
      icon: FaBox,
    },
    {
      label: 'File d\'attente',
      href: '/pending-articles',
      icon: FaClock,
    },
  ]

  return (
    <Sidebar className="border-r border-border/80 bg-sidebar">
      <SidebarHeader className="border-b border-border/80">
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-sm">
            <FaShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">Store Gadjet</span>
            <span className="text-xs text-muted-foreground">Gestion de stock</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-2.5">
            <SidebarMenu className="space-y-2">
              {/* Dashboard */}
              <SidebarMenuItem className="mb-1.5">
                <SidebarMenuButton
                  onClick={() => router.push('/dashboard')}
                  isActive={pathname === '/dashboard'}
                  className={cn(
                    'w-full justify-start gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition-all duration-200 relative group',
                    pathname === '/dashboard'
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <FaChartLine className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    pathname === '/dashboard' ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  <span className="flex-1">Dashboard</span>
                  {pathname === '/dashboard' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary-foreground/30 rounded-r-full" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Menu Articles avec sous-menu */}
              <SidebarMenuItem className="mb-1.5">
                <SidebarMenuButton
                  onClick={() => setIsArticlesMenuOpen(!isArticlesMenuOpen)}
                  isActive={pathname === '/articles' || pathname === '/pending-articles'}
                  className={cn(
                    'w-full justify-start gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition-all duration-200 relative group',
                    pathname === '/articles' || pathname === '/pending-articles'
                      ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <FaBox className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    (pathname === '/articles' || pathname === '/pending-articles') ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  <span className="flex-1">Articles</span>
                  {isArticlesMenuOpen ? (
                    <FaChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
                  ) : (
                    <FaChevronRight className="h-3.5 w-3.5 transition-transform duration-200" />
                  )}
                  {(pathname === '/articles' || pathname === '/pending-articles') && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary-foreground/30 rounded-r-full" />
                  )}
                </SidebarMenuButton>
                {isArticlesMenuOpen && (
                  <SidebarMenuSub className="mt-2">
                    {articlesSubItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = pathname === subItem.href
                      return (
                        <SidebarMenuSubItem key={subItem.href} className="mb-1">
                          <SidebarMenuSubButton
                            onClick={() => router.push(subItem.href)}
                            isActive={isSubActive}
                            className={cn(
                              'w-full justify-start gap-2 rounded-md px-3 py-2.5 text-sm transition-all duration-200',
                              isSubActive
                                ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98] font-medium'
                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            )}
                          >
                            <SubIcon className="h-3.5 w-3.5" />
                            <span>{subItem.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Autres items de navigation */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href} className="mb-1.5">
                    <SidebarMenuButton
                      onClick={() => router.push(item.href)}
                      isActive={isActive}
                      className={cn(
                        'w-full justify-start gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition-all duration-200 relative group',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isActive ? 'scale-110' : 'group-hover:scale-110'
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary-foreground/30 rounded-r-full" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/80 p-4">
        <div className="space-y-3">
          {user && (
            <div className="px-3 py-2 rounded-lg bg-sidebar-accent/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Connecté en tant que
              </p>
              <p className="text-sm font-semibold text-sidebar-foreground">
                {user.username}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 px-1">
            <UserMenu />
            <ThemeSwitch />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
