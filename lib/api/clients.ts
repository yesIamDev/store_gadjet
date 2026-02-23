import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type { Client, CreateClientDto, UpdateClientDto } from './types'

export const clientsApi = {
  async getAll(): Promise<Client[]> {
    return await apiClient.get<Client[]>(API_ENDPOINTS.CLIENTS.BASE)
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
