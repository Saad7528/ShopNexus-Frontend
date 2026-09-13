import { CartItem } from './cart';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod =
  | 'COD'
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'CREDIT_CARD'
  | 'SSLCOMMERZ';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  zone?: string;
  landmark?: string;
  postalCode?: string;
}

export interface TrackingMilestone {
  step: string;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  active?: boolean;
}

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

export interface IOrder {
  _id: string;
  id?: string;
  orderNumber: string;
  trackingNumber?: string;
  userId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  vat: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  isGuest?: boolean;
  notes?: string;
  milestones?: TrackingMilestone[];
  createdAt: string;
  updatedAt?: string;
}

