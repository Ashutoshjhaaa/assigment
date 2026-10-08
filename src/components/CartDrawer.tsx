import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CartItem } from '../hooks/useCart';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + (subtotal > 0 ? tax : 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0f172a', '#334155', '#64748b', '#cbd5e1'],
      });
      setTimeout(() => {
        onClearCart();
        setOrderSuccess(false);
        onClose();
      }, 3000);
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 75,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(6px)',
    }}>
      {/* Backdrop click */}
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* Drawer */}
      <div
        className="cart-drawer-container animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          background: '#ffffff',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                Shopping Bag
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items in your cart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Order success state */}
        {orderSuccess ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.4rem' }}>
              Order Placed Successfully!
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.5, maxWidth: '300px' }}>
              Thank you for exploring our AI Product Recommender demo.
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty state */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            color: '#64748b',
          }}>
            <ShoppingBag size={54} style={{ marginBottom: '1rem', opacity: 0.25 }} />
            <h4 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>
              Your bag is empty
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '260px', lineHeight: 1.5 }}>
              Browse the catalog or use natural language search to add recommended items.
            </p>
          </div>
        ) : (
          /* Cart items list */
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ${product.price} each
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    {/* Quantity controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      padding: '2px 6px',
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0f172a',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          padding: '0 4px',
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', minWidth: '16px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0f172a',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          padding: '0 4px',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>
                      ${product.price * quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Summary */}
        {cartItems.length > 0 && !orderSuccess && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#0f172a',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '0.65rem',
              marginBottom: '1rem',
            }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                background: '#0f172a',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 900,
                cursor: isCheckingOut ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'var(--transition-smooth)',
              }}
            >
              {isCheckingOut ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
