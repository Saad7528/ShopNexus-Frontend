import { Product } from '@/store/useProductStore';
import { Language, formatCurrency, toBengaliNumber } from './translations';

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; bn: string }> = {
  All: { en: 'All Categories', bn: 'সকল ক্যাটাগরি' },
  'Combo Packages': { en: '🎁 Combo Packages & Bundles', bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল' },
  Audio: { en: 'Audio & Acoustics', bn: 'অডিও ও সাউন্ড' },
  Wearables: { en: 'Smartwatches & Wearables', bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য' },
  Peripherals: { en: 'Keyboards & Mice', bn: 'কিবোর্ড ও মাউস' },
  'Smart Home': { en: 'Smart Home & Living', bn: 'স্মার্ট হোম ও লিভিং' },
  'Creator Gear': { en: 'Creator Gear & Studio', bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও' },
  Gaming: { en: 'Gaming Accessories', bn: 'গেমিং এক্সেসরিজ' },
  Accessories: { en: 'Desk Setups & Cables', bn: 'ডেস্ক সেটআপ ও কেবল' },
  Apparel: { en: 'Lifestyle & Apparel', bn: 'লাইফস্টাইল ও পোশাক' },
};

export const getLocalizedCategory = (category: string, lang: Language): string => {
  const item = CATEGORY_TRANSLATIONS[category];
  if (item) {
    return lang === 'bn' ? item.bn : item.en;
  }
  return category;
};

// Dictionary of rich Bengali translations for products
export const PRODUCT_TRANSLATIONS: Record<string, { title_bn: string; desc_bn: string; category_bn: string }> = {
  p1: {
    title_bn: 'সোনি WH-1000XM5 ওয়্যারলেস নয়েজ-ক্যানসেলিং হেডফোন',
    desc_bn: 'দুটি প্রসেসর ও ৮টি মাইক্রোফোন সহ শীর্ষস্থানীয় অ্যাক্টিভ নয়েজ ক্যানসেলেশন, ৩০ ঘণ্টার ব্যাটারি লাইফ ও ক্রিস্টাল ক্লিয়ার সাউন্ড।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p2: {
    title_bn: 'বোস কোয়াইট-কমফোর্ট আল্ট্রা স্পেশিয়াল অডিও হেডফোন',
    desc_bn: 'ইমারসিভ মিউজিক লিসেনিংয়ের জন্য যুগান্তকারী স্পেশিয়াল অডিও, কাস্টম অ্যাক্টিভ নয়েজ ক্যানসেলেশন ও প্রিমিয়াম কমফোর্ট।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p3: {
    title_bn: 'অ্যাপল এয়ারপডস ম্যাক্স (স্পেস গ্রে) উইথ স্মার্ট কেস',
    desc_bn: 'ডায়নামিক হেড ট্র্যাকিং এবং কম্পিউটেশনাল অ্যাকোস্টিক সহ হাই-ফিডেলিটি প্রিমিয়াম অ্যালুমিনিয়াম অডিও হেডসেট।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p4: {
    title_bn: 'মার্শাল স্ট্যানমোর ৩ ব্লুটুথ প্রিমিয়াম হোম স্পিকার',
    desc_bn: 'ক্লাসিক ভিন্টেজ স্টাইলিং সহ রুম-ভরা সাউন্ডস্টেজ ও নিখুঁত ব্রাস কন্ট্রোল নব অডিও স্পিকার।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p5: {
    title_bn: 'সেনহাইজার মোমেন্টাম ৪ ওয়্যারলেস অডিওফাইল হেডফোন',
    desc_bn: 'অডিওফাইল মানের ৪২ মিমি ড্রাইভার, ৬০ ঘণ্টার ব্যাটারি ব্যাকআপ এবং অ্যাডাপটিভ নয়েজ ক্যানসেলেশন।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p6: {
    title_bn: 'শুয়ার SM7B প্রফেশনাল ব্রডকাস্ট মাইক্রোফোন',
    desc_bn: 'বিশ্বজুড়ে শীর্ষস্থানীয় পডকাস্টার ও মিউজিশিয়ানদের পছন্দের ডায়নামিক স্টুডিও গ্রেড মাইক্রোফোন।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p7: {
    title_bn: 'অ্যাপল ওয়াচ আল্ট্রা ২ জিপিএস + সেলুলার টাইটানিয়াম',
    desc_bn: 'অ্যারোস্পেস গ্রেড ৪৯ মিমি টাইটানিয়াম বডি, ৩০০০ নিটস উজ্জ্বল ডিসপ্লে এবং অল-ডে ব্যাটারি লাইফ।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p8: {
    title_bn: 'গারমিন ফেনিক্স ৭ প্রো সোলার জিপিএস স্মার্টওয়াচ',
    desc_bn: 'সোলার চার্জিং লেন্স, অ্যাডভান্সড ট্রেনিং মেট্রিক্স এবং বিল্ট-ইন এলইডি ফ্ল্যাশলাইট স্পোর্টস ওয়াচ।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p9: {
    title_bn: 'স্যামসাং গ্যালাক্সি ওয়াচ ৬ ক্লাসিক ৪৭ মিমি',
    desc_bn: 'রোটেটিং বেজেল, স্যাফায়ার ক্রিস্টাল গ্লাস এবং অ্যাডভান্সড বডি কম্পোজিশন ও হেলথ সেন্সর।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p10: {
    title_bn: 'হুয়াওয়ে ওয়াচ জিটি ৪ ব্রাউন লেদার এডিশন',
    desc_bn: 'ক্লাসিক জ্যামিতিক ডিজাইন, ১৪ দিনের দীর্ঘস্থায়ী ব্যাটারি এবং সুনির্দিষ্ট স্লিপ ট্র্যাকিং।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p11: {
    title_bn: 'কিক্রন কিউ১ প্রো সিএনসি কাস্টম মেকানিক্যাল কিবোর্ড',
    desc_bn: 'সম্পূর্ণ অ্যালুমিনিয়াম সিএনসি বডি, ব্লুটুথ ৫.১ ওয়্যারলেস, হট-সোয়াপ গ্যাস্কেট মাউন্ট কিবোর্ড।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p12: {
    title_bn: 'লজিটেক MX মাস্টার ৩এস ওয়্যারলেস পারফরম্যান্স মাউস',
    desc_bn: '৮কে ডিপিআই গ্লাস ট্র্যাকিং, নিঃশব্দ ক্লিক এবং আল্ট্রাফাস্ট ম্যাগস্পিড ইলেক্ট্রোম্যাগনেটিক স্ক্রোল।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p13: {
    title_bn: 'রেজার হান্টসম্যান ভি৩ প্রো এনালগ গেমিং কিবোর্ড',
    desc_bn: '২য় প্রজন্মের অপটিক্যাল সুইচ, এডজাস্টেবল অ্যাকচুয়েশন পয়েন্ট এবং র‍্যাপিড ট্রিগার গেমিং প্রযুক্তি।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p14: {
    title_bn: 'হায়পারএক্স পালসফায়ার হ্যাস্ট ২ ওয়্যারলেস আল্ট্রালাইট মাউস',
    desc_bn: 'মাত্র ৬১ গ্রাম ওজনের হালকা গেমিং মাউস, ২৬কে ডিপিআই সেন্সর এবং ১০০ ঘণ্টার দীর্ঘস্থায়ী ব্যাটারি।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p15: {
    title_bn: 'নুফি এয়ার৭৫ ভি২ আল্ট্রা-স্লিম ওয়্যারলেস মেকানিক্যাল কিবোর্ড',
    desc_bn: 'লো-প্রোফাইল মেকানিক্যাল সুইচ, ১০০০ হার্টজ পোলিং রেট এবং ম্যাক ও উইন্ডোজ উভয়ের জন্য পারফেক্ট।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p16: {
    title_bn: 'এলগাতো স্ট্রিম ডেক এমকে.২ কাস্টম স্টুডিও কন্ট্রোলার',
    desc_bn: '১৫টি কাস্টমাইজযোগ্য এলসিডি কি, ওয়ান-টাচ অডিও মিক্সিং এবং লাইভ স্ট্রিমিং অটোমেশন।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p17: {
    title_bn: 'সোনি জেডভি-ই১০ মিররলেস ভ্লগ ক্যামেরা ৪কে',
    desc_bn: '২৪.২ মেগাপিক্সেল এপিএস-সি সেন্সর, ৪কে এইচডিআর ভিডিও এবং ডেডিকেটেড ব্যাকগ্রাউন্ড ব্লার বোকেহ মোড।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p18: {
    title_bn: 'ফিলিপস হিউ স্মার্ট অ্যাম্বিয়েন্ট গ্রেডিয়েন্ট লাইটস্ট্রিপ',
    desc_bn: '১৬ মিলিয়ন আরজিবি কালার, ভয়েস অ্যাসিস্ট্যান্ট কন্ট্রোল এবং মিউজিক ও স্ক্রিন সিঙ্ক প্রযুক্তি।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p19: {
    title_bn: 'নেস্ট লার্নিং স্মার্ট থার্মোস্ট্যাট ৪র্থ প্রজন্ম',
    desc_bn: 'এনার্জি সেভিং এআই টেম্পারেচার কন্ট্রোল এবং স্মার্টফোন থেকে সার্বক্ষণিক অটোমেশন।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p20: {
    title_bn: 'অ্যাঙ্কার প্রাইম ২০,০০০ মিলিঅ্যাম্পিয়ার ফাস্ট পাওয়ার ব্যাংক',
    desc_bn: '২০০ ওয়াট আল্ট্রা-ফাস্ট চার্জিং, স্মার্ট ডিজিটাল কালার ডিসপ্লে এবং ল্যাপটপ ও ফোন চার্জ সাপোর্ট।',
    category_bn: 'ডেস্ক সেটআপ ও কেবল',
  },
};

export interface LocalizedProductData {
  title: string;
  description: string;
  category: string;
  formattedPrice: string;
  formattedOriginalPrice?: string;
  ratingFormatted: string;
  reviewsFormatted: string;
}

export const getLocalizedProduct = (product: Partial<Product> | any, lang: Language = 'bn'): LocalizedProductData => {
  if (!product) {
    return {
      title: '',
      description: '',
      category: '',
      formattedPrice: '৳০',
      ratingFormatted: '৫.০',
      reviewsFormatted: '০',
    };
  }

  const trans = product._id ? PRODUCT_TRANSLATIONS[product._id] : undefined;
  const title = lang === 'bn' && trans?.title_bn ? trans.title_bn : (product.title || '');
  const description = lang === 'bn' && trans?.desc_bn ? trans.desc_bn : (product.description || '');
  const category = getLocalizedCategory(product.category || '', lang);

  const rawPrice = typeof product.price === 'number' ? product.price : 0;
  const displayPrice =
    product.isFlashSale && typeof product.discountPrice === 'number'
      ? product.discountPrice
      : typeof product.discountPrice === 'number'
      ? product.discountPrice
      : rawPrice;

  const formattedPrice = formatCurrency(displayPrice, lang);
  const formattedOriginalPrice =
    product.isFlashSale && typeof product.discountPrice === 'number' ? formatCurrency(rawPrice, lang) : undefined;

  const avgRating = typeof product.averageRating === 'number' ? product.averageRating : typeof product.rating === 'number' ? product.rating : 4.9;
  const ratingFormatted = lang === 'bn' ? toBengaliNumber(avgRating.toFixed(1)) : avgRating.toFixed(1);

  const totalReviews = typeof product.totalReviews === 'number' ? product.totalReviews : 0;
  const reviewsFormatted = lang === 'bn' ? toBengaliNumber(totalReviews) : totalReviews.toString();

  return {
    title,
    description,
    category,
    formattedPrice,
    formattedOriginalPrice,
    ratingFormatted,
    reviewsFormatted,
  };
};
