'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Heart, Share2, Check } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  productId?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, productId }) => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isFavorite = productId ? isInWishlist(productId) : false;

  const activeImage = images[selectedIndex] || images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800';

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: productName,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (productId) {
      toggleWishlist({
        id: productId,
        name: productName,
        price: 0,
        image: activeImage,
        category: 'Electronics',
        inStock: true,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Image Display with Floating Top Glass Controls */}
      <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl group">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* 🌟 Floating Top Glass Controls (Directly on the Image) */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-10">
          {/* Top-Left: Floating Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-lg active:scale-90 transition-all cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Top-Right: Floating Home, Share & Wishlist Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-lg active:scale-90 transition-all cursor-pointer"
              title="Share Product"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {productId && (
              <button
                type="button"
                onClick={handleWishlist}
                className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border shadow-lg active:scale-90 transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-black/50 hover:bg-black/75 text-white border-white/20'
                }`}
                title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}

            <Link
              href="/"
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 shadow-lg active:scale-90 transition-all"
              title="ShopNexus Home"
            >
              <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 cursor-pointer ${
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
