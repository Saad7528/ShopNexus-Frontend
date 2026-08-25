'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface BundleProduct {
  _id: string;
  title: string;
  price: number;
  discountPrice?: number;
  images: string[];
}

interface FrequentlyBoughtTogetherProps {
  mainProduct: BundleProduct;
  complementaryProducts: BundleProduct[];
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  mainProduct,
  complementaryProducts,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    mainProduct._id,
    ...complementaryProducts.map((p) => p._id),
  ]);

  const { addItem, openDrawer } = useCartStore();

  const allItems = [mainProduct, ...complementaryProducts];
  const activeItems = allItems.filter((item) => selectedIds.includes(item._id));

  const rawTotal = activeItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price),
    0
  );
  // 15% extra bundle discount
  const isAllSelected = selectedIds.length === allItems.length;
  const bundleDiscount = isAllSelected ? Math.round(rawTotal * 0.15) : 0;
  const finalPrice = rawTotal - bundleDiscount;

  const toggleItem = (id: string) => {
    if (id === mainProduct._id) return; // Main product cannot be unselected
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddBundleToCart = () => {
    activeItems.forEach((item) => {
      addItem({
        productId: item._id,
        title: item.title,
        price: item.discountPrice || item.price,
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
        quantity: 1,
        stock: 20,
        vendorName: 'ShopNexus Official Store',
      });
    });
    openDrawer();
  };

  if (complementaryProducts.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Frequently Bought Together (Smart Bundle)</h3>
        </div>
        {isAllSelected && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Tag className="w-3.5 h-3.5" /> 15% Bundle Discount Applied
          </span>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6 justify-between">
        {/* Visual Item Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full lg:w-auto">
          {allItems.map((item, idx) => {
            const isSelected = selectedIds.includes(item._id);
            return (
              <React.Fragment key={item._id}>
                {idx > 0 && <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                <div
                  onClick={() => toggleItem(item._id)}
                  className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer flex-shrink-0 shadow-xs ${
                    isSelected
                      ? 'bg-orange-500/10 dark:bg-orange-500/15 border-orange-500 ring-2 ring-orange-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Image
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[80px]">
                      {item.title}
                    </p>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      ৳{(item.discountPrice || item.price).toLocaleString()}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Pricing Summary & Action */}
        <div className="w-full lg:w-72 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 flex-shrink-0 shadow-xs">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Bundle Price (৳ BDT):</p>
            <div className="flex items-baseline gap-2 mt-0.5 font-mono">
              <span className="text-2xl font-black text-slate-900 dark:text-white">৳{finalPrice.toLocaleString()}</span>
              {bundleDiscount > 0 && (
                <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-normal">
                  ৳{rawTotal.toLocaleString()}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                You save ৳{bundleDiscount.toLocaleString()} with bundle!
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddBundleToCart}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] hover:from-[#e63d00] hover:to-[#ff6600] text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Add Bundle ({selectedIds.length} Items)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
