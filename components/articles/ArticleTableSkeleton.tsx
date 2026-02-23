'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ArticleTableSkeleton() {
  return (
    <div className="rounded-lg border border-border/80 bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Emplacement
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/80">
                Prix
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="hover:bg-muted/20 border-b border-border/80">
                <td className="px-4 py-3 border-r border-border/80">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <Skeleton className="h-4 w-48" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <Skeleton className="h-5 w-16" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3 border-r border-border/80">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Skeleton className="h-8 w-8 rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
