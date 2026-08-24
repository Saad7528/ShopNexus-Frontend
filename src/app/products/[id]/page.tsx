'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ReviewForm } from '@/components/products/ReviewForm';
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Check,
  Store,
  Zap,
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState('Midnight Black');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Mock product data (strictly typed)
  const product = {
    id: productId,
    name: 'Nexus Pro Wireless ANC Headphones (Gen 2)',
    brand: 'Nexus Audio',
    vendorId: 'vendor_001',
    vendorName: 'Nexus Tech Official Store',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    stockCount: 18,
    category: 'Audio & Acoustics',
    description:
      'Engineered with hybrid active noise cancellation, custom 40mm beryllium drivers, 45-hour ultra battery life, and plush memory foam earcups for exceptional acoustic clarity and luxury comfort.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    colors: ['Midnight Black', 'Space Gray', 'Lunar Silver'],
    sizes: ['Standard', 'XL Foam Cup'],
  };

  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Farhan Rahman',
      rating: 5,
      date: '2 days ago',
      comment: 'The noise cancellation is on par with the best flagship headphones on the market. Soundstage is deep and battery easily lasted me 4 days of heavy work!',
    },
    {
      id: 'rev-2',
      author: 'Tariqul Islam',
      rating: 5,
      date: '1 week ago',
      comment: 'Super fast delivery and premium packaging. Build quality is solid titanium and aluminum.',
    },
  ]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: `${product.name} (${selectedColor}, ${selectedSize})`,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stockCount,
      vendorName: product.vendorName,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleReviewSubmitted = (newRev: { rating: number; comment: string; author: string }) => {
    setReviews([
      {
        id: `rev-${Date.now()}`,
        author: newRev.author,
        rating: newRev.rating,
        date: 'Just now',
        comment: newRev.comment,
      },
      ...reviews,
    ]);
  };

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Link href="/products" className="hover:text-white inline-flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <span>/</span>
          <span className="text-slate-500">{product.category}</span>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery (5 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Product Info & Purchase Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {product.brand}
                </span>
                <Link
                  href={`/shop/${product.vendorId}`}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" /> Sold by <span className="font-semibold text-white underline">{product.vendorName}</span>
                </Link>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> In Stock ({product.stockCount} left)
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 pt-2 font-mono">
                <span className="text-3xl md:text-4xl font-black text-white">
                  ৳{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-slate-500 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 font-sans">
                  Save ৳{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed pt-2">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2 pt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Color: <span className="text-white">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === color
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Edition / Size: <span className="text-white">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        selectedSize === size
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl bg-slate-800 border border-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs shadow-md transition-all active:scale-[0.99] cursor-pointer border border-slate-700"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Added! ✓
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-slate-300" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    router.push('/checkout');
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/25 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  ⚡ সরাসরি অর্ডার করুন (৳{(product.price * quantity).toLocaleString()})
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      category: product.category,
                      inStock: product.inStock,
                    })
                  }
                  className={`p-3.5 rounded-xl border transition-all ${
                    isFavorite
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Assurance badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center gap-1 text-[11px] text-slate-400">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2 Years Warranty</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col items-center gap-1 text-[11px] text-slate-400">
                  <RotateCcw className="w-4 h-4 text-purple-400" />
                  <span>30 Days Free Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Customer Reviews & Ratings</h2>
            <p className="text-slate-400 text-sm mt-1">Real feedback from verified purchasers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <ReviewForm productId={product.id} onReviewSubmitted={handleReviewSubmitted} />
            </div>

            <div className="lg:col-span-7 space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{rev.author}</span>
                      <span className="text-xs text-slate-500 ml-2">● {rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
