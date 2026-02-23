import { create } from 'zustand'
import { stockMovementsApi } from '@/lib/api/stock-movements'
import type {
  StockMovement,
  CreateStockMovementDto,
  UpdateStockMovementDto,
} from '@/lib/api/types'

interface StockMovementsState {
  movements: StockMovement[]
  selectedMovement: StockMovement | null
  isLoading: boolean
  error: string | null
  filterArticleId: string | null
}

interface StockMovementsActions {
  fetchMovements: (articleId?: string) => Promise<void>
  fetchMovementById: (id: string) => Promise<void>
  createMovement: (data: CreateStockMovementDto) => Promise<StockMovement>
  updateMovement: (
    id: string,
    data: UpdateStockMovementDto,
  ) => Promise<StockMovement>
  deleteMovement: (id: string) => Promise<void>
  setSelectedMovement: (movement: StockMovement | null) => void
  setFilterArticleId: (articleId: string | null) => void
  clearError: () => void
}

type StockMovementsStore = StockMovementsState & StockMovementsActions

export const useStockMovementsStore = create<StockMovementsStore>(
  (set, get) => ({
    movements: [],
    selectedMovement: null,
    isLoading: false,
    error: null,
    filterArticleId: null,

    fetchMovements: async (articleId?: string) => {
      set({ isLoading: true, error: null, filterArticleId: articleId || null })
      try {
        const movements = await stockMovementsApi.getAll(articleId)
        set({ movements, isLoading: false })
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erreur lors du chargement des mouvements'
        set({ error: errorMessage, isLoading: false })
      }
    },

    fetchMovementById: async (id: string) => {
      set({ isLoading: true, error: null })
      try {
        const movement = await stockMovementsApi.getById(id)
        set({ selectedMovement: movement, isLoading: false })
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors du chargement du mouvement d'stock"
        set({ error: errorMessage, isLoading: false })
      }
    },

    createMovement: async (data: CreateStockMovementDto) => {
      set({ isLoading: true, error: null })
      try {
        const newMovement = await stockMovementsApi.create(data)
        set((state) => ({
          movements: [newMovement, ...state.movements],
          isLoading: false,
        }))
        return newMovement
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la création du mouvement d'stock"
        set({ error: errorMessage, isLoading: false })
        throw error
      }
    },

    updateMovement: async (id: string, data: UpdateStockMovementDto) => {
      set({ isLoading: true, error: null })
      try {
        const updatedMovement = await stockMovementsApi.update(id, data)
        set((state) => ({
          movements: state.movements.map((m) =>
            m.id === id ? updatedMovement : m,
          ),
          selectedMovement:
            state.selectedMovement?.id === id
              ? updatedMovement
              : state.selectedMovement,
          isLoading: false,
        }))
        return updatedMovement
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la mise à jour du mouvement d'stock"
        set({ error: errorMessage, isLoading: false })
        throw error
      }
    },

    deleteMovement: async (id: string) => {
      set({ isLoading: true, error: null })
      try {
        await stockMovementsApi.delete(id)
        set((state) => ({
          movements: state.movements.filter((m) => m.id !== id),
          selectedMovement:
            state.selectedMovement?.id === id ? null : state.selectedMovement,
          isLoading: false,
        }))
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression du mouvement d'stock"
        set({ error: errorMessage, isLoading: false })
        throw error
      }
    },

    setSelectedMovement: (movement: StockMovement | null) => {
      set({ selectedMovement: movement })
    },

    setFilterArticleId: (articleId: string | null) => {
      set({ filterArticleId: articleId })
    },

    clearError: () => {
      set({ error: null })
    },
  }),
)
