'use client'

import { motion } from 'framer-motion'
import { FaUser, FaBuilding, FaPhone, FaUserTie, FaEdit, FaTrash } from 'react-icons/fa'
import type { Client } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ClientCardProps {
  client: Client
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  isLoading?: boolean
}

export function ClientCard({
  client,
  onEdit,
  onDelete,
  isLoading = false,
}: ClientCardProps) {
  const isEntreprise = client.type === 'ENTREPRISE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          'group relative rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm p-4 transition-all duration-200',
          'hover:shadow-md hover:border-border'
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {isEntreprise ? (
                <FaBuilding className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <FaUser className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              <h3 className="text-base font-semibold text-foreground truncate">
                {client.nom}
              </h3>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                isEntreprise
                  ? 'border-blue-500/30 text-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-green-500/30 text-green-600 bg-green-50/50 dark:bg-green-950/30'
              )}
            >
              {isEntreprise ? 'Entreprise' : 'Individu'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(client)}
              disabled={isLoading}
              className="h-8 w-8 rounded-lg"
            >
              <FaEdit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(client)}
              disabled={isLoading}
              className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {isEntreprise && client.nomPersonneReference && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FaUserTie className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{client.nomPersonneReference}</span>
            </div>
          )}
          {client.telephone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FaPhone className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{client.telephone}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
