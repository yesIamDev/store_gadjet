// Exemple de store Zustand de base
// Vous pouvez créer d'autres stores selon vos besoins

import { create } from 'zustand'

interface AppState {
  // Ajoutez vos états ici
  count: number
  // Exemple d'autres états possibles:
  // user: User | null
  // theme: 'light' | 'dark'
  // cart: CartItem[]
}

interface AppActions {
  // Ajoutez vos actions ici
  increment: () => void
  decrement: () => void
  reset: () => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>((set) => ({
  // État initial
  count: 0,

  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
