import React from 'react';
import { ProfileVaultSkeleton } from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 transition-colors duration-200">
      <ProfileVaultSkeleton />
    </div>
  );
}
