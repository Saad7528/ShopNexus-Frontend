import { NextRequest, NextResponse } from 'next/server';

interface CatalogProduct {
  _id: string;
  title: string;
  category: 'Audio' | 'Keyboards' | 'Accessories' | 'Wearables' | 'Electronics';
  brand: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  inStock: boolean;
}

// 📦 Exact Grounded Catalog of ShopNexus Official Hardware (in ৳ BDT)
const SHOPNEXUS_CATALOG: CatalogProduct[] = [
  // --- Audio & Acoustics ---
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
    features: ['Industry-Leading ANC', '30-Hour Battery', 'Auto NC Optimizer', 'Multipoint Connection'],
    inStock: true,
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
    features: ['Spatialized Audio', 'CustomTune ANC', 'Ultra Comfort Cushions', '24-Hour Playtime'],
    inStock: true,
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
    features: ['Apple H1 Chips', 'Spatial Audio with Head Tracking', 'Anodized Aluminum Cups', 'Transparency Mode'],
    inStock: true,
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
    features: ['30+ Hours Playtime', 'True Stereophonic 360° Sound', 'IP67 Dust & Water Resistance', 'Stack Mode'],
    inStock: true,
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
    features: ['Wider Soundstage', 'Classic Vintage Brass Dials', 'RCA & 3.5mm Inputs', 'Room-Filling Bass'],
    inStock: true,
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
    features: ['60-Hour Massive Battery', '42mm Audiophile Transducers', 'Adaptive ANC', 'Custom Sound Personalization'],
    inStock: true,
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
    features: ['Dual USB/XLR Output', 'Voice Isolation Technology', 'Built-in Touch Panel', 'Studio Quality Podcast Audio'],
    inStock: true,
  },

  // --- Keyboards & Workspace Peripherals ---
  {
    _id: 'prod_keychron_q1',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    category: 'Keyboards',
    brand: 'Keychron',
    price: 25000,
    discountPrice: 21500,
    rating: 4.9,
    reviews: 174,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    features: ['Full CNC Aluminum Body', 'Hot-Swappable Switches', 'Double-Gasket Mount', 'QMK/VIA Programmable', 'Bluetooth 5.1'],
    inStock: true,
  },
  {
    _id: 'prod_mx_master',
    title: 'Logitech MX Master 3S Wireless Performance Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    price: 14500,
    discountPrice: 11500,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800',
    features: ['8K DPI Any-Surface Sensor', 'Quiet Click Switches', 'MagSpeed Electromagnetic Wheel', 'Ergonomic Palm Support'],
    inStock: true,
  },
  {
    _id: 'prod_gmmk_pro',
    title: 'Glorious GMMK Pro 75% Custom Mechanical Keyboard',
    category: 'Keyboards',
    brand: 'Glorious',
    price: 22000,
    discountPrice: 18900,
    rating: 4.8,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800',
    features: ['Rotary Encoder Knob', 'Gasket Mounted Plate', 'Per-Key RGB Lighting', 'Modular Hot-Swap PCB'],
    inStock: true,
  },

  // --- Electronics & Creator Gear ---
  {
    _id: 'prod_dji_pocket3',
    title: 'DJI Osmo Pocket 3 Creator Combo 4K Gimbal',
    category: 'Electronics',
    brand: 'DJI',
    price: 85000,
    discountPrice: 64000,
    rating: 5.0,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
    features: ['1-Inch CMOS Sensor', '4K/120fps UHD Video', '3-Axis Mechanical Stabilization', '2-Inch Rotatable Touchscreen', 'ActiveTrack 6.0'],
    inStock: true,
  },
  {
    _id: 'prod_anker_prime',
    title: 'Anker Prime 200W GaN 20,000mAh Powerbank',
    category: 'Accessories',
    brand: 'Anker',
    price: 17500,
    discountPrice: 14200,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1609592807908-f1f3e74653fa?w=800',
    features: ['200W Total Output', 'Smart Digital Display', 'Ultra-Compact GaNPrime', 'Charges 2 MacBooks Simultaneously'],
    inStock: true,
  },
];

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

    // 🔍 Detect Language
    const isBangla = /[\u0980-\u09FF]/.test(query);
    const isBanglish = /\b(amar|amake|kon|konta|valo|bhalo|dekhao|lagbe|koto|taka|takar|dam|achi|kisu|proyojon|computer|komputer|chai|cheyechi|achhe|ache)\b/i.test(queryLower);

    // 🎯 Intent & Category Classification
    const isAskingForComputer = /\b(computer|laptop|pc|desktop|macbook|কম্পিউটার|ল্যাপটপ|পিসি|ডেস্কটপ|কম্পিউটার)\b/i.test(queryLower);
    const isAskingForPhone = /\b(phone|mobile|smartphone|iphone|samsung|ফোন|মোবাইল|স্মার্টফোন)\b/i.test(queryLower);
    const isAskingForAudio = /\b(audio|headphone|earphone|speaker|sound|music|হেডফোন|স্পিকার|সাউন্ড|অডিও|গান)\b/i.test(queryLower);
    const isAskingForKeyboard = /\b(keyboard|keyboards|mechanical|switch|typing|coding|কিবোর্ড|মেকানিক্যাল)\b/i.test(queryLower);
    const isAskingForMouse = /\b(mouse|mice|trackpad|মাউস)\b/i.test(queryLower);
    const isAskingForCamera = /\b(camera|gimbal|vlog|video|dji|ক্যামেরা|গিম্বল|ভিডিও)\b/i.test(queryLower);
    const isAskingForPower = /\b(powerbank|charger|adapter|battery|পাওয়ারব্যাংক|চার্জার)\b/i.test(queryLower);
    const isOutOfStoreRandom = /\b(shirt|pant|shoes|dress|food|tv|ac|fridge|car|bike|watch|জুতা|কাপড়|খাবার|টিভি|ফ্রিজ)\b/i.test(queryLower);

    let matchedProducts: CatalogProduct[] = [];
    let aiReply: string | null = null;

    // 🧠 1. Live Gemini AI Call
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      try {
        const catalogContext = SHOPNEXUS_CATALOG.map(
          (p) => `- ${p.title} | Category: ${p.category} | Brand: ${p.brand} | Price: ৳${(p.discountPrice || p.price).toLocaleString()} BDT | Rating: ${p.rating}★ | Key Specs: ${p.features.join(', ')}`
        ).join('\n');

        const systemPrompt = `You are "Nexus AI Assistant", the official expert shopping consultant for ShopNexus (Bangladesh's premier official hardware & workspace gear store).
CRITICAL RULES YOU MUST FOLLOW:
1. ALWAYS quote exact prices in Bangladeshi Taka (৳ BDT). NEVER use USD ($).
2. TRUTH & ANTI-HALLUCINATION:
   - If the user asks for a FULL COMPUTER, LAPTOP or PC (e.g. "কম্পিউটার চেয়েছি", "laptop"):
     EXPLICITLY STATE that ShopNexus currently does not sell pre-built full desktop PCs or laptops, but stocks top-tier workspace gear & peripherals (Keychron mechanical keyboards, Logitech MX Master mouse, studio microphones, headphones). Reassure them full PCs/laptops are coming soon, and showcase our keyboards & mice!
   - If the user asks for a product NOT in our catalog (e.g. iPhone, RTX 4090, TV, shoes, clothes):
     CLEARLY SAY: "এই প্রোডাক্টটি বর্তমানে আমাদের শপনেক্সাস স্টোরে নেই। তবে শীঘ্রই এটি যুক্ত করা হবে।" Explain the item briefly and suggest related audio/workspace items from our stock.
   - If the user asks for Audio / Keyboards / Desk Gear:
     Give deep, helpful analysis comparing soundstage, ANC, battery life, switch types, and budget.
3. LANGUAGE MATCHING:
   - Reply in natural, friendly, accurate Bangla if the user writes in Bangla or Banglish.
   - Reply in crisp English if the user writes in English.
4. Keep the text engaging, direct, and concise (2-4 sentences max).

OFFICIAL SHOPNEXUS CATALOG:
${catalogContext}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Message: "${query}"\nSelected Category: ${category || 'Any'}\nMax Budget: ${maxBudget ? `৳${maxBudget}` : 'Flexible'}` }] },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 350,
              },
            }),
            signal: AbortSignal.timeout(3500),
          }
        );

        if (response.ok) {
          const data = await response.json();
          aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }
      } catch (err: any) {
        console.warn('Gemini API call timed out, activating intelligent neural fallback:', err?.message);
      }
    }

    // ⚡ 2. Intelligent Grounded Neural Fallback
    if (isAskingForComputer) {
      // User asked for a Computer / Laptop / PC
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.category === 'Keyboards' || p.category === 'Accessories');
      if (!aiReply) {
        if (isBangla || isBanglish) {
          aiReply = `বর্তমানে আমাদের শপনেক্সাস স্টোরে সম্পূর্ণ **কম্পিউটার বা ল্যাপটপ (Full PC/Laptop)** সরাসরি অ্যাভেইলেবল নেই। তবে খুব শীঘ্রই আমাদের ক্যাটালগে অফিশিয়াল পিসি ও ল্যাপটপ কালেকশন যুক্ত করা হবে!\n\nবর্তমানে আপনার কম্পিউটার বা ওয়ার্কস্পেস সেটআপের জন্য প্রয়োজনীয় প্রিমিয়াম **মেকানিক্যাল কিবোর্ড, প্রিসিশন মাউস ও অ্যাকোস্টিক অডিও গিয়ার** আমাদের স্টোরে রয়েছে। নিচে আপনার পিসির জন্য সেরা অ্যাক্সেসরিজগুলো সাজিয়ে দেওয়া হলো:`;
        } else {
          aiReply = `Currently, ShopNexus does not carry full pre-built desktop PCs or laptops directly in stock, but our procurement team is working to launch full computer systems soon!\n\nIn the meantime, we have top-rated **computer workspace gear**—including custom mechanical keyboards, high-precision mice, and audiophile headphones. Here are the best accessories for your computer setup:`;
        }
      }
    } else if (isAskingForPhone) {
      // User asked for a Phone / Smartphone
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.category === 'Accessories' || p.category === 'Audio');
      if (!aiReply) {
        if (isBangla || isBanglish) {
          aiReply = `বর্তমানে আমাদের ওয়েবসাইটে সরাসরি স্মার্টফোন (Mobile Phones) নেই, তবে খুব শীঘ্রই অফিশিয়াল মোবাইল কালেকশন যুক্ত করা হবে। আপনার ফোনের সাথে ব্যবহারের উপযোগী প্রিমিয়াম **অডিও হেডফোন ও ফাস্ট পাওয়ারব্যাংক** নিচে দেওয়া হলো:`;
        } else {
          aiReply = `Smartphones are currently not in our catalog, but will be available soon! Below are the top smartphone audio gear and fast GaN powerbanks available in stock:`;
        }
      }
    } else if (isOutOfStoreRandom) {
      matchedProducts = [];
      if (!aiReply) {
        if (isBangla || isBanglish) {
          aiReply = `দুঃখিত, এই ধরনের পণ্য বর্তমানে শপনেক্সাসে নেই। শপনেক্সাস মূলত প্রিমিয়াম অডিও, কাস্টম মেকানিক্যাল কিবোর্ড ও ওয়ার্কস্পেস গ্যাজেটে বিশেষজ্ঞ। আপনি আমাদের টেক ও অডিও কালেকশন এক্সপ্লোর করতে পারেন!`;
        } else {
          aiReply = `Sorry, this category is not available at ShopNexus. We specialize in official premium audio, custom mechanical keyboards, and workspace hardware.`;
        }
      }
    } else if (isAskingForAudio) {
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.category === 'Audio');
      if (!aiReply) {
        const topAudio = matchedProducts[0];
        if (isBangla || isBanglish) {
          aiReply = `সেরা সাউন্ড কোয়ালিটি ও নয়েজ ক্যান্সেলেশনের জন্য আমি **${topAudio.title}** (৳${(topAudio.discountPrice || topAudio.price).toLocaleString()} BDT, ${topAudio.rating}★) সবচেয়ে বেশি রিকমেন্ড করছি। নিচে আপনার জন্য টপ সাউন্ড সিস্টেম ও হেডফোনগুলো দেওয়া হলো:`;
        } else {
          aiReply = `For top-tier acoustic fidelity and ANC, I highly recommend the **${topAudio.title}** (৳${(topAudio.discountPrice || topAudio.price).toLocaleString()} BDT, ${topAudio.rating}★). Here are our verified audiophile headphones and speakers:`;
        }
      }
    } else if (isAskingForKeyboard) {
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.category === 'Keyboards');
      if (!aiReply) {
        const topKb = matchedProducts[0];
        if (isBangla || isBanglish) {
          aiReply = `কোডিং ও টাইপিংয়ের সেরা অভিজ্ঞতার জন্য **${topKb.title}** (৳${(topKb.discountPrice || topKb.price).toLocaleString()} BDT) অনবদ্য! এতে রয়েছে CNC অ্যালুমিনিয়াম বডি ও হট-সোয়াপ সুইচ। নিচে কাস্টম কিবোর্ডগুলো দেওয়া হলো:`;
        } else {
          aiReply = `For ultimate typing and programming, the **${topKb.title}** (৳${(topKb.discountPrice || topKb.price).toLocaleString()} BDT) is our top pick. Here are our custom mechanical keyboards:`;
        }
      }
    } else if (isAskingForMouse) {
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.title.toLowerCase().includes('mouse') || p.category === 'Accessories');
      if (!aiReply) {
        aiReply = isBangla || isBanglish
          ? `প্রোডাক্টিভিটি ও স্মুথ ট্র্যাকিংয়ের জন্য **Logitech MX Master 3S** (৳১১,৫০০ BDT) সবচেয়ে সেরা অপশন!`
          : `For productivity and ultra-quiet precision, the **Logitech MX Master 3S** (৳11,500 BDT) is unmatched.`;
      }
    } else if (isAskingForCamera) {
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.category === 'Electronics');
      if (!aiReply) {
        aiReply = isBangla || isBanglish
          ? `৪K সিনেমাটিক ভিডিও ও ব্লগের জন্য **DJI Osmo Pocket 3 Creator Combo** (৳৬৪,০০০ BDT, রেটিং ৫★) সবচেয়ে সেরা!`
          : `For 4K/120fps ultra-stable creator video, the **DJI Osmo Pocket 3 Creator Combo** (৳64,000 BDT) is the undisputed king.`;
      }
    } else if (isAskingForPower) {
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => p.title.toLowerCase().includes('powerbank') || p.category === 'Accessories');
      if (!aiReply) {
        aiReply = isBangla || isBanglish
          ? `ল্যাপটপ ও ফোন দ্রুত চার্জ করার জন্য **Anker Prime 200W GaN Powerbank** (৳১৪,২০০ BDT) সেরা চয়েস!`
          : `For high-speed laptop and mobile charging, the **Anker Prime 200W GaN Powerbank** (৳14,200 BDT) is top-rated.`;
      }
    } else {
      // General Inquiry
      matchedProducts = SHOPNEXUS_CATALOG.filter((p) => {
        const textMatch =
          p.title.toLowerCase().includes(queryLower) ||
          p.brand.toLowerCase().includes(queryLower) ||
          p.category.toLowerCase().includes(queryLower);
        return textMatch;
      });

      if (matchedProducts.length === 0) {
        matchedProducts = [...SHOPNEXUS_CATALOG].sort((a, b) => b.rating - a.rating).slice(0, 4);
      }

      if (!aiReply) {
        const topItem = matchedProducts[0];
        if (isBangla || isBanglish) {
          aiReply = `আপনার জিজ্ঞাসার প্রেক্ষিতে শপনেক্সাসের টপ-রেটেড অফিসিয়াল গ্যাজেটগুলো নিচে দেওয়া হলো। ১-ক্লিকেই আপনি পছন্দের গ্যাজেট কার্টে যোগ করতে পারেন:`;
        } else {
          aiReply = `Here are our verified flagship products tailored for your inquiry. You can add them directly to your cart with 1-click:`;
        }
      }
    }

    // Apply budget filter if specified
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
        provider: GEMINI_API_KEY ? 'gemini-2.0-flash' : 'nexus-neural-grounded',
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
