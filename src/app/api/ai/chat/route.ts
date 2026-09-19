import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { ALL_PRODUCTS } from '@/data/products';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Helper to convert Bengali numbers to English numbers
function parseBengaliOrEnglishNumber(text: string): number | null {
  if (!text) return null;
  const bengaliDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const normalized = text.replace(/[০-৯]/g, (d) => bengaliDigits[d] || d).toLowerCase();

  // Match patterns like "3000", "3k", "3 thousand", "৩ হাজার", "৩০০০ টাকা"
  const kMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:k|হাজার|thousand)/i);
  if (kMatch) {
    return Math.round(parseFloat(kMatch[1]) * 1000);
  }

  const numMatch = normalized.match(/(\d{3,7})/);
  if (numMatch) {
    return parseInt(numMatch[1], 10);
  }

  return null;
}

interface ChatProduct {
  _id: string;
  id?: string;
  slug?: string;
  title: string;
  name?: string;
  category: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  averageRating?: number;
  stock?: number;
  images?: string[];
  image?: string;
  description?: string;
  description_bn?: string;
  features?: string[];
}

// Module-level in-memory catalog cache for lightning fast sub-second responses
let cachedCatalogProducts: ChatProduct[] | null = null;
let lastCatalogCacheTime = 0;
const CATALOG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

// Tier 1: In-Memory AI Query Response Cache (0 Token Cost for repeat queries)
interface CachedAiResponse {
  reply: string;
  provider: string;
  suggestedProducts: ChatProduct[];
  timestamp: number;
}
const aiResponseCache = new Map<string, CachedAiResponse>();
const AI_CACHE_TTL = 15 * 60 * 1000; // 15 minutes TTL

async function getCachedCatalogProducts(): Promise<ChatProduct[]> {
  const now = Date.now();
  if (cachedCatalogProducts && cachedCatalogProducts.length > 0 && now - lastCatalogCacheTime < CATALOG_CACHE_TTL) {
    return cachedCatalogProducts;
  }

  let catalogProducts: ChatProduct[] = [];
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) {
      const dbItems = await db.collection('products').find({ isActive: { $ne: false } }).toArray();
      if (dbItems && dbItems.length > 0) {
        const normalizedDbItems: ChatProduct[] = dbItems.map((item) => ({
          ...item,
          _id: item._id ? String(item._id) : (item.id || item.slug || 'prod-id'),
          title: item.title || item.name || 'Product',
          category: item.category || 'Audio',
          price: Number(item.price) || 0,
        }));

        const dbKeySet = new Set(
          normalizedDbItems.flatMap((item) => [item.slug, item._id, item.title.toLowerCase()]).filter(Boolean)
        );

        const missingStatic: ChatProduct[] = ALL_PRODUCTS.filter(
          (p) => !dbKeySet.has(p.slug) && !dbKeySet.has(p._id) && !dbKeySet.has(p.title.toLowerCase())
        ).map((p) => ({
          ...p,
          _id: p._id,
          title: p.title,
          category: p.category,
          price: p.price,
        }));

        catalogProducts = [...normalizedDbItems, ...missingStatic];
      }
    }
  } catch {
    // Fallback directly to in-memory static catalog
  }

  if (catalogProducts.length === 0) {
    catalogProducts = [...ALL_PRODUCTS];
  }

  cachedCatalogProducts = catalogProducts;
  lastCatalogCacheTime = now;
  return catalogProducts;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { message, category } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Message is required' },
        { status: 400 }
      );
    }

    const query = message.trim();
    const queryLower = query.toLowerCase();
    const normalizedKey = `${queryLower.trim()}__cat:${(category || 'all').toLowerCase()}`;

    // ⚡ Tier 1: Check In-Memory AI Cache (0 Token Cost, Instant <10ms Response)
    const cachedEntry = aiResponseCache.get(normalizedKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp < AI_CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: {
          reply: cachedEntry.reply,
          provider: `${cachedEntry.provider} (cached-zero-token)`,
          responseTimeMs: Date.now() - startTime,
          suggestedProducts: cachedEntry.suggestedProducts.map((p) => ({
            _id: p._id || p.slug || '',
            title: p.title,
            price: p.price,
            discountPrice: p.discountPrice,
            category: p.category,
            rating: p.averageRating || p.rating || 4.9,
            image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          })),
        },
      });
    }

    // ⚡ 1. Fetch official catalog products
    const catalogProducts = await getCachedCatalogProducts();

    // ⚡ 2. Detect Language & Extracted Budget
    const isBengali = /[\u0980-\u09FF]/.test(query);
    const isEnglish = !isBengali;
    const extractedBudget = parseBengaliOrEnglishNumber(query);

    let aiReply: string | null = null;
    let provider = 'nexus-intelligent-classifier';
    let recommendedIds: string[] = [];

    // ⚡⚡ FAST-PATH INTENT CLASSIFIER (<5ms Response for High Accuracy & Zero-Delay) ⚡⚡
    const isLaptopQuery = queryLower.includes('ল্যাপটপ') || queryLower.includes('laptop') || queryLower.includes('পিসি') || (queryLower.includes('pc') && !queryLower.includes('pcap')) || queryLower.includes('computer') || queryLower.includes('কম্পিউটার') || queryLower.includes('macbook') || queryLower.includes('ম্যাকবুক') || queryLower.includes('notebook');
    const isPhoneQuery = (queryLower.includes('ফোন') || queryLower.includes('phone') || queryLower.includes('mobile') || queryLower.includes('মোবাইল') || queryLower.includes('iphone') || queryLower.includes('আইফোন') || queryLower.includes('smartphone') || queryLower.includes('স্মার্টফোন')) && !queryLower.includes('headphone') && !queryLower.includes('হেডফোন') && !queryLower.includes('earphone') && !queryLower.includes('ইয়ারফোন') && !queryLower.includes('microphone') && !queryLower.includes('মাইক্রোফোন');
    const isApplianceQuery = queryLower.includes('টিভি') || queryLower.includes('tv') || queryLower.includes('television') || queryLower.includes('টেলিভিশন') || queryLower.includes('ফ্রিজ') || queryLower.includes('fridge') || queryLower.includes('এসি') || queryLower.includes('air conditioner') || queryLower.includes('washing machine');
    const isCouponQuery = queryLower.includes('coupon') || queryLower.includes('কুপন') || queryLower.includes('discount') || queryLower.includes('ছাড়') || queryLower.includes('অফার') || queryLower.includes('promo') || queryLower.includes('voucher') || queryLower.includes('ভাউচার');

    if (isLaptopQuery) {
      aiReply = isEnglish
        ? `Currently, ShopNexus does not sell laptops or desktop PCs directly. We specialize in premium mechanical keyboards, ergonomic wireless mice, audiophile sound gear, and smart gadgets.\n\nHowever, to upgrade your laptop workstation, explore our top-rated Keychron mechanical keyboards and Logitech wireless mice below:`
        : `বর্তমানে আমাদের শপনেক্সাস স্টোরে সরাসরি ল্যাপটপ বা কম্পিউটার বিক্রয় করা হয় না। ShopNexus মূলত প্রিমিয়াম মেকানিক্যাল কিবোর্ড, প্রফেশনাল মাউস, হাই-এন্ড অডিও এবং স্মার্ট গ্যাজেটের জন্য বিশেষায়িত।\n\nতবে আপনার ল্যাপটপের দুর্দান্ত ওয়ার্কস্টেশন সেটআপের জন্য সেরা Keychron কিবোর্ড ও Logitech মাউস কালেকশন নিচে দেখতে পারেন:`;
      recommendedIds = ['p13', 'p14', 'p15'];
    } else if (isPhoneQuery) {
      aiReply = isEnglish
        ? `We do not stock smartphones or mobile handsets directly. However, we offer official Apple & Samsung smartwatches, premium wireless earbuds, and lifestyle gadgets. Explore them below:`
        : `বর্তমানে শপনেক্সাসে সরাসরি স্মার্টফোন বা মোবাইল হ্যান্ডসেট বিক্রয় করা হয় না। তবে অ্যাপল ও স্যামসাং-এর অফিসিয়াল স্মার্টওয়াচ, ওয়্যারলেস অডিও ও গ্যাজেট কালেকশন আমাদের স্টোরে এভেইলেবল রয়েছে:`;
      recommendedIds = ['p7', 'p8', 'p3'];
    } else if (isApplianceQuery) {
      aiReply = isEnglish
        ? `We currently do not stock large home appliances or televisions. ShopNexus specializes in premium smart home tech gadgets like the Dyson Air Purifier and personal electronics.`
        : `বর্তমানে আমাদের স্টোরে হোম অ্যাপ্লায়েন্সেস বা টিভি বিক্রি করা হয় না। শপনেক্সাস মূলত প্রিমিয়াম স্মার্ট গ্যাজেট (যেমন Dyson এয়ার পিউরিফায়ার) ও ইলেকট্রনিক্স এক্সেসরিজ সরবরাহ করে থাকে।`;
      recommendedIds = ['p26'];
    } else if (isCouponQuery) {
      aiReply = isEnglish
        ? `Here are the active promo offers at ShopNexus!\n• **WELCOME10**: 10% instant discount on registration.\n• **VIP200**: Flat ৳200 discount for Gold VIP Members.\n• **Nexus Coins**: Redeem 50 coins for ৳5 off at checkout!`
        : `শপনেক্সাসে বর্তমানে চালু অফার ও কুপনসমূহ:\n• **WELCOME10**: নতুন নিবন্ধনে পাবেন ইনস্ট্যান্ট ১০% ছাড়।\n• **VIP200**: গোল্ড ভিআইপি মেম্বারদের জন্য ফ্ল্যাট ৳২০০ ছাড়।\n• **Nexus Coins**: চেকআউটে প্রতি ৫০ কয়েনে সরাসরি ৳৫ ক্যাশব্যাক রিডেম্পশন!`;
      recommendedIds = ['p1', 'p8', 'p13'];
    }

    // ⚡ If not caught by fast-path classifier, attempt Google Gemini API with low-latency timeout
    if (!aiReply) {
      const rawApiKeyEnv = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEYS || '';
      const apiKeys = rawApiKeyEnv
        .split(/[,;\n]+/)
        .map((k) => k.trim())
        .filter((k) => k.length > 10 && k.startsWith('AIzaSy'));

      if (apiKeys.length > 0) {
        const catalogContext = catalogProducts
          .slice(0, 25)
          .map(
            (p) =>
              `[ID: ${p._id || p.slug || 'p-unknown'}] "${p.title}" | Category: ${p.category} | Price: ৳${p.price.toLocaleString()} BDT`
          )
          .join('\n');

        const systemPrompt = `You are "ShopNexus AI Shopping Assistant".
DIRECTIVES:
1. Always quote prices in Bangladeshi Taka (৳ BDT).
2. Recommend ONLY items in catalog. If customer asks for items NOT in catalog (e.g. laptops, phones, TVs), clearly state ShopNexus does not stock them directly and suggest closest relevant peripherals or write [RECOMMENDED_IDS: none].
3. End with [RECOMMENDED_IDS: p1, p2] or [RECOMMENDED_IDS: none].
4. Language: ${isBengali ? 'Pure conversational Bengali (বাংলা)' : 'Fluent crisp English'}.
CATALOG:
${catalogContext}`;

        const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

        for (const apiKey of apiKeys) {
          if (aiReply) break;

          for (const model of modelsToTry) {
            if (aiReply) break;
            try {
              const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [
                      {
                        role: 'user',
                        parts: [
                          {
                            text: `${systemPrompt}\n\nCustomer Question: "${query}"\nDetected Budget: ${extractedBudget ? `৳${extractedBudget} BDT` : 'Flexible'}`,
                          },
                        ],
                      },
                    ],
                    generationConfig: {
                      temperature: 0.2,
                      maxOutputTokens: 1024,
                    },
                  }),
                  signal: AbortSignal.timeout(3000), // Fast 3-second timeout
                }
              );

              if (geminiRes.ok) {
                const geminiData = await geminiRes.json();
                const parts = (geminiData?.candidates?.[0]?.content?.parts || []) as Array<{ text?: string }>;
                const fullText = parts
                  .map((p) => (typeof p.text === 'string' ? p.text : ''))
                  .join('')
                  .trim();

                if (fullText) {
                  aiReply = fullText;
                  provider = model;
                  break;
                }
              }
            } catch {
              // Rapid fallback
            }
          }
        }
      }
    }

    // 🎯 Parse Recommended IDs from AI Output
    if (aiReply && provider !== 'nexus-intelligent-classifier') {
      const tagMatch = aiReply.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);
      if (tagMatch) {
        const rawIds = tagMatch[1].trim();
        if (rawIds.toLowerCase() !== 'none') {
          const matched = rawIds.match(/p\d+|[a-zA-Z0-9_-]+/g) || [];
          recommendedIds = matched.filter((id) => id.toLowerCase() !== 'none');
        }
        aiReply = aiReply.replace(/\[RECOMMENDED_IDS:\s*[^\]]*\]?/gi, '').trim();
      }
    }

    // ⚡ Tier 4: Enhanced Offline Semantic Matching Engine (Zero-Delay)
    if (!aiReply) {
      provider = 'nexus-semantic-engine';

      const isSamsung = queryLower.includes('samsung') || queryLower.includes('স্যামসাং') || queryLower.includes('galaxy') || queryLower.includes('গ্যালাক্সি');
      const isApple = queryLower.includes('apple') || queryLower.includes('অ্যাপল') || queryLower.includes('airpods') || queryLower.includes('এয়ারপডস');
      const isBose = queryLower.includes('bose') || queryLower.includes('বোস');
      const isMarshall = queryLower.includes('marshall') || queryLower.includes('মার্শাল');
      const isSony = queryLower.includes('sony') || queryLower.includes('সোনি');
      const isKeychron = queryLower.includes('keychron') || queryLower.includes('কিক্রন');
      const isLogitech = queryLower.includes('logitech') || queryLower.includes('লজিটেক');
      const isGarmin = queryLower.includes('garmin') || queryLower.includes('গারমিন');
      const isHuawei = queryLower.includes('huawei') || queryLower.includes('হুয়াওয়ে');
      const isDji = queryLower.includes('dji') || queryLower.includes('ডিজেআই');
      const isShure = queryLower.includes('shure') || queryLower.includes('শুয়ার');
      const isDyson = queryLower.includes('dyson') || queryLower.includes('ডাইসন');

      const isSpeakerQuery = queryLower.includes('speaker') || queryLower.includes('স্পিকার');
      const isWatchQuery = queryLower.includes('watch') || queryLower.includes('ঘড়ি') || queryLower.includes('ঘড়ি') || queryLower.includes('স্মার্টওয়াচ');
      const isKeyboardQuery = queryLower.includes('keyboard') || queryLower.includes('কিবোর্ড');
      const isMouseQuery = queryLower.includes('mouse') || queryLower.includes('মাউস');
      const isHeadphoneQuery = queryLower.includes('headphone') || queryLower.includes('হেডফোন') || queryLower.includes('earphone') || queryLower.includes('ইয়ারফোন') || queryLower.includes('airpods');

      if (isSamsung) {
        aiReply = isEnglish
          ? `Yes! We carry the official **Samsung Galaxy Watch Ultra 47mm Titanium Gray** smartwatch (priced at ৳56,000 BDT) with Grade 4 titanium frame, dual-frequency GPS, and 10ATM water resistance.`
          : `হ্যাঁ, আমাদের শপনেক্সাস স্টোরে অফিসিয়াল **Samsung Galaxy Watch Ultra 47mm Titanium Gray** স্মার্টওয়াচ রয়েছে (মূল্য ৳৫৬,০০০ টাকা)। এতে রয়েছে গ্রেড ৪ টাইটানিয়াম ফ্রেম, ডুয়েল-ফ্রিকোয়েন্সি জিপিএস এবং ১০এটিএম ওয়াটার রেজিস্ট্যান্স। নিচে প্রোডাক্টটি দেখতে পারেন:`;
        recommendedIds = ['p8'];
      } else if (isApple) {
        aiReply = isEnglish
          ? `Yes! We stock the official **Apple Watch Ultra 2 Titanium** (৳79,900 BDT) and **Apple AirPods Max Space Gray** (৳65,000 BDT). Explore them below:`
          : `হ্যাঁ, আমাদের স্টোরে অফিসিয়াল **Apple Watch Ultra 2 টাইটানিয়াম** (৳৭৯,৯০০ টাকা) এবং **Apple AirPods Max** (৳৬৫,০০০ টাকা) রয়েছে। নিচে কালেকশন দেওয়া হলো:`;
        recommendedIds = ['p7', 'p3'];
      } else if (isBose) {
        aiReply = isEnglish
          ? `We offer the flagship **Bose QuietComfort Ultra Spatial Audio Headphones** (৳38,900 BDT) with world-class noise cancellation.`
          : `আমাদের কাছে রয়েছে ফ্ল্যাগশিপ **Bose QuietComfort Ultra স্পেশিয়াল অডিও হেডফোন** (৳৩৮,৯০০ টাকা), যা যুগান্তকারী স্পেশিয়াল অডিও ও কমফোর্ট প্রদান করে।`;
        recommendedIds = ['p2'];
      } else if (isMarshall) {
        aiReply = isEnglish
          ? `Yes! We have the iconic **Marshall Stanmore III Bluetooth Premium Home Speaker** (৳31,900 BDT) with rich analog controls and room-filling sound.`
          : `হ্যাঁ, আমাদের কাছে রয়েছে প্রিমিয়াম **Marshall Stanmore III ব্লুটুথ হোম স্পিকার** (৳৩১,৯০০ টাকা), যা ক্লাসিক ভিন্টেজ লুক ও রুম-ভরা সাউন্ড প্রদান করে।`;
        recommendedIds = ['p4'];
      } else if (isSony) {
        aiReply = isEnglish
          ? `We feature the industry-leading **Sony WH-1000XM5 Wireless Headphones** (৳32,500 BDT) and **Sony ZV-E10 4K Vlog Camera** (৳62,000 BDT).`
          : `আমাদের কালেকশনে রয়েছে শীর্ষস্থানীয় **Sony WH-1000XM5 ওয়্যারলেস হেডফোন** (৳৩২,৫০০ টাকা) এবং **Sony ZV-E10 ৪কে ভ্লগ ক্যামেরা** (৳৬২,০০০ টাকা)।`;
        recommendedIds = ['p1', 'p17'];
      } else if (isKeychron) {
        aiReply = isEnglish
          ? `Yes! We carry the **Keychron Q1 Pro Wireless Custom CNC Mechanical Keyboard** (৳21,500 BDT) with hot-swappable switches and double-gasket mount.`
          : `হ্যাঁ, আমাদের কাছে রয়েছে **Keychron Q1 Pro সিএনসি কাস্টম মেকানিক্যাল কিবোর্ড** (৳২১,৫০০ টাকা), যা হট-সোয়াপ ও গ্যাস্কেট মাউন্ট ডিজাইনে তৈরি।`;
        recommendedIds = ['p13'];
      } else if (isLogitech) {
        aiReply = isEnglish
          ? `We feature the **Logitech MX Master 3S Wireless Performance Mouse** (৳11,500 BDT) and **Logitech MX Mechanical Keyboard** (৳17,000 BDT).`
          : `আমাদের কাছে রয়েছে প্রফেশনাল **Logitech MX Master 3S ওয়্যারলেস মাউস** (৳১১,৫০০ টাকা) এবং **Logitech MX Mechanical কিবোর্ড** (৳১৭,০০০ টাকা)।`;
        recommendedIds = ['p14', 'p15'];
      } else if (isGarmin) {
        aiReply = isEnglish
          ? `Yes! We stock the **Garmin Forerunner 965 AMOLED Premium Running Watch** (৳65,000 BDT) and **Garmin Fenix 7X Pro** for athletes.`
          : `হ্যাঁ, আমাদের স্টোরে রয়েছে **Garmin Forerunner 965 AMOLED রানিং ওয়াচ** (৳৬৫,০০০ টাকা), যা স্পোর্টস ও আউটডোর ট্রেনিংয়ের জন্য সেরা।`;
        recommendedIds = ['p11', 'p9'];
      } else if (isHuawei) {
        aiReply = isEnglish
          ? `We have the **Huawei Watch GT 4 Brown Leather Edition** (৳22,500 BDT) featuring 14-day battery life and classic octagonal design.`
          : `আমাদের কাছে রয়েছে **Huawei Watch GT 4 ব্রাউন লেদার এডিশন** (৳২২,৫০০ টাকা), যা ১৪ দিনের দীর্ঘস্থায়ী ব্যাটারি লাইফ দেয়।`;
        recommendedIds = ['p10'];
      } else if (isDji) {
        aiReply = isEnglish
          ? `Yes! We carry the **DJI Osmo Pocket 3 Creator Combo 4K Handheld Gimbal** (৳55,000 BDT) with 1-inch CMOS sensor and 3-axis stabilization.`
          : `হ্যাঁ, আমাদের স্টোরে রয়েছে **DJI Osmo Pocket 3 ক্রিয়েটর কম্বো ৪কে জিম্বাল** (৳৫৫,০০০ টাকা), যা কন্টেন্ট ক্রিয়েটরদের জন্য পারফেক্ট।`;
        recommendedIds = ['p21'];
      } else if (isShure) {
        aiReply = isEnglish
          ? `We offer the broadcast-legendary **Shure SM7B Studio Microphone** (৳39,000 BDT) and **Shure MV7+ Podcast Microphone** (৳25,500 BDT).`
          : `আমাদের কাছে রয়েছে ব্রডকাস্টের শীর্ষস্থানীয় **Shure SM7B স্টুডিও মাইক্রোফোন** (৳৩৯,০০০ টাকা) এবং **Shure MV7+ পডকাস্ট মাইক্রোফোন** (৳২৫,৫০০ টাকা)।`;
        recommendedIds = ['p6', 'p23'];
      } else if (isDyson) {
        aiReply = isEnglish
          ? `Yes! We carry the **Dyson Purifier Hot+Cool Gen1 Air Purifier** (৳59,000 BDT) with HEPA H13 filtration.`
          : `হ্যাঁ, আমাদের স্টোরে রয়েছে **Dyson Purifier Hot+Cool জেন১ এয়ার পিউরিফায়ার** (৳৫৯,০০০ টাকা)।`;
        recommendedIds = ['p26'];
      } else if (extractedBudget && extractedBudget <= 5000) {
        if (isSpeakerQuery) {
          aiReply = isEnglish
            ? `Currently, ShopNexus does not have speakers available under ৳${extractedBudget.toLocaleString()} BDT. Our premium **Marshall Stanmore III** speaker starts at ৳34,500 BDT.`
            : `বর্তমানে আমাদের শপনেক্সাস স্টোরে ৳${extractedBudget.toLocaleString()} টাকার মধ্যে কোনো স্পিকার অ্যাভেইলেবল নেই। আমাদের স্টোরে প্রিমিয়াম **Marshall Stanmore III** স্পিকারের মূল্য ৳৩৪,৫০০ টাকা থেকে শুরু।`;
          recommendedIds = [];
        } else if (isWatchQuery) {
          aiReply = isEnglish
            ? `We currently do not stock smartwatches under ৳${extractedBudget.toLocaleString()} BDT. Our official smartwatch collection begins with the **Huawei Watch GT 4** (৳22,500 BDT) and **Samsung Galaxy Watch Ultra** (৳56,000 BDT).`
            : `বর্তমানে ৳${extractedBudget.toLocaleString()} টাকার বাজেটে আমাদের স্টোরে কোনো স্মার্টওয়াচ নেই। আমাদের স্মার্টওয়াচ কালেকশনে **Huawei Watch GT 4** (৳২২,৫০০) এবং **Samsung Galaxy Watch Ultra** (৳৫৬,০০০) রয়েছে।`;
          recommendedIds = [];
        } else {
          aiReply = isEnglish
            ? `At ৳${extractedBudget.toLocaleString()} BDT budget, our closest premium peripheral starts from ৳11,500 BDT (**Logitech MX Master 3S**).`
            : `৳${extractedBudget.toLocaleString()} বাজেটের কাছাকাছি আমাদের প্রিমিয়াম পেরিফেরাল শুরু হয় ৳১১,৫০০ টাকা থেকে (**Logitech MX Master 3S**)।`;
          recommendedIds = ['p14'];
        }
      } else if (isWatchQuery) {
        aiReply = isEnglish
          ? `Our official smartwatch collection features the **Apple Watch Ultra 2 Titanium** (৳79,900 BDT), **Samsung Galaxy Watch Ultra** (৳56,000 BDT), and **Huawei Watch GT 4** (৳22,500 BDT).`
          : `আমাদের অফিসিয়াল স্মার্টওয়াচ কালেকশনে রয়েছে **Samsung Galaxy Watch Ultra** (৳৫৬,০০০ টাকা), **Huawei Watch GT 4** (৳২২,৫০০ টাকা), এবং **Apple Watch Ultra 2** (৳৭৯,৯০০ টাকা)।`;
        recommendedIds = ['p8', 'p10', 'p7'];
      } else if (isKeyboardQuery || isMouseQuery) {
        aiReply = isEnglish
          ? `For keyboards and mice, we recommend the **Keychron Q1 Pro** (৳21,500 BDT), **Logitech MX Master 3S** (৳11,500 BDT), and **Logitech MX Mechanical** (৳17,000 BDT).`
          : `কিবোর্ড ও মাউসের জন্য আমাদের সেরা চয়েস হলো **Keychron Q1 Pro** (৳২১,৫০০ টাকা), **Logitech MX Master 3S** (৳১১,৫০০ টাকা), এবং **Logitech MX Mechanical** (৳১৭,০০০ টাকা)।`;
        recommendedIds = ['p13', 'p14', 'p15'];
      } else if (isHeadphoneQuery) {
        aiReply = isEnglish
          ? `Top audiophile headphones at ShopNexus:\n• **Sony WH-1000XM5** (৳32,500 BDT)\n• **Bose QuietComfort Ultra** (৳38,900 BDT)\n• **Apple AirPods Max** (৳65,000 BDT)`
          : `শপনেক্সাসের শীর্ষ অডিওফাইল হেডফোনসমূহ:\n• **Sony WH-1000XM5** (৳৩২,৫০০ টাকা)\n• **Bose QuietComfort Ultra** (৳৩৮,৯০০ টাকা)\n• **Apple AirPods Max** (৳৬৫,০০০ টাকা)`;
        recommendedIds = ['p1', 'p2', 'p3'];
      } else {
        aiReply = isEnglish
          ? `Welcome to ShopNexus! We feature official hardware gear from Samsung, Apple, Sony, Bose, Marshall, Keychron, and Logitech. How may I assist your shopping today?`
          : `স্বাগতম! শপনেক্সাসে রয়েছে Samsung, Apple, Sony, Bose, Marshall, Keychron এবং Logitech-এর মতো সেরা ব্র্যান্ডের অফিসিয়াল গ্যাজেট। আপনার পছন্দের গ্যাজেটটি খুঁজে পেতে কীভাবে সাহায্য করতে পারি?`;
        recommendedIds = ['p1', 'p13', 'p8'];
      }
    }

    // 🎯 Fetch Matching Product Objects for UI Cards
    let suggestedProducts: ChatProduct[] = [];
    if (recommendedIds.length > 0) {
      suggestedProducts = (recommendedIds
        .map((recId) => {
          return catalogProducts.find((p) => {
            if (p._id === recId || p.id === recId || p.slug === recId) return true;
            const recLower = recId.toLowerCase();
            if (recLower === 'p13' && p.title.toLowerCase().includes('keychron')) return true;
            if (recLower === 'p14' && p.title.toLowerCase().includes('mx master')) return true;
            if (recLower === 'p15' && p.title.toLowerCase().includes('mx mechanical')) return true;
            if (recLower === 'p8' && p.title.toLowerCase().includes('galaxy watch')) return true;
            if (recLower === 'p7' && p.title.toLowerCase().includes('apple watch')) return true;
            if (recLower === 'p1' && p.title.toLowerCase().includes('1000xm5')) return true;
            if (recLower === 'p2' && p.title.toLowerCase().includes('quietcomfort')) return true;
            if (recLower === 'p3' && p.title.toLowerCase().includes('airpods max')) return true;
            if (recLower === 'p4' && p.title.toLowerCase().includes('marshall')) return true;
            if (recLower === 'p26' && p.title.toLowerCase().includes('dyson')) return true;
            return p.title.toLowerCase().includes(recLower);
          });
        })
        .filter(Boolean)
        .slice(0, 4)) as ChatProduct[];
    }


    // Save to Tier 1 Cache
    if (aiReply) {
      aiResponseCache.set(normalizedKey, {
        reply: aiReply,
        provider,
        suggestedProducts,
        timestamp: Date.now(),
      });
      if (aiResponseCache.size > 500) {
        const firstKey = aiResponseCache.keys().next().value;
        if (firstKey) aiResponseCache.delete(firstKey);
      }
    }

    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        reply: aiReply,
        provider,
        responseTimeMs,
        suggestedProducts: suggestedProducts.map((p) => ({
          _id: p._id || p.slug || '',
          title: p.title,
          price: p.price,
          discountPrice: p.discountPrice,
          category: p.category,
          rating: p.averageRating || p.rating || 4.9,
          image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        })),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal AI Server Error';
    console.error('AI chat route error:', error);
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}