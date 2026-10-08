export type ProductCategory = 
  | 'smartphones' 
  | 'laptops' 
  | 'audio' 
  | 'wearables' 
  | 'gaming' 
  | 'cameras' 
  | 'tablets' 
  | 'accessories';

export interface ProductSpec {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  specs: ProductSpec;
  tags: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface RecommendationResult {
  productId: string;
  matchScore: number; // 0 to 100
  reason: string;
  highlightSpecs?: string[];
}

export interface AiRecommendationResponse {
  query: string;
  summary: string;
  recommendations: RecommendationResult[];
  recommendedCategory?: ProductCategory | 'all';
  extractedBudget?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  budgetType?: 'min' | 'max' | 'range' | null;
  extractedKeywords?: string[];
  providerUsed: 'gemini' | 'openai' | 'local-nlp';
}

export type AiProvider = 'local-nlp' | 'gemini' | 'openai';

export interface AiSettings {
  provider: AiProvider;
  geminiApiKey: string;
  openaiApiKey: string;
}
