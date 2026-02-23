'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaUserTie,
  FaEdit,
  FaTrash,
  FaEllipsisV,
} from 'react-icons/fa'
import type { Client } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  isLoading?: boolean
}

export function ClientTable({
  clients,
  onEdit,
  onDelete,
  isLoading = false,
}: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Aucun client pour le moment
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
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Personne de référence
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Téléphone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date de création
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {clients.map((client, index) => {
              const isEntreprise = client.type === 'ENTREPRISE'

              return (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={cn(
                    'group hover:bg-muted/20 transition-colors duration-200 border-b border-border/80',
                    isLoading && 'opacity-50'
                  )}
                >
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1.5 w-fit',
                        isEntreprise
                          ? 'border-blue-500/30 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                          : 'border-green-500/30 text-green-600 bg-green-50/50 dark:bg-green-950/30'
                      )}
                    >
                      {isEntreprise ? (
                        <FaBuilding className="h-3 w-3" />
                      ) : (
                        <FaUser className="h-3 w-3" />
                      )}
                      {isEntreprise ? 'Entreprise' : 'Individu'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    <div className="flex items-center gap-2">
                      {isEntreprise ? (
                        <FaBuilding className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <FaUser className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                      <span className="font-medium text-foreground">
                        {client.nom}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    {isEntreprise && client.nomPersonneReference ? (
                      <div className="flex items-center gap-2 text-sm">
                        <FaUserTie className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">
                          {client.nomPersonneReference}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    {client.telephone ? (
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{client.telephone}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <div className="text-sm text-foreground">
                      {format(new Date(client.createdAt), 'dd MMM yyyy', {
                        locale: fr,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(client.createdAt), 'HH:mm', {
                        locale: fr,
                      })}
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
                        >
                          <FaEllipsisV className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(client)}>
                          <FaEdit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(client)}
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
