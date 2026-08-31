'use client';

import React, { useState } from 'react';

export interface IAbandonedItem {
  id: string;
  title: string;
  image: string;
  variant?: string;
  price: number;
  quantity: number;
}

export interface IAbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: IAbandonedItem[];
  cartTotal: number;
  timeAgo: string;
  status: 'Uncontacted' | 'WhatsApp Sent' | 'Discount Emailed' | 'Recovered';
  recoveryDiscountCode?: string;
}

export const INITIAL_ABANDONED_CARTS: IAbandonedCart[] = [
  {
    id: 'ac-1',
    customerName: 'Shakib Al Hasan',
    customerPhone: '+880 1711-223344',
    customerEmail: 'shakib.official@gmail.com',
    items: [
      {
        id: 'p1',
        title: 'Sony WH-1000XM5 Wireless ANC',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        variant: 'Silver & Black',
        price: 32500,
        quantity: 1,
      },
    ],
    cartTotal: 32500,
    timeAgo: '18 mins ago',
    status: 'Uncontacted',
  },
  {
    id: 'ac-2',
    customerName: 'Ayesha Siddiqua',
    customerPhone: '+880 1822-445566',
    customerEmail: 'ayesha.arch@yahoo.com',
    items: [
      {
        id: 'p2',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        variant: 'Titanium Loop',
        price: 79900,
        quantity: 1,
      },
      {
        id: 'p3',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        variant: 'Carbon Gray',
        price: 17900,
        quantity: 1,
      },
    ],
    cartTotal: 97800,
    timeAgo: '42 mins ago',
    status: 'Uncontacted',
  },
  {
    id: 'ac-3',
    customerName: 'Kazi Moinuddin',
    customerPhone: '+880 1933-778899',
    customerEmail: 'moin.ctg@gmail.com',
    items: [
      {
        id: 'p4',
        title: 'Bose QuietComfort Ultra Spatial Audio',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        variant: 'Black Smoke',
        price: 38900,
        quantity: 1,
      },
    ],
    cartTotal: 38900,
    timeAgo: '2 hours ago',
    status: 'WhatsApp Sent',
    recoveryDiscountCode: 'COMEBACK5',
  },
  {
    id: 'ac-4',
    customerName: 'Fahim Faisal',
    customerPhone: '+880 1644-112233',
    customerEmail: 'fahim.tech@gmail.com',
    items: [
      {
        id: 'p3',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        variant: 'Carbon Gray',
        price: 17900,
        quantity: 2,
      },
    ],
    cartTotal: 35800,
    timeAgo: '5 hours ago',
    status: 'Recovered',
    recoveryDiscountCode: 'SAVE500',
  },
  {
    id: 'ac-5',
    customerName: 'Nadia Sultana',
    customerPhone: '+880 1788-990011',
    customerEmail: 'nadia.fashion@gmail.com',
    items: [
      {
        id: 'p2',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        variant: 'Titanium Loop',
        price: 79900,
        quantity: 1,
      },
    ],
    cartTotal: 79900,
    timeAgo: '1 day ago',
    status: 'Discount Emailed',
    recoveryDiscountCode: 'COMEBACK10',
  },
];
