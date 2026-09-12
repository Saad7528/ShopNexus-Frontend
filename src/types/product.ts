export type ProductCategory =
  | 'Audio'
  | 'Wearables'
  | 'Peripherals'
  | 'Smart Home'
  | 'Creator Gear'
  | 'Gaming'
  | 'Accessories';

export interface ProductTrustBadges {
  isOfficialStore?: boolean;
  warrantyMonths?: number;
  freeShipping?: boolean;
  expressDelivery?: boolean;
  verifiedBuyerRating?: number;
  hasFastDelivery?: boolean;
  hasWarranty?: boolean;
  warrantyText?: string;
  hasReturnPolicy?: boolean;
  isOfficialGenuine?: boolean;
}

export interface IProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  helpfulCount?: number;
  status?: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  sku?: string;
  color?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  title_en?: string;
  title_bn?: string;
  slug?: string;
  description: string;
  description_en?: string;
  description_bn?: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  images: string[];
  vendorName?: string;
  vendorId?: string;
  isFlashSale?: boolean;
  flashSaleDiscountPercent?: number;
  averageRating?: number;
  rating?: number;
  totalReviews?: number;
  tags?: string[];
  specs?: Record<string, string>;
  variants?: ProductVariant[];
  trustBadges?: ProductTrustBadges;
  createdAt?: string;
  updatedAt?: string;
}


export interface ProductFilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedBrand: string;
  priceRange: [number, number];
  minRating: number;
  inStockOnly: boolean;
  isFlashSaleOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';
}
