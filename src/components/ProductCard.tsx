import React from 'react';
import { Star, Sparkles, Eye, Scale, CheckCircle, Plus, Check } from 'lucide-react';
import type { Product, RecommendationResult } from '../types/product';

interface ProductCardProps {
  product: Product;
  recommendation?: RecommendationResult;
  isCompared: boolean;
  isInCart: boolean;
  onToggleCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  recommendation,
  isCompared,
  isInCart,
  onToggleCompare,
  onAddToCart,
  onQuickView,
}) => {
  const isAiMatched = !!recommendation;

  return (
    <div
      style={{
        position: 'relative',
        background: '#ffffff',
        borderRadius: '14px',
        border: isAiMatched ? '2px solid #0f172a' : '1px solid #e2e8f0',
        boxShadow: isAiMatched ? '0 6px 20px rgba(15, 23, 42, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        height: '100%',
        width: '100%',
      }}
      className="product-card"
    >
      {/* Top Image Container */}
      <div
        className="product-card-img-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '58%',
          overflow: 'hidden',
          background: '#f1f5f9',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          className="product-img"
        />

        {/* Match Score Badge */}
        {recommendation && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
          }}>
            <Sparkles size={11} />
            <span>{recommendation.matchScore}% MATCH</span>
          </div>
        )}

        {/* Brand Tag */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(255, 255, 255, 0.92)',
          padding: '2px 7px',
          borderRadius: '4px',
          color: '#0f172a',
          fontSize: '0.7rem',
          fontWeight: 800,
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          zIndex: 2,
        }}>
          {product.brand}
        </div>

        {/* Quick View Overlay Button */}
        <button
          onClick={() => onQuickView(product)}
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            padding: '4px 9px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            zIndex: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            transition: 'var(--transition-smooth)',
          }}
          className="quick-view-btn"
        >
          <Eye size={12} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Content Body */}
      <div
        className="product-card-body"
        style={{
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '0.65rem',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Title */}
          <h3 style={{
            fontSize: '1.025rem',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.3,
            marginBottom: '0.3rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#0f172a', gap: '2px' }}>
              <Star size={12} fill="#0f172a" stroke="none" />
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{product.rating}</span>
            </div>
            <span style={{ color: '#64748b' }}>({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* AI Explanation Box */}
        {recommendation && (
          <div style={{
            background: '#f8fafc',
            borderLeft: '3px solid #0f172a',
            borderTop: '1px solid #e2e8f0',
            borderRight: '1px solid #e2e8f0',
            borderBottom: '1px solid #e2e8f0',
            borderRadius: '4px',
            padding: '0.55rem 0.7rem',
            fontSize: '0.78rem',
            color: '#334155',
            lineHeight: 1.4,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '2px',
              fontSize: '0.68rem',
              textTransform: 'uppercase',
            }}>
              <CheckCircle size={11} />
              <span>AI Fit Rationale</span>
            </div>
            <p style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {recommendation.reason}
            </p>
          </div>
        )}

        {/* Technical Specs Preview */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.3rem',
          paddingTop: '0.2rem',
        }}>
          {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
            <span
              key={key}
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#475569',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <strong style={{ color: '#0f172a', fontWeight: 700 }}>{key}:</strong> {value}
            </span>
          ))}
        </div>

        {/* Pricing & Footer Actions */}
        <div
          className="product-card-footer"
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.85rem',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                }}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
                Save ${product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Action Buttons: Compare & Add to Bag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(product)}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                background: isCompared ? '#0f172a' : '#f8fafc',
                border: '1px solid #cbd5e1',
                color: isCompared ? '#ffffff' : '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)',
                flexShrink: 0,
              }}
            >
              <Scale size={14} />
            </button>

            {/* Add to Bag */}
            <button
              onClick={() => onAddToCart(product)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '4px',
                background: isInCart ? '#f1f5f9' : '#0f172a',
                border: isInCart ? '1px solid #cbd5e1' : 'none',
                color: isInCart ? '#0f172a' : '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {isInCart ? (
                <>
                  <Check size={14} />
                  <span>In Bag</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.04);
        }
        .quick-view-btn:hover {
          background: #0f172a !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};
