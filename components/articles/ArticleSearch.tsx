'use client'

import { FaSearch } from 'react-icons/fa'
import { Input } from '@/components/ui/input'

interface ArticleSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ArticleSearch({ value, onChange, placeholder = 'Rechercher par nom...' }: ArticleSearchProps) {
  return (
    <div className="relative">
      <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
