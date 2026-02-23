import { create } from 'zustand'
import { articlesApi } from '@/lib/api/articles'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/lib/api/types'

interface ArticlesState {
  articles: Article[]
  selectedArticle: Article | null
  isLoading: boolean
  error: string | null
}

interface ArticlesActions {
  fetchArticles: () => Promise<void>
  fetchArticleById: (id: string) => Promise<void>
  createArticle: (data: CreateArticleDto) => Promise<Article>
  updateArticle: (id: string, data: UpdateArticleDto) => Promise<Article>
  deleteArticle: (id: string) => Promise<void>
  setSelectedArticle: (article: Article | null) => void
  clearError: () => void
}

type ArticlesStore = ArticlesState & ArticlesActions

export const useArticlesStore = create<ArticlesStore>((set, get) => ({
  articles: [],
  selectedArticle: null,
  isLoading: false,
  error: null,

  fetchArticles: async () => {
    set({ isLoading: true, error: null })
    try {
      const articles = await articlesApi.getAll()
      set({ articles, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors du chargement des articles'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fetchArticleById: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const article = await articlesApi.getById(id)
      set({ selectedArticle: article, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors du chargement de l\'article'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createArticle: async (data: CreateArticleDto) => {
    set({ isLoading: true, error: null })
    try {
      const newArticle = await articlesApi.create(data)
      set((state) => ({
        articles: [newArticle, ...state.articles],
        isLoading: false,
      }))
      return newArticle
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la création de l\'article'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateArticle: async (id: string, data: UpdateArticleDto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedArticle = await articlesApi.update(id, data)
      set((state) => ({
        articles: state.articles.map((a) => (a.id === id ? updatedArticle : a)),
        selectedArticle:
          state.selectedArticle?.id === id ? updatedArticle : state.selectedArticle,
        isLoading: false,
      }))
      return updatedArticle
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'article'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteArticle: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await articlesApi.delete(id)
      set((state) => ({
        articles: state.articles.filter((a) => a.id !== id),
        selectedArticle:
          state.selectedArticle?.id === id ? null : state.selectedArticle,
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'article'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  setSelectedArticle: (article: Article | null) => {
    set({ selectedArticle: article })
  },

  clearError: () => {
    set({ error: null })
  },
}))
