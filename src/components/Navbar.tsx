import React from 'react';
import { Sparkles, ShoppingBag, Scale } from 'lucide-react';

interface NavbarProps {
  comparisonCount: number;
  onOpenComparison: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  comparisonCount,
  onOpenComparison,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="glass-nav navbar-container" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '0.85rem 1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flexShrink: 0 }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                color: '#0f172a',
              }}>
                OmniPick
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '1px 6px',
                borderRadius: '4px',
                background: '#f1f5f9',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
              }}>
                AI
              </span>
            </div>
            <p className="navbar-subtitle" style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
              Product Recommendation System
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap' }}>
          {/* Compare Button */}
          {comparisonCount > 0 && (
            <button
              onClick={onOpenComparison}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'var(--transition-smooth)',
              }}
            >
              <Scale size={14} />
              <span className="desktop-only">Compare</span>
              <span style={{
                background: '#0f172a',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {comparisonCount}
              </span>
            </button>
          )}

          {/* Cart Bag Button */}
          <button
            onClick={onOpenCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: '#0f172a',
              border: '1px solid #0f172a',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 800,
              flexShrink: 0,
              whiteSpace: 'nowrap',
              transition: 'var(--transition-smooth)',
            }}
          >
            <ShoppingBag size={15} />
            <span className="desktop-only">Bag</span>
            <span style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '1px 6px',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 800,
            }}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
