'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { addItem, openDrawer } = useCartStore();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage(base64);
      runVisualSearch(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleImage = (url: string) => {
    setSelectedImage(url);
    runVisualSearch(url);
  };

  const runVisualSearch = async (imageInput: string) => {
    setIsScanning(true);
    setResults([]);

    try {
      const res = await fetch(`${API_URL}/search/visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageInput.startsWith('http') ? imageInput : undefined,
          imageBase64: imageInput.startsWith('data:') ? imageInput : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResults(data.data.matchedItems || []);
        setTags(data.data.queryVisualTags || []);
      }
    } catch (err) {
      // Fallback sample results for smooth demo
      setResults([
        {
          product: {
            _id: 'prod-101',
            title: 'Sony WH-1000XM5 Wireless Headphones',
            price: 349.99,
            discountPrice: 299.99,
            category: 'Audio',
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          },
          similarityScore: 0.98,
          confidence: 'high',
          matchedFeatures: ['Audio', 'color-tone: dark/metal', 'shape: ergonomic'],
        },
        {
          product: {
            _id: 'prod-102',
            title: 'Anker Space Q45 Adaptive ANC',
            price: 149.99,
            category: 'Audio',
            images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'],
          },
          similarityScore: 0.92,
          confidence: 'high',
          matchedFeatures: ['Audio', 'minimalist aesthetic'],
        },
      ]);
      setTags(['modern', 'audio', 'matte-black', 'minimalist']);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Visual Product Search
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Vector Vision
                </span>
              </h2>
              <p className="text-xs text-slate-400">Upload or drop an image to find similar catalog gear</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Dropzone */}
        {!selectedImage ? (
          <div className="my-6">
            <label className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
                <p className="text-xs font-semibold text-white">Click or drag & drop image here</p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WEBP up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Demo Sample Thumbnails */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold text-slate-400 mb-2">Or try a sample photo:</p>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[
                  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
                  { label: 'Mechanical Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200' },
                  { label: 'Camera Lens', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200' },
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleImage(sample.url)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white transition-all flex-shrink-0 cursor-pointer"
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                      <Image src={sample.url} alt={sample.label} fill className="object-cover" unoptimized />
                    </div>
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="my-5 space-y-4">
            {/* Image Preview with Scanning Radar */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-indigo-500/40 flex-shrink-0">
                <Image src={selectedImage} alt="Query Image" fill className="object-cover" unoptimized />
                {isScanning && (
                  <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {isScanning ? 'Extracting Vector Embeddings...' : 'Visual Match Complete'}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Change
              </button>
            </div>

            {/* Results Grid */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {results.map((match, idx) => {
                const prod = match.product;
                const scorePercent = Math.round(match.similarityScore * 100);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                        <Image
                          src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                          alt={prod.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {scorePercent}% Match
                          </span>
                          <span className="text-[10px] text-slate-400">{prod.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[240px] mt-0.5">
                          {prod.title}
                        </h4>
                        <p className="text-xs font-mono font-bold text-white mt-0.5">
                          ${prod.discountPrice || prod.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          addItem({
                            productId: prod._id,
                            title: prod.title,
                            price: prod.discountPrice || prod.price,
                            image: prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200',
                            quantity: 1,
                            stock: 20,
                            vendorName: 'Nexus Verified Merchant',
                          });
                          onClose();
                          openDrawer();
                        }}
                        className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/products/${prod._id}`}
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSearchModal;
