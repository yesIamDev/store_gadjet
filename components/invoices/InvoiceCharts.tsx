'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaChartPie, FaChartBar, FaChartLine } from 'react-icons/fa'
import type { Invoice } from '@/lib/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InvoiceChartsProps {
  invoices: Invoice[]
}

export function InvoiceCharts({ invoices }: InvoiceChartsProps) {
  const chartData = useMemo(() => {
    // Données pour le graphique en camembert (statut)
    const statusData = [
      {
        name: 'Payées',
        value: invoices.filter((inv) => inv.status === 'PAYE').length,
        color: '#10b981', // green
      },
      {
        name: 'Non payées',
        value: invoices.filter((inv) => inv.status === 'NON_PAYE').length,
        color: '#f59e0b', // orange
      },
    ]

    // Données pour le graphique en barres (montants par statut)
    const montantParStatut = [
      {
        name: 'Payées',
        montant: invoices
          .filter((inv) => inv.status === 'PAYE')
          .reduce((sum, inv) => sum + Number(inv.montantTotal || 0), 0),
        color: '#10b981',
      },
      {
        name: 'Non payées',
        montant: invoices
          .filter((inv) => inv.status === 'NON_PAYE')
          .reduce((sum, inv) => {
            const total = Number(inv.montantTotal) || 0
            const paye = inv.payments && inv.payments.length > 0
              ? inv.payments.reduce((s, p) => s + Number(p.montant), 0)
              : Number(inv.montantPaye || 0)
            return sum + (total - paye)
          }, 0),
        color: '#f59e0b',
      },
    ]

    // Données pour le graphique des factures par mois (6 derniers mois)
    const mois = []
    const maintenant = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1)
      const moisNom = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
      const facturesDuMois = invoices.filter((inv) => {
        const dateFacture = new Date(inv.createdAt)
        return (
          dateFacture.getMonth() === date.getMonth() &&
          dateFacture.getFullYear() === date.getFullYear()
        )
      })
      
      const montantTotal = facturesDuMois.reduce(
        (sum, inv) => sum + Number(inv.montantTotal || 0),
        0
      )
      
      mois.push({
        mois: moisNom,
        nombre: facturesDuMois.length,
        montant: montantTotal,
      })
    }
    
    const facturesParMois = mois

    return {
      statusData,
      montantParStatut,
      facturesParMois,
    }
  }, [invoices])

  // Graphique en camembert simple (CSS)
  const PieChart = ({ data }: { data: Array<{ name: string; value: number; color: string }> }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    if (total === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Aucune donnée disponible</p>
        </div>
      )
    }

    return (
      <div className="relative w-full h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (percentage / 100) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle

            // Calcul des coordonnées pour l'arc
            const startAngleRad = ((startAngle - 90) * Math.PI) / 180
            const endAngleRad = ((endAngle - 90) * Math.PI) / 180
            const x1 = 100 + 80 * Math.cos(startAngleRad)
            const y1 = 100 + 80 * Math.sin(startAngleRad)
            const x2 = 100 + 80 * Math.cos(endAngleRad)
            const y2 = 100 + 80 * Math.sin(endAngleRad)
            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(' ')

            currentAngle += angle

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity"
                />
              </g>
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Factures</p>
          </div>
        </div>
      </div>
    )
  }

  // Graphique en barres simple (CSS)
  const BarChart = ({
    data,
  }: {
    data: Array<{ name: string; montant: number; color: string }>
  }) => {
    const maxMontant = Math.max(...data.map((d) => d.montant), 1)

    if (maxMontant === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Aucune donnée disponible</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.montant / maxMontant) * 100
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="font-semibold">${item.montant.toFixed(2)}</span>
              </div>
              <div className="w-full h-8 bg-muted rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-lg"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Graphique linéaire simple (CSS)
  const LineChart = ({
    data,
  }: {
    data: Array<{ mois: string; nombre: number; montant: number }>
  }) => {
    const maxMontant = Math.max(...data.map((d) => d.montant), 1)
    const maxNombre = Math.max(...data.map((d) => d.nombre), 1)

    if (data.length === 0 || maxMontant === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <p>Aucune donnée disponible</p>
        </div>
      )
    }

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * 100
      const y = 100 - (item.montant / maxMontant) * 80
      return { x, y, ...item }
    })

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')

    return (
      <div className="relative w-full h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grille */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-muted-foreground opacity-20"
            />
          ))}
          {/* Ligne animée */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            className="drop-shadow-sm"
          />
          {/* Points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill="#3b82f6"
                className="hover:r-2 transition-all"
              />
            </g>
          ))}
        </svg>
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
          {data.map((item, index) => (
            <span key={index} className="transform -rotate-45 origin-left">
              {item.mois}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique en camembert - Répartition par statut */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaChartPie className="h-5 w-5 text-primary" />
            Répartition par statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={chartData.statusData} />
          <div className="mt-4 space-y-2">
            {chartData.statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Graphique en barres - Montants par statut */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaChartBar className="h-5 w-5 text-primary" />
            Montants par statut
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={chartData.montantParStatut} />
        </CardContent>
      </Card>
      </motion.div>

      {/* Graphique linéaire - Évolution sur 6 mois */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaChartLine className="h-5 w-5 text-primary" />
            Évolution des factures (6 derniers mois)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={chartData.facturesParMois} />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4">
            {chartData.facturesParMois.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-border/80 bg-muted/20 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1">{item.mois}</p>
                <p className="text-sm font-semibold">{item.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  ${item.montant.toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}
