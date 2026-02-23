'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'sonner'

export function UserMenu() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => router.push('/login')}>
          Connexion
        </Button>
        <Button onClick={() => router.push('/signup')}>
          Inscription
        </Button>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    router.push('/')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-9 rounded-lg border-border/80">
          <FaUser className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground">
          Mon compte
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="px-3 py-2">
          <FaUser className="mr-2 h-3.5 w-3.5" />
          <span className="text-sm">{user.username}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/articles')} className="px-3 py-2">
          <span className="text-sm">Articles</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="px-3 py-2 text-destructive focus:text-destructive">
          <FaSignOutAlt className="mr-2 h-3.5 w-3.5" />
          <span className="text-sm">Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
