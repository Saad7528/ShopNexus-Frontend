// Rating Breakdown Statistics Model
export interface IRatingBreakdownSummary { averageRating: number; totalReviews: number; starFrequencies: Record<1 | 2 | 3 | 4 | 5, number>; recommendationPercentage: number; }
