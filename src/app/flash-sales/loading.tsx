import React from 'react';
import { ProductGridSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function FlashSalesLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1780px] min-[2000px]:max-w-[86vw] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Flash Sale Banner Skeleton */}
        <div className="rounded-3xl border border-rose-500/20 bg-linear-to-r from-rose-500/10 via-amber-500/5 to-orange-500/10 dark:from-red-950/40 dark:via-slate-900/60 dark:to-orange-950/40 p-8 backdrop-blur-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <Skeleton className="h-6 w-36 rounded-full bg-rose-500/20" />
              <Skeleton className="h-10 w-80 rounded-xl" />
              <Skeleton className="h-4 w-96 rounded" />
            </div>
            {/* Countdown Box Skeleton */}
            <div className="flex items-center gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center rounded-2xl border border-rose-500/30 bg-white/80 dark:bg-slate-900/80 p-3 w-16 space-y-1 shadow-xs dark:shadow-none">
                  <Skeleton className="h-7 w-8 rounded" />
                  <Skeleton className="h-3 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
