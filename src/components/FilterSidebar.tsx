import React from 'react';
import { Filter, Star, ArrowUpDown, RotateCcw, Smartphone, Laptop, Headphones, Watch, Gamepad2, Camera, Tablet, Grid } from 'lucide-react';
import type { ProductCategory } from '../types/product';
import { CATEGORY_LABELS } from '../data/products';

interface FilterSidebarProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (category: ProductCategory | 'all') => void;
  minPrice: number;
  onMinPriceChange: (price: number) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  sortBy: 'ai-score' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';
  onSortByChange: (sort: 'ai-score' | 'price-asc' | 'price-desc' | 'rating' | 'reviews') => void;
  onResetFilters: () => void;
  totalProductsCount: number;
  filteredCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalProductsCount,
  filteredCount,
}) => {
  const categories: { id: ProductCategory | 'all'; icon: React.ReactNode }[] = [
    { id: 'all', icon: <Grid size={15} /> },
    { id: 'smartphones', icon: <Smartphone size={15} /> },
    { id: 'laptops', icon: <Laptop size={15} /> },
    { id: 'audio', icon: <Headphones size={15} /> },
    { id: 'wearables', icon: <Watch size={15} /> },
    { id: 'gaming', icon: <Gamepad2 size={15} /> },
    { id: 'cameras', icon: <Camera size={15} /> },
    { id: 'tablets', icon: <Tablet size={15} /> },
  ];

  return (
    <aside
      style={{
        width: '280px',
        flexShrink: 0,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '1.4rem',
        height: 'fit-content',
        position: 'sticky',
        top: '90px',
        zIndex: 30,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }}
      className="filter-sidebar"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #f1f5f9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="#0f172a" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Filters</h2>
        </div>

        <button
          onClick={onResetFilters}
          title="Reset all filters"
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '3px 8px',
            borderRadius: '4px',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.74rem',
            fontWeight: 700,
            transition: 'var(--transition-smooth)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort selector */}
      <div style={{ marginBottom: '1.4rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#64748b',
          marginBottom: '0.55rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <ArrowUpDown size={13} color="#0f172a" />
          <span>Sort Catalog By</span>
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          style={{
            width: '100%',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.65rem 0.8rem',
            color: '#0f172a',
            fontSize: '0.85rem',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="ai-score">⚡ AI Match Score</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

      {/* Category List */}
      <div style={{ marginBottom: '1.4rem' }}>
        <label style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#64748b',
          display: 'block',
          marginBottom: '0.55rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {categories.map(({ id, icon }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                onClick={() => onSelectCategory(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '6px',
                  background: isSelected ? '#0f172a' : 'transparent',
                  border: isSelected ? '1px solid #0f172a' : '1px solid transparent',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#334155';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>{icon}</span>
                  <span>{CATEGORY_LABELS[id]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div style={{ marginBottom: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <label style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Price Range
          </label>
          <span style={{
            fontSize: '0.825rem',
            fontWeight: 800,
            color: '#0f172a',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            ${minPrice} - ${maxPrice}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '2px' }}>
              <span>Min: ${minPrice}</span>
              <span>$100</span>
            </div>
            <input
              type="range"
              min="100"
              max="950"
              step="25"
              value={minPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= maxPrice) onMinPriceChange(val);
              }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '2px' }}>
              <span>Max: ${maxPrice}</span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min="150"
              max="1000"
              step="25"
              value={maxPrice}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= minPrice) onMaxPriceChange(val);
              }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Quick Price Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          <button
            onClick={() => { onMinPriceChange(100); onMaxPriceChange(500); }}
            style={{
              padding: '5px',
              borderRadius: '4px',
              background: minPrice === 100 && maxPrice === 500 ? '#0f172a' : '#f8fafc',
              border: minPrice === 100 && maxPrice === 500 ? '1px solid #0f172a' : '1px solid #cbd5e1',
              color: minPrice === 100 && maxPrice === 500 ? '#ffffff' : '#334155',
              fontSize: '0.74rem',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'var(--transition-smooth)',
            }}
          >
            ≤ $500
          </button>
          <button
            onClick={() => { onMinPriceChange(800); onMaxPriceChange(1000); }}
            style={{
              padding: '5px',
              borderRadius: '4px',
              background: minPrice === 800 && maxPrice === 1000 ? '#0f172a' : '#f8fafc',
              border: minPrice === 800 && maxPrice === 1000 ? '1px solid #0f172a' : '1px solid #cbd5e1',
              color: minPrice === 800 && maxPrice === 1000 ? '#ffffff' : '#334155',
              fontSize: '0.74rem',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'var(--transition-smooth)',
            }}
          >
            ≥ $800
          </button>
          <button
            onClick={() => { onMinPriceChange(500); onMaxPriceChange(800); }}
            style={{
              padding: '5px',
              borderRadius: '4px',
              background: minPrice === 500 && maxPrice === 800 ? '#0f172a' : '#f8fafc',
              border: minPrice === 500 && maxPrice === 800 ? '1px solid #0f172a' : '1px solid #cbd5e1',
              color: minPrice === 500 && maxPrice === 800 ? '#ffffff' : '#334155',
              fontSize: '0.74rem',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'var(--transition-smooth)',
            }}
          >
            $500 - $800
          </button>
          <button
            onClick={() => { onMinPriceChange(100); onMaxPriceChange(1000); }}
            style={{
              padding: '5px',
              borderRadius: '4px',
              background: minPrice === 100 && maxPrice === 1000 ? '#0f172a' : '#f8fafc',
              border: minPrice === 100 && maxPrice === 1000 ? '1px solid #0f172a' : '1px solid #cbd5e1',
              color: minPrice === 100 && maxPrice === 1000 ? '#ffffff' : '#334155',
              fontSize: '0.74rem',
              cursor: 'pointer',
              fontWeight: 700,
              transition: 'var(--transition-smooth)',
            }}
          >
            All ($100-$1000)
          </button>
        </div>
      </div>

      {/* Rating filter */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          color: '#64748b',
          display: 'block',
          marginBottom: '0.55rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          Min Rating
        </label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => onMinRatingChange(rating)}
              style={{
                flex: 1,
                padding: '6px 4px',
                borderRadius: '4px',
                background: minRating === rating ? '#0f172a' : '#f8fafc',
                border: minRating === rating ? '1px solid #0f172a' : '1px solid #cbd5e1',
                color: minRating === rating ? '#ffffff' : '#334155',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                transition: 'var(--transition-smooth)',
              }}
            >
              <Star size={12} fill={minRating === rating ? '#ffffff' : 'none'} stroke={minRating === rating ? '#ffffff' : '#334155'} />
              <span>{rating === 0 ? 'All' : `${rating}+`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result summary */}
      <div style={{
        padding: '0.75rem',
        borderRadius: '6px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: '#64748b',
      }}>
        Displaying <strong style={{ color: '#0f172a' }}>{filteredCount}</strong> of {totalProductsCount} products
      </div>
    </aside>
  );
};
