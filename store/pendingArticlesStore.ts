import { create } from 'zustand'
import { pendingArticlesApi } from '@/lib/api/pending-articles'
import type {
  PendingArticle,
  CreatePendingArticleDto,
  UpdatePendingArticleDto,
  ReceivePendingArticleDto,
} from '@/lib/api/types'

interface PendingArticlesState {
  pendingArticles: PendingArticle[]
  isLoading: boolean
  error: string | null
}

interface PendingArticlesActions {
  fetchPendingArticles: () => Promise<void>
  createPendingArticle: (data: CreatePendingArticleDto) => Promise<void>
  updatePendingArticle: (id: string, data: UpdatePendingArticleDto) => Promise<void>
  deletePendingArticle: (id: string) => Promise<void>
  receivePendingArticle: (id: string, data: ReceivePendingArticleDto) => Promise<void>
  clearError: () => void
}

type PendingArticlesStore = PendingArticlesState & PendingArticlesActions

export const usePendingArticlesStore = create<PendingArticlesStore>((set, get) => ({
  pendingArticles: [],
  isLoading: false,
  error: null,

  fetchPendingArticles: async () => {
    set({ isLoading: true, error: null })
    try {
      const pendingArticles = await pendingArticlesApi.getAll()
      set({ pendingArticles, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des articles en attente'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createPendingArticle: async (data: CreatePendingArticleDto) => {
    set({ isLoading: true, error: null })
    try {
      const newPendingArticle = await pendingArticlesApi.create(data)
      set((state) => ({
        pendingArticles: [newPendingArticle, ...state.pendingArticles],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de l\'article en attente'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updatePendingArticle: async (id: string, data: UpdatePendingArticleDto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedPendingArticle = await pendingArticlesApi.update(id, data)
      set((state) => ({
        pendingArticles: state.pendingArticles.map((pa) =>
          pa.id === id ? updatedPendingArticle : pa
        ),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification de l\'article en attente'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deletePendingArticle: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await pendingArticlesApi.delete(id)
      set((state) => ({
        pendingArticles: state.pendingArticles.filter((pa) => pa.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression de l\'article en attente'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  receivePendingArticle: async (id: string, data: ReceivePendingArticleDto) => {
    set({ isLoading: true, error: null })
    try {
      const response = await pendingArticlesApi.receive(id, data)
      set((state) => ({
        pendingArticles: state.pendingArticles.map((pa) =>
          pa.id === id ? response.pendingArticle : pa
        ),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la réception de l\'article'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
