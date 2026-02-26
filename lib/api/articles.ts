import { apiClient } from './client'
import { API_BASE_URL, API_ENDPOINTS } from './config'
import type { Article, CreateArticleDto, UpdateArticleDto } from './types'

const normalizeArticle = (article: Article): Article => ({
  ...article,
  prixDeVente: typeof article.prixDeVente === 'string' 
    ? parseFloat(article.prixDeVente) 
    : article.prixDeVente,
  quantiteEnStock: typeof article.quantiteEnStock === 'string'
    ? parseInt(article.quantiteEnStock, 10)
    : article.quantiteEnStock,
  quantiteMagasin: typeof article.quantiteMagasin === 'string'
    ? parseInt(article.quantiteMagasin, 10)
    : article.quantiteMagasin,
  quantiteDepot: typeof article.quantiteDepot === 'string'
    ? parseInt(article.quantiteDepot, 10)
    : article.quantiteDepot,
})

export const articlesApi = {
  async getAll(): Promise<Article[]> {
    const articles = await apiClient.get<Article[]>(API_ENDPOINTS.ARTICLES.BASE)
    return articles.map(normalizeArticle)
  },

  async getById(id: string): Promise<Article> {
    const article = await apiClient.get<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id))
    return normalizeArticle(article)
  },

  async create(data: CreateArticleDto): Promise<Article> {
    const article = await apiClient.post<Article>(API_ENDPOINTS.ARTICLES.BASE, data)
    return normalizeArticle(article)
  },

  async update(id: string, data: UpdateArticleDto): Promise<Article> {
    const article = await apiClient.patch<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id), data)
    if (!article) {
      throw new Error('Aucune réponse du serveur')
    }
    return normalizeArticle(article)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.ARTICLES.BY_ID(id))
  },

  async importFromExcel(file: File): Promise<{ created: number; updated: number }> {
    const formData = new FormData()
    formData.append('file', file)

    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const headers: HeadersInit = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ARTICLES.IMPORT}`, {
      method: 'POST',
      body: formData,
      headers,
    })

    if (!response.ok) {
      let message = "Erreur lors de l'import des articles"
      try {
        const data = await response.json()
        if (data?.message) {
          message = Array.isArray(data.message) ? data.message.join('. ') : data.message
        }
      } catch {
        // ignore
      }
      throw new Error(message)
    }

    const data = await response.json()
    return data as { created: number; updated: number }
  },
}
