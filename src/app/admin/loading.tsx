import React from 'react';
import { AdminMetricsSkeleton, AdminTableSkeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-8 p-6">
      <AdminMetricsSkeleton count={4} />
      <AdminTableSkeleton rows={6} cols={5} />
    </div>
  );
}
