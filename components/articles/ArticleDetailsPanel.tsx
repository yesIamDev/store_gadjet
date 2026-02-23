'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  FaBox,
  FaDollarSign,
  FaFileAlt,
  FaCalendar,
  FaTimes,
  FaEdit,
  FaTrash,
} from 'react-icons/fa'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Article } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ArticleDetailsPanelProps {
  article: Article | null
  onClose: () => void
  onEdit?: (article: Article) => void
  onDelete?: (article: Article) => void
  isLoading?: boolean
}

export function ArticleDetailsPanel({
  article,
  onClose,
  onEdit,
  onDelete,
  isLoading = false,
}: ArticleDetailsPanelProps) {
  if (!article) {
    return null
  }

  const isLowStock = article.quantiteEnStock < 10
  const isOutOfStock = article.quantiteEnStock === 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="lg:w-[28rem] xl:w-[32rem] flex-shrink-0 hidden lg:flex flex-col"
      >
        <div className="sticky top-4 h-[calc(100vh-8rem)] flex flex-col bg-background border-l border-border/80 pl-8 pr-6 py-5">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/80 flex-shrink-0">
            <div className="flex-1 space-y-2 min-w-0">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground line-clamp-2">
                {article.nom}
              </h2>
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/10 text-red-600 border-red-500/20 text-xs"
                  >
                    Rupture
                  </Badge>
                ) : isLowStock ? (
                  <Badge
                    variant="outline"
                    className="border-orange-500/30 text-orange-600 bg-orange-50/50 text-xs"
                  >
                    Stock faible
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-500/30 text-green-600 bg-green-50/50 text-xs"
                  >
                    En stock
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-xl flex-shrink-0 ml-2"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col justify-between min-h-0 py-4">
            <div className="space-y-4">
              {article.description && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Description
                    </p>
                  </div>
                  <p className="text-sm leading-snug text-foreground line-clamp-3">
                    {article.description}
                  </p>
                </div>
              )}

              <div className="space-y-4 py-3 border-y border-border/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <FaBox className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Stock total
                    </p>
                  </div>
                  <p
                    className={cn(
                      'text-3xl font-semibold tracking-tight',
                      isOutOfStock && 'text-destructive',
                      isLowStock && !isOutOfStock && 'text-orange-600'
                    )}
                  >
                    {article.quantiteEnStock}
                  </p>
                  <p className="text-xs text-muted-foreground">unités disponibles</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Magasin</p>
                    <p className="text-xl font-semibold text-foreground">
                      {article.quantiteMagasin}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Dépôt</p>
                    <p className="text-xl font-semibold text-foreground">
                      {article.quantiteDepot}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <FaDollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Prix
                    </p>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    ${Number(article.prixDeVente).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">prix de vente</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaCalendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Informations
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">
                      Créé le
                    </p>
                    <p className="text-xs text-foreground">
                      {format(new Date(article.createdAt), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  {article.updatedAt !== article.createdAt && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Modifié le
                      </p>
                      <p className="text-xs text-foreground">
                        {format(new Date(article.updatedAt), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="pt-4 mt-4 border-t border-border/80 space-y-2 flex-shrink-0">
                {onEdit && (
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-xl text-sm"
                    onClick={() => onEdit(article)}
                    disabled={isLoading}
                  >
                    <FaEdit className="mr-2 h-3.5 w-3.5" />
                    Modifier
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    className="w-full h-10 rounded-xl text-sm"
                    onClick={() => onDelete(article)}
                    disabled={isLoading}
                  >
                    <FaTrash className="mr-2 h-3.5 w-3.5" />
                    Supprimer
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
