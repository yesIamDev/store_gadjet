'use client'

import { motion } from 'framer-motion'
import { FaEdit, FaTrash, FaBox, FaDollarSign, FaEye } from 'react-icons/fa'
import type { Article } from '@/lib/api/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ArticleCardProps {
  article: Article
  onEdit: (article: Article) => void
  onDelete: (article: Article) => void
  onView: (article: Article) => void
  isLoading?: boolean
}

export function ArticleCard({ article, onEdit, onDelete, onView, isLoading }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="line-clamp-1">{article.nom}</CardTitle>
          {article.description && (
            <CardDescription className="line-clamp-2">
              {article.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FaBox className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-semibold">{article.quantiteEnStock}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Prix:</span>
              <span className="font-semibold">
                ${Number(article.prixDeVente).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onView(article)}
              disabled={isLoading}
              className="w-full"
            >
              <FaEye className="mr-2 h-3 w-3" />
              Voir les détails
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(article)}
                disabled={isLoading}
                className="flex-1"
              >
                <FaEdit className="mr-2 h-3 w-3" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(article)}
                disabled={isLoading}
                className="flex-1"
              >
                <FaTrash className="mr-2 h-3 w-3" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
