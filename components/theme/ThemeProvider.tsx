'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    // S'assurer que le thème est appliqué après l'hydratation
    const timer = setTimeout(() => {
      const { theme } = useThemeStore.getState()
      const getSystemTheme = (): 'light' | 'dark' => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      
      const resolved = theme === 'system' ? getSystemTheme() : theme
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      
      if (resolved === 'dark') {
        root.classList.add('dark')
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [theme])

  return <>{children}</>
}
