import { NextRequest, NextResponse } from 'next/server';

export interface CatalogItem {
  _id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
  features: string[];
}

// 📦 Full Verified ShopNexus Catalog Database (in ৳ BDT)
const SHOPNEXUS_CATALOG_DATABASE: CatalogItem[] = [
  // --- AUDIO & ACOUSTICS ---
  {
    _id: 'prod_sony_xm5',
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    category: 'Audio',
    brand: 'Sony',
    price: 38000,
    discountPrice: 32500,
    rating: 4.9,
    reviews: 248,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    description: 'Industry-leading noise cancellation with 8 microphones, 30-hour battery, and crystal clear LDAC high-res audio.',
    tags: ['audio', 'headphone', 'headphones', 'wireless', 'anc', 'noise-cancelling', 'sony', 'গান', 'হেডফোন', 'সাউন্ড'],
    features: ['30-Hour Battery Life', 'Industry-Leading ANC', 'Auto NC Optimizer', 'Multipoint Bluetooth 5.3'],
  },
  {
    _id: 'prod_bose_qc_ultra',
    title: 'Bose QuietComfort Ultra Spatial Audio Headphones',
    category: 'Audio',
    brand: 'Bose',
    price: 45000,
    discountPrice: 39500,
    rating: 4.8,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    description: 'Breakthrough spatialized audio with CustomTune noise cancellation and ultra-plush comfort earcups.',
    tags: ['audio', 'headphone', 'headphones', 'bose', 'spatial', 'anc', 'হেডফোন', 'সাউন্ড', 'গান'],
    features: ['Spatialized Immersion Audio', 'CustomTune ANC', 'Ultra-Plush Earcups', '24-Hour Playtime'],
  },
  {
    _id: 'prod_airpods_max',
    title: 'Apple AirPods Max Wireless Headphone (Space Gray)',
    category: 'Audio',
    brand: 'Apple',
    price: 80000,
    discountPrice: 68000,
    rating: 4.9,
    reviews: 320,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
    description: 'Computational acoustics with Apple H1 headphone chips, dynamic head tracking, and anodized aluminum cups.',
    tags: ['audio', 'headphone', 'apple', 'airpods', 'airpod', 'max', 'হালকা', 'হেডফোন', 'গান'],
    features: ['Apple H1 Chips', 'Spatial Audio with Head Tracking', 'Anodized Aluminum Cups', 'Transparency Mode'],
  },
  {
    _id: 'prod_marshall_emberton',
    title: 'Marshall Emberton II Portable Bluetooth Speaker',
    category: 'Audio',
    brand: 'Marshall',
    price: 23800,
    discountPrice: 18500,
    rating: 4.9,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    description: 'Iconic Marshall sound in a rugged IP67 waterproof design with 30+ hours of portable playtime.',
    tags: ['audio', 'speaker', 'bluetooth', 'marshall', 'portable', 'স্পিকার', 'গান', 'সাউন্ড'],
    features: ['30+ Hours Battery', 'True Stereophonic 360° Sound', 'IP67 Waterproof & Dustproof', 'Stack Mode Support'],
  },
  {
    _id: 'prod_marshall_stanmore',
    title: 'Marshall Stanmore III Bluetooth Home Speaker',
    category: 'Audio',
    brand: 'Marshall',
    price: 42000,
    discountPrice: 36500,
    rating: 4.7,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800',
    description: 'Room-filling home audio powerhouse with classic vintage styling and tactile brass analog knobs.',
    tags: ['audio', 'speaker', 'home-theater', 'marshall', 'স্পিকার', 'হোম থিয়েটার', 'সাউন্ড'],
    features: ['Wider Soundstage', 'Classic Vintage Brass Dials', 'RCA & 3.5mm Aux Inputs', 'Dynamic Loudness Bass'],
  },
  {
    _id: 'prod_sennheiser_m4',
    title: 'Sennheiser Momentum 4 Audiophile Wireless Headphones',
    category: 'Audio',
    brand: 'Sennheiser',
    price: 36000,
    discountPrice: 31000,
    rating: 4.8,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    description: 'Unmatched 60-hour marathon battery life with 42mm audiophile transducer system and adaptive ANC.',
    tags: ['audio', 'headphone', 'sennheiser', 'audiophile', 'হেডফোন', 'সাউন্ড', 'গান'],
    features: ['60-Hour Massive Battery', '42mm Audiophile Transducers', 'Adaptive Noise Cancellation', 'Sound Personalization'],
  },
  {
    _id: 'prod_shure_mv7',
    title: 'Shure MV7 USB/XLR Dynamic Broadcast Microphone',
    category: 'Audio',
    brand: 'Shure',
    price: 28000,
    discountPrice: 24500,
    rating: 4.9,
    reviews: 185,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
    description: 'Broadcast-grade voice isolation microphone with dual USB and XLR connections for podcasting and streaming.',
    tags: ['audio', 'microphone', 'mic', 'podcast', 'studio', 'shure', 'মাইক্রোফোন', 'মাইক', 'রেকর্ডিং'],
    features: ['Dual USB/XLR Output', 'Voice Isolation Technology', 'Built-in Touch Panel', 'Studio Quality Podcast Audio'],
  },

  // --- COMPUTING & WORKSPACE PERIPHERALS ---
  {
    _id: 'prod_keychron_q1',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Computing',
    brand: 'Keychron',
    price: 25000,
    discountPrice: 21500,
    rating: 4.9,
    reviews: 174,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    description: 'Full CNC aluminum body, double-gasket acoustic mount, hot-swappable switches, and QMK/VIA programmability.',
    tags: ['computing', 'keyboard', 'mechanical', 'keychron', 'hot-swap', 'কিবোর্ড', 'মেকানিক্যাল', 'টাইপিং', 'কোডিং'],
    features: ['Full CNC Aluminum Body', 'Hot-Swappable Switches', 'Double-Gasket Acoustic Mount', 'QMK/VIA Programmable'],
  },
  {
    _id: 'prod_gmmk_pro',
    title: 'Glorious GMMK Pro 75% Custom Mechanical Keyboard',
    category: 'Computing',
    brand: 'Glorious',
    price: 22000,
    discountPrice: 18900,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    description: 'Ultra-premium 75% gasket-mounted modular mechanical keyboard with clickable rotary encoder knob.',
    tags: ['computing', 'keyboard', 'glorious', 'gmmk', 'mechanical', 'কিবোর্ড', 'গেমিং'],
    features: ['Rotary Encoder Knob', 'Gasket Mounted Plate', 'Per-Key RGB Lighting', 'Modular Hot-Swap PCB'],
  },
  {
    _id: 'prod_mx_master',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'Computing',
    brand: 'Logitech',
    price: 14500,
    discountPrice: 11500,
    rating: 4.9,
    reviews: 540,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
    description: 'Ultra-quiet clicks with 8K DPI track-on-glass sensor and MagSpeed electromagnetic hyper-fast scrolling.',
    tags: ['computing', 'mouse', 'logitech', 'mx-master', 'productivity', 'মাউস', 'কম্পিউটার'],
    features: ['8K DPI Any-Surface Sensor', 'Quiet Click Switches', 'MagSpeed Electromagnetic Wheel', 'Ergonomic Palm Support'],
  },
  {
    _id: 'prod_dell_ultrasharp',
    title: 'Dell UltraSharp 32" 4K QD-OLED Professional Monitor',
    category: 'Computing',
    brand: 'Dell',
    price: 98000,
    discountPrice: 89900,
    rating: 4.8,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
    description: 'Stunning 4K resolution with 99% DCI-P3 color accuracy, HDR400, and 90W USB-C power delivery hub.',
    tags: ['computing', 'monitor', 'display', 'dell', '4k', 'oled', 'মনিটর', 'ডিসপ্লে', 'কম্পিউটার'],
    features: ['4K QD-OLED Panel', '99% DCI-P3 Color Accuracy', '90W USB-C Power Hub', 'Factory Calibrated Delta E<2'],
  },
  {
    _id: 'prod_caldigit_ts4',
    title: 'CalDigit TS4 Thunderbolt 4 18-Port Workstation Dock',
    category: 'Computing',
    brand: 'CalDigit',
    price: 44000,
    discountPrice: 38500,
    rating: 4.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800',
    description: 'Extreme workstation connectivity with 98W laptop charging, 2.5GbE Ethernet, and dual 6K display support.',
    tags: ['computing', 'dock', 'thunderbolt4', 'hub', 'caldigit', 'ডক', 'ল্যাপটপ', 'চার্জার'],
    features: ['18 Expansion Ports', '98W Laptop Fast Power Delivery', '2.5GbE High-Speed Ethernet', 'Dual 6K Display Support'],
  },
  {
    _id: 'prod_benq_screenbar',
    title: 'BenQ ScreenBar Halo Monitor Light Bar with Wireless Dial',
    category: 'Computing',
    brand: 'BenQ',
    price: 19500,
    discountPrice: 16500,
    rating: 4.7,
    reviews: 93,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    description: 'Auto-dimming eye-care desk lamp with rear backlight illumination and zero screen glare.',
    tags: ['computing', 'lightbar', 'desk-lamp', 'benq', 'লাইট', 'ডেস্ক'],
    features: ['Wireless Precision Dial', 'Zero Screen Glare Design', 'Integrated Rear Backlight', 'Smart Auto-Dimming Sensor'],
  },

  // --- ELECTRONICS & CREATOR GEAR ---
  {
    _id: 'prod_dji_pocket3',
    title: 'DJI Osmo Pocket 3 Creator Combo 4K Gimbal Camera',
    category: 'Electronics',
    brand: 'DJI',
    price: 85000,
    discountPrice: 64000,
    rating: 5.0,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    description: '1-inch CMOS sensor with 3-axis mechanical stabilization, 4K/120fps video, and 2-inch rotatable OLED touchscreen.',
    tags: ['electronics', 'camera', 'gimbal', 'dji', 'vlog', 'video', 'ক্যামেরা', 'ভিডিও'],
    features: ['1-Inch CMOS Sensor', '4K/120fps UHD Video', '3-Axis Mechanical Stabilization', '2-Inch Rotatable Touchscreen'],
  },
  {
    _id: 'prod_anker_prime',
    title: 'Anker Prime 200W GaN 20,000mAh Powerbank',
    category: 'Electronics',
    brand: 'Anker',
    price: 17500,
    discountPrice: 14200,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1609592807908-f1f3e74653fa?w=800',
    description: 'Massive capacity with 200W total GaN output, smart digital display, and simultaneous charging for 2 laptops.',
    tags: ['electronics', 'powerbank', 'charger', 'anker', 'gan', 'পাওয়ারব্যাংক', 'চার্জার', 'ব্যাটারি', 'ল্যাপটপ'],
    features: ['200W Total Output', 'Smart Digital Display', 'Ultra-Compact GaNPrime', 'Charges 2 MacBooks Simultaneously'],
  },
];

// Semantic Synonym Map for Category Resolution
const SEMANTIC_CATEGORY_MAP: Record<string, string[]> = {
  computer_laptop: [
    'ল্যাপটপ', 'ল্যাপ্টপ', 'কম্পিউটার', 'কম্পিউটারও', 'পিসি', 'ডেস্কটপ', 'ম্যাকবুক', 'ল্যাপটপটি', 'কম্পিউটারে',
    'laptop', 'laptops', 'computer', 'computers', 'pc', 'desktop', 'macbook', 'lappy', 'notebook'
  ],
  smartphones: [
    'মোবাইল', 'ফোন', 'স্মার্টফোন', 'আইফোন', 'স্যামসাং', 'মোবাইলের', 'ফোনের',
    'phone', 'mobile', 'smartphone', 'iphone', 'samsung', 'xiaomi', 'pixel'
  ],
  audio_headphone: [
    'হেডফোন', 'হেডফোনের', 'ইয়ারফোন', 'সাউন্ড', 'স্পিকার', 'গান', 'অডিও', 'মাইক', 'মাইক্রোফোন', 'সাউন্ডবক্স',
    'headphone', 'headphones', 'earphone', 'earphones', 'earbud', 'earbuds', 'speaker', 'speakers', 'sound', 'audio', 'mic', 'microphone', 'anc'
  ],
  keyboard_mouse: [
    'কিবোর্ড', 'মাউস', 'মেকানিক্যাল', 'কিবোর্ডের', 'মাউসের', 'টাইপিং', 'কোডিং',
    'keyboard', 'keyboards', 'mouse', 'mice', 'mechanical', 'typing', 'switch'
  ],
  monitor_display: [
    'মনিটর', 'ডিসপ্লে', 'স্ক্রিন', 'মনিটরের',
    'monitor', 'display', 'screen', 'oled', '4k'
  ],
  camera_gimbal: [
    'ক্যামেরা', 'গিম্বল', 'ভিডিও', 'রেকর্ডিং', 'ব্লগ', 'ক্যামেরার',
    'camera', 'gimbal', 'video', 'vlog', 'dji'
  ],
  power_charger: [
    'চার্জার', 'পাওয়ারব্যাংক', 'পাওয়ার', 'ব্যাটারি',
    'powerbank', 'charger', 'adapter', 'battery'
  ],
  out_of_store: [
    'জুতা', 'জামাকাপড়', 'শার্ট', 'প্যান্ট', 'পোশাক', 'খাবার', 'টিভি', 'ফ্রিজ', 'এসি', 'গাড়ি', 'বাইক', 'মেকআপ', 'শ্যাম্পু',
    'shoe', 'shoes', 'shirt', 'pant', 'dress', 'clothing', 'food', 'tv', 'fridge', 'ac', 'car', 'bike', 'shampoo', 'cosmetics'
  ]
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { message, maxBudget, category } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    const query = message.trim();
    const queryLower = query.toLowerCase();

    // 🔍 1. Check Language
    const isBangla = /[\u0980-\u09FF]/.test(query);
    const isBanglish = /\b(amar|amake|kon|konta|valo|bhalo|dekhao|lagbe|koto|taka|takar|dam|achi|kisu|proyojon|kom|dame|sosta|chai)\b/i.test(queryLower);

    // 💰 2. Check Budget Intent ("কম দাম", "সস্তা", "Low price", etc.)
    const isLowBudgetRequested =
      queryLower.includes('কম দাম') ||
      queryLower.includes('কম দামে') ||
      queryLower.includes('কম বাজেটের') ||
      queryLower.includes('সস্তা') ||
      queryLower.includes('বাজেট') ||
      queryLower.includes('low price') ||
      queryLower.includes('cheap') ||
      queryLower.includes('budget') ||
      queryLower.includes('affordable');

    // 🎯 3. Intent Detection using Semantic Map
    const matchesIntent = (intentKey: string) => {
      const keywords = SEMANTIC_CATEGORY_MAP[intentKey] || [];
      return keywords.some((kw) => queryLower.includes(kw));
    };

    const isComputerLaptop = matchesIntent('computer_laptop');
    const isSmartphone = matchesIntent('smartphones');
    const isAudio = matchesIntent('audio_headphone');
    const isKeyboardMouse = matchesIntent('keyboard_mouse');
    const isMonitor = matchesIntent('monitor_display');
    const isCamera = matchesIntent('camera_gimbal');
    const isPower = matchesIntent('power_charger');
    const isOutOfStore = matchesIntent('out_of_store');

    let matchedProducts: CatalogItem[] = [];
    let aiReply: string | null = null;
    let isCatalogItemAvailable = true;

    // 🧠 4. Process Category & Intent Logic
    if (isComputerLaptop) {
      // User specifically requested Laptop / Computer / PC
      isCatalogItemAvailable = false;
      // Recommend computer peripherals (Keyboards, Mouse, Monitor, Docks, GaN Chargers)
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter(
        (p) => p.category === 'Computing' || p._id === 'prod_anker_prime' || p._id === 'prod_sony_xm5'
      );

      // Sort by price if low budget requested
      if (isLowBudgetRequested) {
        matchedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      }

      if (isBangla || isBanglish) {
        aiReply = `আমাদের শপনেক্সাস স্টোরে বর্তমানে সরাসরি কোনো ব্র্যান্ডের **ল্যাপটপ বা সম্পূর্ণ কম্পিউটার (Laptop / Full PC)** অ্যাভেইলেবল নেই। তবে আমাদের প্রকিউরমেন্ট টিম শীঘ্রই অথেনটিক অফিশিয়াল ল্যাপটপ কালেকশন যুক্ত করার কাজ করছে!\n\nবর্তমানে আপনার ল্যাপটপ বা কম্পিউটারের সাথে ব্যবহারের জন্য প্রয়োজনীয় সেরা **মেকানিক্যাল কিবোর্ড, প্রিসিশন মাউস, 4K মনিটর ও GaN ফাস্ট চার্জার** আমাদের স্টোরে রয়েছে। নিচে আপনার জন্য${isLowBudgetRequested ? ' সবচেয়ে কম দামের মধ্যে' : ''} প্রয়োজনীয় গ্যাজেটগুলো দেওয়া হলো:`;
      } else {
        aiReply = `Currently, ShopNexus does not stock full pre-built **Laptops or Desktop PCs**. Our procurement team is actively working to launch official laptops soon!\n\nHowever, we carry premium **computer setup hardware**—such as mechanical keyboards, ergonomic mice, 4K monitors, and fast GaN chargers. Below are top-rated peripherals for your setup:`;
      }
    } else if (isSmartphone) {
      // User requested Smartphone / Phone / iPhone
      isCatalogItemAvailable = false;
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => p.category === 'Audio' || p._id === 'prod_anker_prime');

      if (isLowBudgetRequested) {
        matchedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      }

      if (isBangla || isBanglish) {
        aiReply = `আমাদের ওয়েবসাইটে বর্তমানে সরাসরি **স্মার্টফোন বা মোবাইল (Mobile Phones)** অ্যাভেইলেবল নেই। খুব শীঘ্রই অফিশিয়াল ফোন কালেকশন যুক্ত করা হবে!\n\nআপনার ফোনের সাথে ব্যবহারের উপযোগী সেরা **ওয়্যারলেস অডিও হেডফোন ও ফাস্ট পাওয়ারব্যাংক** নিচে দেওয়া হলো:`;
      } else {
        aiReply = `Smartphones are currently not in our inventory, but will be available soon! Here are top wireless audio and fast powerbanks for your phone:`;
      }
    } else if (isOutOfStore) {
      // User requested totally unrelated item (Shoes, Clothes, Food, TV, AC, etc.)
      isCatalogItemAvailable = false;
      matchedProducts = [];

      if (isBangla || isBanglish) {
        aiReply = `দুঃখিত, এই ধরনের পণ্য বর্তমানে শপনেক্সাস স্টোরে নেই। শপনেক্সাস মূলত প্রিমিয়াম অডিও, মেকানিক্যাল কিবোর্ড ও ওয়ার্কস্পেস টেক গ্যাজেটে স্পেশালাইজড।`;
      } else {
        aiReply = `Sorry, this item category is not available at ShopNexus. We specialize in official high-fidelity audio, custom keyboards, and workspace tech gear.`;
      }
    } else if (isAudio) {
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => p.category === 'Audio');
      if (isLowBudgetRequested) {
        matchedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      }

      const topAudio = matchedProducts[0];
      const priceStr = `৳${(topAudio.discountPrice || topAudio.price).toLocaleString()} BDT`;

      if (isBangla || isBanglish) {
        aiReply = `${isLowBudgetRequested ? 'বাজেট-ফ্রেন্ডলি সেরা অডিওর জন্য' : 'অসাধারণ সাউন্ড কোয়ালিটি ও নয়েজ ক্যান্সেলেশনের জন্য'} আমি **${topAudio.title}** (${priceStr}, রেটিং ${topAudio.rating}★) রিকমেন্ড করছি। নিচে আপনার জন্য টপ সাউন্ড সিস্টেম ও হেডফোনগুলো সাজানো হলো:`;
      } else {
        aiReply = `For top-tier acoustic fidelity and ANC, I highly recommend the **${topAudio.title}** (${priceStr}, rating ${topAudio.rating}★). Here are our verified headphones and speakers:`;
      }
    } else if (isKeyboardMouse) {
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter(
        (p) => p.tags.includes('keyboard') || p.tags.includes('mouse')
      );
      if (isLowBudgetRequested) {
        matchedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      }

      const topKb = matchedProducts[0];
      const priceStr = `৳${(topKb.discountPrice || topKb.price).toLocaleString()} BDT`;

      if (isBangla || isBanglish) {
        aiReply = `কোডিং ও স্মুথ টাইপিংয়ের জন্য **${topKb.title}** (${priceStr}) সবচেয়ে সেরা অপশন! নিচে কাস্টম কিবোর্ড ও মাউস কালেকশন দেওয়া হলো:`;
      } else {
        aiReply = `For superior tactile typing and productivity, the **${topKb.title}** (${priceStr}) is our top pick. Here are our custom keyboards and precision mice:`;
      }
    } else if (isMonitor) {
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => p.tags.includes('monitor') || p.tags.includes('lightbar'));
      aiReply = isBangla || isBanglish
        ? `প্রফেশনাল কালার অ্যাকুরেসি ও 4K কোয়ালিটির জন্য **Dell UltraSharp 32" 4K QD-OLED** (৳৮৯,৯০০ BDT) আমাদের স্টোরে রয়েছে!`
        : `For true 4K color grading and immersive workspace setup, the **Dell UltraSharp 32" 4K QD-OLED** is available in stock!`;
    } else if (isCamera) {
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => p.tags.includes('camera'));
      aiReply = isBangla || isBanglish
        ? `৪K সিনেমাটিক ভিডিও ও ব্লগের জন্য **DJI Osmo Pocket 3 Creator Combo** (৳৬৪,০০০ BDT, রেটিং ৫★) সবচেয়ে সেরা!`
        : `For 4K creator video and stabilization, the **DJI Osmo Pocket 3 Creator Combo** (৳64,000 BDT) is in stock!`;
    } else if (isPower) {
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => p.tags.includes('powerbank') || p.tags.includes('dock'));
      aiReply = isBangla || isBanglish
        ? `ল্যাপটপ ও ফোন সুপারফাস্ট চার্জ করার জন্য **Anker Prime 200W GaN Powerbank** (৳১৪,২০০ BDT) সেরা চয়েস!`
        : `For high-speed multi-device charging, the **Anker Prime 200W GaN Powerbank** (৳14,200 BDT) is available!`;
    } else {
      // General Keyword & Semantic Search across Database
      matchedProducts = SHOPNEXUS_CATALOG_DATABASE.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(queryLower);
        const brandMatch = p.brand.toLowerCase().includes(queryLower);
        const tagMatch = p.tags.some((t) => queryLower.includes(t) || t.includes(queryLower));
        const descMatch = p.description.toLowerCase().includes(queryLower);
        return titleMatch || brandMatch || tagMatch || descMatch;
      });

      if (matchedProducts.length === 0) {
        // No match found in entire database
        isCatalogItemAvailable = false;
        aiReply = isBangla || isBanglish
          ? `দুঃখিত, আপনার কাঙ্ক্ষিত পণ্যটি ("${query}") এই মুহূর্তে আমাদের শপনেক্সাস স্টোরের ডাটাবেসে নেই। তবে আমাদের প্রকিউরমেন্ট টিম নতুন কালেকশন যুক্ত করার কাজ করছে!\n\nআপনি আমাদের স্টোরের প্রিমিয়াম অডিও, মেকানিক্যাল কিবোর্ড ও ওয়ার্কস্পেস গ্যাজেটগুলো এক্সপ্লোর করতে পারেন:`
          : `Sorry, the item matching "${query}" is currently not in our official catalog. Our team is constantly expanding our collection! In the meantime, explore our verified gear:`;

        matchedProducts = [...SHOPNEXUS_CATALOG_DATABASE].sort((a, b) => b.rating - a.rating).slice(0, 3);
      } else {
        if (isLowBudgetRequested) {
          matchedProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        }
        aiReply = isBangla || isBanglish
          ? `আপনার অনুসন্ধানের ভিত্তিতে শপনেক্সাসের অফিসিয়াল গ্যাজেটগুলো নিচে দেওয়া হলো। ১-ক্লিক করে সরাসরি কার্টে যুক্ত করতে পারেন:`
          : `Here are the matching official products from our ShopNexus catalog:`;
      }
    }

    // Apply explicit budget filter if provided
    if (maxBudget && maxBudget > 0 && matchedProducts.length > 0) {
      const budgetFiltered = matchedProducts.filter((p) => (p.discountPrice || p.price) <= maxBudget);
      if (budgetFiltered.length > 0) {
        matchedProducts = budgetFiltered;
      }
    }

    const finalProducts = matchedProducts.slice(0, 4);
    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        reply: aiReply,
        isCatalogItemAvailable,
        provider: 'nexus-database-engine',
        responseTimeMs,
        suggestedProducts: finalProducts.map((p) => ({
          _id: p._id,
          title: p.title,
          price: p.price,
          discountPrice: p.discountPrice,
          category: p.category,
          rating: p.rating,
          image: p.image,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal AI Server Error',
      },
      { status: 500 }
    );
  }
}
