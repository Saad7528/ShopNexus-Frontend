import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

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

    // 🗄️ 1. Connect to Live MongoDB Atlas Database & Fetch Catalog
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    const productsCollection = db.collection('products');
    const allProducts = await productsCollection.find({ isActive: { $ne: false } }).toArray();

    // Build rich, formatted catalog context in Bangladeshi Taka (৳ BDT) for Gemini
    const catalogContext = allProducts
      .map(
        (p) =>
          `- ${p.title} | Category: ${p.category} | Brand: ${p.brand} | Price: ৳${(p.discountPrice || p.price).toLocaleString()} BDT | Rating: ${p.averageRating || 4.8}★ | Tags: ${p.tags?.join(', ') || ''} | Description: ${p.description || ''}`
      )
      .join('\n');

    // 🤖 2. Construct Master System Prompt for Google Gemini 3.6 Flash
    const systemPrompt = `You are "Nexus AI Assistant", the hyper-intelligent, official shopping consultant for ShopNexus (Bangladesh's premier official hardware, audiophile audio & workspace gear store).

STRICT CORE GUIDELINES:
1. ALWAYS quote exact prices in Bangladeshi Taka (৳ BDT). NEVER quote in USD ($) or any other currency.
2. LIVE CATALOG GROUNDING:
   - Our store officially stocks the items listed in the OFFICIAL CATALOG below.
   - If the customer asks "তোমার কাছে কি আছে দেখার মতো?" or general questions ("কী কী প্রোডাক্ট আছে?", "তুমি কে?"), warmly introduce yourself as Nexus AI, highlight our top categories (Apple Watch Ultra 2 smartwatch, Sony WH-1000XM5 ANC audio, Keychron Q1 Pro custom keyboards, Logitech MX Master mouse, DJI Pocket 3 4K gimbal, and Anker GaN chargers), and ask how you can assist their setup.
   - If the customer asks for a product NOT in our catalog (e.g. Laptop / Full PC, Smartphones / iPhone, Shoes, Clothes, TV), POLITELY & HONESTLY EXPLAIN: "এই প্রোডাক্টটি বর্তমানে আমাদের শপনেক্সাস স্টোরে সরাসরি অ্যাভেইলেবল নেই, তবে শীঘ্রই এটি যুক্ত করার কাজ চলছে!" Then suggest relevant available peripherals from our catalog.
   - If the customer asks for a budget (e.g. "১৫ হাজার টাকার নিচে কী আছে?", "20k budget", "কম দামের মধ্যে"), identify the exact budget in BDT and recommend the best matching products strictly within or near that budget from our catalog!
3. MULTI-LINGUAL ADAPTABILITY:
   - If the user writes in Bangla (বাংলা), reply in natural, engaging, professional Bangla.
   - If the user writes in Banglish (e.g., "amar 15000 tk budget..."), reply in friendly, conversational Bangla/Banglish.
   - If the user writes in English, reply in sharp, concise, professional English.
4. Keep the response concise, clear, and engaging (2 to 4 sentences).

OFFICIAL SHOPNEXUS CATALOG (LIVE MONGODB):
${catalogContext}`;

    // ⚡ 3. Call Google Gemini 3.6 Flash API
    let aiReply: string | null = null;
    let provider = 'gemini-3.6-flash';
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemPrompt}\n\nCustomer Question: "${query}"\nSelected Category: ${category || 'Any'}\nMax Budget Filter: ${maxBudget ? `৳${maxBudget}` : 'Flexible'}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 380,
              },
            }),
            signal: AbortSignal.timeout(4000), // 4s timeout
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          aiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } else {
          console.warn('Gemini 3.6 API returned error status:', geminiRes.status);
        }
      } catch (err: any) {
        console.warn('Gemini 3.6 API call error, activating neural fallback:', err?.message);
      }
    }

    // 🎯 4. Intelligent MongoDB Product Matching for Display Cards
    let matchedProducts: any[] = [];

    // Check if query is about Smartwatches / Wearables
    const isSmartwatch =
      queryLower.includes('smartwatch') ||
      queryLower.includes('watch') ||
      queryLower.includes('apple watch') ||
      queryLower.includes('garmin') ||
      queryLower.includes('স্মার্টওয়াচ') ||
      queryLower.includes('স্মার্টওয়াচ') ||
      queryLower.includes('ঘড়ি') ||
      queryLower.includes('ঘড়ি');

    const isAudio =
      queryLower.includes('audio') ||
      queryLower.includes('headphone') ||
      queryLower.includes('speaker') ||
      queryLower.includes('sound') ||
      queryLower.includes('হেডফোন') ||
      queryLower.includes('স্পিকার') ||
      queryLower.includes('সাউন্ড') ||
      queryLower.includes('গান');

    const isKeyboard =
      queryLower.includes('keyboard') ||
      queryLower.includes('mouse') ||
      queryLower.includes('mechanical') ||
      queryLower.includes('কিবোর্ড') ||
      queryLower.includes('মাউস');

    // Parse Bengali/English numbers for budget (e.g. "১৫ হাজার", "15000", "15k", "20k", "৫০ হাজার")
    let parsedBudget: number | undefined = maxBudget;
    if (!parsedBudget) {
      if (queryLower.includes('১৫ হাজার') || queryLower.includes('১৫০০০') || queryLower.includes('15000') || queryLower.includes('15k')) {
        parsedBudget = 15000;
      } else if (queryLower.includes('২০ হাজার') || queryLower.includes('২০০০') || queryLower.includes('20000') || queryLower.includes('20k')) {
        parsedBudget = 20000;
      } else if (queryLower.includes('৩০ হাজার') || queryLower.includes('৩০০০') || queryLower.includes('30000') || queryLower.includes('30k')) {
        parsedBudget = 30000;
      } else if (queryLower.includes('৫০ হাজার') || queryLower.includes('৫০০০০') || queryLower.includes('50000') || queryLower.includes('50k')) {
        parsedBudget = 50000;
      }
    }

    if (isSmartwatch) {
      matchedProducts = allProducts.filter(
        (p) => p.category?.toLowerCase().includes('wearable') || p.tags?.includes('smartwatch') || p.title?.toLowerCase().includes('watch')
      );
    } else if (isAudio) {
      matchedProducts = allProducts.filter((p) => p.category?.toLowerCase().includes('audio'));
    } else if (isKeyboard) {
      matchedProducts = allProducts.filter(
        (p) => p.category?.toLowerCase().includes('computing') || p.tags?.includes('keyboard') || p.tags?.includes('mouse')
      );
    } else {
      // General match across title, tags, description
      matchedProducts = allProducts.filter((p) => {
        const textMatch =
          p.title?.toLowerCase().includes(queryLower) ||
          p.brand?.toLowerCase().includes(queryLower) ||
          p.tags?.some((t: string) => queryLower.includes(t.toLowerCase()));
        return textMatch;
      });

      // If broad conversational question ("তোমার কাছে কি আছে?", "best deals"), show flagship highlights
      if (matchedProducts.length === 0) {
        matchedProducts = [...allProducts].sort((a, b) => (b.averageRating || 5) - (a.averageRating || 5));
      }
    }

    // Filter and sort by budget if budget was requested
    if (parsedBudget && parsedBudget > 0) {
      const budgetMatches = matchedProducts.filter((p) => (p.discountPrice || p.price) <= parsedBudget!);
      if (budgetMatches.length > 0) {
        matchedProducts = budgetMatches.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      }
    }

    // ⚡ 5. Fallback Response (if Gemini API key is missing or errored)
    if (!aiReply) {
      provider = 'nexus-neural-engine';
      if (isSmartwatch) {
        const topWatch = matchedProducts[0] || { title: 'Apple Watch Ultra 2 Aerospace Titanium', price: 79900 };
        aiReply = `হ্যাঁ, আমাদের শপনেক্সাস স্টোরে **অফিসিয়াল স্মার্টওয়াচ** রয়েছে! সেরা অভিজ্ঞতার জন্য **${topWatch.title}** (৳${(topWatch.discountPrice || topWatch.price).toLocaleString()} BDT) আমাদের টপ-রেটেড চয়েস। নিচে আমাদের স্মার্টওয়াচ কালেকশন দেওয়া হলো:`;
      } else if (parsedBudget) {
        aiReply = `৳${parsedBudget.toLocaleString()} বাজেটের মধ্যে শপনেক্সাসের সেরা অফিসিয়াল গ্যাজেটগুলো নিচে সাজিয়ে দেওয়া হলো। ১-ক্লিকেই পছন্দের পণ্য কার্টে যোগ করতে পারেন:`;
      } else if (queryLower.includes('তোমার কাছে কি আছে') || queryLower.includes('দেখার মতো') || queryLower.includes('কি কি আছে')) {
        aiReply = `স্বাগতম! শপনেক্সাসে রয়েছে প্রিমিয়াম অফিসিয়াল গ্যাজেটের এক্সক্লুসিভ কালেকশন—যেমন **Apple Watch Ultra 2 (স্মার্টওয়াচ)**, **Sony WH-1000XM5 ও Marshall (অডিও)**, **Keychron Q1 Pro (কাস্টম কিবোর্ড)**, **Logitech MX Master 3S (মাউস)**, এবং **DJI Pocket 3 (4K ক্যামেরা)**। আপনার পছন্দের গ্যাজেটটি বেছে নিতে পারেন!`;
      } else {
        aiReply = `আপনার অনুসন্ধানের ভিত্তিতে শপনেক্সাসের ভেরিফায়েড অফিসিয়াল গ্যাজেটগুলো নিচে দেওয়া হলো:`;
      }
    }

    const finalProducts = matchedProducts.slice(0, 4);
    const responseTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        reply: aiReply,
        provider,
        responseTimeMs,
        suggestedProducts: finalProducts.map((p) => ({
          _id: p._id.toString(),
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
