'use client';

import React from 'react';
import { cn } from './Button';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Base Primitive Skeleton Element with animated Shimmer wave
 * Supports ultra-clean light mode (slate-200/shimmer) and sleek dark mode (slate-800/shimmer)
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-200/80 dark:bg-slate-800/80 animate-shimmer',
        className
      )}
      {...props}
    />
  );
}

/**
 * Single Product Card Skeleton (Matching Storefront Product Cards in Light & Dark Mode)
 */
export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-4 backdrop-blur-md shadow-sm dark:shadow-lg space-y-4">
      {/* Product Image Placeholder */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800/70 animate-shimmer">
        <div className="absolute top-2.5 left-2.5 h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700/80 animate-shimmer" />
        <div className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700/80 animate-shimmer" />
      </div>

      {/* Product Title & Brand */}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-1/3 rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-3.5 w-1/2 rounded" />
      </div>

      {/* Rating & Stock */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3.5 w-16 rounded" />
        </div>
        <Skeleton className="h-3 w-12 rounded" />
      </div>

      {/* Price & Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Product Grid Skeleton (Configurable count, e.g. 8 items)
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Product Detail View Skeleton (Single Product Page)
 */
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl lg:max-w-[85vw] xl:max-w-[85vw] min-[2560px]:max-w-[75vw] px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Product Image Gallery */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right: Product Meta & Purchase Box */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-8 w-4/5 rounded-lg" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </div>

          {/* Pricing Box */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Variant Swatches */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-xl" />
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 w-14 rounded-2xl" />
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-2.5 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Admin Top Metric Stat Cards Skeleton (4 KPIs)
 */
export function AdminMetricsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 p-5 space-y-3 backdrop-blur-md shadow-xs dark:shadow-none"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-32 rounded-lg" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Admin Table Skeleton (For Orders, Inventory, Users, Visitors, etc.)
 */
export function AdminTableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 backdrop-blur-md shadow-xs dark:shadow-none">
      {/* Search & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Table Headers & Rows */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Header Row */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24 rounded" />
          ))}
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/40">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-between px-6 py-4">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <div key={colIndex} className="flex items-center gap-3">
                  {colIndex === 0 && <Skeleton className="h-9 w-9 rounded-lg" />}
                  <Skeleton
                    className={cn(
                      'h-4 rounded',
                      colIndex === 0 ? 'w-32' : colIndex === cols - 1 ? 'w-20' : 'w-24'
                    )}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Bar Skeleton */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-36 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/**
 * Parcel Tracking Timeline Skeleton (Track Page)
 */
export function TrackingTimelineSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Search Tracker Input */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 space-y-4 backdrop-blur-md shadow-xs dark:shadow-none">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <div className="flex gap-3 max-w-xl mx-auto pt-2">
          <Skeleton className="h-12 flex-1 rounded-2xl" />
          <Skeleton className="h-12 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Tracking Result Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 space-y-8 backdrop-blur-md shadow-xs dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-7 w-48" />
          </div>
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>

        {/* Stepper Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Courier / Rider Info */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * User Profile & Account Vault Skeleton
 */
export function ProfileVaultSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs dark:shadow-none">
        <div className="flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-44 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-16 w-32 rounded-2xl" />
          <Skeleton className="h-16 w-32 rounded-2xl" />
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="space-y-6">
        <div className="flex gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <AdminTableSkeleton rows={4} cols={4} />
      </div>
    </div>
  );
}

/**
 * Backward compatibility SkeletonCard
 */
export function SkeletonCard() {
  return <ProductCardSkeleton />;
}
