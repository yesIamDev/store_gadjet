'use client'

import { FaCalendar } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type DateFilterType = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'ALL' | null

interface PendingArticleFilterProps {
  dateFilter: DateFilterType
  onDateFilterChange: (filter: DateFilterType) => void
}

export function PendingArticleFilter({
  dateFilter,
  onDateFilterChange,
}: PendingArticleFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <FaCalendar className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Filtrer par date de réception:</span>
      <div className="flex gap-1.5">
        <Button
          variant={dateFilter === 'TODAY' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onDateFilterChange(dateFilter === 'TODAY' ? null : 'TODAY')}
          className={cn(
            'h-8 rounded-lg text-xs px-3',
            dateFilter === 'TODAY' && 'bg-primary text-primary-foreground'
          )}
        >
          Aujourd'hui
        </Button>
        <Button
          variant={dateFilter === 'THIS_WEEK' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onDateFilterChange(dateFilter === 'THIS_WEEK' ? null : 'THIS_WEEK')
          }
          className={cn(
            'h-8 rounded-lg text-xs px-3',
            dateFilter === 'THIS_WEEK' && 'bg-primary text-primary-foreground'
          )}
        >
          Cette semaine
        </Button>
        <Button
          variant={dateFilter === 'THIS_MONTH' ? 'default' : 'outline'}
          size="sm"
          onClick={() =>
            onDateFilterChange(dateFilter === 'THIS_MONTH' ? null : 'THIS_MONTH')
          }
          className={cn(
            'h-8 rounded-lg text-xs px-3',
            dateFilter === 'THIS_MONTH' && 'bg-primary text-primary-foreground'
          )}
        >
          Ce mois
        </Button>
        {dateFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateFilterChange(null)}
            className="h-8 rounded-lg text-xs px-3"
          >
            Tout
          </Button>
        )}
      </div>
    </div>
  )
}
