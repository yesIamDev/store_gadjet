'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaTruck, FaWarehouse, FaStore, FaStickyNote } from 'react-icons/fa'
import {
  receivePendingArticleSchema,
  type ReceivePendingArticleFormData,
} from '@/lib/validations/pending-articles'
import type { PendingArticle } from '@/lib/api/types'
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

interface ReceivePendingArticleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingArticle: PendingArticle | null
  onSubmit: (data: ReceivePendingArticleFormData) => Promise<void>
  isLoading?: boolean
}

export function ReceivePendingArticleDialog({
  open,
  onOpenChange,
  pendingArticle,
  onSubmit,
  isLoading = false,
}: ReceivePendingArticleDialogProps) {
  const form = useForm<ReceivePendingArticleFormData>({
    resolver: zodResolver(receivePendingArticleSchema),
    defaultValues: {
      quantiteRecue: 0,
      emplacement: 'MAGASIN',
      motif: '',
    },
  })

  useEffect(() => {
    if (pendingArticle && open) {
      const quantiteRestante =
        pendingArticle.quantiteAttendue - pendingArticle.quantiteRecue
      form.reset({
        quantiteRecue: quantiteRestante,
        emplacement: 'MAGASIN',
        motif: '',
      })
    }
  }, [pendingArticle, form, open])

  const handleSubmit = async (data: ReceivePendingArticleFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Erreur gérée par le parent
    }
  }

  if (!pendingArticle) return null

  const quantiteRestante =
    pendingArticle.quantiteAttendue - pendingArticle.quantiteRecue

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaTruck className="h-5 w-5 text-primary" />
            Recevoir l'article
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border/80 bg-muted/20">
            <p className="text-sm font-medium mb-2">{pendingArticle.article.nom}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Quantité attendue:</span>
                <span className="ml-2 font-semibold">{pendingArticle.quantiteAttendue}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Quantité reçue:</span>
                <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                  {pendingArticle.quantiteRecue}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Quantité restante:</span>
                <span className="ml-2 font-semibold text-orange-600 dark:text-orange-400">
                  {quantiteRestante}
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantiteRecue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FaTruck className="h-4 w-4 text-muted-foreground" />
                      Quantité reçue <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={quantiteRestante}
                        placeholder="Quantité reçue"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isLoading || quantiteRestante <= 0}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Maximum: {quantiteRestante} unité(s)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emplacement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FaWarehouse className="h-4 w-4 text-muted-foreground" />
                      Emplacement <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un emplacement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MAGASIN">
                          <div className="flex items-center gap-2">
                            <FaStore className="h-4 w-4" />
                            <span>Magasin</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="DEPOT">
                          <div className="flex items-center gap-2">
                            <FaWarehouse className="h-4 w-4" />
                            <span>Dépôt</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FaStickyNote className="h-4 w-4 text-muted-foreground" />
                      Motif (optionnel)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ajouter un motif..."
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
                <Button type="submit" disabled={isLoading || quantiteRestante <= 0}>
                  {isLoading ? 'Traitement...' : 'Recevoir'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
