'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaBox,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaEllipsisV,
} from 'react-icons/fa'
import type { PendingArticle, PendingArticleStatus } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PendingArticleTableProps {
  pendingArticles: PendingArticle[]
  onEdit: (pendingArticle: PendingArticle) => void
  onDelete: (pendingArticle: PendingArticle) => void
  onReceive: (pendingArticle: PendingArticle) => void
  isLoading?: boolean
}

const getStatusBadge = (status: PendingArticleStatus) => {
  switch (status) {
    case 'EN_ATTENTE':
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/30 text-yellow-600 bg-yellow-50/50 dark:bg-yellow-950/30"
        >
          <FaClock className="h-3 w-3 mr-1" />
          En attente
        </Badge>
      )
    case 'PARTIELLEMENT_RECU':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
        >
          <FaTruck className="h-3 w-3 mr-1" />
          Partiellement reçu
        </Badge>
      )
    case 'RECU':
      return (
        <Badge
          variant="outline"
          className="border-green-500/30 text-green-600 bg-green-50/50 dark:bg-green-950/30"
        >
          <FaCheckCircle className="h-3 w-3 mr-1" />
          Reçu
        </Badge>
      )
  }
}

export function PendingArticleTable({
  pendingArticles,
  onEdit,
  onDelete,
  onReceive,
  isLoading = false,
}: PendingArticleTableProps) {
  if (pendingArticles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Aucun article en attente pour le moment
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
                Article
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Quantité attendue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Quantité reçue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Restant
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date attendue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date de réception
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {pendingArticles.map((pendingArticle) => {
              const quantiteRestante =
                pendingArticle.quantiteAttendue - pendingArticle.quantiteRecue
              const canReceive = quantiteRestante > 0

              return (
                <tr
                  key={pendingArticle.id}
                  className="hover:bg-muted/20 transition-colors duration-200"
                >
                  <td className="px-4 py-3 border-r border-border/80">
                    <div className="flex items-center gap-2">
                      <FaBox className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {pendingArticle.article.nom}
                        </span>
                        {pendingArticle.article.description && (
                          <span className="text-xs text-muted-foreground truncate">
                            {pendingArticle.article.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <span className="text-sm font-semibold">
                      {pendingArticle.quantiteAttendue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {pendingArticle.quantiteRecue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        quantiteRestante > 0
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-green-600 dark:text-green-400'
                      )}
                    >
                      {quantiteRestante}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    {pendingArticle.dateAttendue ? (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(pendingArticle.dateAttendue), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    {pendingArticle.dateReception ? (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {format(new Date(pendingArticle.dateReception), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    {getStatusBadge(pendingArticle.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <span className="sr-only">Ouvrir le menu</span>
                          <FaEllipsisV className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canReceive && (
                          <DropdownMenuItem
                            onClick={() => onReceive(pendingArticle)}
                            className="cursor-pointer"
                          >
                            <FaTruck className="mr-2 h-4 w-4" />
                            Recevoir
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onEdit(pendingArticle)}
                          className="cursor-pointer"
                        >
                          <FaEdit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(pendingArticle)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <FaTrash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
