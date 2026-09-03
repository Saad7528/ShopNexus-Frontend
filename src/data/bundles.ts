export interface IBundleItem {
  id: string;
  title: string;
  image: string;
  regularPrice: number;
  category?: string;
  loyaltyPoints?: number;
}

export interface IBundleDeal {
  id: string;
  title: string;
  badge: string;
  description: string;
  promoCode?: string;
  purchaseInstruction?: string;
  items: IBundleItem[];
  originalTotal: number;
  bundlePrice: number;
  savings: number;
  rewardPoints: number; // e.g. 500 points = ৳50 cashback
  status: 'Active' | 'Draft' | 'Expired';
  salesCount: number;
}

export const INITIAL_BUNDLES: IBundleDeal[] = [
  {
    id: 'b-1',
    title: 'Ultimate Audiophile Master Combo',
    badge: '🔥 15% OFF BUNDLE',
    description: 'হাই-ফাই মিউজিক ও নয়েজ ক্যান্সেলেশনের সেরা কম্বিনেশন। একসাথে কিনলে ১০,৭১০ টাকা সাশ্রয় ও ৬০০ লয়্যালটি পয়েন্ট বোনাস!',
    promoCode: 'AUDIOPRO15',
    purchaseInstruction: 'চেকআউটে অটো ডিসকাউন্ট প্রযোজ্য অথবা কোড AUDIOPRO15 ব্যবহার করুন',
    items: [
      {
        id: '1',
        title: 'Sony WH-1000XM5 Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        regularPrice: 32500,
        category: 'Audio',
        loyaltyPoints: 325,
      },
      {
        id: '4',
        title: 'Bose QuietComfort Ultra Spatial Audio',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        regularPrice: 38900,
        category: 'Audio',
        loyaltyPoints: 389,
      },
    ],
    originalTotal: 71400,
    bundlePrice: 60690,
    savings: 10710,
    rewardPoints: 600, // 600 points = ৳60 cashback
    status: 'Active',
    salesCount: 38,
  },
  {
    id: 'b-2',
    title: 'Titanium Creator Pro Suite',
    badge: '⭐ POPULAR COMBO',
    description: 'স্মার্ট লাইফস্টাইল ও প্রোডাক্টিভিটি বুস্ট করার জন্য প্রিমিয়াম স্মার্টওয়াচ এবং মেকানিক্যাল কিবোর্ড।',
    promoCode: 'CREATORVIP',
    purchaseInstruction: 'এক ক্লিকে কম্বো অর্ডার করুন এবং ফ্রি ডেলিভারি উপভোগ করুন',
    items: [
      {
        id: '2',
        title: 'Apple Watch Ultra 2 Aerospace Titanium',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        regularPrice: 79900,
        category: 'Wearables',
        loyaltyPoints: 799,
      },
      {
        id: '5',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
        category: 'Gaming',
        loyaltyPoints: 179,
      },
    ],
    originalTotal: 97800,
    bundlePrice: 85900,
    savings: 11900,
    rewardPoints: 850, // 850 points = ৳85 cashback
    status: 'Active',
    salesCount: 52,
  },
  {
    id: 'b-3',
    title: 'Esports Competitive Duo',
    badge: '🎮 GAMER SPECIAL',
    description: 'আল্ট্রা-লাইটওয়েট ওয়্যারলেস গেমিং মাউস ও মেকানিক্যাল কাস্টম কিবোর্ড কম্বো।',
    promoCode: 'ESPORTS10',
    purchaseInstruction: 'গেমিং বান্ডেল ডিসকাউন্টের সাথে পাবেন ৩ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি',
    items: [
      {
        id: '8',
        title: 'Razer Viper V2 Pro Ultra-Lightweight',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        regularPrice: 11900,
        category: 'Gaming',
        loyaltyPoints: 119,
      },
      {
        id: '5',
        title: 'Keychron Q1 Pro Custom Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        regularPrice: 17900,
        category: 'Gaming',
        loyaltyPoints: 179,
      },
    ],
    originalTotal: 29800,
    bundlePrice: 25500,
    savings: 4300,
    rewardPoints: 250, // 250 points = ৳25 cashback
    status: 'Active',
    salesCount: 64,
  },
];
