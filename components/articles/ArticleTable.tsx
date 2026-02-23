'use client'

import { motion } from 'framer-motion'
import {
  FaBox,
  FaDollarSign,
  FaEdit,
  FaTrash,
  FaEye,
  FaEllipsisV,
  FaWarehouse,
  FaStore,
} from 'react-icons/fa'
import type { Article } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ArticleTableProps {
  articles: Article[]
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  onView?: (article: Article) => void
  selectedArticleId?: string | null
  isLoading?: boolean
}

export function ArticleTable({
  articles,
  onEdit,
  onDelete,
  onView,
  selectedArticleId,
  isLoading = false,
}: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Aucun article pour le moment
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/80 bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Emplacement
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Prix
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {articles.map((article, index) => (
              <ArticleRow
                key={article.id}
                article={article}
                index={index}
                isSelected={selectedArticleId === article.id}
                isLoading={isLoading}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ArticleRow({
  article,
  index,
  isSelected,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: {
  article: Article
  index: number
  isSelected: boolean
  isLoading: boolean
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  onView?: (article: Article) => void
}) {
  const isLowStock = article.quantiteEnStock < 10
  const isOutOfStock = article.quantiteEnStock === 0

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        'group hover:bg-muted/20 transition-colors duration-200 border-b border-border/80 cursor-pointer',
        isSelected && 'bg-primary/5',
        isLoading && 'opacity-50'
      )}
      onClick={() => onView?.(article)}
    >
      <td className="px-4 py-3 border-r border-border/80">
        <div className="flex items-center gap-2">
          <FaBox className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <span className="text-sm font-semibold text-foreground">
            {article.nom}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 border-r border-border/80">
        {article.description ? (
          <span className="text-sm text-muted-foreground line-clamp-1">
            {article.description}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 border-r border-border/80">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-semibold',
              isOutOfStock && 'text-destructive',
              isLowStock && !isOutOfStock && 'text-orange-600',
              !isLowStock && !isOutOfStock && 'text-foreground'
            )}
          >
            {article.quantiteEnStock}
          </span>
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">
              Épuisé
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-600">
              Faible
            </Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-border/80">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <FaStore className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">M:</span>
            <span className="font-medium text-foreground">{article.quantiteMagasin}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaWarehouse className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">D:</span>
            <span className="font-medium text-foreground">{article.quantiteDepot}</span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 border-r border-border/80">
        <div className="flex items-center gap-2">
          <FaDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            ${Number(article.prixDeVente).toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
            >
              <FaEllipsisV className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onView(article)
              }}>
                <FaEye className="mr-2 h-4 w-4" />
                Voir les détails
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onEdit(article)
              }}
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete(article)
              }}
              className="text-destructive focus:text-destructive"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  )
}
