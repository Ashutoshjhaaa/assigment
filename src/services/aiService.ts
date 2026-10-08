import type { Product, AiRecommendationResponse, RecommendationResult, ProductCategory } from '../types/product';

export const AI_SETTINGS_STORAGE_KEY = 'omnipick_ai_settings';

export interface StoredAiSettings {
  provider: 'local-nlp' | 'gemini' | 'openai';
  geminiApiKey: string;
  openaiApiKey: string;
  geminiModel: string;
  openaiModel: string;
}

export const getStoredSettings = (): StoredAiSettings => {
  const envGeminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  const envOpenAiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';

  try {
    const data = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        geminiApiKey: parsed.geminiApiKey || envGeminiKey,
        openaiApiKey: parsed.openaiApiKey || envOpenAiKey,
        geminiModel: parsed.geminiModel || 'gemini-3.1-flash-lite',
        openaiModel: parsed.openaiModel || 'gpt-4o-mini',
        provider: parsed.provider || (envGeminiKey ? 'gemini' : envOpenAiKey ? 'openai' : 'local-nlp'),
      };
    }
  } catch (e) {
    console.error('Failed to parse AI settings from localStorage', e);
  }

  // If env variable is present, default to live Gemini API
  if (envGeminiKey) {
    return {
      provider: 'gemini',
      geminiApiKey: envGeminiKey,
      openaiApiKey: envOpenAiKey,
      geminiModel: 'gemini-3.1-flash-lite',
      openaiModel: 'gpt-4o-mini',
    };
  }

  if (envOpenAiKey) {
    return {
      provider: 'openai',
      geminiApiKey: '',
      openaiApiKey: envOpenAiKey,
      geminiModel: 'gemini-3.1-flash-lite',
      openaiModel: 'gpt-4o-mini',
    };
  }

  return {
    provider: 'local-nlp',
    geminiApiKey: '',
    openaiApiKey: '',
    geminiModel: 'gemini-3.1-flash-lite',
    openaiModel: 'gpt-4o-mini',
  };
};

export const saveStoredSettings = (settings: StoredAiSettings) => {
  localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

/**
 * Intelligent Local Semantic Rule & Attribute Matcher
 * Acts as an instant fallback or offline mode that provides high-quality recommendations.
 */
/**
 * Helper to parse price/budget intent from natural language
 */
export function parseBudgetIntent(query: string): {
  minPrice: number | null;
  maxPrice: number | null;
  budgetType: 'min' | 'max' | 'range' | null;
  extractedBudget: number | null;
} {
  const q = query.toLowerCase().trim();

  // 1. Between X and Y / Range
  const rangePattern = /(?:between|from)?\s*\$?(\d+)\s*(?:to|-|and)\s*\$?(\d+)/i;
  const rangeMatch = q.match(rangePattern);
  if (rangeMatch && rangeMatch[1] && rangeMatch[2]) {
    const val1 = parseInt(rangeMatch[1], 10);
    const val2 = parseInt(rangeMatch[2], 10);
    if (val1 >= 50 && val2 >= 50) {
      const min = Math.min(val1, val2);
      const max = Math.max(val1, val2);
      return { minPrice: min, maxPrice: max, budgetType: 'range', extractedBudget: max };
    }
  }

  // 2. Minimum budget (above / greater than / more than / over / min / starting from / at least / $X+)
  const minPatterns = [
    /(?:above|greater than|more than|over|higher than|exceeding)\s*\$?(\d+)/i,
    /(?:min|minimum|at least|starting from|starting at)\s*\$?(\d+)/i,
    /\$?(\d+)\s*(?:or more|\+|and above|and up)/i,
  ];

  for (const pattern of minPatterns) {
    const match = q.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (val >= 50 && val <= 5000) {
        return { minPrice: val, maxPrice: 1000, budgetType: 'min', extractedBudget: val };
      }
    }
  }

  // 3. Maximum budget (under / less than / below / max / budget of / up to / <= $X)
  const maxPatterns = [
    /(?:under|less than|below|within|cheaper than)\s*\$?(\d+)/i,
    /(?:max|maximum|up to|budget of|budget)\s*\$?(\d+)/i,
    /\$?(\d+)\s*(?:or less|and below|or under|max)/i,
    /\$(\d+)/i,
  ];

  for (const pattern of maxPatterns) {
    const match = q.match(pattern);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (val >= 50 && val <= 5000) {
        return { minPrice: 100, maxPrice: val, budgetType: 'max', extractedBudget: val };
      }
    }
  }

  return { minPrice: null, maxPrice: null, budgetType: null, extractedBudget: null };
}

/**
 * Intelligent Local Semantic Rule & Attribute Matcher
 * Acts as an instant fallback or offline mode that provides high-quality recommendations.
 */
export function runLocalNlpRecommendation(
  query: string,
  products: Product[]
): AiRecommendationResponse {
  const normalizedQuery = query.toLowerCase().trim();
  const budgetInfo = parseBudgetIntent(normalizedQuery);

  // Identify target category hints
  const categoryKeywords: Record<ProductCategory, string[]> = {
    smartphones: ['phone', 'phones', 'smartphone', 'smartphones', 'iphone', 'android', 'pixel', 'galaxy', 'mobile'],
    laptops: ['laptop', 'laptops', 'macbook', 'notebook', 'pc', 'computer', 'workstation', 'ultrabook', 'vivobook', 'xps', 'legion'],
    audio: ['headphone', 'headphones', 'earbud', 'earbuds', 'earphone', 'earphones', 'sound', 'audio', 'anc', 'noise cancelling', 'airpod', 'airpods', 'bose'],
    wearables: ['watch', 'smartwatch', 'tracker', 'fitness', 'garmin', 'amazfit', 'apple watch', 'wearable', 'gps watch'],
    gaming: ['game', 'gaming', 'console', 'ps5', 'playstation', 'switch', 'steam deck', 'handheld', 'nintendo', 'rog ally'],
    cameras: ['camera', 'cameras', 'vlog', 'vlogging', 'photo', 'photography', 'video', 'gimbal', 'dji', 'gopro', 'mirrorless'],
    tablets: ['tablet', 'tablets', 'ipad', 'tab', 'stylus', 'drawing', 'screen'],
    accessories: ['charger', 'cable', 'case', 'stand', 'accessory'],
  };

  let targetCategory: ProductCategory | 'all' = 'all';
  for (const [cat, words] of Object.entries(categoryKeywords)) {
    if (words.some(word => normalizedQuery.includes(word))) {
      targetCategory = cat as ProductCategory;
      break;
    }
  }

  // Keyword / attribute matching
  const attributeKeywords = [
    'camera', 'battery', 'gaming', 'lightweight', 'compact', 'fast charging',
    'oled', 'travel', 'programming', 'coding', 'office', 'student', '4k',
    'noise cancelling', 'wireless', 'workout', 'running', 'fitness', 'cheap',
    'budget', 'premium', 'flagship', 'apple', 'samsung', 'sony', 'google', 'dji', 'lenovo', 'garmin', 'bose', 'dell', 'hp', 'asus'
  ];

  const matchedKeywords = attributeKeywords.filter(keyword => normalizedQuery.includes(keyword));

  // Filter & Score products
  const scoredProducts: { product: Product; score: number; reasons: string[] }[] = [];

  products.forEach(p => {
    let score = 50;
    const reasons: string[] = [];
    const pText = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.tags.join(' ')} ${Object.entries(p.specs).map(([k, v]) => `${k} ${v}`).join(' ')}`.toLowerCase();

    // Category match
    if (targetCategory !== 'all') {
      if (p.category === targetCategory) {
        score += 35;
        reasons.push(`Matches target category ${p.category}`);
      } else {
        score -= 60; // Strong penalty for wrong category
      }
    }

    // Budget constraints checking
    if (budgetInfo.budgetType === 'min' && budgetInfo.minPrice !== null) {
      if (p.price >= budgetInfo.minPrice) {
        score += 35;
        reasons.push(`Priced at $${p.price}, meeting your requirement of above $${budgetInfo.minPrice}`);
      } else {
        // Severe penalty for violating minimum price requirement
        score -= 75;
      }
    } else if (budgetInfo.budgetType === 'max' && budgetInfo.maxPrice !== null) {
      if (p.price <= budgetInfo.maxPrice) {
        score += 30;
        const savings = budgetInfo.maxPrice - p.price;
        if (savings > 0) {
          reasons.push(`Priced at $${p.price}, safely below your $${budgetInfo.maxPrice} limit`);
        } else {
          reasons.push(`Priced at $${p.price}, right at your $${budgetInfo.maxPrice} limit`);
        }
      } else {
        // Severe penalty for violating maximum price requirement
        score -= 75;
      }
    } else if (budgetInfo.budgetType === 'range' && budgetInfo.minPrice !== null && budgetInfo.maxPrice !== null) {
      if (p.price >= budgetInfo.minPrice && p.price <= budgetInfo.maxPrice) {
        score += 35;
        reasons.push(`Priced at $${p.price}, perfectly within your $${budgetInfo.minPrice} - $${budgetInfo.maxPrice} range`);
      } else {
        score -= 75;
      }
    } else if (normalizedQuery.includes('budget') || normalizedQuery.includes('cheap') || normalizedQuery.includes('affordable')) {
      if (p.price <= 500) {
        score += 20;
        reasons.push(`Budget-friendly pricing at $${p.price}`);
      }
    } else if (normalizedQuery.includes('premium') || normalizedQuery.includes('flagship') || normalizedQuery.includes('best')) {
      if (p.rating >= 4.8 || p.price >= 700) {
        score += 20;
        reasons.push(`Top-tier ${p.rating}★ rating with flagship performance`);
      }
    }

    // Keyword & Tag matches
    matchedKeywords.forEach(kw => {
      if (pText.includes(kw)) {
        score += 15;
        reasons.push(`Matches requested feature "${kw}"`);
      }
    });

    // Rating boost
    if (p.rating >= 4.8) {
      score += 8;
    }

    const finalScore = Math.max(5, Math.min(99, Math.round(score)));

    let synthesisReason = '';
    if (reasons.length > 0) {
      synthesisReason = reasons.slice(0, 3).join('. ') + '.';
    } else {
      synthesisReason = `Rated ${p.rating}★ with high performance in ${p.category}.`;
    }

    scoredProducts.push({
      product: p,
      score: finalScore,
      reasons: [synthesisReason],
    });
  });

  scoredProducts.sort((a, b) => b.score - a.score);

  // Select top valid matches
  const topMatches = scoredProducts
    .filter((sp) => sp.score >= 40)
    .slice(0, 6);

  const finalMatches = topMatches.length > 0 ? topMatches : scoredProducts.slice(0, 4);

  const recommendations: RecommendationResult[] = finalMatches.map(item => ({
    productId: item.product.id,
    matchScore: item.score,
    reason: item.reasons[0],
    highlightSpecs: Object.entries(item.product.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`),
  }));

  let budgetSummaryText = '';
  if (budgetInfo.budgetType === 'min' && budgetInfo.minPrice) {
    budgetSummaryText = ` above $${budgetInfo.minPrice}`;
  } else if (budgetInfo.budgetType === 'max' && budgetInfo.maxPrice) {
    budgetSummaryText = ` under $${budgetInfo.maxPrice}`;
  } else if (budgetInfo.budgetType === 'range') {
    budgetSummaryText = ` between $${budgetInfo.minPrice} and $${budgetInfo.maxPrice}`;
  }

  const summary = finalMatches.length > 0
    ? `Analyzed ${products.length} catalog items for "${query}". Recommended ${finalMatches.length} matching products${budgetSummaryText}${targetCategory !== 'all' ? ` in ${targetCategory}` : ''}.`
    : `We analyzed our catalog for "${query}". Here are our top options matching your criteria.`;

  return {
    query,
    summary,
    recommendations,
    recommendedCategory: targetCategory,
    extractedBudget: budgetInfo.extractedBudget,
    minPrice: budgetInfo.minPrice,
    maxPrice: budgetInfo.maxPrice,
    budgetType: budgetInfo.budgetType,
    extractedKeywords: matchedKeywords,
    providerUsed: 'local-nlp',
  };
}

/**
 * Call Gemini AI for Live Structured Recommendations
 */
async function callGeminiAi(
  query: string,
  products: Product[],
  apiKey: string,
  modelName: string = 'gemini-3.1-flash-lite'
): Promise<AiRecommendationResponse> {
  const catalogSubset = products.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    rating: p.rating,
    tags: p.tags,
    description: p.description,
    specs: p.specs,
  }));

  const systemPrompt = `You are an expert AI product recommender.
Given the user query and the product catalog ($100 to $1000), recommend the most suitable products from the catalog.

CRITICAL PRICE & CATEGORY RULES:
1. "above $X" or "more than $X" or "over $X" -> ONLY recommend products where price >= X. Strictly reject any products priced below X.
2. "under $X" or "less than $X" or "below $X" -> ONLY recommend products where price <= X. Strictly reject any products priced above X.
3. "between $X and $Y" -> ONLY recommend products where price is between X and Y.
4. If category is specified (e.g. laptop, phone, audio, camera), ONLY recommend products from that category.

Strictly return a valid JSON object matching this schema:
{
  "summary": "Brief 1-2 sentence explanation addressing the user constraints precisely",
  "extractedBudget": number | null,
  "minPrice": number | null (e.g. 800 if user asks 'above $800'),
  "maxPrice": number | null (e.g. 500 if user asks 'under $500', or 1000 if user asks 'above $800'),
  "budgetType": "min" | "max" | "range" | null,
  "recommendedCategory": string ("smartphones", "laptops", "audio", "gaming", "wearables", "cameras", "tablets", "all"),
  "recommendations": [
    {
      "productId": "id from catalog (must exist in catalog)",
      "matchScore": number between 75 and 99,
      "reason": "Clear explanation referencing specs and exact price fit",
      "highlightSpecs": ["Spec 1", "Spec 2"]
    }
  ]
}

Product Catalog:
${JSON.stringify(catalogSubset, null, 2)}`;

  const modelsToTry = [
    modelName || 'gemini-3.1-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.7-flash',
    'gemini-flash-latest'
  ];
  const uniqueModels = Array.from(new Set(modelsToTry));
  let lastError: Error | null = null;

  for (const currentModel of uniqueModels) {
    const cleanModel = currentModel.replace(/^models\//, '');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey.trim()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `User Query: "${query}"` },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('No content received from Gemini API');
      }

      const parsed = JSON.parse(rawText);
      const fallbackBudget = parseBudgetIntent(query);

      return {
        query,
        summary: parsed.summary || `Gemini AI live recommendations for "${query}"`,
        recommendations: parsed.recommendations || [],
        recommendedCategory: parsed.recommendedCategory || 'all',
        extractedBudget: parsed.extractedBudget ?? fallbackBudget.extractedBudget,
        minPrice: parsed.minPrice ?? fallbackBudget.minPrice,
        maxPrice: parsed.maxPrice ?? fallbackBudget.maxPrice,
        budgetType: parsed.budgetType ?? fallbackBudget.budgetType,
        providerUsed: 'gemini',
      };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Call OpenAI API for Product Recommendations
 */
async function callOpenAi(
  query: string,
  products: Product[],
  apiKey: string,
  modelName: string = 'gpt-4o-mini'
): Promise<AiRecommendationResponse> {
  const catalogSubset = products.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    rating: p.rating,
    tags: p.tags,
    description: p.description,
    specs: p.specs,
  }));

  const systemPrompt = `You are an expert AI product recommender.
Given the user query and product catalog ($100 to $1000), recommend the most suitable products from the catalog.

CRITICAL PRICE & CATEGORY RULES:
1. "above $X" or "more than $X" or "over $X" -> ONLY recommend products where price >= X. Strictly reject any products priced below X.
2. "under $X" or "less than $X" or "below $X" -> ONLY recommend products where price <= X. Strictly reject any products priced above X.
3. If category is specified (e.g. laptop, phone, audio), ONLY recommend products in that category.

Respond ONLY with a valid JSON object matching this schema:
{
  "summary": "Brief 1-2 sentence explanation of your recommendations addressing user constraints",
  "extractedBudget": number | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "budgetType": "min" | "max" | "range" | null,
  "recommendedCategory": string,
  "recommendations": [
    {
      "productId": "id from catalog",
      "matchScore": number between 75 and 99,
      "reason": "Clear explanation citing specs and budget match",
      "highlightSpecs": ["Key Spec 1", "Key Spec 2"]
    }
  ]
}
Product Catalog:
${JSON.stringify(catalogSubset, null, 2)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: modelName || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content;
  if (!rawContent) {
    throw new Error('No content received from OpenAI API');
  }

  const parsed = JSON.parse(rawContent);
  const fallbackBudget = parseBudgetIntent(query);

  return {
    query,
    summary: parsed.summary || `OpenAI GPT recommendations for "${query}"`,
    recommendations: parsed.recommendations || [],
    recommendedCategory: parsed.recommendedCategory || 'all',
    extractedBudget: parsed.extractedBudget ?? fallbackBudget.extractedBudget,
    minPrice: parsed.minPrice ?? fallbackBudget.minPrice,
    maxPrice: parsed.maxPrice ?? fallbackBudget.maxPrice,
    budgetType: parsed.budgetType ?? fallbackBudget.budgetType,
    providerUsed: 'openai',
  };
}

/**
 * Main AI Engine dispatcher
 */
export async function getAiRecommendations(
  query: string,
  products: Product[],
  settings?: StoredAiSettings
): Promise<AiRecommendationResponse> {
  const currentSettings = settings || getStoredSettings();

  // 1. Google Gemini Live API
  if (currentSettings.provider === 'gemini' && currentSettings.geminiApiKey) {
    try {
      return await callGeminiAi(query, products, currentSettings.geminiApiKey, currentSettings.geminiModel);
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local NLP engine:', err);
      const fallback = runLocalNlpRecommendation(query, products);
      fallback.summary = `(Gemini notice: ${err.message || 'Error'}, fallback active) ${fallback.summary}`;
      return fallback;
    }
  }

  // 2. OpenAI API
  if (currentSettings.provider === 'openai' && currentSettings.openaiApiKey) {
    try {
      return await callOpenAi(query, products, currentSettings.openaiApiKey, currentSettings.openaiModel);
    } catch (err: any) {
      console.warn('OpenAI API call failed, falling back to local NLP engine:', err);
      const fallback = runLocalNlpRecommendation(query, products);
      fallback.summary = `(OpenAI notice: ${err.message || 'Error'}, fallback active) ${fallback.summary}`;
      return fallback;
    }
  }

  // 3. Built-in Smart Local NLP Mode
  await new Promise(res => setTimeout(res, 350));
  return runLocalNlpRecommendation(query, products);
}
