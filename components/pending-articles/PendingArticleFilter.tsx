'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaCalendar, FaFilter, FaTimes } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { PendingArticleStatus } from '@/lib/api/types'

export type DateFilterType = Date | null

interface PendingArticleFilterProps {
  dateFilter: DateFilterType
  onDateFilterChange: (filter: DateFilterType) => void
  statusFilter: PendingArticleStatus | null
  onStatusFilterChange: (filter: PendingArticleStatus | null) => void
}

const statusLabels: Record<PendingArticleStatus, string> = {
  EN_ATTENTE: 'En attente',
  PARTIELLEMENT_RECU: 'Partiellement reçu',
  RECU: 'Reçu',
}

export function PendingArticleFilter({
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
}: PendingArticleFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <FaFilter className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Statut:</span>
        <Select
          value={statusFilter || 'all'}
          onValueChange={(value) =>
            onStatusFilterChange(value === 'all' ? null : (value as PendingArticleStatus))
          }
        >
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(PendingArticleStatus).map(([key, value]) => (
              <SelectItem key={key} value={value}>
                {statusLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <FaCalendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Date de réception:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 w-[240px] justify-start text-left font-normal',
                !dateFilter && 'text-muted-foreground'
              )}
            >
              <FaCalendar className="mr-2 h-3.5 w-3.5" />
              {dateFilter ? (
                format(dateFilter, 'PPP', { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter || undefined}
              onSelect={(date) => onDateFilterChange(date || null)}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateFilterChange(null)}
            className="h-8 w-8 p-0"
            title="Effacer la date"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
