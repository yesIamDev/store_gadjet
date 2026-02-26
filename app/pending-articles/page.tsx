'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { FaPlus, FaFileExcel, FaInfoCircle } from 'react-icons/fa'
import { startOfDay, endOfDay, isSameDay } from 'date-fns'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { usePendingArticlesStore } from '@/store/pendingArticlesStore'
import { useArticlesStore } from '@/store/articlesStore'
import { PendingArticleForm } from '@/components/pending-articles/PendingArticleForm'
import { PendingArticleTable } from '@/components/pending-articles/PendingArticleTable'
import { PendingArticleTableSkeleton } from '@/components/pending-articles/PendingArticleTableSkeleton'
import { PendingArticleFilter, type DateFilterType } from '@/components/pending-articles/PendingArticleFilter'
import { DeleteConfirmDialog } from '@/components/pending-articles/DeleteConfirmDialog'
import { ReceivePendingArticleDialog } from '@/components/pending-articles/ReceivePendingArticleDialog'
import { ArticleSearch } from '@/components/articles/ArticleSearch'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type {
  PendingArticle,
  CreatePendingArticleDto,
  UpdatePendingArticleDto,
  ReceivePendingArticleDto,
  LocationType,
  PendingArticleStatus,
} from '@/lib/api/types'
import type { ReceivePendingArticleFormData } from '@/lib/validations/pending-articles'
import { pendingArticlesApi } from '@/lib/api/pending-articles'

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
  const [statusFilter, setStatusFilter] = useState<PendingArticleStatus | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredPendingArticles = useMemo(() => {
    let filtered = pendingArticles

    // Filtre par nom d'article
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((pa) =>
        pa.article.nom.toLowerCase().includes(query)
      )
    }

    // Filtre par statut
    if (statusFilter) {
      filtered = filtered.filter((pa) => pa.status === statusFilter)
    }

    // Filtre par date de réception (quand le statut est RECU)
    if (dateFilter) {
      filtered = filtered.filter((pa) => {
        // Filtrer par date de réception si disponible, sinon ignorer
        if (!pa.dateReception) return false
        const dateReception = new Date(pa.dateReception)
        // Comparer uniquement le jour (sans l'heure)
        return isSameDay(dateReception, dateFilter)
      })
    }

    return filtered
  }, [pendingArticles, searchQuery, statusFilter, dateFilter])

  useEffect(() => {
    fetchPendingArticles()
    fetchArticles()
  }, [fetchPendingArticles, fetchArticles])

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] as File | undefined
    if (!file) return

    const lowerName = file.name.toLowerCase()
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      toast.error('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)')
      event.target.value = ''
      return
    }

    setIsImporting(true)
    try {
      const result = await pendingArticlesApi.importFromExcel(file)
      await fetchPendingArticles()
      toast.success(
        `Import terminé : ${result.created} ligne(s) créée(s), ${result.updated} mise(s) à jour`
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'import de la file d'attente"
      )
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

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
        // Convertir le type du formulaire vers le DTO
        const dto: ReceivePendingArticleDto = {
          quantiteRecue: data.quantiteRecue,
          emplacement: data.emplacement as LocationType,
          motif: data.motif || undefined,
        }
        await receivePendingArticle(pendingArticleToReceive.id, dto)
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
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportChange}
              disabled={isImporting}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isImporting}
              onClick={handleImportClick}
            >
              <FaFileExcel className="mr-2 h-3.5 w-3.5 text-emerald-600" />
              {isImporting ? 'Import en cours...' : 'Importer Excel'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsFormatDialogOpen(true)}
              className="h-8 w-8 p-0"
              title="Voir le format Excel attendu"
            >
              <FaInfoCircle className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Ajouter un article en attente
            </Button>
          </div>
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
          <div className="space-y-4">
            <div className="max-w-md">
              <ArticleSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Rechercher par nom d'article..."
              />
            </div>
            <PendingArticleFilter
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>
        )}

        {isLoading && pendingArticles.length === 0 ? (
          <PendingArticleTableSkeleton />
        ) : filteredPendingArticles.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {pendingArticles.length === 0
                ? "Aucun article en attente pour le moment. Ajoutez votre premier article en attente !"
                : searchQuery || statusFilter || dateFilter
                ? "Aucun article en attente ne correspond aux filtres sélectionnés."
                : "Aucun article en attente pour le moment."}
            </p>
          </div>
        ) : (
          <>
            {(searchQuery || statusFilter || dateFilter) && (
              <p className="text-xs text-muted-foreground mb-2">
                {filteredPendingArticles.length} article{filteredPendingArticles.length > 1 ? 's' : ''} en attente trouvé{filteredPendingArticles.length > 1 ? 's' : ''}
              </p>
            )}
            <PendingArticleTable
              pendingArticles={filteredPendingArticles}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onReceive={handleReceiveClick}
              isLoading={isLoading}
            />
          </>
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

        <Dialog open={isFormatDialogOpen} onOpenChange={setIsFormatDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Format Excel pour l'import de la file d'attente</DialogTitle>
              <DialogDescription>
                Le fichier Excel doit contenir les colonnes suivantes (la première ligne doit être l'en-tête)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3 text-sm">Colonnes requises :</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[160px]">article</span>
                    <span className="text-muted-foreground">Nom de l'article (doit exister dans la base de données)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[160px]">quantiteAttendue</span>
                    <span className="text-muted-foreground">Quantité attendue (requis, peut aussi être "quantite")</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3 text-sm">Colonnes optionnelles :</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[160px]">dateAttendue</span>
                    <span className="text-muted-foreground">Date attendue de réception (peut aussi être "date")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[160px]">note</span>
                    <span className="text-muted-foreground">Note ou commentaire</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                  ⚠️ Comportement de l'import :
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>Si une file d'attente EN_ATTENTE existe déjà pour cet article, la quantité sera augmentée</li>
                  <li>Sinon, une nouvelle entrée en attente sera créée</li>
                  <li>Les articles qui n'existent pas dans la base seront ignorés</li>
                  <li>Les colonnes sont insensibles à la casse</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedLayout>
  )
}
