'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeImage = images[selectedIndex] || images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl group">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 cursor-pointer ${
                selectedIndex === idx
                  ? 'border-orange-500 ring-2 ring-orange-500/40 scale-105'
                  : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${productName} thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
