'use client'

import { FaBox, FaDollarSign, FaTag, FaFileAlt } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Article } from '@/lib/api/types'
import { format } from 'date-fns'

interface ArticleDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Article | null
}

export function ArticleDetailsDialog({
  open,
  onOpenChange,
  article,
}: ArticleDetailsDialogProps) {
  if (!article) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{article.nom}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaTag className="mt-1 h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Nom</p>
                <p className="text-base">{article.nom}</p>
              </div>
            </div>

            {article.description && (
              <div className="flex items-start gap-3">
                <FaFileAlt className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-base whitespace-pre-wrap">
                    {article.description}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <FaBox className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Quantité en stock
                  </p>
                  <p className="text-lg font-semibold">
                    {article.quantiteEnStock}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaDollarSign className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Prix de vente
                  </p>
                  <p className="text-lg font-semibold">
                    ${Number(article.prixDeVente).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date de création
                </p>
                <p className="text-sm">
                  {format(new Date(article.createdAt), 'dd/MM/yyyy à HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </p>
                <p className="text-sm">
                  {format(new Date(article.updatedAt), 'dd/MM/yyyy à HH:mm')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
