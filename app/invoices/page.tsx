'use client'

import { useEffect, useState, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useInvoicesStore } from '@/store/invoicesStore'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { InvoiceTable } from '@/components/invoices/InvoiceTable'
import { InvoiceTableSkeleton } from '@/components/invoices/InvoiceTableSkeleton'
import { DeleteConfirmDialog } from '@/components/invoices/DeleteConfirmDialog'
import { InvoiceDetailsDialog } from '@/components/invoices/InvoiceDetailsDialog'
import { InvoiceFilter } from '@/components/invoices/InvoiceFilter'
import { InvoiceStats } from '@/components/invoices/InvoiceStats'
import { InvoiceCharts } from '@/components/invoices/InvoiceCharts'
import { Button } from '@/components/ui/button'
import { invoicesApi } from '@/lib/api/invoices'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import type {
  Invoice,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceStatus,
} from '@/lib/api/types'

export default function InvoicesPage() {
  const {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    clearError,
  } = useInvoicesStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL')
  const [clientFilter, setClientFilter] = useState<string>('')

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  // Filtrer les factures par recherche, statut et client
  const filteredInvoices = useMemo(() => {
    let filtered = invoices

    // Filtre par recherche (numéro de facture)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((invoice) =>
        invoice.numeroFacture.toLowerCase().includes(query)
      )
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    // Filtre par nom de client (recherche textuelle)
    if (clientFilter.trim()) {
      const query = clientFilter.toLowerCase().trim()
      filtered = filtered.filter((invoice) => {
        if (!invoice.client) return false
        return (
          invoice.client.nom.toLowerCase().includes(query) ||
          (invoice.client.telephone &&
            invoice.client.telephone.toLowerCase().includes(query)) ||
          (invoice.client.nomPersonneReference &&
            invoice.client.nomPersonneReference.toLowerCase().includes(query))
        )
      })
    }

    return filtered
  }, [invoices, searchQuery, statusFilter, clientFilter])

  const handleCreate = async (
    data: CreateInvoiceDto | UpdateInvoiceDto,
  ) => {
    try {
      await createInvoice(data as CreateInvoiceDto)
      setIsFormOpen(false)
      fetchInvoices()
      toast.success('Facture créée avec succès')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de la facture'
      )
    }
  }

  const handleUpdate = async (
    data: CreateInvoiceDto | UpdateInvoiceDto,
  ) => {
    if (editingInvoice) {
      try {
        await updateInvoice(editingInvoice.id, data as UpdateInvoiceDto)
        setEditingInvoice(null)
        setIsFormOpen(false)
        fetchInvoices()
        toast.success('Facture modifiée avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la modification de la facture'
        )
      }
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (invoiceToDelete) {
      try {
        await deleteInvoice(invoiceToDelete.id)
        setIsDeleteDialogOpen(false)
        setInvoiceToDelete(null)
        fetchInvoices()
        toast.success('Facture supprimée avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression de la facture'
        )
      }
    }
  }

  const handleView = (invoice: Invoice) => {
    setViewingInvoice(invoice)
    setIsDetailsDialogOpen(true)
  }

  return (
    <ProtectedLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos factures et leurs paiements
              </p>
            </div>
            <Button onClick={() => {
              setEditingInvoice(null)
              setIsFormOpen(true)
            }}>
              <FaPlus className="h-4 w-4 mr-2" />
              Nouvelle facture
            </Button>
          </div>

          {/* Onglets */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="list">Liste des factures</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6 mt-6">
              {/* Filtre */}
              <InvoiceFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                clientFilter={clientFilter}
                onClientFilterChange={setClientFilter}
              />

              {/* Erreur */}
          {error && (
            <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2"
              >
                Fermer
              </Button>
            </div>
          )}

              {/* Tableau */}
              {isLoading ? (
                <InvoiceTableSkeleton />
              ) : (
                <InvoiceTable
                  invoices={filteredInvoices}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6 mt-6">
              {/* Statistiques */}
              <InvoiceStats invoices={invoices} />

              {/* Graphiques */}
              <InvoiceCharts invoices={invoices} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Formulaire */}
        <InvoiceForm
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open)
            if (!open) {
              setEditingInvoice(null)
            }
          }}
          invoice={editingInvoice}
          onSubmit={editingInvoice ? handleUpdate : handleCreate}
          isLoading={isLoading}
        />

        {/* Dialogue de confirmation de suppression */}
        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          invoice={invoiceToDelete}
          onConfirm={handleDeleteConfirm}
          isLoading={isLoading}
        />

        {/* Dialogue de détails */}
        <InvoiceDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={(open) => {
            setIsDetailsDialogOpen(open)
            if (!open) {
              setViewingInvoice(null)
            }
          }}
          invoice={viewingInvoice}
          onInvoiceUpdate={async () => {
            await fetchInvoices()
            // Mettre à jour la facture en cours de visualisation si elle existe
            if (viewingInvoice) {
              try {
                const updatedInvoice = await invoicesApi.getById(viewingInvoice.id)
                setViewingInvoice(updatedInvoice)
              } catch (error) {
                console.error('Erreur lors de la mise à jour de la facture:', error)
              }
            }
          }}
        />
      </div>
    </ProtectedLayout>
  )
}
