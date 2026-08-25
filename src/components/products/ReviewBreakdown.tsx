'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface ReviewBreakdownProps {
  averageRating: number;
  totalReviews: number;
  distribution: { [key: number]: number }; // e.g. { 5: 80, 4: 30, 3: 10, 2: 5, 1: 3 }
}

export const ReviewBreakdown: React.FC<ReviewBreakdownProps> = ({
  averageRating = 4.8,
  totalReviews = 128,
  distribution = { 5: 92, 4: 24, 3: 8, 2: 3, 1: 1 },
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-sm space-y-5">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <span className="text-4xl font-black text-slate-900 dark:text-white">{averageRating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5 text-amber-400 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{totalReviews} verified reviews</p>
        </div>

        <div className="flex-1 space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-semibold text-slate-700 dark:text-slate-300">{rating}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-slate-500 dark:text-slate-400">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
