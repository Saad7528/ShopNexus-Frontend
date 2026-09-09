import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCartWidget } from '@/components/cart/FloatingCartWidget';
import { ChatbotWidget } from '@/components/ai/ChatbotWidget';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import StorefrontTelemetryTracker from '@/components/analytics/StorefrontTelemetryTracker';
import CrossTabAuthSync from '@/components/auth/CrossTabAuthSync';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

export const metadata: Metadata = {
  title: 'ShopNexus | Next-Gen E-Commerce & Gadget Store',
  description:
    'ShopNexus is a high-performance, premium e-commerce ecosystem delivering authentic gadgets, mechanical keyboards, audio gear, and instant deliveries.',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 selection:bg-[#ff4400] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {/* Real-time Customer Storefront Telemetry Tracker (Excludes Internal Admin Traffic) */}
          <StorefrontTelemetryTracker />

          {/* Cross-Tab Authentication Auto-Synchronization Engine */}
          <CrossTabAuthSync />

          {/* Global Navigation Bar */}
          <Navbar />

          {/* Global Slide-Over Shopping Cart Drawer */}
          <CartDrawer />

          {/* Interactive Floating Draggable Sticky Cart Widget */}
          <FloatingCartWidget />

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
