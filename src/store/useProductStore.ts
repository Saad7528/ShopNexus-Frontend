import { create } from 'zustand';

export interface ProductTrustBadges {
  hasFastDelivery?: boolean; // ২৪ ঘণ্টায় ডেলিভারি
  hasWarranty?: boolean; // অফিসিয়াল ওয়ারেন্টি
  warrantyText?: string; // e.g. '১ বছরের অফিসিয়াল ওয়ারেন্টি'
  hasReturnPolicy?: boolean; // ৭ দিনের রিটার্ন পলিসি
  isOfficialGenuine?: boolean; // ১০০% জেনুইন প্রোডাক্ট
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  vendorName: string;
  isFlashSale: boolean;
  flashSaleDiscountPercent?: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  trustBadges?: ProductTrustBadges;
}

interface ProductFilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: string;
  isFlashSale: boolean;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setBrand: (brand: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sortBy: string) => void;
  setIsFlashSale: (isFlashSale: boolean) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductFilterState>((set) => ({
  search: '',
  category: '',
  brand: '',
  minPrice: 0,
  maxPrice: 150000,
  minRating: 0,
  sortBy: 'newest',
  isFlashSale: false,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setBrand: (brand) => set({ brand }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setMinRating: (minRating) => set({ minRating }),
  setSortBy: (sortBy) => set({ sortBy }),
  setIsFlashSale: (isFlashSale) => set({ isFlashSale }),
  resetFilters: () =>
    set({
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 150000,
      minRating: 0,
      sortBy: 'newest',
      isFlashSale: false,
    }),
}));
