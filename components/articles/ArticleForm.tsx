'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaTag, FaFileAlt, FaBox, FaDollarSign } from 'react-icons/fa'
import {
  createArticleSchema,
  updateArticleSchema,
  type CreateArticleFormData,
  type UpdateArticleFormData,
} from '@/lib/validations/articles'
import type { Article } from '@/lib/api/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ArticleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article?: Article | null
  onSubmit: (data: CreateArticleFormData | UpdateArticleFormData) => Promise<void>
  isLoading?: boolean
}

export function ArticleForm({
  open,
  onOpenChange,
  article,
  onSubmit,
  isLoading = false,
}: ArticleFormProps) {
  const isEdit = !!article
  const schema = isEdit ? updateArticleSchema : createArticleSchema

  const form = useForm<CreateArticleFormData | UpdateArticleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: '',
      description: '',
      quantiteMagasin: 0,
      quantiteDepot: 0,
      prixDeVente: 0,
    },
  })

  useEffect(() => {
    if (article) {
      form.reset({
        nom: article.nom,
        description: article.description || '',
        quantiteMagasin: article.quantiteMagasin,
        quantiteDepot: article.quantiteDepot,
        prixDeVente: Number(article.prixDeVente),
      })
    } else {
      form.reset({
        nom: '',
        description: '',
        quantiteMagasin: 0,
        quantiteDepot: 0,
        prixDeVente: 0,
      })
    }
  }, [article, form, open])

  const handleSubmit = async (data: CreateArticleFormData | UpdateArticleFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // L'erreur est gérée par le store
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier l\'article' : 'Ajouter un article'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FaTag className="h-4 w-4 text-muted-foreground" />
                    <FormLabel>
                      Nom <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input placeholder="Nom de l'article" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="h-4 w-4 text-muted-foreground" />
                    <FormLabel>Description (Optionnel)</FormLabel>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Description de l'article (optionnel)"
                        className="min-h-[100px] pr-16 resize-none"
                        maxLength={1000}
                        {...field}
                        disabled={isLoading}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {field.value?.length || 0}/1000
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantiteMagasin"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FaBox className="h-4 w-4 text-muted-foreground" />
                      <FormLabel>Quantité au magasin</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantiteDepot"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FaBox className="h-4 w-4 text-muted-foreground" />
                      <FormLabel>Quantité au dépôt</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prixDeVente"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                    <FormLabel>Prix de vente</FormLabel>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
