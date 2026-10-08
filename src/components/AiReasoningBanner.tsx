import React from 'react';
import { Sparkles, Bot, Tag, DollarSign, CheckCircle2, Sliders, Cpu } from 'lucide-react';
import type { AiRecommendationResponse } from '../types/product';

interface AiReasoningBannerProps {
  aiResponse: AiRecommendationResponse | null;
  onClear: () => void;
  resultCount: number;
}

export const AiReasoningBanner: React.FC<AiReasoningBannerProps> = ({
  aiResponse,
  onClear,
  resultCount,
}) => {
  if (!aiResponse) return null;

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto 2rem',
      padding: '0 1.5rem',
    }}>
      <div style={{
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        borderRadius: '14px',
        padding: '1.25rem 1.75rem',
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      }} className="animate-fade-in">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}>
          {/* Left section */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '300px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0,
            }}>
              <Bot size={22} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#0f172a',
                }}>
                  AI Recommendation Analysis
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  fontWeight: 800,
                }}>
                  <Cpu size={12} />
                  Engine: {aiResponse.providerUsed.toUpperCase()}
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  fontWeight: 700,
                }}>
                  <CheckCircle2 size={12} />
                  Match Confirmed
                </span>
              </div>

              <p style={{
                fontSize: '0.95rem',
                color: '#334155',
                lineHeight: 1.55,
                marginBottom: '0.85rem',
                fontWeight: 500,
              }}>
                {aiResponse.summary}
              </p>

              {/* Badges / Extracted Insights */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(() => {
                  if (aiResponse.budgetType === 'min' && aiResponse.minPrice) {
                    return (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        <DollarSign size={13} />
                        <span>Target Budget: ≥ ${aiResponse.minPrice}</span>
                      </div>
                    );
                  }
                  if (aiResponse.budgetType === 'range' && aiResponse.minPrice && aiResponse.maxPrice) {
                    return (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        <DollarSign size={13} />
                        <span>Target Budget: ${aiResponse.minPrice} - ${aiResponse.maxPrice}</span>
                      </div>
                    );
                  }
                  if (aiResponse.extractedBudget) {
                    return (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}>
                        <DollarSign size={13} />
                        <span>Target Budget: ≤ ${aiResponse.extractedBudget}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {aiResponse.recommendedCategory && aiResponse.recommendedCategory !== 'all' && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}>
                    <Tag size={13} />
                    <span>Category: {aiResponse.recommendedCategory.toUpperCase()}</span>
                  </div>
                )}

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}>
                  <Sparkles size={13} />
                  <span>{resultCount} Products Ranked By Fit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <button
            onClick={onClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <Sliders size={14} />
            <span>Reset AI Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
