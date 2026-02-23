import { create } from 'zustand'
import { invoicesApi } from '@/lib/api/invoices'
import type { Invoice, CreateInvoiceDto, UpdateInvoiceDto, CreatePaymentDto } from '@/lib/api/types'

interface InvoicesState {
  invoices: Invoice[]
  isLoading: boolean
  error: string | null
}

interface InvoicesActions {
  fetchInvoices: () => Promise<void>
  createInvoice: (data: CreateInvoiceDto) => Promise<void>
  updateInvoice: (id: string, data: UpdateInvoiceDto) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>
  addPayment: (invoiceId: string, data: CreatePaymentDto) => Promise<void>
  removePayment: (paymentId: string) => Promise<void>
  clearError: () => void
}

type InvoicesStore = InvoicesState & InvoicesActions

export const useInvoicesStore = create<InvoicesStore>((set, get) => ({
  invoices: [],
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null })
    try {
      const invoices = await invoicesApi.getAll()
      set({ invoices, isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors du chargement des factures'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createInvoice: async (data: CreateInvoiceDto) => {
    set({ isLoading: true, error: null })
    try {
      const newInvoice = await invoicesApi.create(data)
      set((state) => ({
        invoices: [newInvoice, ...state.invoices],
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de la facture'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  updateInvoice: async (id: string, data: UpdateInvoiceDto) => {
    set({ isLoading: true, error: null })
    try {
      const updatedInvoice = await invoicesApi.update(id, data)
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.id === id ? updatedInvoice : invoice
        ),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la modification de la facture'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  deleteInvoice: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await invoicesApi.delete(id)
      set((state) => ({
        invoices: state.invoices.filter((invoice) => invoice.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression de la facture'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  addPayment: async (invoiceId: string, data: CreatePaymentDto) => {
    set({ isLoading: true, error: null })
    try {
      // Le backend retourne maintenant la facture complète mise à jour
      const updatedInvoice = await invoicesApi.addPayment(invoiceId, data)
      // Mettre à jour la facture dans la liste
      set((state) => ({
        invoices: state.invoices.map((invoice) =>
          invoice.id === invoiceId ? updatedInvoice : invoice
        ),
        isLoading: false,
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de l\'ajout du paiement'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  removePayment: async (paymentId: string) => {
    set({ isLoading: true, error: null })
    try {
      await invoicesApi.removePayment(paymentId)
      await get().fetchInvoices()
      set({ isLoading: false })
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la suppression du paiement'
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
