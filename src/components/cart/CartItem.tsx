'use client';

import React from 'react';
import Image from 'next/image';
import { CartItemType, useCartStore } from '@/store/useCartStore';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b border-slate-800/80 items-center">
      {/* Product Thumbnail */}
      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-800">
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
          <h4 className="text-sm font-medium text-slate-100 line-clamp-1">{item.title}</h4>
          <button
            onClick={() => removeItem(item.productId)}
            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-0.5">{item.vendorName}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-white px-1.5">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
