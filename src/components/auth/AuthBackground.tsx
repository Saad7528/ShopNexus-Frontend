'use client';

import React, { useRef, useEffect } from 'react';

interface AuthBackgroundProps {
  children?: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* 1. Real Looping Supermarket Family & Kids Shopping Video / Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Animated Visual Sequence Layer */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 scale-105"
          style={{
            backgroundImage: `url('/images/auth-bg/family-kids-shopping-animated.webp'), url('/images/auth-bg/family-kids-shopping-1.jpg')`,
            filter: 'brightness(0.92) contrast(1.06)',
          }}
        />

        {mounted && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/auth-bg/shopping-ambience-1.jpg?v=4"
            className="absolute inset-0 w-full h-full object-cover filter blur-[1px] brightness-[0.92] contrast-[1.06] scale-105 opacity-90"
          >
            <source src="/videos/supermarket-family-kids-shopping.mp4?v=4" type="video/mp4" />
            <source src="/videos/supermarket-shopping.mp4?v=4" type="video/mp4" />
          </video>
        )}

        {/* 2. Soft & Light Overlay to keep the shoppers vibrant & clearly visible */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-slate-950/40" />

        {/* 3. Subtle Brand Accent Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4. Foreground Content (Login / Register Card) */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
