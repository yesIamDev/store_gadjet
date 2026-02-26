import { apiClient } from './client'
import { API_BASE_URL, API_ENDPOINTS } from './config'
import type {
  PendingArticle,
  CreatePendingArticleDto,
  UpdatePendingArticleDto,
  ReceivePendingArticleDto,
  ReceivePendingArticleResponse,
} from './types'

export const pendingArticlesApi = {
  async getAll(): Promise<PendingArticle[]> {
    return await apiClient.get<PendingArticle[]>(API_ENDPOINTS.PENDING_ARTICLES.BASE)
  },

  async getById(id: string): Promise<PendingArticle> {
    return await apiClient.get<PendingArticle>(API_ENDPOINTS.PENDING_ARTICLES.BY_ID(id))
  },

  async create(data: CreatePendingArticleDto): Promise<PendingArticle> {
    return await apiClient.post<PendingArticle>(API_ENDPOINTS.PENDING_ARTICLES.BASE, data)
  },

  async update(id: string, data: UpdatePendingArticleDto): Promise<PendingArticle> {
    return await apiClient.patch<PendingArticle>(
      API_ENDPOINTS.PENDING_ARTICLES.BY_ID(id),
      data
    )
  },

  async receive(
    id: string,
    data: ReceivePendingArticleDto
  ): Promise<ReceivePendingArticleResponse> {
    return await apiClient.post<ReceivePendingArticleResponse>(
      API_ENDPOINTS.PENDING_ARTICLES.RECEIVE(id),
      data
    )
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.PENDING_ARTICLES.BY_ID(id))
  },

  async importFromExcel(file: File): Promise<{ created: number; updated: number }> {
    const formData = new FormData()
    formData.append('file', file)

    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.PENDING_ARTICLES.IMPORT}`,
      {
        method: 'POST',
        body: formData,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    )

    if (!response.ok) {
      let message = "Erreur lors de l'import de la file d'attente"
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
