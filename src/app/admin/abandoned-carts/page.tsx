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
