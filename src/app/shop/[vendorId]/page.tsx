import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, ArrowLeft, Star, ShoppingCart } from 'lucide-react';

interface ShopPageProps {
  params: Promise<{ vendorId: string }>;
}

export default async function VendorShopPage({ params }: ShopPageProps) {
  const resolvedParams = await params;
  const vendorId = resolvedParams.vendorId;

  // Mock Vendor Catalog Data
  const vendorInfo = {
    id: vendorId,
    name: 'Nexus Tech Official',
    description: 'Premier authorized merchant delivering flagship electronics, next-gen smart wearables, and audiophile gear.',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
    logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    email: 'support@nexustech.io',
    rating: 4.9,
    reviewsCount: 328,
  };

  const storeProducts = [
    {
      id: 'prod_1',
      name: 'Nexus Pro Wireless ANC Headphones',
      category: 'Audio',
      price: 299.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_2',
      name: 'Ultra Titanium Smartwatch Series 9',
      category: 'Wearables',
      price: 399.00,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod_3',
      name: 'Mechanical RGB Gaming Keyboard (Tactile)',
      category: 'Accessories',
      price: 149.50,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white pb-16">
      {/* Header Banner */}
      <div className="relative h-64 md:h-80 w-full bg-slate-800">
        <Image
          src={vendorInfo.banner}
          alt={vendorInfo.name}
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/40 to-transparent" />
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-sm font-medium hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>
      </div>

      {/* Vendor Profile Summary Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-20 relative z-10">
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-indigo-500 bg-slate-800 shadow-xl flex-shrink-0">
              <Image
                src={vendorInfo.logo}
                alt={vendorInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">{vendorInfo.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">{vendorInfo.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendorInfo.rating} ({vendorInfo.reviewsCount} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> {vendorInfo.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Storefront Products Grid */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">Store Catalog ({storeProducts.length} Items)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl bg-slate-900/60 border border-white/10 hover:border-indigo-500/50 p-4 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="relative h-52 w-full rounded-xl overflow-hidden bg-slate-800 mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1 mt-1">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <span className="text-lg font-black text-white">${product.price.toFixed(2)}</span>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
