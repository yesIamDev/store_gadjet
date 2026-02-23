'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaShoppingBag, FaHome, FaBox, FaBars, FaTimes } from 'react-icons/fa'
import { useAuthStore } from '@/store/authStore'
import { UserMenu } from '@/components/auth/UserMenu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: FaHome,
      show: true,
    },
    {
      label: 'Articles',
      href: '/articles',
      icon: FaBox,
      show: isAuthenticated,
    },
  ]

  const filteredItems = navItems.filter((item) => item.show)

  const handleNavClick = (href: string) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <FaShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Store Gadjet</span>
          </motion.div>

          <div className="hidden items-center gap-1 md:flex">
            {filteredItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? 'secondary' : 'ghost'}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    'gap-2',
                    isActive && 'bg-secondary font-medium'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <UserMenu />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FaBars className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                {filteredItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? 'secondary' : 'ghost'}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        'w-full justify-start gap-2',
                        isActive && 'bg-secondary font-medium'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  )
                })}
                <div className="mt-4 border-t pt-4">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
