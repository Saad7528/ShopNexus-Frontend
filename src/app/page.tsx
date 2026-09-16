import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { TestimonialSlider } from '@/components/home/TestimonialSlider';
import { HeroSection } from '@/components/home/HeroSection';
import { ComboDealsSection } from '@/components/home/ComboDealsSection';
import { FlashDealsSection } from '@/components/home/FlashDealsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { AiSuperpowersSection } from '@/components/home/AiSuperpowersSection';
import { HomeTrustPillars } from '@/components/home/HomeTrustPillars';
import { HomeCategorySections } from '@/components/home/HomeCategorySections';
import { ALL_PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'ShopNexus | Next-Gen E-Commerce & Gadget Store',
  description:
    'ShopNexus is a high-performance e-commerce ecosystem delivering authentic mechanical keyboards, audiophile gear, wearables, and express nationwide delivery.',
};

const AUDIO_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Audio').slice(0, 5);
const WEARABLE_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Wearables').slice(0, 5);
const PERIPHERAL_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Peripherals').slice(0, 5);
const CREATOR_PRODUCTS = ALL_PRODUCTS.filter((p) => p.category === 'Creator Gear' || p.category === 'Smart Home').slice(0, 5);
const FLASH_PRODUCTS = ALL_PRODUCTS.filter((p) => p.isFlashSale).slice(0, 5);

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      {/* 🌟 1. HERO SECTION */}
      <HeroSection />

      {/* ⚡ 2. MEGA FLASH DEALS */}
      <FlashDealsSection products={FLASH_PRODUCTS} />

      {/* 🌟 3. ULTRA-COMPACT 4 TRUST PILLARS */}
      <HomeTrustPillars />

      {/* 🎧 4-7. CATEGORY SECTIONS (AUDIO, WEARABLES, PERIPHERALS, CREATOR GEAR) */}
      <HomeCategorySections
        audioProducts={AUDIO_PRODUCTS}
        wearableProducts={WEARABLE_PRODUCTS}
        peripheralProducts={PERIPHERAL_PRODUCTS}
        creatorProducts={CREATOR_PRODUCTS}
      />

      {/* 🔥 EXCLUSIVE COMBO BUNDLES & LOYALTY REWARDS */}
      <ComboDealsSection />

      {/* 🤖 8. 5 AI SUPERPOWERS SHOWCASE */}
      <AiSuperpowersSection />

      {/* 💬 9. CUSTOMER REVIEWS & 3D TESTIMONIAL SLIDER */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <TestimonialSlider />
      </section>

      {/* 🎁 10. VIP NEWSLETTER & COUPON SECTION */}
      <NewsletterSection />
    </div>
  );
}
