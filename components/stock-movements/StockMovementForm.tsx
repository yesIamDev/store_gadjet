'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaBox, FaArrowDown, FaArrowUp, FaFileAlt, FaPlus, FaTrash, FaMapMarkerAlt } from 'react-icons/fa'
import {
  createStockMovementSchema,
  updateStockMovementSchema,
  type CreateStockMovementFormData,
  type UpdateStockMovementFormData,
} from '@/lib/validations/stock-movements'
import type { StockMovement, MovementType, LocationType } from '@/lib/api/types'
import { useArticlesStore } from '@/store/articlesStore'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArticleSearchSelect } from './ArticleSearchSelect'

interface StockMovementFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement?: StockMovement | null
  onSubmit: (
    data: CreateStockMovementFormData | UpdateStockMovementFormData,
  ) => Promise<void>
  isLoading?: boolean
}

export function StockMovementForm({
  open,
  onOpenChange,
  movement,
  onSubmit,
  isLoading = false,
}: StockMovementFormProps) {
  const isEdit = !!movement
  const schema = isEdit ? updateStockMovementSchema : createStockMovementSchema
  const { articles, fetchArticles } = useArticlesStore()

  useEffect(() => {
    if (articles.length === 0) {
      fetchArticles()
    }
  }, [articles.length, fetchArticles])

  const form = useForm<CreateStockMovementFormData | UpdateStockMovementFormData>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        type: 'ENTREE' as MovementType,
        items: [{ articleId: '', quantite: 1, emplacement: 'MAGASIN' as LocationType }],
        motif: '',
      },
    },
  )

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  useEffect(() => {
    if (movement && movement.items.length > 0) {
      form.reset({
        type: movement.type,
        items: movement.items.map((item) => ({
          articleId: item.article.id,
          quantite: item.quantite,
          emplacement: item.emplacement,
        })),
        motif: movement.motif || '',
      })
    } else {
      form.reset({
        type: 'ENTREE' as MovementType,
        items: [{ articleId: '', quantite: 1, emplacement: 'MAGASIN' as LocationType }],
        motif: '',
      })
    }
  }, [movement, form, open])

  const handleSubmit = async (
    data: CreateStockMovementFormData | UpdateStockMovementFormData,
  ) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // L'erreur est gérée par le store
    }
  }

  const selectedType = form.watch('type')

  const getAvailableArticles = (currentIndex: number) => {
    const items = form.watch('items') || []
    const selectedArticleIds = items
      .map((item, index) => (index !== currentIndex ? item.articleId : null))
      .filter((id): id is string => !!id)

    return articles.filter((article) => !selectedArticleIds.includes(article.id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Modifier le mouvement d'stock"
              : "Créer un mouvement d'stock"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    {selectedType === 'ENTREE' ? (
                      <FaArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <FaArrowDown className="h-4 w-4 text-red-500" />
                    )}
                    <FormLabel>
                      Type de mouvement <span className="text-destructive">*</span>
                    </FormLabel>
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ENTREE">
                        <div className="flex items-center gap-2">
                          <FaArrowUp className="h-3 w-3 text-green-500" />
                          <span>Entrée (Approvisionnement)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="SORTIE">
                        <div className="flex items-center gap-2">
                          <FaArrowDown className="h-3 w-3 text-red-500" />
                          <span>Sortie (Vente, Casse, etc.)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedType === 'ENTREE'
                      ? 'Augmente le stock des articles'
                      : 'Diminue le stock des articles'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>
                  Articles <span className="text-destructive">*</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ articleId: '', quantite: 1, emplacement: 'MAGASIN' as LocationType })}
                  disabled={isLoading}
                >
                  <FaPlus className="mr-2 h-3 w-3" />
                  Ajouter un article
                </Button>
              </div>

              {fields.map((field, index) => {
                const selectedArticleId = form.watch(`items.${index}.articleId`)
                const selectedArticle = articles.find(
                  (a) => a.id === selectedArticleId,
                )

                return (
                  <div
                    key={field.id}
                    className="flex gap-3 items-start p-4 border border-border/80 rounded-lg"
                  >
                    <div className="flex-1 space-y-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.articleId`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FaBox className="h-4 w-4 text-muted-foreground" />
                              <FormLabel>
                                Article <span className="text-destructive">*</span>
                              </FormLabel>
                            </div>
                            <FormControl>
                              <ArticleSearchSelect
                                articles={getAvailableArticles(index)}
                                value={field.value}
                                onChange={field.onChange}
                                disabled={isLoading || isEdit}
                                placeholder="Rechercher un article..."
                              />
                            </FormControl>
                            {selectedArticle && (
                              <FormDescription>
                                Stock actuel: {selectedArticle.quantiteEnStock} unités
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantite`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Quantité <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  step="1"
                                  placeholder="1"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value) || 1)
                                  }
                                  disabled={isLoading}
                                />
                              </FormControl>
                              {selectedArticle && selectedType === 'SORTIE' && (
                                <FormDescription className="text-orange-500 text-xs">
                                  Stock: {selectedArticle.quantiteEnStock}
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.emplacement`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
                                <FormLabel>
                                  Emplacement <span className="text-destructive">*</span>
                                </FormLabel>
                              </div>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MAGASIN">Magasin</SelectItem>
                                  <SelectItem value="DEPOT">Dépôt</SelectItem>
                                </SelectContent>
                              </Select>
                              {selectedArticle && selectedType === 'SORTIE' && (
                                <FormDescription className="text-orange-500 text-xs">
                                  {field.value === 'MAGASIN'
                                    ? `Magasin: ${selectedArticle.quantiteMagasin}`
                                    : `Dépôt: ${selectedArticle.quantiteDepot}`}
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {fields.length > 1 && !isEdit && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                        className="mt-8"
                      >
                        <FaTrash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>

            <FormField
              control={form.control}
              name="motif"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FaFileAlt className="h-4 w-4 text-muted-foreground" />
                    <FormLabel>Motif (Optionnel)</FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Vente, Casse, Retour client, etc."
                      className="min-h-[80px] resize-none"
                      maxLength={255}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    {selectedType === 'SORTIE'
                      ? 'Raison de la sortie (vente, casse, etc.)'
                      : "Raison de l'entrée (approvisionnement, retour, etc.)"}
                  </FormDescription>
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
                {isLoading
                  ? 'Enregistrement...'
                  : isEdit
                    ? 'Modifier'
                    : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
