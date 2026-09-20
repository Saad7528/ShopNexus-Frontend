import React from 'react';
import { AdminMetricsSkeleton, Skeleton } from '@/components/ui/Skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <Skeleton className="h-4 w-80 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <AdminMetricsSkeleton count={4} />

      {/* Analytics Charts Skeleton Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 backdrop-blur-md shadow-xs dark:shadow-none">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 backdrop-blur-md shadow-xs dark:shadow-none">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44 rounded" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>

      {/* Recent Activity Table Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4 backdrop-blur-md shadow-xs dark:shadow-none">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/40">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
