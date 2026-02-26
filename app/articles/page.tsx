'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { FaPlus, FaFileExcel, FaInfoCircle, FaPrint } from 'react-icons/fa'
import './print.css'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useArticlesStore } from '@/store/articlesStore'
import { ArticleForm } from '@/components/articles/ArticleForm'
import { ArticleTable } from '@/components/articles/ArticleTable'
import { ArticleTableSkeleton } from '@/components/articles/ArticleTableSkeleton'
import { ArticleSearch } from '@/components/articles/ArticleSearch'
import { ArticleDetailsPanel } from '@/components/articles/ArticleDetailsPanel'
import { DeleteConfirmDialog } from '@/components/articles/DeleteConfirmDialog'
import { ArticlesCatalogPrint } from '@/components/articles/ArticlesCatalogPrint'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/lib/api/types'
import { articlesApi } from '@/lib/api/articles'

export default function ArticlesPage() {
  const {
    articles,
    isLoading,
    error,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    clearError,
  } = useArticlesStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return articles
    }
    const query = searchQuery.toLowerCase().trim()
    return articles.filter((article) =>
      article.nom.toLowerCase().includes(query)
    )
  }, [articles, searchQuery])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

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
      const result = await articlesApi.importFromExcel(file)
      await fetchArticles()
      toast.success(
        `Import terminé : ${result.created} article(s) créé(s), ${result.updated} mis à jour`
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'import des articles"
      )
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

  const handleCreate = async (data: CreateArticleDto | UpdateArticleDto) => {
    try {
      await createArticle(data as CreateArticleDto)
      setIsFormOpen(false)
      toast.success('Article créé avec succès')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Erreur lors de la création de l\'article'
      )
    }
  }

  const handleUpdate = async (data: CreateArticleDto | UpdateArticleDto) => {
    if (editingArticle) {
      try {
        await updateArticle(editingArticle.id, data as UpdateArticleDto)
        setEditingArticle(null)
        setIsFormOpen(false)
        toast.success('Article modifié avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la modification de l\'article'
        )
      }
    }
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (articleToDelete) {
      try {
        await deleteArticle(articleToDelete.id)
        setIsDeleteDialogOpen(false)
        setArticleToDelete(null)
        toast.success('Article supprimé avec succès')
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erreur lors de la suppression de l\'article'
        )
      }
    }
  }

  const handleView = (article: Article) => {
    setViewingArticle(article)
  }

  const handleClosePanel = () => {
    setViewingArticle(null)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingArticle(null)
  }

  const handlePrintCatalog = () => {
    window.print()
  }

  return (
    <ProtectedLayout>
      <ArticlesCatalogPrint articles={articles} />
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <h1 className="text-2xl font-semibold">Articles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez votre inventaire d'articles
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

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrintCatalog}
                disabled={articles.length === 0}
                title="Imprimer le catalogue"
              >
                <FaPrint className="mr-2 h-3.5 w-3.5" />
                Imprimer le catalogue
              </Button>

              <Button onClick={() => setIsFormOpen(true)} size="sm">
                <FaPlus className="mr-2 h-3.5 w-3.5" />
                Ajouter un article
              </Button>
            </div>
          </div>

          <div className="max-w-md">
            <ArticleSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un article par nom..."
            />
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

          {isLoading && articles.length === 0 ? (
            <ArticleTableSkeleton />
          ) : filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `Aucun article trouvé pour "${searchQuery}"`
                  : 'Aucun article pour le moment. Créez votre premier article !'}
              </p>
            </div>
          ) : (
            <>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mb-2">
                  {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
                </p>
              )}
              <ArticleTable
                articles={filteredArticles}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleView}
                selectedArticleId={viewingArticle?.id || null}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        <ArticleDetailsPanel
          article={viewingArticle}
          onClose={handleClosePanel}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />

        <ArticleForm
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          article={editingArticle}
          onSubmit={editingArticle ? handleUpdate : handleCreate}
          isLoading={isLoading}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          articleName={articleToDelete?.nom}
          isLoading={isLoading}
        />

        <Dialog open={isFormatDialogOpen} onOpenChange={setIsFormatDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Format Excel pour l'import d'articles</DialogTitle>
              <DialogDescription>
                Le fichier Excel doit contenir les colonnes suivantes (la première ligne doit être l'en-tête)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3 text-sm">Colonnes requises :</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[140px]">nom</span>
                    <span className="text-muted-foreground">Nom de l'article (requis)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[140px]">prixDeVente</span>
                    <span className="text-muted-foreground">Prix de vente (requis, peut aussi être "prix")</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3 text-sm">Colonnes optionnelles :</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[140px]">description</span>
                    <span className="text-muted-foreground">Description de l'article</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[140px]">quantiteMagasin</span>
                    <span className="text-muted-foreground">Quantité en magasin (peut aussi être "MAGASIN")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-semibold text-primary min-w-[140px]">quantiteDepot</span>
                    <span className="text-muted-foreground">Quantité en dépôt (peut aussi être "DEPOT")</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                  ⚠️ Comportement de l'import :
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>Si un article avec le même nom existe déjà, il sera mis à jour</li>
                  <li>Sinon, un nouvel article sera créé</li>
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
