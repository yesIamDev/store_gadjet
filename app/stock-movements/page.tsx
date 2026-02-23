'use client'

import { useEffect, useState, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval } from 'date-fns'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useStockMovementsStore } from '@/store/stockMovementsStore'
import { useArticlesStore } from '@/store/articlesStore'
import { StockMovementForm } from '@/components/stock-movements/StockMovementForm'
import { StockMovementTable } from '@/components/stock-movements/StockMovementTable'
import { StockMovementTableSkeleton } from '@/components/stock-movements/StockMovementTableSkeleton'
import { StockMovementFilter, type DateFilterType } from '@/components/stock-movements/StockMovementFilter'
import { StockMovementDetailsDialog } from '@/components/stock-movements/StockMovementDetailsDialog'
import { DeleteConfirmDialog } from '@/components/stock-movements/DeleteConfirmDialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type {
  StockMovement,
  CreateStockMovementDto,
  UpdateStockMovementDto,
  MovementType,
} from '@/lib/api/types'

export default function StockMovementsPage() {
  const {
    movements,
    isLoading,
    error,
    fetchMovements,
    createMovement,
    updateMovement,
    deleteMovement,
    clearError,
    filterArticleId,
    setFilterArticleId,
  } = useStockMovementsStore()

  const { articles, fetchArticles } = useArticlesStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingMovement, setEditingMovement] =
    useState<StockMovement | null>(null)
  const [movementToDelete, setMovementToDelete] =
    useState<StockMovement | null>(null)
  const [viewingMovement, setViewingMovement] =
    useState<StockMovement | null>(null)
  const [filterType, setFilterType] = useState<MovementType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null)

  const filteredMovements = useMemo(() => {
    let filtered = movements

    // Filtre par recherche de nom d'article
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((m) =>
        m.items.some((item) =>
          item.article.nom.toLowerCase().includes(query)
        )
      )
    }

    // Filtre par article sélectionné
    if (filterArticleId) {
      filtered = filtered.filter((m) =>
        m.items.some((item) => item.article.id === filterArticleId),
      )
    }

    // Filtre par type
    if (filterType) {
      filtered = filtered.filter((m) => m.type === filterType)
    }

    // Filtre par date
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
          startDate = new Date(0)
          endDate = new Date()
      }

      filtered = filtered.filter((m) => {
        const movementDate = new Date(m.createdAt)
        return isWithinInterval(movementDate, {
          start: startDate,
          end: endDate,
        })
      })
    }

    return filtered
  }, [movements, filterArticleId, filterType, searchQuery, dateFilter])

  useEffect(() => {
    fetchArticles()
    fetchMovements()
  }, [fetchArticles, fetchMovements])

  const handleCreate = async (
    data: CreateStockMovementDto | UpdateStockMovementDto,
  ) => {
    try {
      await createMovement(data as CreateStockMovementDto)
      setIsFormOpen(false)
      fetchMovements(filterArticleId || undefined)
      fetchArticles()
      toast.success('Mouvement de stock créé avec succès')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création du mouvement de stock'
      )
    }
  }

  const handleUpdate = async (
    data: CreateStockMovementDto | UpdateStockMovementDto,
  ) => {
    if (editingMovement) {
      try {
        await updateMovement(editingMovement.id, data as UpdateStockMovementDto)
        setEditingMovement(null)
        setIsFormOpen(false)
        fetchMovements(filterArticleId || undefined)
        fetchArticles()
        toast.success('Mouvement de stock modifié avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la modification du mouvement de stock'
        )
      }
    }
  }

  const handleEdit = (movement: StockMovement) => {
    setEditingMovement(movement)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (movement: StockMovement) => {
    setMovementToDelete(movement)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (movementToDelete) {
      try {
        await deleteMovement(movementToDelete.id)
        setIsDeleteDialogOpen(false)
        setMovementToDelete(null)
        fetchMovements(filterArticleId || undefined)
        fetchArticles()
        toast.success('Mouvement de stock supprimé avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression du mouvement de stock'
        )
      }
    }
  }

  const handleView = (movement: StockMovement) => {
    setViewingMovement(movement)
    setIsDetailsDialogOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingMovement(null)
  }

  const handleFilterChange = (articleId: string | null) => {
    setFilterArticleId(articleId)
    fetchMovements(articleId || undefined)
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-semibold">Mouvements de Stock</h1>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <FaPlus className="mr-2 h-3.5 w-3.5" />
            Nouveau mouvement
          </Button>
        </div>

        <StockMovementFilter
          articles={articles}
          selectedArticleId={filterArticleId}
          onArticleChange={handleFilterChange}
          selectedType={filterType}
          onTypeChange={setFilterType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

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

        {isLoading && movements.length === 0 ? (
          <StockMovementTableSkeleton />
        ) : filteredMovements.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {filterArticleId || filterType || searchQuery || dateFilter
                ? 'Aucun mouvement trouvé avec ces filtres'
                : 'Aucun mouvement de stock pour le moment. Créez votre premier mouvement !'}
            </p>
          </div>
        ) : (
          <>
            {(filterArticleId || filterType || searchQuery || dateFilter) && (
              <p className="text-xs text-muted-foreground">
                {filteredMovements.length} mouvement
                {filteredMovements.length > 1 ? 's' : ''} trouvé
                {filteredMovements.length > 1 ? 's' : ''}
              </p>
            )}
            <StockMovementTable
              movements={filteredMovements}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onView={handleView}
              isLoading={isLoading}
            />
          </>
        )}

        <StockMovementForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          movement={editingMovement}
          onSubmit={editingMovement ? handleUpdate : handleCreate}
          isLoading={isLoading}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          articleName={
            movementToDelete?.items.length === 1
              ? movementToDelete.items[0].article.nom
              : undefined
          }
          isLoading={isLoading}
        />

        <StockMovementDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          movement={viewingMovement}
        />
      </div>
    </ProtectedLayout>
  )
}
