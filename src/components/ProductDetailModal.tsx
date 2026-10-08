import React from 'react';
import { X, Star, Sparkles, ShoppingBag, Check } from 'lucide-react';
import type { Product, RecommendationResult } from '../types/product';

interface ProductDetailModalProps {
  product: Product | null;
  recommendation?: RecommendationResult;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isInCart: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  recommendation,
  isOpen,
  onClose,
  onAddToCart,
  isInCart,
}) => {
  if (!isOpen || !product) return null;

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
      {/* Modal Card */}
      <div
        className="product-modal-container animate-fade-in"
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        >
          <X size={18} />
        </button>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          padding: '2rem',
        }}>
          {/* Left Column: Image & Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f8fafc',
              paddingTop: '80%',
              border: '1px solid #e2e8f0',
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {recommendation && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  <Sparkles size={13} />
                  <span>{recommendation.matchScore}% AI MATCH</span>
                </div>
              )}
            </div>

            {/* AI Fit Analysis Card */}
            {recommendation && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#0f172a', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <Sparkles size={14} />
                  <span>AI SPECIFICATION RATIONALE</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                  {recommendation.reason}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Specs & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#64748b',
                }}>
                  {product.brand}
                </span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#64748b',
                }}>
                  {product.category}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: '0.75rem' }}>
                {product.name}
              </h2>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#0f172a', color: '#ffffff', padding: '2px 7px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 800 }}>
                  <Star size={12} fill="#ffffff" stroke="none" />
                  <span>{product.rating}</span>
                </div>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {product.reviewCount.toLocaleString()} verified customer ratings
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {product.description}
              </p>

              {/* Specs Table */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                  Hardware Specifications
                </h4>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  {Object.entries(product.specs).map(([k, v], idx) => (
                    <div
                      key={k}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.55rem 0.85rem',
                        fontSize: '0.82rem',
                        borderBottom: idx < Object.entries(product.specs).length - 1 ? '1px solid #f1f5f9' : 'none',
                        background: idx % 2 === 0 ? 'transparent' : '#ffffff',
                      }}
                    >
                      <span style={{ color: '#64748b', fontWeight: 600 }}>{k}</span>
                      <span style={{ color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Price</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                    ${product.price}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onAddToCart(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '8px',
                  background: isInCart ? '#f1f5f9' : '#0f172a',
                  border: isInCart ? '1px solid #cbd5e1' : 'none',
                  color: isInCart ? '#0f172a' : '#ffffff',
                  fontSize: '0.925rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)',
                }}
              >
                {isInCart ? (
                  <>
                    <Check size={18} />
                    <span>In Shopping Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
