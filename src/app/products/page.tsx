'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductCard } from '@/components/products/ProductCard';
import { useProductStore, Product } from '@/store/useProductStore';
import { useBundleStore, convertBundleToProduct } from '@/store/useBundleStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getLocalizedCategory } from '@/lib/localizedProducts';
import { toBengaliNumber } from '@/lib/translations';
import { Sparkles, PackageSearch, RotateCcw, Filter, SlidersHorizontal, X } from 'lucide-react';

const FALLBACK_PRODUCTS: Product[] = [
  // --- AUDIO & ACOUSTICS (6 Products) ---
  {
    _id: 'p1',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    slug: 'sony-wh-1000xm5-anc-headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones for unparalleled clarity.',
    category: 'Audio',
    brand: 'Sony',
    price: 38500,
    discountPrice: 32500,
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
    stock: 8,
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.9,
    totalReviews: 320,
    tags: ['apple', 'hifi', 'spatial-audio', 'audio'],
  },
  {
    _id: 'p4',
    title: 'Marshall Stanmore III Bluetooth Home Speaker',
    slug: 'marshall-stanmore-iii-speaker',
    description: 'Iconic vintage styling with wider soundstage, room-filling sound, and brass control dials.',
    category: 'Audio',
    brand: 'Marshall',
    price: 39000,
    discountPrice: 34500,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 96,
    tags: ['speaker', 'bluetooth', 'vintage', 'audio'],
  },
  {
    _id: 'p5',
    title: 'Sennheiser Momentum 4 Wireless Audiophile Headphones',
    slug: 'sennheiser-momentum-4-wireless',
    description: '60-hour battery life with audiophile-grade 42mm transducer system and adaptive noise cancellation.',
    category: 'Audio',
    brand: 'Sennheiser',
    price: 36000,
    discountPrice: 31000,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: true,
    flashSaleDiscountPercent: 14,
    averageRating: 4.8,
    totalReviews: 110,
    tags: ['audiophile', '60hr-battery', 'anc', 'audio'],
  },
  {
    _id: 'p6',
    title: 'Shure SM7B Dynamic Vocal Microphone for Podcasting',
    slug: 'shure-sm7b-dynamic-vocal-microphone',
    description: 'Smooth, flat, wide-range frequency response suitable for music and speech in all professional audio applications.',
    category: 'Audio',
    brand: 'Shure',
    price: 44000,
    discountPrice: 39000,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80'],
    vendorName: 'Apex Acoustic Studio',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 184,
    tags: ['microphone', 'studio', 'vocal', 'shure'],
  },

  // --- WEARABLES & WATCHES (6 Products) ---
  {
    _id: 'p7',
    title: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
    slug: 'apple-watch-ultra-2-49mm-titanium',
    description: 'Rugged titanium case, precision dual-frequency GPS, up to 36 hours battery life, and 3000-nit display.',
    category: 'Wearables',
    brand: 'Apple',
    price: 89000,
    discountPrice: 79900,
    stock: 10,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.9,
    totalReviews: 410,
    tags: ['smartwatch', 'apple', 'titanium', 'gps'],
  },
  {
    _id: 'p8',
    title: 'Samsung Galaxy Watch Ultra 47mm Titanium Gray',
    slug: 'samsung-galaxy-watch-ultra-47mm',
    description: 'Cushion design with Grade 4 titanium frame, dual-frequency GPS, and 10ATM water resistance.',
    category: 'Wearables',
    brand: 'Samsung',
    price: 64000,
    discountPrice: 56000,
    stock: 16,
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 120,
    tags: ['smartwatch', 'samsung', 'android', 'wearable'],
  },
  {
    _id: 'p9',
    title: 'Garmin Fenix 7X Pro Solar Sapphire Edition',
    slug: 'garmin-fenix-7x-pro-solar-sapphire',
    description: 'Multisport GPS watch with built-in LED flashlight, solar charging lens, and top-tier endurance metrics.',
    category: 'Wearables',
    brand: 'Garmin',
    price: 98000,
    discountPrice: 88000,
    stock: 7,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.9,
    totalReviews: 98,
    tags: ['garmin', 'solar', 'fitness', 'rugged'],
  },
  {
    _id: 'p10',
    title: 'Apple Watch Series 9 GPS 45mm Midnight Aluminum',
    slug: 'apple-watch-series-9-45mm-midnight',
    description: 'Powered by S9 SiP with Double Tap gesture, brighter display, and fast on-device Siri processing.',
    category: 'Wearables',
    brand: 'Apple',
    price: 48000,
    discountPrice: 42000,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 290,
    tags: ['apple-watch', 'series-9', 'fitness', 'smartwatch'],
  },
  {
    _id: 'p11',
    title: 'Garmin Forerunner 965 Premium Running Smartwatch',
    slug: 'garmin-forerunner-965-smartwatch',
    description: 'Brilliant AMOLED touchscreen display with titanium bezel, built-in mapping, and training readiness.',
    category: 'Wearables',
    brand: 'Garmin',
    price: 68000,
    discountPrice: 59000,
    stock: 11,
    images: ['https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: true,
    flashSaleDiscountPercent: 13,
    averageRating: 4.8,
    totalReviews: 85,
    tags: ['running', 'amoled', 'garmin', 'triathlon'],
  },
  {
    _id: 'p12',
    title: 'Whoop 4.0 Health, Fitness & Sleep Tracker Band',
    slug: 'whoop-4-health-fitness-tracker',
    description: 'Continuous biometric tracking monitoring physiological data including heart rate, HRV, and skin temp.',
    category: 'Wearables',
    brand: 'Whoop',
    price: 28000,
    discountPrice: 24000,
    stock: 19,
    images: ['https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&q=80'],
    vendorName: 'Titan Hardware Lab',
    isFlashSale: false,
    averageRating: 4.6,
    totalReviews: 160,
    tags: ['whoop', 'recovery', 'sleep-tracking', 'health'],
  },

  // --- WORKSPACE & PERIPHERALS (6 Products) ---
  {
    _id: 'p13',
    title: 'Keychron Q1 Pro Custom Mechanical Keyboard (Wireless)',
    slug: 'keychron-q1-pro-wireless-custom-keyboard',
    description: 'Full CNC aluminum body, 75% layout, QMK/VIA programmable with south-facing RGB and hot-swap sockets.',
    category: 'Peripherals',
    brand: 'Keychron',
    price: 19500,
    discountPrice: 17900,
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
    stock: 35,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 540,
    tags: ['mouse', 'ergonomic', 'mx-master', 'productivity'],
  },
  {
    _id: 'p15',
    title: 'Logitech MX Mechanical Wireless Illuminated Keyboard',
    slug: 'logitech-mx-mechanical-keyboard',
    description: 'Low-profile mechanical switches, smart backlighting, and multi-device Bluetooth Easy-Switch.',
    category: 'Peripherals',
    brand: 'Logitech',
    price: 18500,
    discountPrice: 16200,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 12,
    averageRating: 4.8,
    totalReviews: 180,
    tags: ['low-profile', 'mechanical', 'logitech', 'wireless'],
  },
  {
    _id: 'p16',
    title: 'Razer DeathStalker V2 Pro Wireless RGB Optical Keyboard',
    slug: 'razer-deathstalker-v2-pro-keyboard',
    description: 'Ultra-slim optical gaming keyboard with Razer HyperSpeed Wireless and linear optical switches.',
    category: 'Peripherals',
    brand: 'Razer',
    price: 24000,
    discountPrice: 21500,
    stock: 9,
    images: ['https://images.unsplash.com/photo-1541140532154-b024d705b909?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.7,
    totalReviews: 95,
    tags: ['razer', 'optical-switch', 'gaming', 'rgb'],
  },
  {
    _id: 'p17',
    title: 'Apple Magic Trackpad 3 Multi-Touch Surface (Black)',
    slug: 'apple-magic-trackpad-3-black',
    description: 'Wireless and rechargeable, it brings the full range of Force Touch gestures to your desktop setup.',
    category: 'Peripherals',
    brand: 'Apple',
    price: 16500,
    discountPrice: 14800,
    stock: 22,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.8,
    totalReviews: 130,
    tags: ['apple', 'trackpad', 'force-touch', 'peripherals'],
  },
  {
    _id: 'p18',
    title: 'Razer Viper V3 Pro Ultra-Lightweight Wireless Mouse',
    slug: 'razer-viper-v3-pro-mouse',
    description: '54g esports design featuring Focus Pro 35K Gen-2 Optical Sensor and true 8000Hz polling rate.',
    category: 'Peripherals',
    brand: 'Razer',
    price: 17500,
    discountPrice: 15500,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 210,
    tags: ['esports', 'lightweight', '8000hz', 'razer'],
  },

  // --- CREATOR & SMART HARDWARE (12 Products) ---
  {
    _id: 'p19',
    title: 'Apple Studio Display 27-inch 5K Retina (Tilt-Adjustable)',
    slug: 'apple-studio-display-27-5k',
    description: '5K Retina display with 12MP Ultra Wide camera with Center Stage, studio-quality mics, and 6 speakers.',
    category: 'Creator Gear',
    brand: 'Apple',
    price: 185000,
    discountPrice: 169000,
    stock: 6,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 88,
    tags: ['5k', 'retina', 'apple', 'studio-display'],
  },
  {
    _id: 'p20',
    title: 'Sony Alpha a7 IV Full-Frame Mirrorless Hybrid Camera',
    slug: 'sony-alpha-a7-iv-camera',
    description: '33MP Exmor R CMOS sensor with 4K 60p 10-bit video, real-time Eye AF, and S-Cinetone color science.',
    category: 'Creator Gear',
    brand: 'Sony',
    price: 260000,
    discountPrice: 235000,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    averageRating: 4.9,
    totalReviews: 310,
    tags: ['camera', '4k-video', 'full-frame', 'sony'],
  },
  {
    _id: 'p21',
    title: 'DJI Osmo Pocket 3 Creator Combo 4K Handheld Gimbal',
    slug: 'dji-osmo-pocket-3-creator-combo',
    description: '1-inch CMOS sensor, 4K/120fps recording, 2-inch rotatable OLED screen, and 3-axis mechanical stabilization.',
    category: 'Creator Gear',
    brand: 'DJI',
    price: 62000,
    discountPrice: 55000,
    stock: 14,
    images: ['https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 11,
    averageRating: 4.9,
    totalReviews: 290,
    tags: ['gimbal', '4k120fps', 'vlogging', 'dji'],
  },
  {
    _id: 'p22',
    title: 'Elgato Stream Deck MK.2 Studio Controller (15 LCD Keys)',
    slug: 'elgato-stream-deck-mk2',
    description: '15 customizable tactile LCD keys to trigger unlimited actions with customizable magnetic faceplates.',
    category: 'Creator Gear',
    brand: 'Elgato',
    price: 17500,
    discountPrice: 15200,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 175,
    tags: ['stream-deck', 'broadcasting', 'macro-controller'],
  },
  {
    _id: 'p23',
    title: 'Shure MV7+ Podcast Dynamic Hybrid Microphone (XLR/USB)',
    slug: 'shure-mv7-plus-podcast-microphone',
    description: 'Customizable LED touch panel, onboard DSP, Voice Isolation Technology, and multi-color RGB strip.',
    category: 'Creator Gear',
    brand: 'Shure',
    price: 29000,
    discountPrice: 25500,
    stock: 16,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 12,
    averageRating: 4.8,
    totalReviews: 140,
    tags: ['podcast-mic', 'shure', 'usb-c', 'xlr'],
  },
  {
    _id: 'p24',
    title: 'Anker Prime 20,000mAh 200W GaN Power Bank Station',
    slug: 'anker-prime-20000mah-200w-powerbank',
    description: 'Ultra-fast 200W total output with smart digital display, power breakdown, and multi-device fast charging.',
    category: 'Peripherals',
    brand: 'Anker',
    price: 16000,
    discountPrice: 14200,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1609592424368-eb871a9ec603?w=800&q=80'],
    vendorName: 'Nexus Direct',
    isFlashSale: true,
    flashSaleDiscountPercent: 11,
    averageRating: 4.9,
    totalReviews: 310,
    tags: ['anker', 'gan', '200w', 'power-bank'],
  },
  {
    _id: 'p25',
    title: 'Philips Hue Play Gradient Lightstrip 65-inch for TV/PC',
    slug: 'philips-hue-play-gradient-lightstrip',
    description: 'Blends multiple colors of seamless reactive light simultaneously behind your monitor or entertainment center.',
    category: 'Smart Home',
    brand: 'Philips',
    price: 26000,
    discountPrice: 22500,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: true,
    flashSaleDiscountPercent: 13,
    averageRating: 4.9,
    totalReviews: 130,
    tags: ['lighting', 'smart-home', 'philips-hue'],
  },
  {
    _id: 'p26',
    title: 'Dyson Purifier Hot+Cool Gen1 Air Purifier & Fan',
    slug: 'dyson-purifier-hot-cool-gen1',
    description: 'Fully sealed HEPA H13 filtration removes 99.97% of pollutants, with intelligent thermal regulation.',
    category: 'Smart Home',
    brand: 'Dyson',
    price: 68000,
    discountPrice: 59000,
    stock: 9,
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 180,
    tags: ['purifier', 'dyson', 'smart-home', 'climate'],
  },
  {
    _id: 'p27',
    title: 'Nanoleaf Shapes Hexagons Modular LED Smart Panels',
    slug: 'nanoleaf-shapes-hexagons-starter-kit',
    description: 'Touch-sensitive modular smart lighting tiles with dynamic music visualizer rhythm synchronization.',
    category: 'Smart Home',
    brand: 'Nanoleaf',
    price: 22000,
    discountPrice: 18500,
    stock: 24,
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: true,
    flashSaleDiscountPercent: 15,
    averageRating: 4.7,
    totalReviews: 115,
    tags: ['modular-lighting', 'rgb', 'smart-home'],
  },
  {
    _id: 'p28',
    title: 'Ecobee Smart Thermostat Premium with Voice Control',
    slug: 'ecobee-smart-thermostat-premium',
    description: 'Zinc bezel with built-in air quality monitor, radar occupancy sensing, and Apple HomeKit support.',
    category: 'Smart Home',
    brand: 'Ecobee',
    price: 27000,
    discountPrice: 23500,
    stock: 17,
    images: ['https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: false,
    averageRating: 4.8,
    totalReviews: 95,
    tags: ['thermostat', 'energy-saving', 'smart-home'],
  },
  {
    _id: 'p29',
    title: 'Level Lock+ Smart Deadbolt with Apple Home Key',
    slug: 'level-lock-plus-smart-deadbolt',
    description: 'Invisible smart lock technology hidden entirely inside the door with tap-to-unlock NFC.',
    category: 'Smart Home',
    brand: 'Level',
    price: 36000,
    discountPrice: 31000,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: true,
    flashSaleDiscountPercent: 14,
    averageRating: 4.7,
    totalReviews: 70,
    tags: ['smart-lock', 'security', 'homekey', 'smart-home'],
  },
  {
    _id: 'p30',
    title: 'Ember Smart Ceramic Temperature-Controlled Mug 2',
    slug: 'ember-smart-temperature-mug-2',
    description: 'Maintains your chosen hot beverage drinking temperature for 1.5 hours on a single charge.',
    category: 'Smart Home',
    brand: 'Ember',
    price: 16500,
    discountPrice: 14200,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'],
    vendorName: 'Eco Living Global',
    isFlashSale: false,
    averageRating: 4.9,
    totalReviews: 240,
    tags: ['smart-mug', 'temperature-control', 'smart-home'],
  },

  // --- COMBO PACKAGES & BUNDLES (3 Combos) ---
  {
    _id: 'combo-1',
    title: 'Ultimate Audiophile Master Combo (Sony XM5 + Bose QC Ultra)',
    slug: 'ultimate-audiophile-master-combo',
    description: 'হাই-ফাই মিউজিক ও নয়েজ ক্যান্সেলেশনের সেরা কম্বিনেশন। একসাথে কিনলে ১০,৭১০ টাকা সাশ্রয় ও ৬০০ লয়্যালটি পয়েন্ট বোনাস!',
    category: 'Combo Packages',
    brand: 'Sony',
    price: 71400,
    discountPrice: 60690,
    stock: 15,
    images: [
      '/images/combos/combo-1.jpg',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    ],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 15,
    averageRating: 5.0,
    totalReviews: 86,
    tags: ['combo', 'bundle', 'audio', 'savings', 'special-offer'],
  },
  {
    _id: 'combo-2',
    title: 'Titanium Creator Pro Suite (Apple Watch Ultra 2 + Keychron Q1 Pro)',
    slug: 'titanium-creator-pro-suite',
    description: 'স্মার্ট লাইফস্টাইল ও প্রোডাক্টিভিটি বুস্ট করার জন্য প্রিমিয়াম স্মার্টওয়াচ এবং মেকানিক্যাল কিবোর্ড কম্বো।',
    category: 'Combo Packages',
    brand: 'Apple',
    price: 97800,
    discountPrice: 85900,
    stock: 12,
    images: [
      '/images/combos/combo-2.jpg',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    ],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 12,
    averageRating: 4.9,
    totalReviews: 64,
    tags: ['combo', 'bundle', 'wearable', 'gaming', 'savings'],
  },
  {
    _id: 'combo-3',
    title: 'Esports Competitive Duo (Razer Viper V2 Pro + Keychron Q1 Pro)',
    slug: 'esports-competitive-duo',
    description: 'আল্ট্রা-লাইটওয়েট ওয়্যারলেস গেমিং মাউস ও মেকানিক্যাল কাস্টম কিবোর্ড কম্বো।',
    category: 'Combo Packages',
    brand: 'Razer',
    price: 29800,
    discountPrice: 25500,
    stock: 20,
    images: [
      '/images/combos/combo-3.jpg',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    ],
    vendorName: 'ShopNexus Official',
    isFlashSale: true,
    flashSaleDiscountPercent: 14,
    averageRating: 4.9,
    totalReviews: 92,
    tags: ['combo', 'bundle', 'gaming', 'esports', 'savings'],
  },
];

const CATEGORIES_LIST = [
  'All',
  'Combo Packages',
  'Audio',
  'Wearables',
  'Peripherals',
  'Smart Home',
  'Creator Gear',
  'Gaming',
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const {
    search,
    category,
    brand,
    maxPrice,
    minRating,
    sortBy,
    isFlashSale,
    setSearch,
    setCategory,
    resetFilters,
  } = useProductStore();

  const { t, language } = useLanguageStore();
  const [mounted, setMounted] = useState(false);
  const rawBundles = useBundleStore((state) => state.bundles);

  // Merge custom dynamic bundles with base products stably cached with useMemo
  const allCatalogProducts = React.useMemo(() => {
    const bundleProducts = rawBundles
      .filter((b) => b.status === 'Active')
      .map(convertBundleToProduct);
    const nonCombos = FALLBACK_PRODUCTS.filter((p) => p.category !== 'Combo Packages');
    return [...bundleProducts, ...nonCombos];
  }, [rawBundles]);

  const [products, setProducts] = useState<Product[]>(allCatalogProducts);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setSearch(q);
    if (cat) setCategory(cat);
  }, [searchParams, setSearch, setCategory]);

  useEffect(() => {
    let filtered = [...allCatalogProducts];
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (brand) filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    if (isFlashSale) filtered = filtered.filter((p) => p.isFlashSale);
    if (maxPrice) filtered = filtered.filter((p) => (p.discountPrice || p.price) <= maxPrice);
    if (minRating) filtered = filtered.filter((p) => p.averageRating >= minRating);

    if (sortBy === 'price_asc') filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sortBy === 'price_desc') filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sortBy === 'rating') filtered.sort((a, b) => b.averageRating - a.averageRating);

    setProducts(filtered);
  }, [search, category, brand, maxPrice, minRating, sortBy, isFlashSale, allCatalogProducts]);

  const activeFiltersCount = (category ? 1 : 0) + (brand ? 1 : 0) + (isFlashSale ? 1 : 0) + (minRating > 0 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-orange-50/90 via-white to-amber-50/60 dark:from-[#0b1120] dark:via-slate-900 dark:to-[#090d16] border border-orange-200 dark:border-orange-500/20 p-5 sm:p-10 mb-6 sm:mb-10 shadow-xl backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {mounted ? (language === 'bn' ? 'অফিসিয়াল ওয়্যারেন্টি ও ভেরিফাইড ক্যাটালগ' : 'Curated Catalog & Official Warranty') : 'Curated Catalog & Official Warranty'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
            {mounted ? (language === 'bn' ? 'প্রিমিয়াম উদ্ভাবনী গ্যাজেটসমূহ' : 'Explore Premium Innovations') : 'Explore Premium Innovations'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
            {mounted ? (language === 'bn' ? 'অডিওফাইল সাউন্ড, মেকানিক্যাল কিবোর্ড, টাইটানিয়াম স্মার্টওয়াচ এবং স্মার্ট হোম গ্যাজেট অন্বেষণ করুন।' : 'Discover audiophile sound, mechanical keyboards, titanium wearables, and smart home hardware with persistent cart ordering.') : 'Discover audiophile sound, mechanical keyboards, titanium wearables, and smart home hardware with persistent cart ordering.'}
          </p>
        </div>
      </div>

      {/* Mobile Sticky Quick Category Scroll Bar & Filter Trigger */}
      <div className="lg:hidden mb-6 space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = (cat === 'All' && !category) || category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mounted ? getLocalizedCategory(cat, language) : cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>{mounted ? t('filter_title') : 'Filters & Refinements'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-black">
                {mounted && language === 'bn' ? toBengaliNumber(activeFiltersCount) : activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-500 text-xs font-bold cursor-pointer"
              title={mounted ? t('filter_reset') : 'Reset Filters'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desktop Sidebar Filters (Hidden on Mobile) */}
        <aside className="hidden lg:block lg:col-span-3">
          <ProductFilter />
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {mounted ? t('filter_showing') : 'Showing'}{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {mounted && language === 'bn' ? toBengaliNumber(products.length) : products.length}
              </span>{' '}
              {mounted ? t('filter_products_found') : 'official items'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {mounted ? t('filter_reset') : 'Clear active filters'}
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl text-center shadow-sm">
              <PackageSearch className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                {mounted ? (language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No matching products found') : 'No matching products found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {mounted ? (language === 'bn' ? 'আপনার নির্বাচিত ফিল্টার বা বাজেটের সাথে কোনো পণ্য মেলেনি। অন্যান্য ফিল্টার দিয়ে চেষ্টা করুন।' : 'We couldn\'t find any items matching your budget or selected filters. Try broadening your criteria.') : 'We couldn\'t find any items matching your budget.'}
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#ff4400] via-[#ff7700] to-[#ff4400] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {mounted ? t('filter_reset') : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Slide-Over Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl p-5 shadow-2xl z-10 space-y-4">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-2" />
            <ProductFilter onClose={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400 text-sm">
          Loading official hardware catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
