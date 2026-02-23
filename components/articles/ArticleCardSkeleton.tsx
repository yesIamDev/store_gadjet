'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ArticleCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 animate-pulse rounded bg-muted" />
          <div className="h-9 flex-1 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
