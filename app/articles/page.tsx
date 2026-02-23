'use client'

import { useEffect, useState, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useArticlesStore } from '@/store/articlesStore'
import { ArticleForm } from '@/components/articles/ArticleForm'
import { ArticleTable } from '@/components/articles/ArticleTable'
import { ArticleTableSkeleton } from '@/components/articles/ArticleTableSkeleton'
import { ArticleSearch } from '@/components/articles/ArticleSearch'
import { ArticleDetailsPanel } from '@/components/articles/ArticleDetailsPanel'
import { DeleteConfirmDialog } from '@/components/articles/DeleteConfirmDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/lib/api/types'

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

  return (
    <ProtectedLayout>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/50">
            <div>
              <h1 className="text-2xl font-semibold">Articles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez votre inventaire d'articles
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)} size="sm">
              <FaPlus className="mr-2 h-3.5 w-3.5" />
              Ajouter un article
            </Button>
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
      </div>
    </ProtectedLayout>
  )
}
