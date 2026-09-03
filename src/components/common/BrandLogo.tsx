'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  showSubtitle?: boolean;
  variant?: 'auto' | 'white' | 'dark';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  href = '/',
  className = '',
  variant = 'auto',
}) => {
  const sizeConfig = {
    sm: {
      imgSize: 34,
      textSize: 'text-lg',
      gap: 'gap-1',
    },
    md: {
      imgSize: 44,
      textSize: 'text-xl sm:text-2xl',
      gap: 'gap-1 sm:gap-1.5',
    },
    lg: {
      imgSize: 58,
      textSize: 'text-2xl sm:text-3xl',
      gap: 'gap-1.5 sm:gap-2',
    },
    xl: {
      imgSize: 76,
      textSize: 'text-3xl sm:text-4xl',
      gap: 'gap-2 sm:gap-2.5',
    },
  }[size];

  // If variant is 'white', text is always pure white regardless of light/dark theme (essential for dark auth background)
  const textColorClass =
    variant === 'white'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-slate-950'
      : 'text-slate-950 dark:text-white';

  const content = (
    <div className={`relative inline-flex items-center ${sizeConfig.gap} shrink-0 group transition-transform duration-200 hover:scale-[1.02] ${className}`}>
      {/* 🌟 Official 3D Gold-Orange Emblem (Flawless on both Light & Dark themes) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/shopnexus-gold-emblem.png"
          alt="ShopNexus Logo"
          width={sizeConfig.imgSize}
          height={sizeConfig.imgSize}
          className="object-contain select-none drop-shadow-[0_2px_8px_rgba(255,140,0,0.35)] dark:drop-shadow-[0_0_16px_rgba(255,140,0,0.7)]"
          priority
        />
      </div>

      {/* 🌟 Typography: Crisp white in 'white' variant, responsive in 'auto', glowing gradient for Nexus */}
      <span className={`${sizeConfig.textSize} font-black tracking-tight leading-none ${textColorClass} transition-colors select-none`}>
        Shop<span className="bg-gradient-to-r from-[#ff4400] via-[#ff6600] to-[#ff8800] bg-clip-text text-transparent">Nexus</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} title="ShopNexus Home" className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
