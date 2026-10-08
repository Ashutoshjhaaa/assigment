import React from 'react';
import { X, Scale, Sparkles, Trash2, ShoppingBag } from 'lucide-react';
import type { Product, RecommendationResult } from '../types/product';

interface ComparisonModalProps {
  products: Product[];
  recommendationsMap: Map<string, RecommendationResult>;
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  onAddToCart: (product: Product) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  products,
  recommendationsMap,
  isOpen,
  onClose,
  onRemoveProduct,
  onClearAll,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const allSpecKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.specs)))
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        overflow: 'hidden',
      }} className="animate-fade-in">
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}>
              <Scale size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                Compare Products ({products.length})
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Side-by-side technical specification & AI score matrix
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {products.length > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  color: '#64748b',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0f172a';
                  e.currentTarget.style.borderColor = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                Clear All
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {products.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <Scale size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h4 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No products in comparison list
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              Click the compare button on any product card in the catalog to add it here.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', flex: 1, padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr>
                  <th style={{ width: '180px', textAlign: 'left', padding: '1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                    Feature / Spec
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.id}
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        verticalAlign: 'top',
                        borderLeft: '1px solid #f1f5f9',
                      }}
                    >
                      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <button
                          onClick={() => onRemoveProduct(product.id)}
                          title="Remove product"
                          style={{
                            position: 'absolute',
                            top: '-6px',
                            right: '-6px',
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#0f172a',
                            border: '1px solid #cbd5e1',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.3rem' }}>
                        {product.name}
                      </h4>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>
                        ${product.price}
                      </div>
                      <button
                        onClick={() => onAddToCart(product)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          background: '#0f172a',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'var(--transition-smooth)',
                        }}
                      >
                        <ShoppingBag size={12} />
                        <span>Add to Bag</span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* AI Score Row */}
                <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: '#0f172a', fontSize: '0.8rem' }}>
                    AI Match Score
                  </td>
                  {products.map((p) => {
                    const rec = recommendationsMap.get(p.id);
                    return (
                      <td key={p.id} style={{ padding: '0.75rem 1rem', textAlign: 'center', borderLeft: '1px solid #f1f5f9' }}>
                        {rec ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: '#0f172a',
                            color: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                          }}>
                            <Sparkles size={11} />
                            {rec.matchScore}% Fit
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>N/A</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Rating Row */}
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                    Customer Rating
                  </td>
                  {products.map((p) => (
                    <td key={p.id} style={{ padding: '0.75rem 1rem', textAlign: 'center', borderLeft: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a', fontSize: '0.82rem' }}>
                      ⭐ {p.rating} ({p.reviewCount})
                    </td>
                  ))}
                </tr>

                {/* Dynamic Spec Rows */}
                {allSpecKeys.map((key, idx) => (
                  <tr key={key} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'transparent' : '#f8fafc' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>
                      {key}
                    </td>
                    {products.map((p) => (
                      <td key={p.id} style={{ padding: '0.75rem 1rem', textAlign: 'center', borderLeft: '1px solid #f1f5f9', color: '#0f172a', fontSize: '0.82rem', fontWeight: 600 }}>
                        {p.specs[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
