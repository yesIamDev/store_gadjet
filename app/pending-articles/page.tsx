'use client'

import { useEffect, useState, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval } from 'date-fns'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { usePendingArticlesStore } from '@/store/pendingArticlesStore'
import { useArticlesStore } from '@/store/articlesStore'
import { PendingArticleForm } from '@/components/pending-articles/PendingArticleForm'
import { PendingArticleTable } from '@/components/pending-articles/PendingArticleTable'
import { PendingArticleTableSkeleton } from '@/components/pending-articles/PendingArticleTableSkeleton'
import { PendingArticleFilter, type DateFilterType } from '@/components/pending-articles/PendingArticleFilter'
import { DeleteConfirmDialog } from '@/components/pending-articles/DeleteConfirmDialog'
import { ReceivePendingArticleDialog } from '@/components/pending-articles/ReceivePendingArticleDialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type {
  PendingArticle,
  CreatePendingArticleDto,
  UpdatePendingArticleDto,
  ReceivePendingArticleFormData,
} from '@/lib/api/types'

export default function PendingArticlesPage() {
  const {
    pendingArticles,
    isLoading,
    error,
    fetchPendingArticles,
    createPendingArticle,
    updatePendingArticle,
    deletePendingArticle,
    receivePendingArticle,
    clearError,
  } = usePendingArticlesStore()

  const { articles, fetchArticles } = useArticlesStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false)
  const [editingPendingArticle, setEditingPendingArticle] = useState<PendingArticle | null>(null)
  const [pendingArticleToDelete, setPendingArticleToDelete] = useState<PendingArticle | null>(null)
  const [pendingArticleToReceive, setPendingArticleToReceive] = useState<PendingArticle | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null)

  const filteredPendingArticles = useMemo(() => {
    let filtered = pendingArticles

    // Filtre par date de réception (quand le statut est RECU)
    if (dateFilter) {
      const now = new Date()
      let startDate: Date
      let endDate: Date

      switch (dateFilter) {
        case 'TODAY':
          startDate = startOfDay(now)
          endDate = endOfDay(now)
          break
        case 'THIS_WEEK':
          startDate = startOfWeek(now, { weekStartsOn: 1 })
          endDate = endOfWeek(now, { weekStartsOn: 1 })
          break
        case 'THIS_MONTH':
          startDate = startOfMonth(now)
          endDate = endOfMonth(now)
          break
        default:
          return filtered
      }

      filtered = filtered.filter((pa) => {
        // Filtrer par date de réception si disponible, sinon ignorer
        if (!pa.dateReception) return false
        const dateReception = new Date(pa.dateReception)
        return isWithinInterval(dateReception, { start: startDate, end: endDate })
      })
    }

    return filtered
  }, [pendingArticles, dateFilter])

  useEffect(() => {
    fetchPendingArticles()
    fetchArticles()
  }, [fetchPendingArticles, fetchArticles])

  const handleCreate = async (
    data: CreatePendingArticleDto | UpdatePendingArticleDto,
  ) => {
    try {
      await createPendingArticle(data as CreatePendingArticleDto)
      setIsFormOpen(false)
      toast.success('Article en attente créé avec succès')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de l\'article en attente'
      )
    }
  }

  const handleUpdate = async (
    data: CreatePendingArticleDto | UpdatePendingArticleDto,
  ) => {
    if (editingPendingArticle) {
      try {
        await updatePendingArticle(editingPendingArticle.id, data as UpdatePendingArticleDto)
        setEditingPendingArticle(null)
        setIsFormOpen(false)
        toast.success('Article en attente modifié avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la modification de l\'article en attente'
        )
      }
    }
  }

  const handleEdit = (pendingArticle: PendingArticle) => {
    setEditingPendingArticle(pendingArticle)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (pendingArticle: PendingArticle) => {
    setPendingArticleToDelete(pendingArticle)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (pendingArticleToDelete) {
      try {
        await deletePendingArticle(pendingArticleToDelete.id)
        setIsDeleteDialogOpen(false)
        setPendingArticleToDelete(null)
        toast.success('Article en attente supprimé avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression de l\'article en attente'
        )
      }
    }
  }

  const handleReceiveClick = (pendingArticle: PendingArticle) => {
    setPendingArticleToReceive(pendingArticle)
    setIsReceiveDialogOpen(true)
  }

  const handleReceive = async (data: ReceivePendingArticleFormData) => {
    if (pendingArticleToReceive) {
      try {
        await receivePendingArticle(pendingArticleToReceive.id, data)
        setIsReceiveDialogOpen(false)
        setPendingArticleToReceive(null)
        fetchPendingArticles()
        fetchArticles()
        toast.success('Article reçu avec succès. Un mouvement d\'entrée a été créé.')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la réception de l\'article'
        )
      }
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingPendingArticle(null)
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-semibold">File d'attente des articles</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les articles que vous devez recevoir
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <FaPlus className="mr-2 h-3.5 w-3.5" />
            Ajouter un article en attente
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

        {pendingArticles.length > 0 && (
          <PendingArticleFilter
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        )}

        {isLoading && pendingArticles.length === 0 ? (
          <PendingArticleTableSkeleton />
        ) : filteredPendingArticles.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {pendingArticles.length === 0
                ? "Aucun article en attente pour le moment. Ajoutez votre premier article en attente !"
                : "Aucun article en attente ne correspond aux filtres sélectionnés."}
            </p>
          </div>
        ) : (
          <PendingArticleTable
            pendingArticles={filteredPendingArticles}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onReceive={handleReceiveClick}
            isLoading={isLoading}
          />
        )}

        <PendingArticleForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          pendingArticle={editingPendingArticle}
          articles={articles}
          onSubmit={editingPendingArticle ? handleUpdate : handleCreate}
          isLoading={isLoading}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          pendingArticle={pendingArticleToDelete}
          onConfirm={handleDeleteConfirm}
          isLoading={isLoading}
        />

        <ReceivePendingArticleDialog
          open={isReceiveDialogOpen}
          onOpenChange={(open) => {
            setIsReceiveDialogOpen(open)
            if (!open) {
              setPendingArticleToReceive(null)
            }
          }}
          pendingArticle={pendingArticleToReceive}
          onSubmit={handleReceive}
          isLoading={isLoading}
        />
      </div>
    </ProtectedLayout>
  )
}
