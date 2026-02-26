'use client'

import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Article } from '@/lib/api/types'

interface ArticlesCatalogPrintProps {
  articles: Article[]
}

export function ArticlesCatalogPrint({ articles }: ArticlesCatalogPrintProps) {
  const printDate = format(new Date(), 'PPP', { locale: fr })

  return (
    <>
      <div className="hidden print-catalog print:block">
        <div className="p-8 space-y-6">
          {/* En-tête */}
          <div className="border-b-2 border-gray-900 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Catalogue du Magasin</h1>
            <p className="text-sm text-gray-600 mt-2">Date d'impression : {printDate}</p>
          </div>

          {/* Informations générales */}
          <div className="mb-6 text-sm">
            <div>
              <span className="font-semibold">Total d'articles :</span>{' '}
              <span>{articles.length}</span>
            </div>
          </div>

          {/* Tableau des articles */}
          <table className="w-full border-collapse border border-gray-900">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-900 px-4 py-3 text-left text-sm font-bold text-gray-900">
                  #
                </th>
                <th className="border border-gray-900 px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Nom de l'article
                </th>
                <th className="border border-gray-900 px-4 py-3 text-left text-sm font-bold text-gray-900">
                  Description
                </th>
                <th className="border border-gray-900 px-4 py-3 text-center text-sm font-bold text-gray-900">
                  Prix unitaire
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="border border-gray-900 px-4 py-8 text-center text-gray-600">
                    Aucun article disponible
                  </td>
                </tr>
              ) : (
                articles.map((article, index) => {
                  const prix = typeof article.prixDeVente === 'string'
                    ? parseFloat(article.prixDeVente)
                    : article.prixDeVente

                  return (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="border border-gray-900 px-4 py-3 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm font-semibold text-gray-900">
                        {article.nom}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm text-gray-700">
                        {article.description || '-'}
                      </td>
                      <td className="border border-gray-900 px-4 py-3 text-sm text-center text-gray-700">
                        ${prix.toFixed(2)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          {/* Pied de page */}
          <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600 text-center">
            <p>Document généré le {printDate}</p>
          </div>
        </div>
      </div>
    </>
  )
}
