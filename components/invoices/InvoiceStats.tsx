'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaFileInvoice,
} from 'react-icons/fa'
import type { Invoice } from '@/lib/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface InvoiceStatsProps {
  invoices: Invoice[]
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const stats = useMemo(() => {
    // 1. Montant total des factures non payées
    const montantNonPaye = invoices
      .filter((inv) => inv.status === 'NON_PAYE')
      .reduce((sum, inv) => {
        const total = Number(inv.montantTotal) || 0
        const paye = inv.payments && inv.payments.length > 0
          ? inv.payments.reduce((s, p) => s + Number(p.montant), 0)
          : Number(inv.montantPaye || 0)
        const restant = total - paye
        return sum + restant
      }, 0)

    // 2. Montant total des factures payées
    const montantPaye = invoices
      .filter((inv) => inv.status === 'PAYE')
      .reduce((sum, inv) => sum + Number(inv.montantTotal || 0), 0)

    // 3. Nombre total de factures
    const totalFactures = invoices.length
    const facturesNonPayees = invoices.filter((inv) => inv.status === 'NON_PAYE').length
    const facturesPayees = invoices.filter((inv) => inv.status === 'PAYE').length

    // 4. Montant moyen par facture
    const montantTotal = invoices.reduce(
      (sum, inv) => sum + Number(inv.montantTotal || 0),
      0
    )
    const montantMoyen = totalFactures > 0 ? montantTotal / totalFactures : 0

    // 5. Dettes par client
    const dettesParClient = invoices
      .filter((inv) => inv.status === 'NON_PAYE' && inv.client)
      .reduce((acc, inv) => {
        const clientId = inv.client!.id
        const clientNom = inv.client!.nom
        const total = Number(inv.montantTotal) || 0
        const paye = inv.payments && inv.payments.length > 0
          ? inv.payments.reduce((s, p) => s + Number(p.montant), 0)
          : Number(inv.montantPaye || 0)
        const restant = total - paye

        if (!acc[clientId]) {
          acc[clientId] = {
            id: clientId,
            nom: clientNom,
            dette: 0,
            nombreFactures: 0,
          }
        }
        acc[clientId].dette += restant
        acc[clientId].nombreFactures += 1

        return acc
      }, {} as Record<string, { id: string; nom: string; dette: number; nombreFactures: number }>)

    const topDettes = Object.values(dettesParClient)
      .sort((a, b) => b.dette - a.dette)
      .slice(0, 5)

    return {
      montantNonPaye,
      montantPaye,
      totalFactures,
      facturesNonPayees,
      facturesPayees,
      montantMoyen,
      topDettes,
      montantTotal,
    }
  }, [invoices])

  const statsCards = [
    {
      title: 'Dettes totales',
      value: `$${stats.montantNonPaye.toFixed(2)}`,
      description: `${stats.facturesNonPayees} facture${stats.facturesNonPayees > 1 ? 's' : ''} non payée${stats.facturesNonPayees > 1 ? 's' : ''}`,
      icon: FaMoneyBillWave,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Montant payé',
      value: `$${stats.montantPaye.toFixed(2)}`,
      description: `${stats.facturesPayees} facture${stats.facturesPayees > 1 ? 's' : ''} payée${stats.facturesPayees > 1 ? 's' : ''}`,
      icon: FaDollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Montant moyen',
      value: `$${stats.montantMoyen.toFixed(2)}`,
      description: `Sur ${stats.totalFactures} facture${stats.totalFactures > 1 ? 's' : ''}`,
      icon: FaChartLine,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Total facturé',
      value: `$${stats.montantTotal.toFixed(2)}`,
      description: `${stats.totalFactures} facture${stats.totalFactures > 1 ? 's' : ''} au total`,
      icon: FaFileInvoice,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'border border-border/80 transition-all duration-200 hover:shadow-md hover:-translate-y-1',
                  stat.borderColor
                )}
              >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={cn(
                      'p-2 rounded-lg',
                      stat.bgColor,
                      stat.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className={cn('text-2xl font-bold', stat.color)}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Top 5 des dettes par client */}
      {stats.topDettes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FaUsers className="h-5 w-5 text-primary" />
                Top 5 des dettes par client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topDettes.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{client.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.nombreFactures} facture
                        {client.nombreFactures > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-lg text-red-600 dark:text-red-400">
                      ${client.dette.toFixed(2)}
                    </p>
                  </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
