import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopNexus | Next-Gen Multi-Vendor E-Commerce Ecosystem',
  description:
    'ShopNexus is a high-performance, multi-vendor e-commerce platform built with Next.js 16, TypeScript, Zustand, and MongoDB.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Global Slide-Over Shopping Cart Drawer */}
        <CartDrawer />

        {/* Main Application Body */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
