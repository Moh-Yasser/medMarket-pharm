"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

function DetailTileSkeleton() {
  return (
    <div className="rounded-2xl border bg-background/60 p-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mt-3 h-4 w-3/4" />
    </div>
  )
}

function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-background/60 p-3">
      <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-4 w-14 shrink-0" />
    </div>
  )
}

export function OrderDetailsSkeleton() {
  return (
    <div dir="rtl" className="space-y-5">
      <Skeleton className="h-9 w-32 rounded-full" />

      <section className="relative overflow-hidden rounded-4xl border bg-card p-5 shadow-sm">
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailTileSkeleton />
              <DetailTileSkeleton />
              <DetailTileSkeleton />
              <DetailTileSkeleton />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-muted/40 p-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-3 h-8 w-32" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-3.5 w-14" />
                <Skeleton className="h-3.5 w-16" />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b pb-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </CardHeader>

        <CardContent className="space-y-3 p-5">
          <ProductRowSkeleton />
          <ProductRowSkeleton />
          <ProductRowSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}