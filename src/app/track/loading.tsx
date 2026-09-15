import React from 'react';
import { TrackingTimelineSkeleton } from '@/components/ui/Skeleton';

export default function TrackLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 transition-colors duration-200">
      <TrackingTimelineSkeleton />
    </div>
  );
}
