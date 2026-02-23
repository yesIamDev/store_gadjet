'use client'

import { useState, useEffect } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/button'

export function ThemeSwitch() {
  const { theme, setTheme } = useThemeStore()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Déterminer si on est actuellement en mode sombre
    const checkDarkMode = () => {
      if (theme === 'dark') {
        setIsDark(true)
      } else if (theme === 'light') {
        setIsDark(false)
      } else {
        // Mode système
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setIsDark(systemDark)
      }
    }

    checkDarkMode()

    // Écouter les changements si on est en mode système
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        setIsDark(mediaQuery.matches)
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const toggleTheme = () => {
    // Basculer entre clair et sombre
    // Si on est en mode système, on passe directement à l'opposé du système
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemDark ? 'light' : 'dark')
    } else {
      // Basculer entre clair et sombre
      setTheme(isDark ? 'light' : 'dark')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 rounded-xl"
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        <FaSun className="h-4 w-4" />
      ) : (
        <FaMoon className="h-4 w-4" />
      )}
    </Button>
  )
}
