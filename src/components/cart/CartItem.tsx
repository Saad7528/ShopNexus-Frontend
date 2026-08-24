'use client';

import React from 'react';
import Image from 'next/image';
import { CartItemType, useCartStore } from '@/store/useCartStore';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const isMaxStock = item.quantity >= item.stock;
  const isLowStock = item.stock <= 5;

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-slate-800/80 items-center">
      {/* Product Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
        <Image
          src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Info & Counter */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">{item.title}</h4>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-slate-500 hover:text-rose-400 p-1 transition-colors flex-shrink-0"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-slate-400">{item.vendorName}</span>
          {isLowStock && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
              <AlertCircle className="w-2.5 h-2.5" /> Only {item.stock} left
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-xs font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
            {item.quantity > 1 && (
              <span className="text-[10px] text-slate-500">(৳{item.price.toLocaleString()}/ea)</span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-white px-2 min-w-[20px] text-center">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={isMaxStock}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={isMaxStock ? 'Maximum available stock reached' : 'Increase quantity'}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
