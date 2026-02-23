'use client'

import { useState, useRef, useEffect } from 'react'
import { FaBox, FaSearch, FaCheck } from 'react-icons/fa'
import type { Article } from '@/lib/api/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ArticleSearchSelectProps {
  articles: Article[]
  value: string | undefined
  onChange: (articleId: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ArticleSearchSelect({
  articles,
  value,
  onChange,
  disabled = false,
  placeholder = 'Rechercher un article...',
}: ArticleSearchSelectProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedArticle = value ? articles.find((a) => a.id === value) : undefined

  const filteredArticles = articles.filter((article) =>
    article.nom.toLowerCase().includes(searchQuery.toLowerCase().trim()),
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery('')
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (articleId: string) => {
    onChange(articleId)
    setIsOpen(false)
    setSearchQuery('')
    setFocusedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((prev) =>
        prev < filteredArticles.length - 1 ? prev + 1 : prev,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault()
      handleSelect(filteredArticles[focusedIndex].id)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
      setFocusedIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <Button
        type="button"
        variant="outline"
        className={cn(
          'w-full justify-start text-left font-normal',
          !selectedArticle && 'text-muted-foreground',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <FaBox className="mr-2 h-4 w-4 shrink-0" />
        {selectedArticle ? (
          <span className="truncate">
            {selectedArticle.nom} (Stock: {selectedArticle.quantiteEnStock})
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2">
            <div className="relative">
              <FaSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setFocusedIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                className="pl-8"
              />
            </div>
          </div>
          <div className="max-h-[200px] overflow-auto p-1">
            {filteredArticles.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                Aucun article trouvé
              </div>
            ) : (
              filteredArticles.map((article, index) => (
                <button
                  key={article.id}
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    focusedIndex === index && 'bg-accent text-accent-foreground',
                    value === article.id && 'bg-accent',
                  )}
                  onClick={() => handleSelect(article.id)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <FaBox className="mr-2 h-4 w-4 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{article.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      Stock: {article.quantiteEnStock} unités
                    </div>
                  </div>
                  {value === article.id && (
                    <FaCheck className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
