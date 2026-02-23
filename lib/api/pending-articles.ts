import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
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
}
