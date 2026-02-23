'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaEye,
  FaBox,
  FaMapMarkerAlt,
  FaEllipsisV,
  FaCopy,
  FaCheck,
} from 'react-icons/fa'
import type { StockMovement } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StockMovementTableProps {
  movements: StockMovement[]
  onEdit?: (movement: StockMovement) => void
  onDelete?: (movement: StockMovement) => void
  onView?: (movement: StockMovement) => void
  isLoading?: boolean
}

export function StockMovementTable({
  movements,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: StockMovementTableProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Aucun mouvement de stock pour le moment
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
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Articles
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Quantité totale
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Motif
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {movements.map((movement, index) => (
              <MovementRow
                key={movement.id}
                movement={movement}
                index={index}
                isEntree={movement.type === 'ENTREE'}
                totalQuantite={movement.items.reduce(
                  (sum, item) => sum + item.quantite,
                  0,
                )}
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

function MovementRow({
  movement,
  index,
  isEntree,
  totalQuantite,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: {
  movement: StockMovement
  index: number
  isEntree: boolean
  totalQuantite: number
  isLoading: boolean
  onEdit?: (movement: StockMovement) => void
  onDelete?: (movement: StockMovement) => void
  onView?: (movement: StockMovement) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(movement.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
    }
  }

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={cn(
        'group hover:bg-muted/20 transition-colors duration-200 border-b border-border/80',
        isLoading && 'opacity-50'
      )}
    >
      <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono font-semibold text-foreground bg-muted/50 px-2 py-1 rounded">
            {movement.code}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            title="Copier le code"
          >
            {copied ? (
              <FaCheck className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <FaCopy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <div className="text-sm text-foreground">
                      {format(new Date(movement.createdAt), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(movement.createdAt), 'HH:mm', {
                        locale: fr,
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <Badge
                      variant={isEntree ? 'default' : 'destructive'}
                      className={cn(
                        'flex items-center gap-1.5 w-fit',
                        isEntree
                          ? 'bg-green-500/10 text-green-600 border-green-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      )}
                    >
                      {isEntree ? (
                        <FaArrowUp className="h-3 w-3" />
                      ) : (
                        <FaArrowDown className="h-3 w-3" />
                      )}
                      {isEntree ? 'ENTRÉE' : 'SORTIE'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    <div className="space-y-1.5 max-w-md">
                      {movement.items.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <FaBox className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-foreground truncate">
                            {item.article.nom}
                          </span>
                          <span className="text-muted-foreground">
                            ({isEntree ? '+' : '-'}
                            {item.quantite})
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FaMapMarkerAlt className="h-2.5 w-2.5" />
                            <span>
                              {item.emplacement === 'MAGASIN' ? 'M' : 'D'}
                            </span>
                          </div>
                        </div>
                      ))}
                      {movement.items.length > 2 && (
                        <div className="text-xs text-muted-foreground pl-5">
                          +{movement.items.length - 2} autre(s)
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <div
                      className={cn(
                        'text-base font-semibold',
                        isEntree ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {isEntree ? '+' : '-'}
                      {totalQuantite}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {movement.items.length} article
                      {movement.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    {movement.motif ? (
                      <div className="text-sm text-foreground max-w-xs truncate">
                        {movement.motif}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isLoading}
                        >
                          <FaEllipsisV className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
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
                            className="text-destructive focus:text-destructive"
                          >
                            <FaTrash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
  )
}
