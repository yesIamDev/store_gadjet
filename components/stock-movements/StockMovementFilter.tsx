'use client'

import { FaFilter, FaBox, FaSearch, FaCalendar } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MovementType } from '@/lib/api/types'
import type { Article } from '@/lib/api/types'
import { cn } from '@/lib/utils'

export type DateFilterType = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'ALL' | null

interface StockMovementFilterProps {
  articles: Article[]
  selectedArticleId: string | null
  onArticleChange: (articleId: string | null) => void
  selectedType: MovementType | null
  onTypeChange: (type: MovementType | null) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  dateFilter: DateFilterType
  onDateFilterChange: (filter: DateFilterType) => void
}

export function StockMovementFilter({
  articles,
  selectedArticleId,
  onArticleChange,
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
}: StockMovementFilterProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              id="search-filter"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[160px]">
          <Select
            value={selectedArticleId || 'all'}
            onValueChange={(value) =>
              onArticleChange(value === 'all' ? null : value)
            }
          >
            <SelectTrigger id="article-filter" className="h-9 text-sm">
              <div className="flex items-center gap-2">
                <FaBox className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Tous les articles" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les articles</SelectItem>
              {articles.map((article) => (
                <SelectItem key={article.id} value={article.id}>
                  {article.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <Select
            value={selectedType || 'all'}
            onValueChange={(value) =>
              onTypeChange(value === 'all' ? null : (value as MovementType))
            }
          >
            <SelectTrigger id="type-filter" className="h-9 text-sm">
              <div className="flex items-center gap-2">
                <FaFilter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Tous les types" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="ENTREE">Entrées</SelectItem>
              <SelectItem value="SORTIE">Sorties</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FaCalendar className="h-3.5 w-3.5 text-muted-foreground" />
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
    </div>
  )
}
