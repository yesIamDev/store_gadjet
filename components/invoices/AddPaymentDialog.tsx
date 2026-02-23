'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaDollarSign, FaMoneyBillWave, FaStickyNote } from 'react-icons/fa'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Invoice } from '@/lib/api/types'
import { useInvoicesStore } from '@/store/invoicesStore'
import { toast } from 'sonner'

const addPaymentSchema = z.object({
  montant: z
    .number()
    .positive('Le montant doit être positif')
    .min(0.01, 'Le montant doit être supérieur à 0'),
  note: z.string().max(500, 'La note ne peut pas dépasser 500 caractères').optional().or(z.literal('')),
})

type AddPaymentFormData = z.infer<typeof addPaymentSchema>

interface AddPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onPaymentAdded: () => void
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  invoice,
  onPaymentAdded,
}: AddPaymentDialogProps) {
  const { addPayment, isLoading } = useInvoicesStore()

  const form = useForm<AddPaymentFormData>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      montant: 0,
      note: '',
    },
  })

  // Calculer le montant restant dynamiquement
  const montantTotal = Number(invoice?.montantTotal || 0)
  const montantPaye = invoice?.payments && invoice.payments.length > 0
    ? invoice.payments.reduce((sum, payment) => sum + Number(payment.montant), 0)
    : Number(invoice?.montantPaye || 0)
  const montantRestant = montantTotal - montantPaye

  const onSubmit = async (data: AddPaymentFormData) => {
    if (!invoice) return

    if (data.montant > montantRestant) {
      form.setError('montant', {
        type: 'manual',
        message: `Le montant ne peut pas dépasser le montant restant (${montantRestant.toFixed(2)}$)`,
      })
      return
    }

    try {
      await addPayment(invoice.id, data)
      toast.success('Paiement ajouté avec succès')
      onPaymentAdded()
      form.reset()
      onOpenChange(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de l\'ajout du paiement'
      form.setError('root', {
        type: 'manual',
        message: errorMessage,
      })
      toast.error(errorMessage)
    }
  }

  useEffect(() => {
    if (open && invoice) {
      form.reset({
        montant: montantRestant > 0 ? montantRestant : 0,
        note: '',
      })
    }
  }, [open, invoice, form, montantRestant])

  if (!invoice || !open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FaMoneyBillWave className="h-5 w-5 text-primary" />
            Ajouter un paiement pour la facture {invoice.numeroFacture}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Montant total: <span className="font-semibold">${Number(invoice.montantTotal).toFixed(2)}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Montant déjà payé: <span className="font-semibold">${Number(invoice.montantPaye || 0).toFixed(2)}</span>
              </p>
              <p className="text-lg font-bold text-foreground">
                Montant restant: <span className="text-primary">${montantRestant.toFixed(2)}</span>
              </p>
            </div>

            <FormField
              control={form.control}
              name="montant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                    Montant du paiement <span className="text-destructive">*</span>
                  </FormLabel>
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        disabled={isLoading || montantRestant <= 0}
                      />
                    </div>
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
                      placeholder="Ajouter une note pour ce paiement"
                      {...field}
                      disabled={isLoading}
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
              <Button type="submit" disabled={isLoading || montantRestant <= 0}>
                {isLoading ? 'Ajout...' : 'Ajouter le paiement'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
