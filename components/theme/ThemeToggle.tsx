'use client'

import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa'
import { useThemeStore } from '@/store/themeStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          aria-label="Changer le thème"
        >
          {theme === 'dark' ? (
            <FaMoon className="h-4 w-4" />
          ) : theme === 'light' ? (
            <FaSun className="h-4 w-4" />
          ) : (
            <FaDesktop className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-2',
            theme === 'light' && 'bg-accent'
          )}
        >
          <FaSun className="h-4 w-4" />
          <span>Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-2',
            theme === 'dark' && 'bg-accent'
          )}
        >
          <FaMoon className="h-4 w-4" />
          <span>Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-2',
            theme === 'system' && 'bg-accent'
          )}
        >
          <FaDesktop className="h-4 w-4" />
          <span>Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
