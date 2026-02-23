'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FaBox,
  FaPlus,
  FaTrash,
  FaTruck,
  FaDollarSign,
  FaUser,
} from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Switch } from '@/components/ui/switch'
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  type CreateInvoiceFormData,
  type UpdateInvoiceFormData,
} from '@/lib/validations/invoices'
import type { Invoice, InvoiceStatus, StockMovement, Client } from '@/lib/api/types'
import { useStockMovementsStore } from '@/store/stockMovementsStore'
import { useClientsStore } from '@/store/clientsStore'

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice | null
  onSubmit: (data: CreateInvoiceFormData | UpdateInvoiceFormData) => Promise<void>
  isLoading?: boolean
}

export function InvoiceForm({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isLoading = false,
}: InvoiceFormProps) {
  const isEdit = !!invoice
  const schema = isEdit ? updateInvoiceSchema : createInvoiceSchema

  const { movements, fetchMovements } = useStockMovementsStore()
  const { clients, fetchClients } = useClientsStore()

  useEffect(() => {
    fetchMovements()
    fetchClients()
  }, [fetchMovements, fetchClients])

  // Filtrer les mouvements de sortie disponibles
  const availableMovements = movements.filter(
    (movement) =>
      movement.type === 'SORTIE' &&
      (!invoice || (invoice.stockMovement && movement.id === invoice.stockMovement.id))
  )

  const form = useForm<CreateInvoiceFormData | UpdateInvoiceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      numeroFacture: '',
      numeroBonLivraison: '',
      montantTotal: 0,
      status: 'NON_PAYE' as InvoiceStatus,
      stockMovementCode: '',
      items: [],
      clientId: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const selectedMovementCode = form.watch('stockMovementCode')
  const selectedMovement = availableMovements.find(
    (m) => m.code === selectedMovementCode
  )
  const watchedItems = form.watch('items')

  // Calculer le montant total automatiquement
  useEffect(() => {
    let total = 0

    // Montant du mouvement
    if (selectedMovement && selectedMovement.items && selectedMovement.items.length > 0) {
      for (const item of selectedMovement.items) {
        const prixUnitaire = typeof item.article.prixDeVente === 'string'
          ? parseFloat(item.article.prixDeVente)
          : item.article.prixDeVente
        total += (prixUnitaire || 0) * (item.quantite || 0)
      }
    }

    // Montant des articles libres
    if (watchedItems && Array.isArray(watchedItems) && watchedItems.length > 0) {
      for (const item of watchedItems) {
        if (item && item.nom && item.nom.trim()) {
          const prixUnitaire = Number(item.prixUnitaire) || 0
          const quantite = Number(item.quantite) || 0
          total += prixUnitaire * quantite
        }
      }
    }

    // Mettre à jour le montant total
    form.setValue('montantTotal', total, { shouldValidate: false, shouldDirty: false })
  }, [selectedMovement, watchedItems, form])

  // Initialiser le formulaire avec les données de la facture en édition
  useEffect(() => {
    if (invoice) {
      form.reset({
        numeroFacture: invoice.numeroFacture,
        numeroBonLivraison: invoice.numeroBonLivraison || '',
        montantTotal: Number(invoice.montantTotal),
        status: invoice.status,
        stockMovementCode: invoice.stockMovement?.code || '',
        items: invoice.items?.map(item => ({
          nom: item.nom,
          description: item.description || '',
          prixUnitaire: typeof item.prixUnitaire === 'string' ? parseFloat(item.prixUnitaire) : item.prixUnitaire,
          quantite: item.quantite,
        })) || [],
        clientId: invoice.client?.id || '',
      })
    } else {
      form.reset({
        numeroFacture: '',
        numeroBonLivraison: '',
        montantTotal: 0,
        status: 'NON_PAYE' as InvoiceStatus,
        stockMovementCode: '',
        items: [],
        clientId: '',
      })
    }
  }, [invoice, form, open])

  const handleSubmit = async (data: CreateInvoiceFormData | UpdateInvoiceFormData) => {
    try {
      // Recalculer le montant total avant la soumission
      let calculatedTotal = 0

      // Montant du mouvement
      if (selectedMovement && selectedMovement.items && selectedMovement.items.length > 0) {
        for (const item of selectedMovement.items) {
          const prixUnitaire = typeof item.article.prixDeVente === 'string'
            ? parseFloat(item.article.prixDeVente)
            : item.article.prixDeVente
          calculatedTotal += (prixUnitaire || 0) * (item.quantite || 0)
        }
      }

      // Montant des articles libres
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        for (const item of data.items) {
          if (item && item.nom && item.nom.trim()) {
            const prixUnitaire = Number(item.prixUnitaire) || 0
            const quantite = Number(item.quantite) || 0
            calculatedTotal += prixUnitaire * quantite
          }
        }
      }

      // Construire l'objet de données de manière simple et claire
      const payload: any = {
        numeroFacture: data.numeroFacture?.trim() || (isEdit ? undefined : ''),
        numeroBonLivraison: data.numeroBonLivraison?.trim() || undefined,
        montantTotal: calculatedTotal > 0 ? calculatedTotal : (Number(data.montantTotal) || 0),
        status: data.status || 'NON_PAYE',
      }

      // Ajouter le client seulement s'il est fourni
      if (data.clientId && data.clientId.trim()) {
        payload.clientId = data.clientId.trim()
      }

      // Gérer le mouvement de stock
      if (data.stockMovementCode?.trim()) {
        payload.stockMovementCode = data.stockMovementCode.trim()
      }

      // Gérer les articles libres
      if (data.items && data.items.length > 0) {
        const validItems = data.items
          .filter(item => item.nom?.trim() && Number(item.prixUnitaire) > 0 && Number(item.quantite) > 0)
          .map(item => ({
            nom: item.nom.trim(),
            description: item.description?.trim() || undefined,
            prixUnitaire: Number(item.prixUnitaire),
            quantite: Number(item.quantite),
          }))

        if (validItems.length > 0) {
          payload.items = validItems
        }
      }

      // Validation : au moins un mouvement ou des articles libres
      if (!payload.stockMovementCode && (!payload.items || payload.items.length === 0)) {
        form.setError('root', {
          type: 'manual',
          message: 'Un code de mouvement de stock ou au moins un article libre est requis',
        })
        return
      }

      // Validation : montant total > 0
      if (payload.montantTotal <= 0) {
        form.setError('root', {
          type: 'manual',
          message: 'Le montant total doit être supérieur à 0',
        })
        return
      }

      await onSubmit(payload)
      form.reset()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Erreur lors de la soumission:', error)
      if (error?.message) {
        form.setError('root', {
          type: 'manual',
          message: error.message,
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier la facture' : 'Créer une facture'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            console.log('Erreurs de validation:', errors)
          })} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroFacture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Numéro de facture <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="FAC-2024-001" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroBonLivraison"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de bon de livraison</FormLabel>
                    <FormControl>
                      <Input placeholder="BL-2024-001" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sélection du client (optionnel) */}
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaUser className="h-4 w-4 text-muted-foreground" />
                    Client (optionnel)
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={clients.map(client => ({
                        value: client.id,
                        label: `${client.nom}${client.telephone ? ` - ${client.telephone}` : ''}`,
                      }))}
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      placeholder="Rechercher un client..."
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code du mouvement de stock */}
            <FormField
              control={form.control}
              name="stockMovementCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaBox className="h-4 w-4 text-muted-foreground" />
                    Code du mouvement de stock (optionnel)
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        placeholder="Collez ou saisissez le code du mouvement"
                        {...field}
                        disabled={isLoading || isEdit}
                        className="font-mono"
                      />
                    </FormControl>
                    {availableMovements.length > 0 && (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading || isEdit}
                      >
                        <SelectTrigger className="w-auto min-w-[120px]">
                          <SelectValue placeholder="Ou sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMovements.map((movement) => {
                            let total = 0
                            for (const item of movement.items) {
                              const prixUnitaire = typeof item.article.prixDeVente === 'string'
                                ? parseFloat(item.article.prixDeVente)
                                : item.article.prixDeVente
                              total += prixUnitaire * item.quantite
                            }
                            return (
                              <SelectItem key={movement.id} value={movement.code || ''}>
                                <div className="flex items-center justify-between w-full gap-2">
                                  <code className="text-xs font-mono font-semibold">
                                    {movement.code}
                                  </code>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ${total.toFixed(2)}
                                  </span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  {selectedMovement && (
                    <FormDescription>
                      {selectedMovement.items.length} article
                      {selectedMovement.items.length > 1 ? 's' : ''} -{' '}
                      {selectedMovement.motif || 'Sans motif'} -{' '}
                      {new Date(selectedMovement.createdAt).toLocaleDateString('fr-FR')}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Articles libres */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base">
                  Articles libres (optionnel)
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ nom: '', description: '', prixUnitaire: 0, quantite: 1 })}
                  disabled={isLoading}
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Ajouter un article
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start p-4 border border-border/80 rounded-lg">
                  <FormField
                    control={form.control}
                    name={`items.${index}.nom`}
                    render={({ field }) => (
                      <FormItem className="col-span-12 md:col-span-4">
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'article" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-12 md:col-span-3">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description"
                            {...field}
                            disabled={isLoading}
                            className="min-h-[38px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.prixUnitaire`}
                    render={({ field }) => (
                      <FormItem className="col-span-6 md:col-span-2">
                        <FormLabel>Prix unitaire</FormLabel>
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

                  <FormField
                    control={form.control}
                    name={`items.${index}.quantite`}
                    render={({ field }) => (
                      <FormItem className="col-span-6 md:col-span-2">
                        <FormLabel>Quantité</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-12 md:col-span-1 flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                    >
                      <FaTrash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Montant total */}
            <FormField
              control={form.control}
              name="montantTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                    Montant total <span className="text-destructive">*</span>
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
                        className="pl-7 bg-muted/50"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={isLoading || (!!selectedMovement || (watchedItems && watchedItems.length > 0))}
                        readOnly={!!selectedMovement || (watchedItems && watchedItems.length > 0)}
                      />
                    </div>
                  </FormControl>
                  {(selectedMovement || (watchedItems && watchedItems.length > 0)) && (
                    <FormDescription>
                      Montant calculé automatiquement à partir du mouvement et des articles libres
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/80 p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Statut de la facture</FormLabel>
                    <FormDescription>
                      {field.value === 'PAYE' ? 'La facture est payée' : 'La facture n\'est pas encore payée'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === 'PAYE'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'PAYE' : 'NON_PAYE')}
                      disabled={isLoading}
                    />
                  </FormControl>
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
                {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
