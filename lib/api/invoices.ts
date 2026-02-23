import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type { Invoice, CreateInvoiceDto, UpdateInvoiceDto, Payment, CreatePaymentDto } from './types'

const normalizeInvoice = (invoice: Invoice): Invoice => ({
  ...invoice,
  montantTotal:
    typeof invoice.montantTotal === 'string'
      ? parseFloat(invoice.montantTotal)
      : invoice.montantTotal,
  montantPaye:
    typeof invoice.montantPaye === 'string'
      ? parseFloat(invoice.montantPaye)
      : invoice.montantPaye,
  montantRestant:
    typeof invoice.montantRestant === 'string'
      ? parseFloat(invoice.montantRestant)
      : invoice.montantRestant,
})

export const invoicesApi = {
  async getAll(): Promise<Invoice[]> {
    const invoices = await apiClient.get<Invoice[]>(API_ENDPOINTS.INVOICES.BASE)
    return invoices.map(normalizeInvoice)
  },

  async getById(id: string): Promise<Invoice> {
    const invoice = await apiClient.get<Invoice>(API_ENDPOINTS.INVOICES.BY_ID(id))
    return normalizeInvoice(invoice)
  },

  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const invoice = await apiClient.post<Invoice>(API_ENDPOINTS.INVOICES.BASE, data)
    return normalizeInvoice(invoice)
  },

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await apiClient.patch<Invoice>(
      API_ENDPOINTS.INVOICES.BY_ID(id),
      data
    )
    if (!invoice) {
      throw new Error('Aucune réponse du serveur')
    }
    return normalizeInvoice(invoice)
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.INVOICES.BY_ID(id))
  },

  async addPayment(invoiceId: string, data: CreatePaymentDto): Promise<Invoice> {
    const invoice = await apiClient.post<Invoice>(
      `${API_ENDPOINTS.INVOICES.BY_ID(invoiceId)}/payments`,
      data
    )
    return normalizeInvoice(invoice)
  },

  async removePayment(paymentId: string): Promise<void> {
    await apiClient.delete<void>(`${API_ENDPOINTS.INVOICES.BASE}/payments/${paymentId}`)
  },
}
