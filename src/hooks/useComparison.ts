import { useState, useCallback } from 'react';
import type { Product } from '../types/product';

const MAX_COMPARISON_ITEMS = 4;

export function useComparison(onShowToast?: (msg: string) => void) {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const toggleCompare = useCallback((product: Product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        onShowToast?.(`Removed "${product.name}" from comparison`);
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        onShowToast?.(`You can compare up to ${MAX_COMPARISON_ITEMS} products at once.`);
        return prev;
      }
      onShowToast?.(`Added "${product.name}" to comparison matrix`);
      return [...prev, product];
    });
  }, [onShowToast]);

  const removeProduct = useCallback((productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearAll = useCallback(() => {
    setComparedProducts([]);
  }, []);

  return {
    comparedProducts,
    comparisonCount: comparedProducts.length,
    toggleCompare,
    removeProduct,
    clearAll,
  };
}
