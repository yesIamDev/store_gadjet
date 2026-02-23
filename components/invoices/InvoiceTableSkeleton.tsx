'use client'

export function InvoiceTableSkeleton() {
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
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-border/80">
                <td className="px-4 py-3 border-r border-border/80">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3 text-center border-r border-border/80">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-4 py-3 text-center border-r border-border/80">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-4 py-3 text-center border-r border-border/80">
                  <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-4 py-3 text-center border-r border-border/80">
                  <div className="h-5 w-20 bg-muted animate-pulse rounded mx-auto" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
