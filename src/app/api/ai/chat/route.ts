import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { ALL_PRODUCTS } from '@/data/products';

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

    // 🗄️ 1. Fetch live products from MongoDB Atlas (with fallback to ALL_PRODUCTS)
    let catalogProducts: any[] = [...ALL_PRODUCTS];
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        const dbItems = await db.collection('products').find({ isActive: { $ne: false } }).toArray();
        if (dbItems && dbItems.length > 0) {
          // Merge with static products so IDs like p1..p29 are preserved
          const dbMap = new Map();
          dbItems.forEach((item) => {
            const key = item.slug || item._id?.toString() || item.title;
            dbMap.set(key, item);
          });
          catalogProducts = catalogProducts.map((p) => {
            const matched = dbMap.get(p.slug) || dbMap.get(p._id);
            return matched ? { ...p, ...matched } : p;
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB connection note, using cached static catalog:', dbErr);
    }

    // Build catalog grounding for Gemini
    const catalogContext = catalogProducts
      .map(
        (p) =>
          `ID: ${p._id} | Title: ${p.title} | Category: ${p.category} | Brand: ${p.brand} | Price: ৳${(p.discountPrice || p.price).toLocaleString()} BDT | Rating: ${p.averageRating || 4.9}★ | Description: ${p.description || ''}`
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
3. LIVE CATALOG ANALYSIS & BUDGET HONESTY (CRITICAL):
   - You MUST analyze the catalog carefully.
   - If the customer asks for a product type (e.g. speaker, headphone, watch, keyboard) within a specific budget (e.g., 3000 BDT, 5000 BDT, 10000 BDT), and our store DOES NOT have that product type within that budget:
     - Clearly and politely explain that we currently do not carry that item within that budget.
     - State the starting price of that category in our store (e.g. our Marshall Stanmore speaker starts at ৳31,900 BDT).
     - If there are other gadget accessories near their budget (e.g. HyperX mouse at ৳7,500 BDT or Logitech MX Master at ৳11,500 BDT), mention them as alternatives, or explain our store's focus on authentic premium hardware.
     - In this scenario, DO NOT falsely claim that expensive items fit their low budget!
   - If products DO exist within their budget or match their query, recommend the best matching products from the catalog with their exact prices and key features.
   - If the customer asks for items we do not sell (like iPhone, Laptops, Clothes, TV), politely inform them that we specialize in Audiophile Audio, Smartwatches, Mechanical Keyboards, Studio/Creator Gear, and Desk Peripherals.
4. STRUCTURED RECOMMENDATION TAG:
   - At the VERY END of your response, on a new line, list the IDs of the products you specifically recommended for this customer in this exact format:
     [RECOMMENDED_IDS: p1, p4]
   - If no products in the catalog fit the customer's budget/request, write:
     [RECOMMENDED_IDS: none]
   - Maximum 4 product IDs.

OFFICIAL SHOPNEXUS CATALOG:
${catalogContext}`;

    // ⚡ 3. Call Google Gemini API (with multiple model fallbacks)
    let aiReply: string | null = null;
    let provider = 'gemini-1.5-flash';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

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
                  temperature: 0.3,
                  maxOutputTokens: 500,
                },
              }),
              signal: AbortSignal.timeout(6000),
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
        // Remove the technical tag from the user-facing text
        aiReply = aiReply.replace(/\[RECOMMENDED_IDS:\s*[^\]]+\]/i, '').trim();
      }
    }

    // ⚡ 5. Intelligent Fallback Engine if API is unavailable or offline
    if (!aiReply) {
      provider = 'nexus-intelligent-engine';
      const isSpeakerQuery = queryLower.includes('speaker') || queryLower.includes('স্পিকার');
      const isHeadphoneQuery = queryLower.includes('headphone') || queryLower.includes('হেডফোন');
      const isWatchQuery = queryLower.includes('watch') || queryLower.includes('ঘড়ি') || queryLower.includes('স্মার্টওয়াচ');
      const isKeyboardQuery = queryLower.includes('keyboard') || queryLower.includes('কিবোর্ড');
      const isMouseQuery = queryLower.includes('mouse') || queryLower.includes('মাউস');

      if (extractedBudget && extractedBudget <= 5000) {
        if (isSpeakerQuery) {
          if (isEnglish) {
            aiReply = `Currently, ShopNexus does not have speakers available under ৳${extractedBudget.toLocaleString()} BDT. Our premium **Marshall Stanmore III** speaker starts at ৳31,900 BDT. We specialize in official high-end audiophile audio equipment.`;
          } else {
            aiReply = `বর্তমানে আমাদের শপনেক্সাস স্টোরে ৳${extractedBudget.toLocaleString()} টাকার মধ্যে কোনো স্পিকার অ্যাভেইলেবল নেই। আমাদের স্টোরে প্রিমিয়াম **Marshall Stanmore III** স্পিকারের মূল্য ৳৩১,৯০০ টাকা থেকে শুরু। আমরা মূলত অফিসিয়াল হাই-এন্ড প্রিমিয়াম অডিও গ্যাজেট সরবরাহ করে থাকি।`;
          }
          recommendedIds = [];
        } else if (isWatchQuery) {
          if (isEnglish) {
            aiReply = `We currently do not stock smartwatches under ৳${extractedBudget.toLocaleString()} BDT. Our official smartwatch collection begins with the **Huawei Watch GT 4** (৳22,500 BDT) and **Apple Watch Ultra 2** (৳79,900 BDT).`;
          } else {
            aiReply = `বর্তমানে ৳${extractedBudget.toLocaleString()} টাকার বাজেটে আমাদের স্টোরে কোনো স্মার্টওয়াচ নেই। আমাদের স্মার্টওয়াচ কালেকশনে **Huawei Watch GT 4** (৳২২,৫০০) এবং **Apple Watch Ultra 2** (৳৭৯,৯০০) রয়েছে।`;
          }
          recommendedIds = [];
        } else {
          if (isEnglish) {
            aiReply = `At ৳${extractedBudget.toLocaleString()} BDT budget, our closest premium peripheral is the **HyperX Pulsefire Haste 2 Wireless Mouse** (৳7,500 BDT). Explore our verified collection below:`;
          } else {
            aiReply = `৳${extractedBudget.toLocaleString()} বাজেটের কাছাকাছি আমাদের প্রিমিয়াম পেরিফেরাল হলো **HyperX Pulsefire Haste 2 ওয়্যারলেস মাউস** (৳৭,৫০০ টাকা)। আমাদের অফিসিয়াল গ্যাজেটগুলো নিচে দেখতে পারেন:`;
          }
          recommendedIds = ['p14'];
        }
      } else if (isSpeakerQuery) {
        aiReply = isEnglish
          ? `For home and studio audio, we highly recommend the **Marshall Stanmore III Bluetooth Speaker** (৳31,900 BDT) for its iconic room-filling acoustic soundstage.`
          : `হোম ও স্টুডিও অডিওর জন্য আমরা **Marshall Stanmore III ব্লুটুথ স্পিকার** (৳৩১,৯০০ টাকা) রিকমেন্ড করছি, যা রুম-ভরা ক্লাসিক সাউন্ডস্টেজ প্রদান করে।`;
        recommendedIds = ['p4'];
      } else if (isKeyboardQuery) {
        aiReply = isEnglish
          ? `For the ultimate typing and gaming experience, the **Keychron Q1 Pro CNC Custom Keyboard** (৳17,900 BDT) and **NuPhy Air75 V2** (৳13,500 BDT) are our top choices.`
          : `টাইপিং ও প্রোডাক্টিভিটির জন্য আমাদের সেরা কাস্টম মেকানিক্যাল কিবোর্ড হলো **Keychron Q1 Pro** (৳১৭,৯০০ টাকা) এবং **NuPhy Air75 V2** (৳১৩,৫০০ টাকা)।`;
        recommendedIds = ['p11', 'p15'];
      } else if (isWatchQuery) {
        aiReply = isEnglish
          ? `Our flagship smartwatch collection features the **Apple Watch Ultra 2 Titanium** (৳79,900 BDT) and **Garmin Fenix 7 Pro Solar** (৳85,000 BDT).`
          : `আমাদের ফ্ল্যাগশিপ স্মার্টওয়াচ কালেকশনে রয়েছে **Apple Watch Ultra 2 টাইটানিয়াম** (৳৭৯,৯০০ টাকা) এবং **Garmin Fenix 7 Pro সোলার** (৳৮৫,০০০ টাকা)।`;
        recommendedIds = ['p7', 'p8'];
      } else {
        aiReply = isEnglish
          ? `Welcome to ShopNexus! We feature official hardware gear from Sony, Apple, Bose, Marshall, Keychron, and Logitech. How may I assist your shopping today?`
          : `স্বাগতম! শপনেক্সাসে রয়েছে Sony, Apple, Bose, Marshall, Keychron এবং Logitech-এর মতো সেরা ব্র্যান্ডের অফিসিয়াল গ্যাজেট। আপনার বাজেটের সেরা গ্যাজেটটি খুঁজে পেতে কীভাবে সাহায্য করতে পারি?`;
        recommendedIds = ['p1', 'p11', 'p7'];
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
