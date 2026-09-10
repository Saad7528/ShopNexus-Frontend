import { ALL_PRODUCTS } from './products';
import { Product } from '@/store/useProductStore';

export interface IInventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  costPrice: number;
  price: number;
  discountPrice?: number;
  vatTaxPercent?: number;
  stock: number;
  threshold: number;
  image: string;
  images?: string[];
  description?: string;
  isFlashSale: boolean;
  variantColor?: string;
  slug: string;
  // Trust Badges & Guarantee Policies
  hasFastDelivery?: boolean;
  hasWarranty?: boolean;
  warrantyText?: string;
  hasReturnPolicy?: boolean;
  isOfficialGenuine?: boolean;
}

export const INITIAL_INVENTORY: IInventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'SKU-AUD-001',
    barcode: 'BC-880192',
    name: 'Sony WH-1000XM5 Wireless ANC Headphones',
    category: 'Audio',
    brand: 'Sony',
    costPrice: 28000,
    price: 38500,
    discountPrice: 32500,
    vatTaxPercent: 7.5,
    stock: 45,
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    description: 'Industry-leading noise cancellation with two processors and 8 microphones for unparalleled clarity, 30-hour battery life, and crystal-clear hands-free calling.',
    isFlashSale: true,
    variantColor: 'Silver & Black',
    slug: 'sony-wh-1000xm5-wireless-anc',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
  {
    id: 'inv-2',
    sku: 'SKU-WR-002',
    barcode: 'BC-880193',
    name: 'Apple Watch Ultra 2 Aerospace Titanium Smartwatch',
    category: 'Wearables',
    brand: 'Apple',
    costPrice: 65000,
    price: 88900,
    discountPrice: 79900,
    vatTaxPercent: 7.5,
    stock: 4, // Low stock
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    description: 'Rugged titanium casing with dual-frequency GPS, up to 72 hours of battery life in low power mode, and custom Oceanic+ app support.',
    isFlashSale: true,
    variantColor: 'Titanium Loop',
    slug: 'apple-watch-ultra-2-titanium',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অ্যাপল ইন্টারন্যাশনাল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
  {
    id: 'inv-3',
    sku: 'SKU-KEY-003',
    barcode: 'BC-880194',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Peripherals',
    brand: 'Keychron',
    costPrice: 14000,
    price: 21500,
    discountPrice: 17900,
    vatTaxPercent: 5,
    stock: 3, // Low stock
    threshold: 8,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
    description: 'Full aluminum CNC machined body, QMK/VIA programmable, double-gasket design for signature acoustics and hot-swappable switches.',
    isFlashSale: true,
    variantColor: 'Carbon Gray',
    slug: 'keychron-q1-pro-wireless-custom',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '২ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
  {
    id: 'inv-4',
    sku: 'SKU-AUD-004',
    barcode: 'BC-880195',
    name: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    category: 'Audio',
    brand: 'Bose',
    costPrice: 32000,
    price: 44500,
    discountPrice: 38900,
    vatTaxPercent: 7.5,
    stock: 28,
    threshold: 10,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],
    description: 'Breakthrough spatialized audio for immersive listening with custom tuned active noise cancellation and world-class comfort.',
    isFlashSale: false,
    variantColor: 'White Smoke',
    slug: 'bose-qc-ultra-spatial-headphones',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
  {
    id: 'inv-5',
    sku: 'SKU-GAM-005',
    barcode: 'BC-880196',
    name: 'Razer Viper V2 Pro Ultra-Lightweight Wireless Mouse',
    category: 'Gaming',
    brand: 'Razer',
    costPrice: 9500,
    price: 15500,
    discountPrice: 11900,
    vatTaxPercent: 5,
    stock: 15,
    threshold: 5,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
    description: '58g ultra-lightweight design, Focus Pro 30K Optical Sensor, Gen-3 Optical Mouse Switches with 90-million click lifecycle.',
    isFlashSale: true,
    variantColor: 'Matte Black',
    slug: 'razer-viper-v2-pro-wireless',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '১ বছরের অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
  {
    id: 'inv-6',
    sku: 'SKU-CR-006',
    barcode: 'BC-880197',
    name: 'Shure SM7B Cardioid Dynamic Vocal Studio Microphone',
    category: 'Creator Gear',
    brand: 'Shure',
    costPrice: 29000,
    price: 42000,
    discountPrice: 36500,
    vatTaxPercent: 7.5,
    stock: 12,
    threshold: 5,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
    description: 'Legendary flat, wide-range frequency response for exceptionally clean and natural reproduction of both music and speech.',
    isFlashSale: true,
    variantColor: 'Studio Black',
    slug: 'shure-sm7b-dynamic-microphone',
    hasFastDelivery: true,
    hasWarranty: true,
    warrantyText: '২ বছরের গ্লোবাল ওয়ারেন্টি',
    hasReturnPolicy: true,
    isOfficialGenuine: true,
  },
];

/**
 * Robust Product Resolver
 * Finds product by inv-X id, pX id, slug, or title from ALL_PRODUCTS & INITIAL_INVENTORY
 */
export function getProductOrInventoryById(idOrSlug: string): (IInventoryItem | Product) | undefined {
  if (!idOrSlug) return undefined;
  const decoded = decodeURIComponent(idOrSlug).trim().toLowerCase();

  // 1. Direct match INITIAL_INVENTORY
  const invFound = INITIAL_INVENTORY.find(
    (item) =>
      item.id.toLowerCase() === decoded ||
      item.slug.toLowerCase() === decoded ||
      item.sku.toLowerCase() === decoded
  );
  if (invFound) return invFound;

  // 2. Direct match in ALL_PRODUCTS
  const prodFound = ALL_PRODUCTS.find(
    (p) =>
      p._id.toLowerCase() === decoded ||
      p.slug.toLowerCase() === decoded ||
      p.title.toLowerCase() === decoded
  );
  if (prodFound) return prodFound;

  // 3. Map inv-1 -> p1, inv-2 -> p2
  if (decoded.startsWith('inv-')) {
    const num = decoded.replace('inv-', '');
    const pMatch = ALL_PRODUCTS.find((p) => p._id === `p${num}`);
    if (pMatch) return pMatch;

    const index = parseInt(num, 10) - 1;
    if (index >= 0 && index < ALL_PRODUCTS.length) {
      return ALL_PRODUCTS[index];
    }
  }

  // 4. Map p1 -> inv-1, p2 -> inv-2
  if (decoded.startsWith('p') && !isNaN(Number(decoded.slice(1)))) {
    const num = decoded.slice(1);
    const invMatch = INITIAL_INVENTORY.find((item) => item.id === `inv-${num}`);
    if (invMatch) return invMatch;
  }

  // 5. Fuzzy match by slug or title
  const fuzzyProd = ALL_PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase().includes(decoded) ||
      decoded.includes(p.slug.toLowerCase()) ||
      p.title.toLowerCase().includes(decoded)
  );
  if (fuzzyProd) return fuzzyProd;

  return undefined;
}
