'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaEye, FaBox } from 'react-icons/fa'
import type { StockMovement } from '@/lib/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StockMovementCardProps {
  movement: StockMovement
  onEdit?: (movement: StockMovement) => void
  onDelete?: (movement: StockMovement) => void
  onView?: (movement: StockMovement) => void
  isLoading?: boolean
}

export function StockMovementCard({
  movement,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: StockMovementCardProps) {
  const isEntree = movement.type === 'ENTREE'
  const totalQuantite = movement.items.reduce(
    (sum, item) => sum + item.quantite,
    0,
  )

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {movement.items.length} article{movement.items.length > 1 ? 's' : ''}
            </CardTitle>
            <div className="mt-1 flex items-center gap-2">
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
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <span className="sr-only">Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(movement)}>
                  <FaEye className="mr-2 h-4 w-4" />
                  Voir les détails
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(movement)}>
                  <FaEdit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(movement)}
                  className="text-destructive"
                >
                  <FaTrash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total quantité:</span>
            <span className="font-semibold">
              {isEntree ? '+' : '-'}
              {totalQuantite} unités
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Articles:</span>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {movement.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs bg-muted/50 p-1 rounded"
                >
                  <span className="flex items-center gap-1">
                    <FaBox className="h-3 w-3" />
                    {item.article.nom}
                    <span className="text-muted-foreground">
                      ({item.emplacement === 'MAGASIN' ? 'M' : 'D'})
                    </span>
                  </span>
                  <span className="font-medium">
                    {isEntree ? '+' : '-'}
                    {item.quantite}
                  </span>
                </div>
              ))}
              {movement.items.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{movement.items.length - 3} autre(s)
                </div>
              )}
            </div>
          </div>
          {movement.motif && (
            <div className="flex items-start justify-between text-sm">
              <span className="text-muted-foreground">Motif:</span>
              <span className="text-right font-medium">{movement.motif}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>
              {format(new Date(movement.createdAt), 'dd MMM yyyy, HH:mm', {
                locale: fr,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
