import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return
  
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (resolved === 'dark') {
    root.classList.add('dark')
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme: Theme) => {
        set({ theme })
        applyTheme(theme)
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)

// Initialiser le thème au chargement
if (typeof window !== 'undefined') {
  const { theme } = useThemeStore.getState()
  applyTheme(theme)

  // Écouter les changements de préférence système
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const { theme } = useThemeStore.getState()
      if (theme === 'system') {
        applyTheme('system')
      }
    })
}
