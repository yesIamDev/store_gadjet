'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaBox, FaCalendar, FaStickyNote } from 'react-icons/fa'
import {
  createPendingArticleSchema,
  updatePendingArticleSchema,
  type CreatePendingArticleFormData,
  type UpdatePendingArticleFormData,
} from '@/lib/validations/pending-articles'
import type { PendingArticle, Article } from '@/lib/api/types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PendingArticleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingArticle?: PendingArticle | null
  articles: Article[]
  onSubmit: (data: CreatePendingArticleFormData | UpdatePendingArticleFormData) => Promise<void>
  isLoading?: boolean
}

export function PendingArticleForm({
  open,
  onOpenChange,
  pendingArticle,
  articles,
  onSubmit,
  isLoading = false,
}: PendingArticleFormProps) {
  const isEdit = !!pendingArticle
  const schema = isEdit ? updatePendingArticleSchema : createPendingArticleSchema

  const form = useForm<CreatePendingArticleFormData | UpdatePendingArticleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      articleId: '',
      quantiteAttendue: 1,
      dateAttendue: '',
      note: '',
    },
  })

  useEffect(() => {
    if (pendingArticle) {
      form.reset({
        articleId: pendingArticle.article.id,
        quantiteAttendue: pendingArticle.quantiteAttendue,
        dateAttendue: pendingArticle.dateAttendue
          ? new Date(pendingArticle.dateAttendue).toISOString().split('T')[0]
          : '',
        note: pendingArticle.note || '',
      })
    } else {
      form.reset({
        articleId: '',
        quantiteAttendue: 1,
        dateAttendue: '',
        note: '',
      })
    }
  }, [pendingArticle, form, open])

  const handleSubmit = async (
    data: CreatePendingArticleFormData | UpdatePendingArticleFormData
  ) => {
    try {
      // Nettoyer la date attendue si elle est vide
      const cleanedData = {
        ...data,
        dateAttendue: data.dateAttendue && data.dateAttendue.trim() !== '' ? data.dateAttendue : undefined,
      }
      await onSubmit(cleanedData)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Erreur gérée par le parent
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier l\'article en attente' : 'Ajouter un article en attente'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="articleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaBox className="h-4 w-4 text-muted-foreground" />
                    Article <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || isEdit}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un article" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {articles.map((article) => (
                        <SelectItem key={article.id} value={article.id}>
                          {article.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantiteAttendue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaBox className="h-4 w-4 text-muted-foreground" />
                    Quantité attendue <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantité attendue"
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
              name="dateAttendue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaCalendar className="h-4 w-4 text-muted-foreground" />
                    Date attendue (optionnel)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaStickyNote className="h-4 w-4 text-muted-foreground" />
                    Note (optionnel)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajouter une note..."
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {form.formState.errors.root.message}
              </div>
            )}

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
                {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
