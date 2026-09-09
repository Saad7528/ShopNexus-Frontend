'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { toBengaliNumber } from '@/lib/translations';

export const FloatingCartWidget: React.FC = () => {
  const pathname = usePathname();
  const { items, isOpen: isCartOpen, openDrawer } = useCartStore();
  const { language } = useLanguageStore();

  const [isMounted, setIsMounted] = useState(false);
  const [topPos, setTopPos] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [highlightPulse, setHighlightPulse] = useState(false);

  const prevCountRef = useRef(0);
  const dragStartRef = useRef<{ y: number; initialTop: number }>({ y: 0, initialTop: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const itemCount = isMounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Set default initial position vertically centered
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedTop = sessionStorage.getItem('shopnexus_floating_cart_y');
      if (savedTop) {
        const parsed = parseFloat(savedTop);
        if (!isNaN(parsed) && parsed > 50 && parsed < window.innerHeight - 90) {
          setTopPos(parsed);
          return;
        }
      }
      setTopPos(Math.round(window.innerHeight * 0.45));
    }
  }, []);

  // Trigger glowing pulse & bounce animation whenever an item is added
  useEffect(() => {
    if (isMounted && itemCount > prevCountRef.current && itemCount > 0) {
      setHighlightPulse(true);
      const timer = setTimeout(() => {
        setHighlightPulse(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (itemCount === 0) {
      setHighlightPulse(false);
    }
    prevCountRef.current = itemCount;
  }, [itemCount, isMounted]);

  // Mouse / Touch Drag Logic
  const handleStartDrag = (clientY: number) => {
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      y: clientY,
      initialTop: topPos ?? (typeof window !== 'undefined' ? window.innerHeight * 0.45 : 300),
    };
  };

  const handleMoveDrag = useCallback(
    (clientY: number) => {
      if (!isDragging) return;
      const deltaY = clientY - dragStartRef.current.y;
      if (Math.abs(deltaY) > 4) {
        setHasMoved(true);
      }
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const newTop = Math.min(Math.max(60, dragStartRef.current.initialTop + deltaY), windowHeight - 80);
      setTopPos(newTop);
    },
    [isDragging]
  );

  const handleEndDrag = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (topPos !== null && typeof window !== 'undefined') {
        sessionStorage.setItem('shopnexus_floating_cart_y', topPos.toString());
      }
    }
  }, [isDragging, topPos]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMoveDrag(e.clientY);
    const onMouseUp = () => handleEndDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMoveDrag(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEndDrag();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, handleMoveDrag, handleEndDrag]);

  // Click Trigger
  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    openDrawer();
  };

  // Don't display on Admin / Auth pages
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password';
  const isAdminPage = pathname.startsWith('/admin');

  if (!isMounted || isAuthPage || isAdminPage || topPos === null) return null;

  const hasItems = itemCount > 0;

  return (
    <div
      ref={widgetRef}
      style={{ top: `${topPos}px` }}
      className={`fixed right-2 sm:right-4 z-40 select-none transition-opacity duration-300 ${
        isCartOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'
      }`}
    >
      <div
        onClick={handleClick}
        onMouseDown={(e) => {
          if (e.button === 0) handleStartDrag(e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) handleStartDrag(e.touches[0].clientY);
        }}
        className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl ${
          isDragging ? 'cursor-grabbing scale-105 shadow-2xl' : 'cursor-grab'
        } ${
          hasItems && highlightPulse
            ? 'scale-115 ring-4 ring-orange-400/80 shadow-2xl shadow-orange-500/60 brightness-110 animate-bounce'
            : ''
        } ${
          hasItems
            ? 'bg-gradient-to-tr from-[#ff4400] via-[#ff5500] to-[#ff7700] text-white shadow-xl shadow-orange-500/35 border border-orange-300/40 opacity-100 hover:scale-108 hover:shadow-orange-500/50'
            : 'bg-white/80 dark:bg-[#0c1220]/80 border border-orange-500/40 dark:border-orange-500/40 text-orange-500 dark:text-orange-400 opacity-90 hover:opacity-100 hover:scale-108 hover:border-orange-500 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/25'
        }`}
        title={
          language === 'bn'
            ? `শপিং কার্ট (${toBengaliNumber(itemCount)}টি আইটেম) - ক্লিক করে ড্রয়ার খুলুন বা টেনে সরান`
            : `Shopping Cart (${itemCount} items) - Click to open or drag to reposition`
        }
      >
        {/* Ambient Glow Aura when active */}
        {hasItems && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#ff4400] to-[#ff9900] opacity-40 blur-md group-hover:opacity-75 transition-opacity -z-10 animate-pulse" />
        )}

        {/* Centered Shopping Bag Icon */}
        <div className="relative flex items-center justify-center">
          <ShoppingBag
            className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:rotate-6 ${
              hasItems ? 'text-white drop-shadow-sm' : 'text-orange-500 dark:text-orange-400 group-hover:scale-110'
            }`}
          />

          {/* Glowing Ping Ring on Item Add */}
          {hasItems && highlightPulse && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-yellow-300 animate-ping" />
          )}

          {/* Crisp Floating Item Count Badge */}
          {hasItems && (
            <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-[20px] px-1 rounded-full bg-white text-[#ff4400] text-[10px] font-black flex items-center justify-center shadow-md shadow-black/20 border-2 border-[#ff4400] animate-in zoom-in-50">
              {language === 'bn' ? toBengaliNumber(itemCount) : itemCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
