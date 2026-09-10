import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';
import { ALL_PRODUCTS } from '@/data/products';
import { INITIAL_INVENTORY } from '@/data/inventory';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { imageBase64, imageUrl, language } = body;
    const isBn = language === 'bn';

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Image (base64 or URL) is required for visual search' },
        { status: 400 }
      );
    }

    // 🌐 1. If imageUrl is provided and imageBase64 is not, fetch and convert to base64
    if (!imageBase64 && imageUrl) {
      try {
        const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(8000) });
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
          imageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        }
      } catch (_imgFetchErr) {
        console.warn('Failed to fetch imageUrl for base64 conversion:', imageUrl);
      }
    }

    // 🗄️ 2. Fetch live products from MongoDB Atlas (with fallback to ALL_PRODUCTS + INITIAL_INVENTORY)
    let catalogProducts: any[] = [];
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        const dbItems = await db.collection('products').find({ isActive: { $ne: false } }).toArray();
        if (dbItems && dbItems.length > 0) {
          catalogProducts = dbItems
            .filter((item) => item.title && !item.title.startsWith('sdfs') && !item.title.startsWith('ascasc'))
            .map((item) => ({
              ...item,
              _id: item._id?.toString() || item.id || item.slug,
            }));
        }
      }
    } catch (_dbErr) {
      // Fallback to in-memory datasets
    }

    // Merge static catalog products
    const existingIds = new Set(catalogProducts.map((p) => p._id));
    for (const prod of ALL_PRODUCTS) {
      if (!existingIds.has(prod._id)) {
        catalogProducts.push(prod);
        existingIds.add(prod._id);
      }
    }

    // Create concise catalog reference for AI prompt
    const catalogSummary = catalogProducts.slice(0, 30).map((p) => ({
      id: p._id,
      title: p.title || p.name,
      category: p.category,
      brand: p.brand,
      price: p.discountPrice || p.price,
      tags: p.tags || [],
      description: (p.description || '').slice(0, 150),
    }));

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    let aiMatchResult: {
      categoryType: 'human_or_selfie' | 'tech_gadget' | 'non_tech_object' | 'screenshot_or_ui';
      detectedCategory?: string;
      detectedItem: string;
      isGadget: boolean;
      isCatalogAvailable: boolean;
      aiMessage: string;
      visualTags: string[];
      matchedProductIds: Array<{
        id: string;
        similarityScore: number;
        confidence?: string;
        matchedFeatures: string[];
      }>;
    } | null = null;

    // ⚡ 3. Call Google Gemini Vision Multimodal API directly
    if (GEMINI_API_KEY && imageBase64) {
      let mimeType = 'image/jpeg';
      let cleanBase64 = imageBase64;

      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        const mimeMatch = parts[0].match(/:(.*?)$/);
        if (mimeMatch) mimeType = mimeMatch[1];
        cleanBase64 = parts[1];
      }

      const visionPrompt = `You are ShopNexus AI Vector Vision Engine - a specialist in multimodal computer vision for premium electronics, tech gadgets, mechanical keyboards, audiophile gear, smart wearables, and gaming peripherals.

Analyze the uploaded image with extreme precision across 3 possible cases:

Case A: The image shows a HUMAN, SELFIE, FACE, BODY, PORTRAIT, PET, SCENERY, RANDOM NON-TECH OBJECT (e.g. food, furniture, clothes, car), or a CODE/UI SCREENSHOT.
- Set categoryType to "human_or_selfie", "screenshot_or_ui", or "non_tech_object".
- Set isGadget to false.
- Set isCatalogAvailable to false.
- Set detectedCategory to "General".
- Set aiMessage to a clear polite explanation in Bengali/English (e.g., "এটি একজন ব্যক্তির ছবি / সাধারণ ছবি, কোনো টেক গ্যাজেট নয়। ShopNexus শুধুমাত্র প্রিমিয়াম গ্যাজেট বিক্রয় করে।").
- matchedProductIds MUST BE [].

Case B: The image shows a TECH GADGET / ELECTRONICS PRODUCT that IS PRESENT in the ShopNexus Catalog below (e.g. Mechanical Keyboard, Sony/Bose Headphones, Smartwatch, Gaming Mouse, Studio Mic).
- Set categoryType to "tech_gadget".
- Set isGadget to true.
- Set isCatalogAvailable to true.
- Set detectedCategory to one of: "Wearables", "Audio", "Peripherals", "Gaming", "Creator Gear", "Smart Home", "Electronics".
- List the top 1 to 3 matching product IDs from the catalog with similarityScore (0.80 to 0.99) and matchedFeatures.

Case C: The image shows a TECH GADGET / DEVICE that is REAL but NOT STOCKED in the ShopNexus Catalog (e.g. Xiaomi/Redmi Smartwatch not in catalog, Drone, Microwave, DSLR Camera, Smartphone, VR Headset).
- Set categoryType to "tech_gadget".
- Set isGadget to true.
- Set isCatalogAvailable to false.
- Set detectedCategory to one of: "Wearables", "Audio", "Peripherals", "Gaming", "Creator Gear", "Smart Home", "Electronics".
- Set aiMessage to a friendly notice explaining that this specific gadget was detected, but is currently out of stock in ShopNexus.
- matchedProductIds MUST BE [].

SHOPNEXUS CATALOG:
${JSON.stringify(catalogSummary, null, 2)}

OUTPUT REQUIREMENT:
Respond ONLY with a valid JSON object in this exact schema without any markdown wrapping or extra commentary:
{
  "categoryType": "human_or_selfie" | "tech_gadget" | "non_tech_object" | "screenshot_or_ui",
  "detectedCategory": "Wearables" | "Audio" | "Peripherals" | "Gaming" | "Creator Gear" | "Smart Home" | "Electronics",
  "detectedItem": "Detailed description of what is visible in the image",
  "isGadget": true/false,
  "isCatalogAvailable": true/false,
  "aiMessage": "Contextual explanation for the user",
  "visualTags": ["tag1", "tag2", "tag3"],
  "matchedProductIds": [
    {
      "id": "exact_catalog_id",
      "similarityScore": 0.96,
      "confidence": "high",
      "matchedFeatures": ["Feature 1", "Feature 2"]
    }
  ]
}`;

      const visionModels = ['gemini-flash-latest', 'gemini-3.6-flash', 'gemini-3.5-flash'];

      for (const model of visionModels) {
        if (aiMatchResult) break;
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
                        inlineData: {
                          mimeType: mimeType,
                          data: cleanBase64,
                        },
                      },
                      {
                        text: visionPrompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.1,
                  maxOutputTokens: 1024,
                },
              }),
              signal: AbortSignal.timeout(15000),
            }
          );

          if (geminiRes.ok) {
            const geminiJson = await geminiRes.json();
            const textResponse = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textResponse) {
              try {
                const cleaned = textResponse.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                if (parsed.detectedItem && Array.isArray(parsed.visualTags)) {
                  aiMatchResult = parsed;
                  break;
                }
              } catch (_parseErr) {
                console.warn('JSON parse error from model:', textResponse);
              }
            }
          }
        } catch (_visionErr) {
          // Try next model
        }
      }
    }

    // 🎯 4. Build Final Matched Products List & Category Inference
    let finalMatchedItems: any[] = [];
    let detectedItemTitle = aiMatchResult?.detectedItem || (isBn ? 'শনাক্তকরণ সম্পন্ন' : 'Detected Visual Gear');
    let queryVisualTags: string[] = aiMatchResult?.visualTags || [];
    let categoryType = aiMatchResult?.categoryType || 'tech_gadget';
    let isGadget = aiMatchResult?.isGadget ?? true;
    let isCatalogAvailable = aiMatchResult?.isCatalogAvailable ?? false;
    let aiMessage = aiMatchResult?.aiMessage || '';
    let detectedCategory = aiMatchResult?.detectedCategory || '';

    // Smart Category Inference if not explicitly returned by Gemini
    if (!detectedCategory || detectedCategory === 'General') {
      const lowerDetection = `${detectedItemTitle} ${queryVisualTags.join(' ')}`.toLowerCase();
      if (lowerDetection.includes('watch') || lowerDetection.includes('wearable') || lowerDetection.includes('fitness') || lowerDetection.includes('band') || lowerDetection.includes('tracker')) {
        detectedCategory = 'Wearables';
      } else if (lowerDetection.includes('headphone') || lowerDetection.includes('earphone') || lowerDetection.includes('earbud') || lowerDetection.includes('audio') || lowerDetection.includes('speaker') || lowerDetection.includes('mic')) {
        detectedCategory = 'Audio';
      } else if (lowerDetection.includes('keyboard') || lowerDetection.includes('mouse') || lowerDetection.includes('keycap') || lowerDetection.includes('desk') || lowerDetection.includes('peripheral')) {
        detectedCategory = 'Peripherals';
      } else if (lowerDetection.includes('game') || lowerDetection.includes('controller') || lowerDetection.includes('console') || lowerDetection.includes('joystick')) {
        detectedCategory = 'Gaming';
      } else if (lowerDetection.includes('camera') || lowerDetection.includes('stream') || lowerDetection.includes('light') || lowerDetection.includes('lens')) {
        detectedCategory = 'Creator Gear';
      } else if (lowerDetection.includes('home') || lowerDetection.includes('smart bulb') || lowerDetection.includes('vacuum') || lowerDetection.includes('router')) {
        detectedCategory = 'Smart Home';
      } else {
        detectedCategory = isGadget ? 'Wearables' : 'General';
      }
    }

    if (aiMatchResult && isGadget && isCatalogAvailable && Array.isArray(aiMatchResult.matchedProductIds)) {
      for (const match of aiMatchResult.matchedProductIds) {
        const fullProd = catalogProducts.find(
          (p) => p._id === match.id || p.id === match.id || p.slug === match.id
        );
        if (fullProd) {
          finalMatchedItems.push({
            product: {
              _id: fullProd._id || fullProd.id,
              title: fullProd.title || fullProd.name,
              category: fullProd.category,
              brand: fullProd.brand,
              price: fullProd.price,
              discountPrice: fullProd.discountPrice,
              images: fullProd.images || [fullProd.image],
              stock: fullProd.stock ?? 15,
            },
            similarityScore: match.similarityScore || 0.9,
            confidence: match.confidence || 'high',
            matchedFeatures: match.matchedFeatures || [fullProd.category, fullProd.brand],
          });
        }
      }
    }

    // ⚡ Fallback if AI was unavailable and sample image was used
    if (!aiMatchResult && imageUrl) {
      const sampleKeywords = imageUrl.toLowerCase();
      if (sampleKeywords.includes('keyboard') || sampleKeywords.includes('keychron')) {
        detectedItemTitle = 'Keychron Mechanical Keyboard';
        detectedCategory = 'Peripherals';
        queryVisualTags = ['mechanical-keyboard', 'custom-keycaps', 'wireless', 'rgb'];
        const prod = catalogProducts.find((p) => p.category === 'Peripherals' || p.title?.toLowerCase().includes('keyboard'));
        if (prod) {
          finalMatchedItems.push({
            product: {
              _id: prod._id,
              title: prod.title,
              category: prod.category,
              brand: prod.brand,
              price: prod.price,
              discountPrice: prod.discountPrice,
              images: prod.images,
              stock: prod.stock,
            },
            similarityScore: 0.96,
            confidence: 'high',
            matchedFeatures: ['Mechanical Switch', 'RGB Backlight', 'Peripherals'],
          });
          isCatalogAvailable = true;
          isGadget = true;
        }
      } else if (sampleKeywords.includes('headphones') || sampleKeywords.includes('audio')) {
        detectedItemTitle = 'Sony WH-1000XM5 Wireless ANC';
        detectedCategory = 'Audio';
        queryVisualTags = ['audiophile', 'anc-headphones', 'wireless-audio'];
        const prod = catalogProducts.find((p) => p.category === 'Audio');
        if (prod) {
          finalMatchedItems.push({
            product: {
              _id: prod._id,
              title: prod.title,
              category: prod.category,
              brand: prod.brand,
              price: prod.price,
              discountPrice: prod.discountPrice,
              images: prod.images,
              stock: prod.stock,
            },
            similarityScore: 0.97,
            confidence: 'high',
            matchedFeatures: ['Active Noise Cancellation', 'Spatial Audio'],
          });
          isCatalogAvailable = true;
          isGadget = true;
        }
      }
    }

    // 💡 5. Fetch 2-4 Alternative Products if Gadget is Out of Stock or Not in Direct Catalog
    let alternativeItems: any[] = [];
    if (isGadget && finalMatchedItems.length === 0) {
      // Find products in the same category or relevant tags
      const categoryProds = catalogProducts.filter(
        (p) => p.category?.toLowerCase() === detectedCategory.toLowerCase()
      );
      
      const candidateList = categoryProds.length >= 2 ? categoryProds : catalogProducts;
      alternativeItems = candidateList.slice(0, 4).map((p, idx) => ({
        product: {
          _id: p._id || p.id,
          title: p.title || p.name,
          category: p.category,
          brand: p.brand,
          price: p.price,
          discountPrice: p.discountPrice,
          images: p.images || [p.image],
          stock: p.stock ?? 15,
        },
        similarityScore: Math.max(0.75, 0.90 - idx * 0.05),
        matchLabel: isBn ? 'বিকল্প পছন্দ' : 'Alternative Pick',
        matchedFeatures: [p.category, p.brand].filter(Boolean),
      }));
    }

    return NextResponse.json({
      success: true,
      data: {
        categoryType,
        detectedCategory,
        detectedItem: detectedItemTitle,
        isGadget,
        isCatalogAvailable: finalMatchedItems.length > 0,
        aiMessage,
        queryVisualTags: queryVisualTags.length > 0 ? queryVisualTags : ['visual-search', 'ai-vision'],
        matchedItems: finalMatchedItems,
        alternativeItems,
      },
    });
  } catch (error: any) {
    console.error('AI Visual Search Endpoint Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to process visual search request',
      },
      { status: 500 }
    );
  }
}
