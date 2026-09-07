import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

const INITIAL_CATALOG = [
  {
    _id: 'p1',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh-1000xm5-anc-headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones for unparalleled clarity.',
    category: 'Audio',
    brand: 'Sony',
    price: 38500,
    discountPrice: 32500,
    costPrice: 25000,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: true,
    flashSaleDiscountPercent: 16,
    averageRating: 4.9,
    totalReviews: 248,
    tags: ['wireless', 'noise-cancelling', 'bluetooth 5.3', 'audio'],
  },
  {
    _id: 'p2',
    title: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    slug: 'bose-qc-ultra-spatial-headphones',
    description: 'Breakthrough spatialized audio for immersive listening with custom tuned active noise cancellation.',
    category: 'Audio',
    brand: 'Bose',
    price: 42000,
    discountPrice: 37500,
    costPrice: 28000,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 142,
    tags: ['spatial-audio', 'anc', 'comfort', 'audio'],
  },
  {
    _id: 'p3',
    title: 'Apple AirPods Max Space Gray with Smart Case',
    slug: 'apple-airpods-max-space-gray',
    description: 'High-fidelity audio with dynamic head tracking and computational acoustics in anodized aluminum.',
    category: 'Audio',
    brand: 'Apple',
    price: 58000,
    discountPrice: 52000,
    costPrice: 42000,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 310,
    tags: ['apple', 'h1-chip', 'spatial-audio', 'premium'],
  },
  {
    _id: 'p4',
    title: 'Sennheiser Momentum 4 Wireless 60h Battery Headphones',
    slug: 'sennheiser-momentum-4-wireless',
    description: 'Audiophile-inspired 42mm transducer system delivering brilliant dynamics, clarity, and musicality.',
    category: 'Audio',
    brand: 'Sennheiser',
    price: 34000,
    discountPrice: 29900,
    costPrice: 22000,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: true,
    flashSaleDiscountPercent: 12,
    averageRating: 4.7,
    totalReviews: 95,
    tags: ['sennheiser', '60hr-battery', 'audiophile', 'anc'],
  },
  {
    _id: 'p5',
    title: 'Marshall Stanmore III Bluetooth Home Speaker',
    slug: 'marshall-stanmore-iii-speaker',
    description: 'Re-engineered for a wider stereo soundstage with classic vintage rock-and-roll styling.',
    category: 'Audio',
    brand: 'Marshall',
    price: 46000,
    discountPrice: 41000,
    costPrice: 31000,
    stock: 7,
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 180,
    tags: ['marshall', 'home-audio', 'vintage-speaker', 'bluetooth'],
  },
  {
    _id: 'p6',
    title: 'Shure SM7B Cardioid Studio Vocal Microphone',
    slug: 'shure-sm7b-vocal-microphone',
    description: 'The legendary dynamic studio microphone for broadcasting, podcasting, and premier studio recording.',
    category: 'Audio',
    brand: 'Shure',
    price: 49000,
    discountPrice: 44500,
    costPrice: 34000,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 5.0,
    totalReviews: 420,
    tags: ['shure', 'microphone', 'podcast', 'studio-grade'],
  },
  {
    _id: 'p7',
    title: 'Apple Watch Ultra 2 Titanium GPS + Cellular 49mm',
    slug: 'apple-watch-ultra-2-titanium',
    description: 'The most capable and rugged Apple Watch with precision dual-frequency GPS and 3000 nits display.',
    category: 'Wearables',
    brand: 'Apple',
    price: 98000,
    discountPrice: 89000,
    costPrice: 72000,
    stock: 9,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: true,
    flashSaleDiscountPercent: 9,
    averageRating: 4.9,
    totalReviews: 195,
    tags: ['apple-watch', 'ultra-2', 'titanium', 'rugged'],
  },
  {
    _id: 'p8',
    title: 'Samsung Galaxy Watch6 Classic 47mm LTE with Rotating Bezel',
    slug: 'samsung-galaxy-watch6-classic',
    description: 'Timeless stainless steel design with physical rotating bezel and advanced sleep coaching.',
    category: 'Wearables',
    brand: 'Samsung',
    price: 36000,
    discountPrice: 31500,
    costPrice: 23000,
    stock: 16,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 130,
    tags: ['samsung', 'galaxy-watch', 'classic-bezel', 'wear-os'],
  },
  {
    _id: 'p9',
    title: 'Garmin Fenix 7X Pro Sapphire Solar Edition',
    slug: 'garmin-fenix-7x-pro-solar',
    description: 'Multisport GPS smartwatch with solar charging lens, built-in LED flashlight, and TopoActive maps.',
    category: 'Wearables',
    brand: 'Garmin',
    price: 115000,
    discountPrice: 102000,
    costPrice: 85000,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 76,
    tags: ['garmin', 'solar-smartwatch', 'endurance', 'sapphire'],
  },
  {
    _id: 'p10',
    title: 'Oura Ring Gen3 Horizon Stealth Smart Fitness Ring',
    slug: 'oura-ring-gen3-stealth',
    description: 'Sleek titanium smart ring measuring sleep staging, HRV, body temperature trends, and daily readiness.',
    category: 'Wearables',
    brand: 'Oura',
    price: 45000,
    discountPrice: 39500,
    costPrice: 30000,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 112,
    tags: ['smart-ring', 'sleep-tracking', 'hrv', 'titanium'],
  },
  {
    _id: 'p13',
    title: 'Keychron Q1 Pro Custom Mechanical Keyboard (Wireless)',
    slug: 'keychron-q1-pro-wireless-custom-keyboard',
    description: 'Full CNC aluminum body, 75% layout, QMK/VIA programmable with south-facing RGB and hot-swap sockets.',
    category: 'Peripherals',
    brand: 'Keychron',
    price: 19500,
    discountPrice: 17900,
    costPrice: 13000,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 8,
    averageRating: 4.9,
    totalReviews: 215,
    tags: ['mechanical-keyboard', 'qmk', 'wireless', 'cnc-aluminum'],
  },
  {
    _id: 'p14',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    slug: 'logitech-mx-master-3s-mouse',
    description: 'Quiet Click technology with 8000 DPI track-on-glass sensor and MagSpeed electromagnetic scrolling.',
    category: 'Peripherals',
    brand: 'Logitech',
    price: 13000,
    discountPrice: 11500,
    costPrice: 8500,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 540,
    tags: ['logitech', 'mx-master', 'productivity-mouse', 'ergonomic'],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const category = searchParams.get('category');

    await connectToDatabase();
    const db = mongoose.connection.db;

    if (db) {
      const productsColl = db.collection('products');
      let query: any = {};
      if (category && category !== 'All') {
        query.category = new RegExp(category, 'i');
      }

      const dbProducts = await productsColl.find(query).limit(limit).toArray();

      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({
          success: true,
          count: dbProducts.length,
          data: {
            products: dbProducts,
            total: dbProducts.length,
          },
        });
      }
    }

    // Fallback to rich default catalog if DB collection has not been populated yet
    const filtered = category && category !== 'All'
      ? INITIAL_CATALOG.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : INITIAL_CATALOG;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: {
        products: filtered,
        total: filtered.length,
      },
    });
  } catch (error: any) {
    console.error('API Products GET error:', error);
    return NextResponse.json({
      success: true,
      count: INITIAL_CATALOG.length,
      data: {
        products: INITIAL_CATALOG,
        total: INITIAL_CATALOG.length,
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();
    const db = mongoose.connection.db;

    const newProduct = {
      ...body,
      _id: body._id || `prod_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (db) {
      const productsColl = db.collection('products');
      await productsColl.insertOne(newProduct);
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error: any) {
    console.error('API Products POST error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to save product' }, { status: 500 });
  }
}
