'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaBox, FaDollarSign, FaExclamationTriangle, FaChartLine } from 'react-icons/fa'
import { ProtectedLayout } from '@/components/layout/ProtectedLayout'
import { useArticlesStore } from '@/store/articlesStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { articles, isLoading, fetchArticles } = useArticlesStore()

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const stats = useMemo(() => {
    const totalArticles = articles.length
    const totalStock = articles.reduce((sum, article) => sum + (article.quantiteEnStock || 0), 0)
    const totalValue = articles.reduce(
      (sum, article) => sum + (Number(article.prixDeVente) || 0) * (article.quantiteEnStock || 0),
      0
    )
    const lowStockItems = articles.filter(
      (article) => (article.quantiteEnStock || 0) < 10
    ).length
    const outOfStockItems = articles.filter(
      (article) => (article.quantiteEnStock || 0) === 0
    ).length

    return {
      totalArticles,
      totalStock,
      totalValue,
      lowStockItems,
      outOfStockItems,
    }
  }, [articles])

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      description: 'Articles dans l\'inventaire',
      icon: FaBox,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Stock Total',
      value: stats.totalStock.toLocaleString(),
      description: 'Unités en stock',
      icon: FaBox,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Valeur Totale',
      value: `$${stats.totalValue.toFixed(2)}`,
      description: 'Valeur du stock',
      icon: FaDollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Stock Faible',
      value: stats.lowStockItems,
      description: 'Articles < 10 unités',
      icon: FaExclamationTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Rupture de Stock',
      value: stats.outOfStockItems,
      description: 'Articles épuisés',
      icon: FaExclamationTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <ProtectedLayout>
      <div className="space-y-10 px-1">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Vue d'ensemble de votre inventaire
          </p>
        </div>

        {isLoading && articles.length === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`rounded-2xl p-2.5 ${stat.bgColor} shadow-sm`}>
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-semibold tracking-tight">{stat.value}</div>
                      <CardDescription className="mt-2 text-sm">
                        {stat.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {!isLoading && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaChartLine className="h-5 w-5" />
                  Statistiques détaillées
                </CardTitle>
                <CardDescription>
                  Analyse approfondie de votre inventaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Valeur moyenne par article
                    </p>
                    <p className="text-2xl font-bold">
                      $
                      {stats.totalArticles > 0
                        ? (stats.totalValue / stats.totalArticles).toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Stock moyen par article
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalArticles > 0
                        ? (stats.totalStock / stats.totalArticles).toFixed(1)
                        : '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Taux de rupture
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalArticles > 0
                        ? ((stats.outOfStockItems / stats.totalArticles) * 100).toFixed(1)
                        : '0'}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Articles bien approvisionnés
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totalArticles - stats.lowStockItems - stats.outOfStockItems}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ProtectedLayout>
  )
}
