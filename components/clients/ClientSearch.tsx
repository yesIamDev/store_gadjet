'use client'

import { FaSearch } from 'react-icons/fa'
import { Input } from '@/components/ui/input'

interface ClientSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ClientSearch({
  value,
  onChange,
  placeholder = 'Rechercher un client...',
}: ClientSearchProps) {
  return (
    <div className="relative">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9 text-sm"
      />
    </div>
  )
}
