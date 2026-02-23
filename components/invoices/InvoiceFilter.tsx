'use client'

import { FaSearch, FaFilter, FaUser } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InvoiceStatus } from '@/lib/api/types'

interface InvoiceFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: InvoiceStatus | 'ALL'
  onStatusFilterChange: (status: InvoiceStatus | 'ALL') => void
  clientFilter: string
  onClientFilterChange: (client: string) => void
}

export function InvoiceFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  clientFilter,
  onClientFilterChange,
}: InvoiceFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative flex-1 max-w-md w-full">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher par numéro de facture..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="relative flex-1 max-w-md w-full">
        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher par nom de client..."
          value={clientFilter}
          onChange={(e) => onClientFilterChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <FaFilter className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as InvoiceStatus | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value={InvoiceStatus.NON_PAYE}>Non payé</SelectItem>
            <SelectItem value={InvoiceStatus.PAYE}>Payé</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
