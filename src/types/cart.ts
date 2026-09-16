export interface CartItemType {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  vendorName: string;
  variant?: string;
  color?: string;
  edition?: string;
}

export type ShippingMethod = 'standard' | 'express';

export interface CartTotals {
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingProgress: number;
  amountUntilFreeShipping: number;
}

export type CartItem = CartItemType;


