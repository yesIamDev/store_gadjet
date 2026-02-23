'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaArrowUp, FaArrowDown, FaBox, FaFileAlt, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import type { StockMovement } from '@/lib/api/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface StockMovementDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: StockMovement | null
}

export function StockMovementDetailsDialog({
  open,
  onOpenChange,
  movement,
}: StockMovementDetailsDialogProps) {
  if (!movement) return null

  const isEntree = movement.type === 'ENTREE'
  const totalQuantite = movement.items.reduce(
    (sum, item) => sum + item.quantite,
    0,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détails du mouvement de stock
            <Badge
              variant={isEntree ? 'default' : 'destructive'}
              className={cn(
                'flex items-center gap-1',
                isEntree ? 'bg-green-500' : 'bg-red-500',
              )}
            >
              {isEntree ? (
                <FaArrowUp className="h-3 w-3" />
              ) : (
                <FaArrowDown className="h-3 w-3" />
              )}
              {isEntree ? 'ENTRÉE' : 'SORTIE'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <FaBox className="h-4 w-4" />
                Nombre d'articles
              </div>
              <p className="text-2xl font-bold">{movement.items.length}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                <FaBox className="h-4 w-4" />
                Quantité totale
              </div>
              <p className="text-2xl font-bold">
                {isEntree ? '+' : '-'}
                {totalQuantite}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <FaBox className="h-4 w-4" />
              Articles
            </div>
            <div className="space-y-2">
              {movement.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-border/80 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{item.article.nom}</p>
                    {item.article.description && (
                      <p className="text-sm text-muted-foreground">
                        {item.article.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">
                        Stock après: {item.article.quantiteEnStock} unités
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        <FaMapMarkerAlt className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {item.emplacement === 'MAGASIN' ? 'Magasin' : 'Dépôt'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {isEntree ? '+' : '-'}
                      {item.quantite}
                    </p>
                    <p className="text-xs text-muted-foreground">unités</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {movement.motif && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                  <FaFileAlt className="h-4 w-4" />
                  Motif
                </div>
                <p className="text-base">{movement.motif}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FaCalendar className="h-4 w-4" />
              Date de création
            </div>
            <p className="text-sm">
              {format(new Date(movement.createdAt), 'dd MMMM yyyy, HH:mm', {
                locale: fr,
              })}
            </p>
            {movement.updatedAt !== movement.createdAt && (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-3">
                  <FaCalendar className="h-4 w-4" />
                  Dernière modification
                </div>
                <p className="text-sm">
                  {format(new Date(movement.updatedAt), 'dd MMMM yyyy, HH:mm', {
                    locale: fr,
                  })}
                </p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
