'use client'

import { motion } from 'framer-motion'
import { FaUser, FaBuilding, FaPhone, FaUserTie, FaEdit, FaTrash, FaChevronRight } from 'react-icons/fa'
import type { Client } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ClientListItemProps {
  client: Client
  isSelected?: boolean
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  onView: (client: Client) => void
  isLoading?: boolean
}

export function ClientListItem({
  client,
  isSelected = false,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
}: ClientListItemProps) {
  const isEntreprise = client.type === 'ENTREPRISE'

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
        onClick={() => onView(client)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-foreground truncate">
                  {client.nom}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    isEntreprise
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                  )}
                >
                  {isEntreprise ? (
                    <>
                      <FaBuilding className="h-2.5 w-2.5 mr-1" />
                      Entreprise
                    </>
                  ) : (
                    <>
                      <FaUser className="h-2.5 w-2.5 mr-1" />
                      Individu
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {isEntreprise && client.nomPersonneReference && (
                  <div className="flex items-center gap-1.5">
                    <FaUserTie className="h-3 w-3" />
                    <span className="truncate max-w-[200px]">{client.nomPersonneReference}</span>
                  </div>
                )}
                {client.telephone && (
                  <div className="flex items-center gap-1.5">
                    <FaPhone className="h-3 w-3" />
                    <span>{client.telephone}</span>
                  </div>
                )}
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
    </motion.div>
  )
}
