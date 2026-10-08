import { useState, useMemo, useCallback } from 'react';
import type { Product, ProductCategory, RecommendationResult } from '../types/product';

export type SortOption = 'ai-score' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';

export function useProductFilter(
  products: Product[],
  recommendationsMap: Map<string, RecommendationResult>
) {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [minPrice, setMinPrice] = useState<number>(100);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('ai-score');

  const resetFilters = useCallback(() => {
    setSelectedCategory('all');
    setMinPrice(100);
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy('ai-score');
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }
        if (p.rating < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ai-score') {
          const scoreA = recommendationsMap.get(a.id)?.matchScore ?? 0;
          const scoreB = recommendationsMap.get(b.id)?.matchScore ?? 0;
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }
          return b.rating - a.rating;
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        return 0;
      });
  }, [products, selectedCategory, minPrice, maxPrice, minRating, sortBy, recommendationsMap]);

  return {
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
    filteredProducts,
  };
}
