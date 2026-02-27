import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type { Client, CreateClientDto, UpdateClientDto } from './types'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    const response = await apiClient.get<PaginatedResponse<Client>>(
      API_ENDPOINTS.CLIENTS.BASE
    )
    // Si la réponse est paginée, extraire le tableau data
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data
    }
    // Sinon, retourner la réponse telle quelle (pour compatibilité)
    return Array.isArray(response) ? response : []
  },

  async getById(id: string): Promise<Client> {
    return await apiClient.get<Client>(API_ENDPOINTS.CLIENTS.BY_ID(id))
  },

  async create(data: CreateClientDto): Promise<Client> {
    return await apiClient.post<Client>(API_ENDPOINTS.CLIENTS.BASE, data)
  },

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const client = await apiClient.patch<Client>(
      API_ENDPOINTS.CLIENTS.BY_ID(id),
      data
    )
    if (!client) {
      throw new Error('Aucune réponse du serveur')
    }
    return client
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.CLIENTS.BY_ID(id))
  },
}
