import React from 'react';
import { AdminMetricsSkeleton, AdminTableSkeleton } from '@/components/ui/Skeleton';

export default function AdminInventoryLoading() {
  return (
    <div className="space-y-8 p-6">
      <AdminMetricsSkeleton count={4} />
      <AdminTableSkeleton rows={8} cols={6} />
    </div>
  );
}
