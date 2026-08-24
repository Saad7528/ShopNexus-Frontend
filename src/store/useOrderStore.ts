import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING';
  status: 'PLACED' | 'CONFIRMED' | 'PACKAGING' | 'SHIPPED' | 'DELIVERED';
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  shippingAddress: string;
}
