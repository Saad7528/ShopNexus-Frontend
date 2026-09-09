import { Product } from '@/store/useProductStore';
import { IBundleDeal } from '@/data/bundles';
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

export interface ProductTranslationItem {
  title_en: string;
  title_bn: string;
  desc_en: string;
  desc_bn: string;
  category_bn?: string;
  badge_en?: string;
  badge_bn?: string;
}

// Check if a string contains Bengali Unicode characters
export const hasBengaliChars = (text: string): boolean => {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
};

// Comprehensive bilingual dictionary for all catalog items and combos
export const PRODUCT_TRANSLATIONS: Record<string, ProductTranslationItem> = {
  p1: {
    title_en: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    title_bn: 'সোনি WH-1000XM5 ওয়্যারলেস নয়েজ-ক্যানসেলিং হেডফোন',
    desc_en: 'Industry-leading noise cancellation with two processors and 8 microphones, 30-hour battery life, and crystal clear calling.',
    desc_bn: 'দুটি প্রসেসর ও ৮টি মাইক্রোফোন সহ শীর্ষস্থানীয় অ্যাক্টিভ নয়েজ ক্যানসেলেশন, ৩০ ঘণ্টার ব্যাটারি লাইফ ও ক্রিস্টাল ক্লিয়ার সাউন্ড।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p2: {
    title_en: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    title_bn: 'বোস কোয়াইট-কমফোর্ট আল্ট্রা স্পেশিয়াল অডিও হেডফোন',
    desc_en: 'Groundbreaking spatial audio for immersive music listening, custom active noise cancellation, and all-day premium comfort.',
    desc_bn: 'ইমারসিভ মিউজিক লিসেনিংয়ের জন্য যুগান্তকারী স্পেশিয়াল অডিও, কাস্টম অ্যাক্টিভ নয়েজ ক্যানসেলেশন ও প্রিমিয়াম কমফোর্ট।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p3: {
    title_en: 'Apple AirPods Max (Space Gray) with Smart Case',
    title_bn: 'অ্যাপল এয়ারপডস ম্যাক্স (স্পেস গ্রে) উইথ স্মার্ট কেস',
    desc_en: 'High-fidelity audio with dynamic head tracking, active noise cancellation, and computational audio in an anodized aluminum frame.',
    desc_bn: 'ডায়নামিক হেড ট্র্যাকিং এবং কম্পিউটেশনাল অ্যাকোস্টিক সহ হাই-ফিডেলিটি প্রিমিয়াম অ্যালুমিনিয়াম অডিও হেডসেট।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p4: {
    title_en: 'Marshall Stanmore III Bluetooth Premium Home Speaker',
    title_bn: 'মার্শাল স্ট্যানমোর ৩ ব্লুটুথ প্রিমিয়াম হোম স্পিকার',
    desc_en: 'Classic vintage styling paired with re-engineered room-filling soundstage and tactile brass analog control knobs.',
    desc_bn: 'ক্লাসিক ভিন্টেজ স্টাইলিং সহ রুম-ভরা সাউন্ডস্টেজ ও নিখুঁত ব্রাস কন্ট্রোল নব অডিও স্পিকার।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p5: {
    title_en: 'Sennheiser Momentum 4 Wireless Audiophile Headphones',
    title_bn: 'সেনহাইজার মোমেন্টাম ৪ ওয়্যারলেস অডিওফাইল হেডফোন',
    desc_en: 'Audiophile-grade 42mm transducer system with 60 hours battery backup and intelligent adaptive noise cancellation.',
    desc_bn: 'অডিওফাইল মানের ৪২ মিমি ড্রাইভার, ৬০ ঘণ্টার ব্যাটারি ব্যাকআপ এবং অ্যাডাপটিভ নয়েজ ক্যানসেলেশন।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p6: {
    title_en: 'Shure SM7B Professional Broadcast Studio Microphone',
    title_bn: 'শুয়ার SM7B প্রফেশনাল ব্রডকাস্ট মাইক্রোফোন',
    desc_en: 'The industry benchmark dynamic microphone trusted worldwide by elite podcasters, broadcasters, and vocalists.',
    desc_bn: 'বিশ্বজুড়ে শীর্ষস্থানীয় পডকাস্টার ও মিউজিশিয়ানদের পছন্দের ডায়নামিক স্টুডিও গ্রেড মাইক্রোফোন।',
    category_bn: 'অডিও ও সাউন্ড',
  },
  p7: {
    title_en: 'Apple Watch Ultra 2 GPS + Cellular Titanium 49mm',
    title_bn: 'অ্যাপল ওয়াচ আল্ট্রা ২ জিপিএস + সেলুলার টাইটানিয়াম',
    desc_en: 'Rugged 49mm aerospace-grade titanium case with ultra-bright 3000-nit display, dual-frequency GPS, and multi-day battery.',
    desc_bn: 'অ্যারোস্পেস গ্রেড ৪৯ মিমি টাইটানিয়াম বডি, ৩০০০ নিটস উজ্জ্বল ডিসপ্লে এবং অল-ডে ব্যাটারি লাইফ।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p8: {
    title_en: 'Garmin Fenix 7 Pro Solar Multisport GPS Smartwatch',
    title_bn: 'গারমিন ফেনিক্স ৭ প্রো সোলার জিপিএস স্মার্টওয়াচ',
    desc_en: 'Solar-powered multisport endurance watch with built-in LED flashlight, advanced hill score, and topography navigation.',
    desc_bn: 'সোলার চার্জিং লেন্স, অ্যাডভান্সড ট্রেনিং মেট্রিক্স এবং বিল্ট-ইন এলইডি ফ্ল্যাশলাইট স্পোর্টস ওয়াচ।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p9: {
    title_en: 'Samsung Galaxy Watch 6 Classic 47mm Bluetooth',
    title_bn: 'স্যামসাং গ্যালাক্সি ওয়াচ ৬ ক্লাসিক ৪৭ মিমি',
    desc_en: 'Signature rotating bezel, sapphire crystal glass, advanced sleep coaching, and bioactive cardiovascular health sensor.',
    desc_bn: 'রোটেটিং বেজেল, স্যাফায়ার ক্রিস্টাল গ্লাস এবং অ্যাডভান্সড বডি কম্পোজিশন ও হেলথ সেন্সর।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p10: {
    title_en: 'Huawei Watch GT 4 Brown Leather Edition (46mm)',
    title_bn: 'হুয়াওয়ে ওয়াচ জিটি ৪ ব্রাউন লেদার এডিশন',
    desc_en: 'Classic octagonal geometric aesthetics with up to 14 days of ultra-long battery life and TruSeen 5.5+ heart monitoring.',
    desc_bn: 'ক্লাসিক জ্যামিতিক ডিজাইন, ১৪ দিনের দীর্ঘস্থায়ী ব্যাটারি এবং সুনির্দিষ্ট স্লিপ ট্র্যাকিং।',
    category_bn: 'স্মার্টওয়াচ ও পরিধানযোগ্য',
  },
  p11: {
    title_en: 'Keychron Q1 Pro Wireless Custom CNC Mechanical Keyboard',
    title_bn: 'কিক্রন কিউ১ প্রো সিএনসি কাস্টম মেকানিক্যাল কিবোর্ড',
    desc_en: 'Full aluminum CNC machined body, Bluetooth 5.1 wireless, hot-swappable switches, and double-gasket acoustic mount design.',
    desc_bn: 'সম্পূর্ণ অ্যালুমিনিয়াম সিএনসি বডি, ব্লুটুথ ৫.১ ওয়্যারলেস, হট-সোয়াপ গ্যাস্কেট মাউন্ট কিবোর্ড।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p12: {
    title_en: 'Logitech MX Master 3S Wireless Performance Mouse',
    title_bn: 'লজিটেক MX মাস্টার ৩এস ওয়্যারলেস পারফরম্যান্স মাউস',
    desc_en: '8K DPI track-on-glass optical sensor with quiet clicks, ergonomic thumb rest, and MagSpeed electromagnetic scroll wheel.',
    desc_bn: '৮কে ডিপিআই গ্লাস ট্র্যাকিং, নিঃশব্দ ক্লিক এবং আল্ট্রাফাস্ট ম্যাগস্পিড ইলেক্ট্রোম্যাগনেটিক স্ক্রোল।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p13: {
    title_en: 'Razer Huntsman V3 Pro Analog Optical Gaming Keyboard',
    title_bn: 'রেজার হান্টsman ভি৩ প্রো এনালগ গেমিং কিবোর্ড',
    desc_en: '2nd-Gen Analog Optical Switches with rapid trigger mode, 0.1-4.0mm adjustable actuation, and magnetic leatherette wrist rest.',
    desc_bn: '২য় প্রজন্মের অপটিক্যাল সুইচ, এডজাস্টেবল অ্যাকচুয়েশন পয়েন্ট এবং র‍্যাপিড ট্রিগার গেমিং প্রযুক্তি।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p14: {
    title_en: 'HyperX Pulsefire Haste 2 Wireless Ultra-Lightweight Mouse',
    title_bn: 'হায়পারএক্স পালসফায়ার হ্যাস্ট ২ ওয়্যারলেস আল্ট্রালাইট মাউস',
    desc_en: 'Featherlight 61-gram solid shell design with 26K DPI precision sensor, dual wireless connectivity, and 100-hour battery life.',
    desc_bn: 'মাত্র ৬১ গ্রাম ওজনের হালকা গেমিং মাউস, ২৬কে ডিপিআই সেন্সর এবং ১০০ ঘণ্টার দীর্ঘস্থায়ী ব্যাটারি।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p15: {
    title_en: 'NuPhy Air75 V2 Ultra-Slim Wireless Mechanical Keyboard',
    title_bn: 'নুফি এয়ার৭৫ ভি২ আল্ট্রা-স্লিম ওয়্যারলেস মেকানিক্যাল কিবোর্ড',
    desc_en: 'Ultra-low-profile hot-swappable switches with 1000Hz 2.4G wireless polling, QMK/VIA support, and seamless Mac/Windows toggle.',
    desc_bn: 'লো-প্রোফাইল মেকানিক্যাল সুইচ, ১০০০ হার্টজ পোলিং রেট এবং ম্যাক ও উইন্ডোজ উভয়ের জন্য পারফেক্ট।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p16: {
    title_en: 'Elgato Stream Deck MK.2 Studio Controller (15 LCD Keys)',
    title_bn: 'এলগাতো স্ট্রিম ডেক এমকে.২ কাস্টম স্টুডিও কন্ট্রোলার',
    desc_en: '15 customizable tactile LCD keys to trigger unlimited actions with one-touch audio mixing and live streaming automation.',
    desc_bn: '১৫টি কাস্টমাইজযোগ্য এলসিডি কি, ওয়ান-টাচ অডিও মিক্সিং এবং লাইভ স্ট্রিমিং অটোমেশন।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p17: {
    title_en: 'Sony ZV-E10 Mirrorless 4K Vlog Camera (Body)',
    title_bn: 'সোনি জেডভি-ই১০ মিররলেস ভ্লগ ক্যামেরা ৪কে',
    desc_en: '24.2 MP APS-C sensor with 4K HDR video, directional 3-capsule mic with windscreen, and one-touch background defocus bokeh.',
    desc_bn: '২৪.২ মেগাপিক্সেল এপিএস-সি সেন্সর, ৪কে এইচডিআর ভিডিও এবং ডেডিকেটেড ব্যাকগ্রাউন্ড ব্লার বোকেহ মোড।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p18: {
    title_en: 'Philips Hue Play Gradient Lightstrip 65-inch for TV/PC',
    title_bn: 'ফিলিপস হিউ স্মার্ট অ্যাম্বিয়েন্ট গ্রেডিয়েন্ট লাইটস্ট্রিপ',
    desc_en: '16 million seamless blended RGB colors with voice assistant control and intelligent dynamic music & screen syncing.',
    desc_bn: '১৬ মিলিয়ন আরজিবি কালার, ভয়েস অ্যাসিস্ট্যান্ট কন্ট্রোল এবং মিউজিক ও স্ক্রিন সিঙ্ক প্রযুক্তি।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p19: {
    title_en: 'Nest Learning Smart Thermostat 4th Generation',
    title_bn: 'নেস্ট লার্নিং স্মার্ট থার্মোস্ট্যাট ৪র্থ প্রজন্ম',
    desc_en: 'Energy-saving AI adaptive temperature scheduling with remote smartphone automation and HVAC smart diagnostics.',
    desc_bn: 'এনার্জি সেভিং এআই টেম্পারেচার কন্ট্রোল এবং স্মার্টফোন থেকে সার্বক্ষণিক অটোমেশন।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p20: {
    title_en: 'Anker Prime 20,000mAh 200W GaN Fast Power Bank Station',
    title_bn: 'অ্যাঙ্কার প্রাইম ২০,০০০ মিলিঅ্যাম্পিয়ার ফাস্ট পাওয়ার ব্যাংক',
    desc_en: 'Ultra-fast 200W total output with smart digital color display, real-time power breakdown, and multi-device fast laptop charging.',
    desc_bn: '২০০ ওয়াট আল্ট্রা-ফাস্ট চার্জিং, স্মার্ট ডিজিটাল কালার ডিসপ্লে এবং ল্যাপটপ ও ফোন চার্জ সাপোর্ট।',
    category_bn: 'ডেস্ক সেটআপ ও কেবল',
  },
  p21: {
    title_en: 'DJI Osmo Pocket 3 Creator Combo 4K Handheld Gimbal',
    title_bn: 'ডিজেআই ওসমো পকেট ৩ ক্রিয়েটর কম্বো ৪কে জিম্বাল',
    desc_en: '1-inch CMOS sensor, 4K/120fps recording, 2-inch rotatable OLED screen, and 3-axis mechanical gimbal stabilization.',
    desc_bn: '১ ইঞ্চি সিএমওএস সেন্সর, ৪কে/১২০এফপিএস রেকর্ডিং, ২ ইঞ্চি রোটেটিং ওলেড ডিসপ্লে ও ৩-অ্যাক্সিস মেকানিক্যাল জিম্বাল স্ট্যাবিলাইজেশন।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p22: {
    title_en: 'Elgato Stream Deck MK.2 Studio Controller (15 LCD Keys)',
    title_bn: 'এলগাতো স্ট্রিম ডেক এমকে.২ স্টুডিও কন্ট্রোলার',
    desc_en: '15 customizable tactile LCD keys to trigger unlimited macros and live broadcast transitions.',
    desc_bn: '১৫টি কাস্টমাইজযোগ্য এলসিডি কি, ওয়ান-টাচ অডিও মিক্সিং এবং লাইভ স্ট্রিমিং অটোমেশন।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p23: {
    title_en: 'Shure MV7+ Podcast Dynamic Hybrid Microphone (XLR/USB)',
    title_bn: 'শুয়ার MV7+ পডকাস্ট ডায়নামিক হাইব্রিড মাইক্রোফোন',
    desc_en: 'Customizable LED touch panel, onboard DSP, Voice Isolation Technology, and multi-color RGB strip.',
    desc_bn: 'কাস্টমাইজযোগ্য এলইডি টাচ প্যানেল, অনবোর্ড ডিএসপি ও ভয়েস আইসোলেশন প্রযুক্তি সহ প্রফেশনাল মাইক্রোফোন।',
    category_bn: 'ক্রিয়েটর গিয়ার ও স্টুডিও',
  },
  p24: {
    title_en: 'Anker Prime 20,000mAh 200W GaN Power Bank Station',
    title_bn: 'অ্যাঙ্কার প্রাইম ২০,০০০ মিলিঅ্যাম্পিয়ার ২০০ ওয়াট পাওয়ার ব্যাংক',
    desc_en: 'Ultra-fast 200W total output with smart digital display, power breakdown, and multi-device fast charging.',
    desc_bn: '২০০ ওয়াট আল্ট্রা-ফাস্ট চার্জিং, স্মার্ট ডিজিটাল কালার ডিসপ্লে এবং ল্যাপটপ ও ফোন চার্জ সাপোর্ট।',
    category_bn: 'কিবোর্ড ও মাউস',
  },
  p25: {
    title_en: 'Philips Hue Play Gradient Lightstrip 65-inch for TV/PC',
    title_bn: 'ফিলিপস হিউ প্লে গ্রেডিয়েন্ট লাইটস্ট্রিপ ৬৫-ইঞ্চি',
    desc_en: 'Blends multiple colors of seamless reactive light simultaneously behind your monitor or entertainment center.',
    desc_bn: '১৬ মিলিয়ন আরজিবি কালার এবং মিউজিক ও স্ক্রিন কালার সিঙ্ক স্মার্ট লাইটিং স্ট্রিপ।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p26: {
    title_en: 'Dyson Purifier Hot+Cool Gen1 Air Purifier & Fan',
    title_bn: 'ডাইসন পিউরিফায়ার হট+কুল জেন১ এয়ার পিউরিফায়ার',
    desc_en: 'Fully sealed HEPA H13 filtration removes 99.97% of pollutants, with intelligent thermal regulation and room airflow.',
    desc_bn: 'এইচইপিএ এইচ১৩ ফিল্ট্রেশন সহ ৯৯.৯৭% দূষণমুক্ত বাতাস এবং তাপমাত্রা নিয়ন্ত্রণকারী প্রিমিয়াম পিউরিফায়ার।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p27: {
    title_en: 'Nanoleaf Shapes Hexagons Modular LED Smart Panels',
    title_bn: 'ন্যানোফ লিফ শেপস হেক্সাগন মডুলার স্মার্ট এলইডি প্যানেল',
    desc_en: 'Touch-sensitive modular smart lighting tiles with dynamic music visualizer rhythm synchronization.',
    desc_bn: 'টাচ-সেনসিটিভ মডুলার স্মার্ট আরজিবি লাইটিং টাইলস এবং ডায়নামিক মিউজিক সিঙ্ক রিদম।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p28: {
    title_en: 'Ecobee Smart Thermostat Premium with Voice Control',
    title_bn: 'ইকোবি স্মার্ট থার্মোস্ট্যাট প্রিমিয়াম উইথ ভয়েস কন্ট্রোল',
    desc_en: 'Zinc bezel with built-in air quality monitor, radar occupancy sensing, and Apple HomeKit / Alexa support.',
    desc_bn: 'বিল্ট-ইন এয়ার কোয়ালিটি মনিটর, রাডার অকুপেন্সি সেন্সর এবং স্মার্ট হোম অটোমেশন থার্মোস্ট্যাট।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },
  p29: {
    title_en: 'Level Lock+ Smart Deadbolt with Apple Home Key',
    title_bn: 'লেভেল লক+ স্মার্ট ডেডবোল্ট উইথ অ্যাপল হোম কি',
    desc_en: 'Invisible smart lock technology hidden entirely inside the door with tap-to-unlock NFC and remote access.',
    desc_bn: 'অদৃশ্য স্মার্ট লক প্রযুক্তি, এনএফসি ট্যাপ-টু-আনলক এবং স্মার্টফোন রিমোট কন্ট্রোল সাপোর্ট।',
    category_bn: 'স্মার্ট হোম ও লিভিং',
  },

  // --- COMBO PACKAGES & BUNDLES ---
  'combo-1': {
    title_en: 'Ultimate Audiophile Master Combo (Sony XM5 + Bose QC Ultra)',
    title_bn: 'আল্টিমেট অডিওফাইল মাস্টার কম্বো (সোনি XM5 + বোস QC আল্ট্রা)',
    desc_en: 'The ultimate combination of Hi-Fi acoustics and noise cancellation. Save ৳10,710 + get 600 bonus loyalty points!',
    desc_bn: 'হাই-ফাই মিউজিক ও নয়েজ ক্যান্সেলেশনের সেরা কম্বিনেশন। একসাথে কিনলে ১০,৭১০ টাকা সাশ্রয় ও ৬০০ লয়্যালটি পয়েন্ট বোনাস!',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '🔥 15% OFF COMBO',
    badge_bn: '🔥 ১৫% ছাড় কম্বো',
  },
  'b-1': {
    title_en: 'Ultimate Audiophile Master Combo (Sony XM5 + Bose QC Ultra)',
    title_bn: 'আল্টিমেট অডিওফাইল মাস্টার কম্বো (সোনি XM5 + বোস QC আল্ট্রা)',
    desc_en: 'The ultimate combination of Hi-Fi acoustics and noise cancellation. Save ৳10,710 + get 600 bonus loyalty points!',
    desc_bn: 'হাই-ফাই মিউজিক ও নয়েজ ক্যান্সেলেশনের সেরা কম্বিনেশন। একসাথে কিনলে ১০,৭১০ টাকা সাশ্রয় ও ৬০০ লয়্যালটি পয়েন্ট বোনাস!',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '🔥 15% OFF BUNDLE',
    badge_bn: '🔥 ১৫% ছাড় বান্ডেল',
  },
  'combo-2': {
    title_en: 'Titanium Creator Pro Suite (Apple Watch Ultra 2 + Keychron Q1 Pro)',
    title_bn: 'টাইটানিয়াম ক্রিয়েটর প্রো স্যুট (অ্যাপল ওয়াচ আল্ট্রা ২ + কিক্রন Q1 প্রো)',
    desc_en: 'Premium aerospace smartwatch and CNC mechanical keyboard combo to supercharge productivity and lifestyle.',
    desc_bn: 'স্মার্ট লাইফস্টাইল ও প্রোডাক্টিভিটি বুস্ট করার জন্য প্রিমিয়াম স্মার্টওয়াচ এবং মেকানিক্যাল কিবোর্ড কম্বো।',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '⭐ POPULAR COMBO',
    badge_bn: '⭐ জনপ্রিয় কম্বো',
  },
  'b-2': {
    title_en: 'Titanium Creator Pro Suite (Apple Watch Ultra 2 + Keychron Q1 Pro)',
    title_bn: 'টাইটানিয়াম ক্রিয়েটর প্রো স্যুট (অ্যাপল ওয়াচ আল্ট্রা ২ + কিক্রন Q1 প্রো)',
    desc_en: 'Premium aerospace smartwatch and CNC mechanical keyboard combo to supercharge productivity and lifestyle.',
    desc_bn: 'স্মার্ট লাইফস্টাইল ও প্রোডাক্টিভিটি বুস্ট করার জন্য প্রিমিয়াম স্মার্টওয়াচ এবং মেকানিক্যাল কিবোর্ড কম্বো।',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '⭐ POPULAR COMBO',
    badge_bn: '⭐ জনপ্রিয় কম্বো',
  },
  'combo-3': {
    title_en: 'Esports Competitive Duo (Razer Viper V2 Pro + Keychron Q1 Pro)',
    title_bn: 'ই-স্পোর্টস কম্পিটিটিভ ডুয়ো (রেজার ভাইপার V2 প্রো + কিক্রন Q1 প্রো)',
    desc_en: 'Ultra-lightweight wireless esports gaming mouse and custom acoustic mechanical keyboard package.',
    desc_bn: 'আল্ট্রা-লাইটওয়েট ওয়্যারলেস গেমিং মাউস ও মেকানিক্যাল কাস্টম কিবোর্ড কম্বো।',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '🎮 GAMER SPECIAL',
    badge_bn: '🎮 গেমার স্পেশাল',
  },
  'b-3': {
    title_en: 'Esports Competitive Duo (Razer Viper V2 Pro + Keychron Q1 Pro)',
    title_bn: 'ই-স্পোর্টস কম্পিটিটিভ ডুয়ো (রেজার ভাইপার V2 প্রো + কিক্রন Q1 প্রো)',
    desc_en: 'Ultra-lightweight wireless esports gaming mouse and custom acoustic mechanical keyboard package.',
    desc_bn: 'আল্ট্রা-লাইটওয়েট ওয়্যারলেস গেমিং মাউস ও মেকানিক্যাল কাস্টম কিবোর্ড কম্বো।',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '🎮 GAMER SPECIAL',
    badge_bn: '🎮 গেমার স্পেশাল',
  },
  'watch-combo': {
    title_en: 'Apple Watch Ultra 2 + Garmin Fenix 7 Pro Combo',
    title_bn: 'অ্যাপল ওয়াচ আল্ট্রা ২ + গারমিন ফেনিক্স ৭ প্রো স্মার্টওয়াচ কম্বো',
    desc_en: 'Special curated hardware combo bundle: Get maximum savings on premium smartwatches with bonus loyalty points.',
    desc_bn: 'বিশেষ প্যাকেজ অফার: প্রিমিয়াম স্মার্টওয়াচ কম্বোতে আকর্ষণীয় সাশ্রয় ও বোনাস লয়্যালটি পয়েন্ট।',
    category_bn: '🎁 কম্বো প্যাকেজ ও বান্ডেল',
    badge_en: '🔥 15% OFF BUNDLE',
    badge_bn: '🔥 ১৫% ছাড় বান্ডেল',
  },
};

/**
 * Brand & Keyword Dictionary for Smart Universal Transliteration & Auto-Translation
 */
const BENGALI_WORD_MAP: Array<[RegExp, string]> = [
  // Brands
  [/\bSony\b/gi, 'সোনি'],
  [/\bBose\b/gi, 'বোস'],
  [/\bMarshall\b/gi, 'মার্শাল'],
  [/\bShure\b/gi, 'শুয়ার'],
  [/\bApple\b/gi, 'অ্যাপল'],
  [/\bKeychron\b/gi, 'কিক্রন'],
  [/\bRazer\b/gi, 'রেজার'],
  [/\bLogitech\b/gi, 'লজিটেক'],
  [/\bSamsung\b/gi, 'স্যামসাং'],
  [/\bHuawei\b/gi, 'হুয়াওয়ে'],
  [/\bDJI\b/gi, 'ডিজেআই'],
  [/\bElgato\b/gi, 'এলগাতো'],
  [/\bAnker\b/gi, 'অ্যাঙ্কার'],
  [/\bPhilips\b/gi, 'ফিলিপস'],
  [/\bDyson\b/gi, 'ডাইসন'],
  [/\bNanoleaf\b/gi, 'ন্যানোফ লিফ'],
  [/\bEcobee\b/gi, 'ইকোবি'],
  [/\bLevel\b/gi, 'লেভেল'],
  [/\bHyperX\b/gi, 'হায়পারএক্স'],
  [/\bNuPhy\b/gi, 'নুফি'],
  [/\bGarmin\b/gi, 'গারমিন'],
  [/\bSennheiser\b/gi, 'সেনহাইজার'],
  [/\bStanmore\b/gi, 'স্ট্যানমোর'],
  [/\bQuietComfort\b/gi, 'কোয়াইট-কমফোর্ট'],
  [/\bAirPods\b/gi, 'এয়ারপডস'],
  [/\bViper\b/gi, 'ভাইপার'],
  [/\bHuntsman\b/gi, 'হান্টসম্যান'],

  // Categories & Core Terms
  [/\bCombo Suite\b/gi, 'কম্বো স্যুট'],
  [/\bCombo\b/gi, 'কম্বো'],
  [/\bSuite\b/gi, 'স্যুট'],
  [/\bBundle\b/gi, 'বান্ডেল'],
  [/\bPackages?\b/gi, 'প্যাকেজ'],
  [/\bWireless\b/gi, 'ওয়্যারলেস'],
  [/\bNoise-Cancelling\b/gi, 'নয়েজ-ক্যানসেলিং'],
  [/\bNoise Cancelling\b/gi, 'নয়েজ ক্যানসেলিং'],
  [/\bHeadphones?\b/gi, 'হেডফোন'],
  [/\bEarbuds?\b/gi, 'ইয়ারবাডস'],
  [/\bEarphones?\b/gi, 'ইয়ারফোন'],
  [/\bSpeakers?\b/gi, 'স্পিকার'],
  [/\bMicrophones?\b/gi, 'মাইক্রোফোন'],
  [/\bSmartwatch\b/gi, 'স্মার্টওয়াচ'],
  [/\bWatch\b/gi, 'ওয়াচ'],
  [/\bKeyboards?\b/gi, 'কিবোর্ড'],
  [/\bMechanical\b/gi, 'মেকানিক্যাল'],
  [/\bMice\b/gi, 'মাউস'],
  [/\bMouse\b/gi, 'মাউস'],
  [/\bCameras?\b/gi, 'ক্যামেরা'],
  [/\bLightstrips?\b/gi, 'লাইটস্ট্রিপ'],
  [/\bThermostats?\b/gi, 'থার্মোস্ট্যাট'],
  [/\bPower Banks?\b/gi, 'পাওয়ার ব্যাংক'],
  [/\bGimbals?\b/gi, 'জিম্বাল'],
  [/\bControllers?\b/gi, 'কন্ট্রোলার'],
  [/\bSpatial Audio\b/gi, 'স্পেশিয়াল অডিও'],
  [/\bDynamic\b/gi, 'ডায়নামিক'],
  [/\bAudiophile\b/gi, 'অডিওফাইল'],
  [/\bMaster\b/gi, 'মাস্টার'],
  [/\bCreator\b/gi, 'ক্রিয়েটর'],
  [/\bPro\b/gi, 'প্রো'],
  [/\bUltra\b/gi, 'আল্ট্রা'],
  [/\bMax\b/gi, 'ম্যাক্স'],
  [/\bPlus\b/gi, 'প্লাস'],
  [/\bClassic\b/gi, 'ক্লাসিক'],
  [/\bTitanium\b/gi, 'টাইটানিয়াম'],
  [/\bCompetitive\b/gi, 'কম্পিটিটিভ'],
  [/\bDuo\b/gi, 'ডুয়ো'],
  [/\bSpecial\b/gi, 'স্পেশাল'],
  [/\bEdition\b/gi, 'এডিশন'],
  [/\bStarter Kit\b/gi, 'স্টার্টার কিট'],
];

/**
 * Universal Auto-Translator for English Product / Combo titles into fluent Bengali
 */
export const autoTranslateTitleToBengali = (title: string): string => {
  if (!title) return '';
  if (hasBengaliChars(title)) return title;

  let translated = title;
  for (const [pattern, replacement] of BENGALI_WORD_MAP) {
    translated = translated.replace(pattern, replacement);
  }

  // Handle common trailing digits or models like "III" -> "৩", "3S" -> "৩এস", "II" -> "২"
  translated = translated
    .replace(/\bIII\b/g, '৩')
    .replace(/\bII\b/g, '২')
    .replace(/\bIV\b/g, '৪')
    .replace(/\bV\b/g, '৫');

  return translated;
};

/**
 * Universal Auto-Translator for Bengali Titles back into standard English
 */
export const autoTranslateTitleToEnglish = (title: string): string => {
  if (!title) return '';
  if (!hasBengaliChars(title)) return title;

  // If title is pure Bengali, check reverse lookup in dictionary
  for (const item of Object.values(PRODUCT_TRANSLATIONS)) {
    if (item.title_bn === title || title.includes(item.title_bn)) {
      return item.title_en;
    }
  }

  return title;
};

export interface LocalizedProductData {
  title: string;
  description: string;
  category: string;
  badge?: string;
  formattedPrice: string;
  formattedOriginalPrice?: string;
  ratingFormatted: string;
  reviewsFormatted: string;
}

/**
 * Smart Bilingual Resolver for Products and Combo Packages
 * Supports direct dictionary lookup, slug matching, semantic title matching, and universal auto-translation.
 */
export const getLocalizedProduct = (product: Partial<Product> | any, lang: Language = 'bn'): LocalizedProductData => {
  if (!product) {
    return {
      title: '',
      description: '',
      category: '',
      formattedPrice: lang === 'bn' ? '৳০' : '৳0',
      ratingFormatted: lang === 'bn' ? '৫.০' : '5.0',
      reviewsFormatted: lang === 'bn' ? '০' : '0',
    };
  }

  // 1. Precise lookup by _id, slug, or id
  const lookupKey = (product._id || product.slug || product.id || '').toString();
  let trans = PRODUCT_TRANSLATIONS[lookupKey] || (product.slug ? PRODUCT_TRANSLATIONS[product.slug] : undefined);

  // 2. Fallback lookup by normalized title
  if (!trans && product.title) {
    const slugified = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    trans = PRODUCT_TRANSLATIONS[slugified];

    if (!trans) {
      for (const item of Object.values(PRODUCT_TRANSLATIONS)) {
        if (
          item.title_en.toLowerCase() === product.title.toLowerCase() ||
          item.title_bn === product.title ||
          product.title.toLowerCase().includes(item.title_en.toLowerCase())
        ) {
          trans = item;
          break;
        }
      }
    }
  }

  const isCombo =
    product.category === 'Combo Packages' ||
    (product.tags && product.tags.includes('combo')) ||
    (product.title && /combo|bundle|suite/i.test(product.title));

  let title = '';
  let description = '';
  let badge: string | undefined = undefined;

  if (lang === 'bn') {
    // ----------------------------------------------------
    // BENGALI MODE (বাং)
    // ----------------------------------------------------
    if (trans?.title_bn) {
      title = trans.title_bn;
    } else if (product.title_bn) {
      title = product.title_bn;
    } else if (hasBengaliChars(product.title)) {
      title = product.title;
    } else {
      // Dynamic Auto-Translation from English to Bengali
      title = autoTranslateTitleToBengali(product.title || '');
    }

    if (trans?.desc_bn) {
      description = trans.desc_bn;
    } else if (product.description_bn) {
      description = product.description_bn;
    } else if (hasBengaliChars(product.description)) {
      description = product.description;
    } else {
      // Dynamic Auto-Translation for Description in Bengali mode
      description = isCombo
        ? 'বিশেষ প্যাকেজ অফার: একসাথে একাধিক গ্যাজেটে আকর্ষণীয় সাশ্রয় ও বোনাস লয়্যালটি পয়েন্ট।'
        : `${product.brand ? `${product.brand} ব্র্যান্ডের ` : ''}১০০% অথেনটিক অফিসিয়াল গ্যাজেট, ম্যানুফ্যাকচারার ওয়ারেন্টি ও ফাস্ট হোম ডেলিভারি সুবিধা সহ।`;
    }

    badge = trans?.badge_bn;
  } else {
    // ----------------------------------------------------
    // ENGLISH MODE (EN)
    // ----------------------------------------------------
    if (trans?.title_en) {
      title = trans.title_en;
    } else if (product.title_en) {
      title = product.title_en;
    } else if (!hasBengaliChars(product.title)) {
      title = product.title || '';
    } else {
      title = autoTranslateTitleToEnglish(product.title || '');
    }

    if (trans?.desc_en) {
      description = trans.desc_en;
    } else if (product.description_en) {
      description = product.description_en;
    } else if (product.description && !hasBengaliChars(product.description)) {
      description = product.description;
    } else {
      description = isCombo
        ? 'Special Curated Bundle: Get extra discount on multiple devices with bonus reward points.'
        : `Authentic ${product.brand || 'premium'} device with manufacturer warranty and fast express delivery.`;
    }

    badge = trans?.badge_en;
  }

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

  const avgRating =
    typeof product.averageRating === 'number'
      ? product.averageRating
      : typeof product.rating === 'number'
      ? product.rating
      : 4.9;
  const ratingFormatted = lang === 'bn' ? toBengaliNumber(avgRating.toFixed(1)) : avgRating.toFixed(1);

  const totalReviews = typeof product.totalReviews === 'number' ? product.totalReviews : 0;
  const reviewsFormatted = lang === 'bn' ? toBengaliNumber(totalReviews) : totalReviews.toString();

  return {
    title,
    description,
    category,
    badge,
    formattedPrice,
    formattedOriginalPrice,
    ratingFormatted,
    reviewsFormatted,
  };
};

export interface LocalizedBundleData {
  title: string;
  badge: string;
  description: string;
  savingsFormatted: string;
  bundlePriceFormatted: string;
  originalTotalFormatted: string;
  rewardPointsFormatted: string;
  cashbackFormatted: string;
  items: Array<{
    id: string;
    title: string;
    image: string;
    regularPrice: number;
    category?: string;
  }>;
}

/**
 * Smart Bilingual Resolver for Bundles
 */
export const getLocalizedBundle = (bundle: IBundleDeal, lang: Language = 'bn'): LocalizedBundleData => {
  const lookupKey = bundle.id || bundle.title.toLowerCase().replace(/\s+/g, '-');
  const trans = PRODUCT_TRANSLATIONS[lookupKey] || PRODUCT_TRANSLATIONS[bundle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')];

  let title = '';
  let description = '';

  if (lang === 'bn') {
    title = trans?.title_bn || bundle.title_bn || autoTranslateTitleToBengali(bundle.title);
    description = trans?.desc_bn || bundle.description_bn || (hasBengaliChars(bundle.description) ? bundle.description : 'বিশেষ প্যাকেজ অফার: একসাথে একাধিক গ্যাজেটে আকর্ষণীয় সাশ্রয় ও বোনাস লয়্যালটি পয়েন্ট।');
  } else {
    title = trans?.title_en || bundle.title_en || autoTranslateTitleToEnglish(bundle.title);
    description = trans?.desc_en || bundle.description_en || (!hasBengaliChars(bundle.description) ? bundle.description : 'Special curated hardware combo bundle: Get maximum savings and bonus loyalty reward points.');
  }

  let badge = bundle.badge;
  if (trans?.badge_bn && lang === 'bn') badge = trans.badge_bn;
  if (trans?.badge_en && lang === 'en') badge = trans.badge_en;
  if (lang === 'bn' && !hasBengaliChars(badge)) {
    badge = badge.replace(/OFF BUNDLE/i, 'ছাড় বান্ডেল').replace(/POPULAR COMBO/i, 'জনপ্রিয় কম্বো').replace(/GAMER SPECIAL/i, 'গেমার স্পেশাল');
  }

  const savingsFormatted = formatCurrency(bundle.savings, lang);
  const bundlePriceFormatted = formatCurrency(bundle.bundlePrice, lang);
  const originalTotalFormatted = formatCurrency(bundle.originalTotal, lang);
  const rewardPointsFormatted = lang === 'bn' ? toBengaliNumber(bundle.rewardPoints) : bundle.rewardPoints.toString();
  const cashbackTaka = Math.floor(bundle.rewardPoints / 10);
  const cashbackFormatted = formatCurrency(cashbackTaka, lang);

  const items = (bundle.items || []).map((it) => {
    const itemTrans = PRODUCT_TRANSLATIONS[`p${it.id}`] || PRODUCT_TRANSLATIONS[it.id];
    let itemTitle = it.title;
    if (lang === 'bn') {
      itemTitle = itemTrans?.title_bn || autoTranslateTitleToBengali(it.title);
    } else {
      itemTitle = itemTrans?.title_en || autoTranslateTitleToEnglish(it.title);
    }
    return {
      ...it,
      title: itemTitle,
    };
  });

  return {
    title,
    badge,
    description,
    savingsFormatted,
    bundlePriceFormatted,
    originalTotalFormatted,
    rewardPointsFormatted,
    cashbackFormatted,
    items,
  };
};
