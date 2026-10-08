import React from 'react';
import { PackageSearch } from 'lucide-react';
import type { Product, RecommendationResult } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  recommendationsMap: Map<string, RecommendationResult>;
  comparedProducts: Product[];
  cartItemIds: Set<string>;
  onToggleCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  recommendationsMap,
  comparedProducts,
  cartItemIds,
  onToggleCompare,
  onAddToCart,
  onQuickView,
  onResetFilters,
}) => {
  const comparedIdSet = new Set(comparedProducts.map(p => p.id));

  if (products.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '14px',
        padding: '3rem 1.25rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        flex: 1,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0f172a',
        }}>
          <PackageSearch size={26} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
          No Matching Products Found
        </h3>
        <p style={{ color: '#64748b', maxWidth: '400px', fontSize: '0.88rem', lineHeight: 1.5 }}>
          Try broadening your price range, selecting "All Categories", or asking the AI with different keywords.
        </p>
        <button
          onClick={onResetFilters}
          style={{
            padding: '0.65rem 1.3rem',
            borderRadius: '6px',
            background: '#0f172a',
            border: 'none',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.825rem',
            cursor: 'pointer',
            marginTop: '0.4rem',
            transition: 'var(--transition-smooth)',
          }}
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div
      className="product-grid-container"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.15rem',
        flex: 1,
        width: '100%',
        alignItems: 'stretch',
      }}
    >
      {products.map((product) => {
        const recommendation = recommendationsMap.get(product.id);
        const isCompared = comparedIdSet.has(product.id);
        const isInCart = cartItemIds.has(product.id);

        return (
          <ProductCard
            key={product.id}
            product={product}
            recommendation={recommendation}
            isCompared={isCompared}
            isInCart={isInCart}
            onToggleCompare={onToggleCompare}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
          />
        );
      })}
    </div>
  );
};
