import { Skeleton } from '@/components/ui/skeleton'

export function PendingArticleTableSkeleton() {
  return (
    <div className="rounded-lg border border-border/80 bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Article
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Quantité attendue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Quantité reçue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Restant
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date attendue
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Date de réception
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Statut
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-32" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-16 mx-auto" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-16 mx-auto" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-16 mx-auto" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-24 mx-auto" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-24 mx-auto" />
                </td>
                <td className="px-4 py-3 whitespace-nowrap border-r border-border/80">
                  <Skeleton className="h-5 w-20 mx-auto" />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
