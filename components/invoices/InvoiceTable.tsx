'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion } from 'framer-motion'
import {
  FaFileInvoice,
  FaUser,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaEye,
  FaEllipsisV,
} from 'react-icons/fa'
import type { Invoice } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface InvoiceTableProps {
  invoices: Invoice[]
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  isLoading?: boolean
}

export function InvoiceTable({
  invoices,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Aucune facture pour le moment
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border/80 bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Numéro
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Client
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Montant total
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Montant payé
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Restant
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {invoices.map((invoice, index) => {
              const montantTotal = Number(invoice.montantTotal || 0)
              const montantPaye = invoice.payments && invoice.payments.length > 0
                ? invoice.payments.reduce((sum, payment) => sum + Number(payment.montant || 0), 0)
                : Number(invoice.montantPaye || 0)
              const montantRestant = Math.max(0, montantTotal - montantPaye)
              const isPaid = invoice.status === 'PAYE'

              return (
                <motion.tr
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={cn(
                    'group hover:bg-muted/20 transition-colors duration-200 border-b border-border/80',
                    isLoading && 'opacity-50'
                  )}
                >
                  <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                    <div className="flex items-center gap-2">
                      <FaFileInvoice className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {invoice.numeroFacture}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    <div className="flex items-center gap-2">
                      <FaUser className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {invoice.client?.nom || 'Non renseigné'}
                        </span>
                        {invoice.client?.telephone && (
                          <span className="text-xs text-muted-foreground truncate">
                            {invoice.client.telephone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <div className="flex items-center justify-center gap-1">
                      <FaDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">
                        {montantTotal.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <span className="text-sm text-muted-foreground">
                      {montantPaye.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <span className={cn(
                      'text-sm font-medium',
                      montantRestant > 0 ? 'text-destructive' : 'text-green-600'
                    )}>
                      {montantRestant.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border-r border-border/80">
                    <Badge
                      variant="outline"
                      className={cn(
                        'flex items-center gap-1.5 w-fit mx-auto',
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
                  </td>
                  <td className="px-4 py-3 border-r border-border/80">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(invoice.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isLoading}
                        >
                          <FaEllipsisV className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[160px]">
                        <DropdownMenuItem onClick={() => onView(invoice)}>
                          <FaEye className="mr-2 h-4 w-4" />
                          <span>Voir les détails</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(invoice)}>
                          <FaEdit className="mr-2 h-4 w-4" />
                          <span>Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(invoice)}
                          className="text-destructive focus:text-destructive"
                        >
                          <FaTrash className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
