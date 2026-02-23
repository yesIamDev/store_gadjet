import { create } from 'zustand'
import { clientsApi } from '@/lib/api/clients'
import type { Client, CreateClientDto, UpdateClientDto } from '@/lib/api/types'

interface ClientsState {
  clients: Client[]
  isLoading: boolean
  error: string | null
}

interface ClientsActions {
  fetchClients: () => Promise<void>
  createClient: (data: CreateClientDto) => Promise<void>
  updateClient: (id: string, data: UpdateClientDto) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  clearError: () => void
}

type ClientsStore = ClientsState & ClientsActions

export const useClientsStore = create<ClientsStore>((set, get) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null })
    try {
      const clients = await clientsApi.getAll()
      set({ clients, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur lors du chargement des clients'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createClient: async (data: CreateClientDto) => {
    set({ isLoading: true, error: null })
    try {
      const newClient = await clientsApi.create(data)
      set((state) => ({
        clients: [newClient, ...state.clients],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du client'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateClient: async (id: string, data: UpdateClientDto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedClient = await clientsApi.update(id, data)
      set((state) => ({
        clients: state.clients.map((client) =>
          client.id === id ? updatedClient : client
        ),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification du client'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await clientsApi.delete(id)
      set((state) => ({
        clients: state.clients.filter((client) => client.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression du client'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
