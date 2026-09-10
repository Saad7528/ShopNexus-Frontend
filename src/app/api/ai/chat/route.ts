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

// Module-level in-memory catalog cache for lightning fast sub-second responses
let cachedCatalogProducts: any[] | null = null;
let lastCatalogCacheTime = 0;
const CATALOG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

async function getCachedCatalogProducts(): Promise<any[]> {
  const now = Date.now();
  if (cachedCatalogProducts && cachedCatalogProducts.length > 0 && now - lastCatalogCacheTime < CATALOG_CACHE_TTL) {
    return cachedCatalogProducts;
  }

  let catalogProducts: any[] = [];
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) {
      const dbItems = await db.collection('products').find({ isActive: { $ne: false } }).toArray();
      if (dbItems && dbItems.length > 0) {
        const normalizedDbItems = dbItems.map((item) => ({
          ...item,
          _id: item._id?.toString() || item.id || item.slug,
        }));

        const dbKeySet = new Set(
          normalizedDbItems.flatMap((item: any) => [item.slug, item._id, item.title?.toLowerCase()]).filter(Boolean)
        );

        const missingStatic = ALL_PRODUCTS.filter(
          (p) => !dbKeySet.has(p.slug) && !dbKeySet.has(p._id) && !dbKeySet.has(p.title?.toLowerCase())
        );

        catalogProducts = [...normalizedDbItems, ...missingStatic];
      }
    }
  } catch (dbErr) {
    console.warn('MongoDB connection note, using cached static catalog:', dbErr);
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
    const { message, maxBudget, category, language } = body;
    const isEnglish = language === 'en';

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ success: false, message: 'Message is required' }, { status: 400 });
    }

    const query = message.trim();
    const queryLower = query.toLowerCase();

    // 🗄️ 1. Fetch live products with in-memory caching (< 1ms overhead)
    const catalogProducts = await getCachedCatalogProducts();

    // Build compact catalog grounding for fast AI processing
    const catalogContext = catalogProducts
      .map(
        (p) =>
          `ID: ${p._id} | Title: ${p.title} | Category: ${p.category} | Brand: ${p.brand} | Price: ৳${(p.discountPrice || p.price).toLocaleString()} BDT | Rating: ${p.averageRating || 4.9}★`
      )
      .join('\n');

    // Parse budget from message or dropdown
    const extractedBudget = parseBengaliOrEnglishNumber(query) || maxBudget || null;

    // 🤖 2. Construct Master System Prompt for Google Gemini
    const systemPrompt = `You are "Nexus AI Assistant", the hyper-intelligent, official shopping consultant for ShopNexus (Bangladesh's premier official hardware, audiophile audio & workspace gear store).

STRICT RULES & GUIDELINES:
1. PRICING & CURRENCY:
   - Quote exact prices in Bangladeshi Taka (৳ BDT) based strictly on our catalog. NEVER use USD ($).
2. LANGUAGE REQUIREMENT:
   - Selected Website Mode: ${isEnglish ? 'ENGLISH' : 'BANGLA (বাংলা)'}.
   ${
     isEnglish
       ? '- Respond in 100% natural, polite, fluent English. No Bangla script.'
       : '- Respond in 100% natural, warm, polite Bengali (বাংলা). Use natural conversational Bengali.'
   }
3. LIVE CATALOG ANALYSIS & BRAND SPECIFICITY (CRITICAL):
   - You MUST analyze the catalog carefully for specific brands and products requested by the user.
   - Example 1 (Brand/Product Inquiry): If the customer asks "স্যামসাং এর ঘড়ি দেখাও" (Show me Samsung watches) or asks about Samsung products, check the catalog: We have "Samsung Galaxy Watch Ultra 47mm Titanium Gray (ID: p8)" for ৳56,000 BDT! State clearly all Samsung details accurately and recommend ID: p8.
   - Example 2 (Budget Realism): If the customer asks for a product type (e.g. speaker) within a specific budget (e.g. 3000 BDT), and our store does not have speakers under 3000 BDT, state clearly that we don't have speakers under 3000 BDT and mention our Marshall Stanmore starts at ৳31,900 BDT. DO NOT recommend expensive headphones/speakers as budget items! Write [RECOMMENDED_IDS: none].
   - Example 3 (Available Budget Matches): If the customer asks for items within a budget that exists in catalog (e.g. "১৫,০০০ টাকার মধ্যে কিবোর্ড"), recommend Keychron Q1 Pro or NuPhy Air75 V2 or HyperX mouse.
4. STRUCTURED RECOMMENDATION TAG:
   - At the VERY END of your response, on a new line, list the IDs of the products you specifically recommended for this customer in this exact format:
     [RECOMMENDED_IDS: p8]
   - If no products in the catalog fit the customer's budget/request, write:
     [RECOMMENDED_IDS: none]
   - Maximum 4 product IDs.

OFFICIAL SHOPNEXUS CATALOG:
${catalogContext}`;

    // ⚡ 3. Call Google Gemini API with fastest low-latency models first
    let aiReply: string | null = null;
    let provider = 'gemini-flash-latest';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const modelsToTry = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3.6-flash'];

      for (const model of modelsToTry) {
        if (aiReply) break;
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: `${systemPrompt}\n\nCustomer Question: "${query}"\nDetected Budget: ${extractedBudget ? `৳${extractedBudget} BDT` : 'Flexible'}\nCategory Filter: ${category || 'All'}`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 800,
                },
              }),
              signal: AbortSignal.timeout(12000),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              aiReply = candidateText.trim();
              provider = model;
              break;
            }
          } else {
            console.warn(`Gemini model ${model} responded with status ${geminiRes.status}`);
          }
        } catch (err: any) {
          console.warn(`Gemini model ${model} error:`, err?.message);
        }
      }
    }

    // 🎯 4. Parse Recommended IDs from AI Output
    let recommendedIds: string[] = [];
    if (aiReply) {
      const tagMatch = aiReply.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);
      if (tagMatch) {
        const rawIds = tagMatch[1].trim();
        if (rawIds.toLowerCase() !== 'none') {
          recommendedIds = rawIds
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0 && id.toLowerCase() !== 'none');
        }
        aiReply = aiReply.replace(/\[RECOMMENDED_IDS:\s*[^\]]+\]/i, '').trim();
      }
    }

    // ⚡ 5. Intelligent Semantic Fallback Engine
    if (!aiReply) {
      provider = 'nexus-intelligent-engine';

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
          ? `Yes! We carry the **Keychron Q1 Pro Wireless Custom CNC Mechanical Keyboard** (৳17,900 BDT) with hot-swappable switches and gasket mount.`
          : `হ্যাঁ, আমাদের কাছে রয়েছে **Keychron Q1 Pro সিএনসি কাস্টম মেকানিক্যাল কিবোর্ড** (৳১৭,৯০০ টাকা), যা হট-সোয়াপ ও গ্যাস্কেট মাউন্ট ডিজাইনে তৈরি।`;
        recommendedIds = ['p11'];
      } else if (isLogitech) {
        aiReply = isEnglish
          ? `We feature the **Logitech MX Master 3S Wireless Performance Mouse** (৳11,500 BDT) with 8K DPI track-on-glass and quiet clicks.`
          : `আমাদের কাছে রয়েছে প্রফেশনাল **Logitech MX Master 3S ওয়্যারলেস মাউস** (৳১১,৫০০ টাকা), যা ৮কে ডিপিআই ও নিঃশব্দ ক্লিকের সুবিধা দেয়।`;
        recommendedIds = ['p12'];
      } else if (isGarmin) {
        aiReply = isEnglish
          ? `Yes! We stock the **Garmin Fenix 7X Pro Solar Sapphire Edition** (৳88,000 BDT) for multisport and endurance athletes.`
          : `হ্যাঁ, আমাদের স্টোরে রয়েছে **Garmin Fenix 7X Pro সোলার স্যাফায়ার এডিশন** (৳৮৮,০০০ টাকা), যা স্পোর্টস ও আউটডোর অ্যাডভেঞ্চারের জন্য সেরা।`;
        recommendedIds = ['p9'];
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
          ? `We offer the broadcast-legendary **Shure SM7B Studio Microphone** (৳42,000 BDT) and **Shure MV7+ Podcast Microphone** (৳25,500 BDT).`
          : `আমাদের কাছে রয়েছে ব্রডকাস্টের শীর্ষস্থানীয় **Shure SM7B স্টুডিও মাইক্রোফোন** (৳৪২,০০০ টাকা) এবং **Shure MV7+ পডকাস্ট মাইক্রোফোন** (৳২৫,৫০০ টাকা)।`;
        recommendedIds = ['p6', 'p23'];
      } else if (isDyson) {
        aiReply = isEnglish
          ? `Yes! We carry the **Dyson Purifier Hot+Cool Gen1 Air Purifier** (৳59,000 BDT) with HEPA H13 filtration.`
          : `হ্যাঁ, আমাদের স্টোরে রয়েছে **Dyson Purifier Hot+Cool জেন১ এয়ার পিউরিফায়ার** (৳৫৯,০০০ টাকা)।`;
        recommendedIds = ['p26'];
      } else if (extractedBudget && extractedBudget <= 5000) {
        if (isSpeakerQuery) {
          aiReply = isEnglish
            ? `Currently, ShopNexus does not have speakers available under ৳${extractedBudget.toLocaleString()} BDT. Our premium **Marshall Stanmore III** speaker starts at ৳31,900 BDT.`
            : `বর্তমানে আমাদের শপনেক্সাস স্টোরে ৳${extractedBudget.toLocaleString()} টাকার মধ্যে কোনো স্পিকার অ্যাভেইলেবল নেই। আমাদের স্টোরে প্রিমিয়াম **Marshall Stanmore III** স্পিকারের মূল্য ৳৩১,৯০০ টাকা থেকে শুরু।`;
          recommendedIds = [];
        } else if (isWatchQuery) {
          aiReply = isEnglish
            ? `We currently do not stock smartwatches under ৳${extractedBudget.toLocaleString()} BDT. Our official smartwatch collection begins with the **Huawei Watch GT 4** (৳22,500 BDT) and **Samsung Galaxy Watch Ultra** (৳56,000 BDT).`
            : `বর্তমানে ৳${extractedBudget.toLocaleString()} টাকার বাজেটে আমাদের স্টোরে কোনো স্মার্টওয়াচ নেই। আমাদের স্মার্টওয়াচ কালেকশনে **Huawei Watch GT 4** (৳২২,৫০০) এবং **Samsung Galaxy Watch Ultra** (৳৫৬,০০০) রয়েছে।`;
          recommendedIds = [];
        } else {
          aiReply = isEnglish
            ? `At ৳${extractedBudget.toLocaleString()} BDT budget, our closest premium peripheral is the **HyperX Pulsefire Haste 2 Wireless Mouse** (৳7,500 BDT).`
            : `৳${extractedBudget.toLocaleString()} বাজেটের কাছাকাছি আমাদের প্রিমিয়াম পেরিফেরাল হলো **HyperX Pulsefire Haste 2 ওয়্যারলেস মাউস** (৳৭,৫০০ টাকা)।`;
          recommendedIds = ['p14'];
        }
      } else if (isWatchQuery) {
        aiReply = isEnglish
          ? `Our official smartwatch collection features the **Apple Watch Ultra 2 Titanium** (৳79,900 BDT), **Garmin Fenix 7X Pro** (৳88,000 BDT), and **Samsung Galaxy Watch Ultra** (৳56,000 BDT).`
          : `আমাদের অফিসিয়াল স্মার্টওয়াচ কালেকশনে রয়েছে **Samsung Galaxy Watch Ultra** (৳৫৬,০০০ টাকা), **Huawei Watch GT 4** (৳২২,৫০০ টাকা), এবং **Apple Watch Ultra 2** (৳৭৯,৯০০ টাকা)।`;
        recommendedIds = ['p8', 'p10', 'p7'];
      } else if (isKeyboardQuery || isMouseQuery) {
        aiReply = isEnglish
          ? `For keyboards and mice, we recommend the **Keychron Q1 Pro** (৳17,900 BDT), **Logitech MX Master 3S** (৳11,500 BDT), and **NuPhy Air75 V2** (৳13,500 BDT).`
          : `কিবোর্ড ও মাউসের জন্য আমাদের সেরা চয়েস হলো **Keychron Q1 Pro** (৳১৭,৯০০ টাকা), **Logitech MX Master 3S** (৳১১,৫০০ টাকা), এবং **NuPhy Air75 V2** (৳১৩,৫০০ টাকা)।`;
        recommendedIds = ['p11', 'p12', 'p15'];
      } else {
        aiReply = isEnglish
          ? `Welcome to ShopNexus! We feature official hardware gear from Samsung, Apple, Sony, Bose, Marshall, Keychron, and Logitech. How may I assist your shopping today?`
          : `স্বাগতম! শপনেক্সাসে রয়েছে Samsung, Apple, Sony, Bose, Marshall, Keychron এবং Logitech-এর মতো সেরা ব্র্যান্ডের অফিসিয়াল গ্যাজেট। আপনার পছন্দের গ্যাজেটটি খুঁজে পেতে কীভাবে সাহায্য করতে পারি?`;
        recommendedIds = ['p9', 'p1', 'p11'];
      }
    }

    // 🎯 6. Fetch Matching Product Objects for UI Cards
    let suggestedProducts: any[] = [];
    if (recommendedIds.length > 0) {
      suggestedProducts = recommendedIds
        .map((recId) => {
          return catalogProducts.find(
            (p) =>
              p._id?.toString() === recId ||
              p.slug === recId ||
              p.title?.toLowerCase().includes(recId.toLowerCase())
          );
        })
        .filter(Boolean)
        .slice(0, 4);
    }

    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        reply: aiReply,
        provider,
        responseTimeMs,
        suggestedProducts: suggestedProducts.map((p) => ({
          _id: (p._id || p.slug || '').toString(),
          title: p.title,
          price: p.price,
          discountPrice: p.discountPrice,
          category: p.category,
          rating: p.averageRating || p.rating || 4.9,
          image: p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        })),
      },
    });
  } catch (error: any) {
    console.error('AI chat route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal AI Server Error',
      },
      { status: 500 }
    );
  }
}
