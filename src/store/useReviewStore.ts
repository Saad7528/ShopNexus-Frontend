import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';

export interface ISellerReply {
  author: string;
  role: string;
  comment: string;
  date: string;
}

export interface IReviewItem {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  author: string;
  authorEmail: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  images: string[];
  date: string;
  timestamp: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  helpfulVotes: string[]; // List of user IDs who voted helpful
  sellerReply?: ISellerReply;
}

export type ModerationMode = 'AUTO_24H' | 'INSTANT' | 'MANUAL';

interface ReviewStoreState {
  reviews: IReviewItem[];
  moderationMode: ModerationMode;
  addReview: (reviewData: Omit<IReviewItem, 'id' | 'timestamp' | 'date' | 'status' | 'helpfulVotes'>) => { id: string; coinsEarned: number; status: 'APPROVED' | 'PENDING' };
  editReview: (reviewId: string, userId: string, rating: number, comment: string, images: string[], isAdmin?: boolean) => boolean;
  deleteReview: (reviewId: string, userId: string, isAdmin?: boolean) => boolean;
  toggleHelpfulVote: (reviewId: string, userId: string) => boolean;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  addSellerReply: (reviewId: string, replyComment: string, authorName?: string, role?: string) => void;
  deleteSellerReply: (reviewId: string) => void;
  setModerationMode: (mode: ModerationMode) => void;
  getProductReviews: (productId: string, currentUserId?: string, isAdmin?: boolean) => IReviewItem[];
}

const INITIAL_REVIEWS: IReviewItem[] = [
  {
    id: 'rev-demo-1',
    productId: 'p1',
    productName: 'Sony WH-1000XM5 Wireless ANC Headphones',
    userId: 'usr-farhan-1',
    author: 'Farhan Rahman',
    authorEmail: 'farhan.audio@gmail.com',
    rating: 5,
    comment: 'অসাধারণ প্রিমিয়াম সাউন্ড কোয়ালিটি! অ্যাক্টিভ নয়েজ ক্যান্সেলেশন এক কথায় অতুলনীয়। ডেলিভারি ২৪ ঘণ্টার মধ্যে পেয়েছি।',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    ],
    date: '২ দিন আগে',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'APPROVED',
    helpfulVotes: ['usr-tanvir', 'usr-sarah', 'usr-demo-3'],
    sellerReply: {
      author: 'ShopNexus Official Support',
      role: 'Verified Merchant',
      comment: 'ধন্যবাদ ফারহান ভাই! আপনার সন্তুষ্টিই আমাদের প্রধান অগ্রাধিকার। যেকোনো সহযোগিতায় আমরা আছি ২৪/৭।',
      date: '১ দিন আগে',
    },
  },
  {
    id: 'rev-demo-2',
    productId: 'p1',
    productName: 'Sony WH-1000XM5 Wireless ANC Headphones',
    userId: 'usr-tariqul-2',
    author: 'Tariqul Islam',
    authorEmail: 'tariqul.dev@gmail.com',
    rating: 5,
    comment: 'Super fast delivery in Dhaka and 100% genuine sealed box. Microphone clarity on Zoom calls is crisp. Highly recommended!',
    images: [],
    date: '১ সপ্তাহ আগে',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    status: 'APPROVED',
    helpfulVotes: ['usr-farhan-1'],
  },
  {
    id: 'rev-demo-3',
    productId: 'p2',
    productName: 'Apple Watch Ultra 2 Titanium Smartwatch',
    userId: 'usr-sarah-3',
    author: 'Sarah Rahman',
    authorEmail: 'sarah.audio@gmail.com',
    rating: 5,
    comment: 'Real aerospace grade titanium! Battery lasts over 3 days on a single charge. Official warranty included.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    ],
    date: '৩ দিন আগে',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    status: 'APPROVED',
    helpfulVotes: ['usr-farhan-1', 'usr-tariqul-2'],
    sellerReply: {
      author: 'ShopNexus Gadgets',
      role: 'Verified Store',
      comment: 'Thank you Sarah for your wonderful review! Enjoy your Apple Watch Ultra 2.',
      date: '২ দিন আগে',
    },
  },
  {
    id: 'rev-demo-4',
    productId: 'p3',
    productName: 'Logitech MX Master 3S Wireless Mouse',
    userId: 'usr-kazi-4',
    author: 'Kazi Mahbub',
    authorEmail: 'mahbub.photo@yahoo.com',
    rating: 4,
    comment: 'The magspeed scroll wheel is lightning fast and silent clicks feel great for coding and photo editing.',
    images: [],
    date: '৪ দিন আগে',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    status: 'APPROVED',
    helpfulVotes: [],
  },
];

export const useReviewStore = create<ReviewStoreState>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_REVIEWS,
      moderationMode: 'AUTO_24H',

      addReview: (reviewData) => {
        const id = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const now = Date.now();
        const mode = get().moderationMode;
        
        // In instant mode -> APPROVED immediately. In AUTO_24H/MANUAL -> PENDING initially
        const initialStatus: 'APPROVED' | 'PENDING' = mode === 'INSTANT' ? 'APPROVED' : 'PENDING';

        const newReview: IReviewItem = {
          ...reviewData,
          id,
          date: 'এইমাত্র',
          timestamp: now,
          status: initialStatus,
          helpfulVotes: [],
        };

        set((state) => ({
          reviews: [newReview, ...state.reviews],
        }));

        // Reward customer with +10 Nexus Coins for submitting verified review!
        const authState = useAuthStore.getState();
        if (authState.user && typeof authState.addCoins === 'function') {
          authState.addCoins(10);
        }

        return { id, coinsEarned: 10, status: initialStatus };
      },

      editReview: (reviewId, userId, rating, comment, images, isAdmin = false) => {
        const review = get().reviews.find((r) => r.id === reviewId);
        if (!review) return false;

        // Security check: Only author or Admin can edit
        if (review.userId !== userId && !isAdmin) {
          return false;
        }

        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  rating,
                  comment,
                  images,
                  date: 'সম্পাদিত (Edited)',
                  timestamp: Date.now(),
                }
              : r
          ),
        }));
        return true;
      },

      deleteReview: (reviewId, userId, isAdmin = false) => {
        const review = get().reviews.find((r) => r.id === reviewId);
        if (!review) return false;

        // Security check: Only author or Admin can delete
        if (review.userId !== userId && !isAdmin) {
          return false;
        }

        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
        return true;
      },

      toggleHelpfulVote: (reviewId, userId) => {
        if (!userId) return false;
        set((state) => ({
          reviews: state.reviews.map((r) => {
            if (r.id !== reviewId) return r;
            const hasVoted = r.helpfulVotes.includes(userId);
            const updatedVotes = hasVoted
              ? r.helpfulVotes.filter((id) => id !== userId)
              : [...r.helpfulVotes, userId];
            return { ...r, helpfulVotes: updatedVotes };
          }),
        }));
        return true;
      },

      approveReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, status: 'APPROVED' } : r
          ),
        }));
      },

      rejectReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, status: 'REJECTED' } : r
          ),
        }));
      },

      addSellerReply: (reviewId, replyComment, authorName = 'ShopNexus Official Support', role = 'Verified Merchant') => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  sellerReply: {
                    author: authorName,
                    role,
                    comment: replyComment,
                    date: 'এইমাত্র',
                  },
                }
              : r
          ),
        }));
      },

      deleteSellerReply: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId ? { ...r, sellerReply: undefined } : r
          ),
        }));
      },

      setModerationMode: (mode) => {
        set({ moderationMode: mode });
      },

      getProductReviews: (productId, currentUserId, isAdmin = false) => {
        const all = get().reviews.filter(
          (r) =>
            r.productId === productId ||
            r.productName?.toLowerCase().includes(productId.toLowerCase())
        );

        // Auto-approve after 24 hours check for AUTO_24H mode
        const now = Date.now();
        const effectiveList = all.map((r) => {
          if (r.status === 'PENDING' && get().moderationMode === 'AUTO_24H') {
            const hoursPassed = (now - r.timestamp) / (1000 * 60 * 60);
            if (hoursPassed >= 24) {
              return { ...r, status: 'APPROVED' as const };
            }
          }
          return r;
        });

        // Filter: Public visitors see ONLY 'APPROVED'.
        // The author who submitted sees their own 'PENDING' review.
        // Admin sees all reviews.
        return effectiveList.filter((r) => {
          if (isAdmin) return true;
          if (r.status === 'APPROVED') return true;
          if (r.status === 'PENDING' && currentUserId && r.userId === currentUserId) return true;
          return false;
        });
      },
    }),
    {
      name: 'shopnexus_product_reviews_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
