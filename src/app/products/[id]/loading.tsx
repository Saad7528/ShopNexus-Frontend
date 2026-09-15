import React from 'react';
import { ProductDetailSkeleton } from '@/components/ui/Skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 transition-colors duration-200">
      <ProductDetailSkeleton />
    </div>
  );
}
