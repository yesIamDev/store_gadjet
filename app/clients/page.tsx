'use client'

import { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useClientsStore } from '@/store/clientsStore'
import { ClientForm } from '@/components/clients/ClientForm'
import { ClientTable } from '@/components/clients/ClientTable'
import { ClientTableSkeleton } from '@/components/clients/ClientTableSkeleton'
import { DeleteConfirmDialog } from '@/components/clients/DeleteConfirmDialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type {
  Client,
  CreateClientDto,
  UpdateClientDto,
} from '@/lib/api/types'

export default function ClientsPage() {
  const {
    clients,
    isLoading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    clearError,
  } = useClientsStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleCreate = async (
    data: CreateClientDto | UpdateClientDto,
  ) => {
    try {
      await createClient(data as CreateClientDto)
      setIsFormOpen(false)
      fetchClients()
      toast.success('Client créé avec succès')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du client'
      )
    }
  }

  const handleUpdate = async (
    data: CreateClientDto | UpdateClientDto,
  ) => {
    if (editingClient) {
      try {
        await updateClient(editingClient.id, data as UpdateClientDto)
        setEditingClient(null)
        setIsFormOpen(false)
        fetchClients()
        toast.success('Client modifié avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la modification du client'
        )
      }
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete.id)
        setIsDeleteDialogOpen(false)
        setClientToDelete(null)
        fetchClients()
        toast.success('Client supprimé avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression du client'
        )
      }
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingClient(null)
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-semibold">Clients</h1>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <FaPlus className="mr-2 h-3.5 w-3.5" />
            Nouveau client
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-7 px-2"
            >
              Fermer
            </Button>
          </div>
        )}

        {isLoading && clients.length === 0 ? (
          <ClientTableSkeleton />
        ) : clients.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aucun client pour le moment. Créez votre premier client !
            </p>
          </div>
        ) : (
          <ClientTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        )}

        <ClientForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          client={editingClient}
          onSubmit={editingClient ? handleUpdate : handleCreate}
          isLoading={isLoading}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          clientName={clientToDelete?.nom}
          isLoading={isLoading}
        />
      </div>
    </ProtectedLayout>
  )
}
