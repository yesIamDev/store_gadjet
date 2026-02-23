'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaFileInvoice,
  FaUser,
  FaBox,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaTruck,
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
} from 'react-icons/fa'
import type { Invoice } from '@/lib/api/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { invoicesApi } from '@/lib/api/invoices'
import { AddPaymentDialog } from './AddPaymentDialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { toast } from 'sonner'

interface InvoiceDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onInvoiceUpdate?: () => void
}

export function InvoiceDetailsDialog({
  open,
  onOpenChange,
  invoice,
  onInvoiceUpdate,
}: InvoiceDetailsDialogProps) {
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [isDeletingPayment, setIsDeletingPayment] = useState<string | null>(null)
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(invoice)
  const [deletePaymentDialogOpen, setDeletePaymentDialogOpen] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null)

  // Mettre à jour la facture locale quand elle change
  useEffect(() => {
    if (invoice) {
      setCurrentInvoice(invoice)
    } else {
      setCurrentInvoice(null)
    }
  }, [invoice])

  if (!invoice || !open) {
    return null
  }

  // Utiliser currentInvoice si disponible, sinon invoice
  const displayInvoice = currentInvoice || invoice
  const montantTotal = Number(displayInvoice.montantTotal)
  
  // Calculer le montant payé à partir des paiements si disponibles, sinon utiliser montantPaye
  let montantPaye = 0
  if (displayInvoice.payments && displayInvoice.payments.length > 0) {
    montantPaye = displayInvoice.payments.reduce(
      (sum, payment) => sum + Number(payment.montant),
      0
    )
  } else {
    montantPaye = Number(displayInvoice.montantPaye || 0)
  }
  
  // Calculer le montant restant dynamiquement
  const montantRestant = montantTotal - montantPaye
  const isPaid = displayInvoice.status === 'PAYE'

  const handleDeletePaymentClick = (paymentId: string) => {
    setPaymentToDelete(paymentId)
    setDeletePaymentDialogOpen(true)
  }

  const handleDeletePaymentConfirm = async () => {
    if (!paymentToDelete) return

    setIsDeletingPayment(paymentToDelete)
    try {
      await invoicesApi.removePayment(paymentToDelete)
      // Recharger la facture mise à jour
      if (onInvoiceUpdate) {
        onInvoiceUpdate()
      } else {
        // Si pas de callback, recharger directement
        try {
          const updatedInvoice = await invoicesApi.getById(invoice.id)
          setCurrentInvoice(updatedInvoice)
        } catch (error) {
          console.error('Erreur lors du rechargement de la facture:', error)
        }
      }
      toast.success('Paiement supprimé avec succès')
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement:', error)
      toast.error('Erreur lors de la suppression du paiement')
    } finally {
      setIsDeletingPayment(null)
      setPaymentToDelete(null)
      setDeletePaymentDialogOpen(false)
    }
  }

  if (!invoice || !open) {
    return null
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaFileInvoice className="h-5 w-5 text-primary" />
              Détails de la facture {displayInvoice.numeroFacture}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaFileInvoice className="h-4 w-4" />
                    <span>Numéro de facture:</span>
                  </div>
                  <span className="font-semibold">{displayInvoice.numeroFacture}</span>
                </div>

                {displayInvoice.numeroBonLivraison && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FaTruck className="h-4 w-4" />
                      <span>Numéro de bon de livraison:</span>
                    </div>
                    <span className="font-semibold">{displayInvoice.numeroBonLivraison}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FaUser className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Client:</span>
                <span className="font-semibold">{displayInvoice.client?.nom || 'Non renseigné'}</span>
              </div>

              {displayInvoice.client?.telephone && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground ml-6">Téléphone:</span>
                  <span className="font-semibold">{displayInvoice.client.telephone}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <FaCalendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date de création:</span>
                <span className="font-semibold">
                  {format(new Date(displayInvoice.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'flex items-center gap-1.5',
                    isPaid
                      ? 'border-green-500/30 text-green-600 bg-green-50/50 dark:bg-green-950/30'
                      : 'border-orange-500/30 text-orange-600 bg-orange-50/50 dark:bg-orange-950/30'
                  )}
                >
                  {isPaid ? (
                    <>
                      <FaCheckCircle className="h-3 w-3" />
                      <span>Payé</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="h-3 w-3" />
                      <span>Non payé</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Tableau des articles */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FaBox className="h-4 w-4 text-muted-foreground" />
                <span>
                  Articles (
                  {(displayInvoice.stockMovement ? displayInvoice.stockMovement.items.length : 0) + (displayInvoice.items?.length || 0)}
                  )
                </span>
              </div>

              <div className="rounded-lg border border-border/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Article
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Quantité
                        </th>
                        {(displayInvoice.stockMovement && displayInvoice.stockMovement.items.length > 0) && (
                          <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Emplacement
                          </th>
                        )}
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Prix unitaire
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {/* Articles du mouvement de stock */}
                      {displayInvoice.stockMovement && displayInvoice.stockMovement.items.map((item, index) => {
                        const prixUnitaire = typeof item.article.prixDeVente === 'string'
                          ? parseFloat(item.article.prixDeVente)
                          : item.article.prixDeVente
                        const total = prixUnitaire * item.quantite

                        return (
                          <tr
                            key={`movement-${item.id || index}`}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{item.article.nom}</span>
                                {item.article.description && (
                                  <span className="text-xs text-muted-foreground mt-0.5">
                                    {item.article.description}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">{item.quantite}</td>
                            {displayInvoice.stockMovement && (
                              <td className="px-4 py-3 text-center">
                                <Badge variant="outline" className="text-xs">
                                  {item.emplacement === 'MAGASIN' ? 'Magasin' : 'Dépôt'}
                                </Badge>
                              </td>
                            )}
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              ${prixUnitaire.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold">
                              ${total.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                      {/* Articles libres */}
                      {displayInvoice.items && displayInvoice.items.map((item, index) => {
                        const prixUnitaire = typeof item.prixUnitaire === 'string'
                          ? parseFloat(item.prixUnitaire)
                          : item.prixUnitaire
                        const total = prixUnitaire * item.quantite

                        return (
                          <tr
                            key={`free-${item.id || index}`}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{item.nom}</span>
                                {item.description && (
                                  <span className="text-xs text-muted-foreground mt-0.5">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">{item.quantite}</td>
                            {displayInvoice.stockMovement && displayInvoice.stockMovement.items.length > 0 && (
                              <td className="px-4 py-3 text-center">
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  -
                                </Badge>
                              </td>
                            )}
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              ${prixUnitaire.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold">
                              ${total.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot className="bg-muted/30">
                      <tr>
                        <td
                          colSpan={(displayInvoice.stockMovement && displayInvoice.stockMovement.items.length > 0) ? 4 : 3}
                          className="px-4 py-3 text-right text-sm font-semibold"
                        >
                          <div className="flex items-center justify-end gap-2">
                            <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                            <span>Montant total:</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-lg font-bold text-foreground">
                            ${montantTotal.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <Separator />

            {/* Section Paiements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FaMoneyBillWave className="h-4 w-4 text-muted-foreground" />
                  <span>Paiements</span>
                </div>
                {!isPaid && (
                  <Button
                    size="sm"
                    onClick={() => setAddPaymentOpen(true)}
                    disabled={montantRestant <= 0}
                  >
                    <FaPlus className="h-3.5 w-3.5 mr-2" />
                    Ajouter un paiement
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20">
                  <span className="text-sm text-muted-foreground">Montant total:</span>
                  <span className="text-sm font-semibold">${montantTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20">
                  <span className="text-sm text-muted-foreground">Montant payé:</span>
                  <span className="text-sm font-semibold text-green-600">${montantPaye.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20">
                  <span className="text-sm text-muted-foreground">Montant restant:</span>
                  <span className={cn(
                    'text-sm font-semibold',
                    montantRestant > 0 ? 'text-destructive' : 'text-green-600'
                  )}>
                    ${montantRestant.toFixed(2)}
                  </span>
                </div>
              </div>

              {displayInvoice.payments && displayInvoice.payments.length > 0 && (
                <div className="rounded-lg border border-border/80 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Montant
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Note
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {displayInvoice.payments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 text-sm">
                              {format(new Date(payment.createdAt), 'dd MMM yyyy à HH:mm', { locale: fr })}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-semibold">
                              ${Number(payment.montant).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {payment.note || '-'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePaymentClick(payment.id)}
                                disabled={isDeletingPayment === payment.id}
                              >
                                <FaTrash className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddPaymentDialog
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
        invoice={invoice}
        onPaymentAdded={() => {
          setAddPaymentOpen(false)
          onInvoiceUpdate?.()
        }}
      />

      <ConfirmDialog
        open={deletePaymentDialogOpen}
        onOpenChange={setDeletePaymentDialogOpen}
        title="Supprimer le paiement"
        description="Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="destructive"
        onConfirm={handleDeletePaymentConfirm}
        isLoading={isDeletingPayment !== null}
      />
    </>
  )
}
