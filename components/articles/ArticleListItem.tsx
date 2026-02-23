'use client'

import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaBox, FaDollarSign, FaEye, FaChevronRight } from 'react-icons/fa'
import type { Article } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ArticleListItemProps {
  article: Article
  isSelected?: boolean
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  onView: (article: Article) => void
  isLoading?: boolean
}

export function ArticleListItem({
  article,
  isSelected = false,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ArticleListItemProps) {
  const isLowStock = article.quantiteEnStock < 10
  const isOutOfStock = article.quantiteEnStock === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          'group relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer',
          'hover:bg-muted/50',
          isSelected && 'bg-primary/5 border border-primary/20'
        )}
        onClick={() => onView(article)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate mb-1">
                {article.nom}
              </h3>
              {article.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {article.description}
                </p>
              )}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <FaBox className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Stock:</span>
                  <span
                    className={cn(
                      'font-semibold',
                      isOutOfStock && 'text-destructive',
                      isLowStock && !isOutOfStock && 'text-orange-600'
                    )}
                  >
                    {article.quantiteEnStock}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({article.quantiteMagasin}M / {article.quantiteDepot}D)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Prix:</span>
                  <span className="font-semibold text-foreground">
                    ${Number(article.prixDeVente).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <FaChevronRight
              className={cn(
                'h-4 w-4 text-muted-foreground/50 transition-all duration-200 flex-shrink-0',
                'group-hover:text-foreground group-hover:translate-x-1'
              )}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(article)}
            disabled={isLoading}
            className="h-8 w-8 rounded-lg"
          >
            <FaEdit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(article)}
            disabled={isLoading}
            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <FaTrash className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
