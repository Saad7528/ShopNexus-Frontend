import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IBundleDeal, INITIAL_BUNDLES } from '@/data/bundles';
import { Product } from './useProductStore';

export function convertBundleToProduct(b: IBundleDeal): Product {
  const discountPercent =
    b.originalTotal > b.bundlePrice
      ? Math.round(((b.originalTotal - b.bundlePrice) / b.originalTotal) * 100)
      : 15;

  let bundleImages = b.items.map((it) => it.image).filter(Boolean);
  if (b.id === 'b-1' || b.id === 'combo-1') {
    bundleImages = ['/images/combos/combo-1.jpg', ...bundleImages];
  } else if (b.id === 'b-2' || b.id === 'combo-2') {
    bundleImages = ['/images/combos/combo-2.jpg', ...bundleImages];
  } else if (b.id === 'b-3' || b.id === 'combo-3') {
    bundleImages = ['/images/combos/combo-3.jpg', ...bundleImages];
  }

  return {
    _id: b.id,
    title: b.title,
    slug: b.id,
    description: b.description || 'Special curated hardware combo bundle.',
    category: 'Combo Packages',
    brand: 'ShopNexus Official',
    price: b.originalTotal,
    discountPrice: b.bundlePrice,
    stock: 20,
    images: bundleImages,
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: discountPercent,
    averageRating: 5.0,
    totalReviews: (b.salesCount || 10) * 2 + 15,
    tags: ['combo', 'bundle', 'special-offer', 'savings'],
  };
}

interface BundleState {
  bundles: IBundleDeal[];
  addBundle: (bundle: IBundleDeal) => void;
  updateBundle: (id: string, updated: Partial<IBundleDeal>) => void;
  deleteBundle: (id: string) => void;
}

export const useBundleStore = create<BundleState>()(
  persist(
    (set) => ({
      bundles: INITIAL_BUNDLES,

      addBundle: (newBundle) =>
        set((state) => ({
          bundles: [newBundle, ...state.bundles],
        })),

      updateBundle: (id, updated) =>
        set((state) => ({
          bundles: state.bundles.map((b) => (b.id === id ? { ...b, ...updated } : b)),
        })),

      deleteBundle: (id) =>
        set((state) => ({
          bundles: state.bundles.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'shopnexus_bundle_store',
    }
  )
);
