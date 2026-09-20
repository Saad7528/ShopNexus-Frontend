import React from 'react';
import { ProductGridSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        </div>

        {/* Content Layout with Filter Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 space-y-6 backdrop-blur-md shadow-xs dark:shadow-none">
              <div className="space-y-3">
                <Skeleton className="h-5 w-28 rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
