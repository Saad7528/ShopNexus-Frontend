import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatbotWidget } from '@/components/ai/ChatbotWidget';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopNexus | Next-Gen E-Commerce & AI Commerce Ecosystem',
  description:
    'ShopNexus is a high-performance, official single-brand e-commerce ecosystem built with Next.js 16, TypeScript, Zustand, and 5 AI Superpowers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {/* Global Navigation Bar */}
          <Navbar />

          {/* Global Slide-Over Shopping Cart Drawer */}
          <CartDrawer />

          {/* Main Application Body */}
          <main className="flex-1 w-full">{children}</main>

          {/* Global Floating AI Shopping Assistant */}
          <ChatbotWidget />

          {/* Global Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
