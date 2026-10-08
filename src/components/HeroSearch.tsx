import React, { useState } from 'react';
import { Search, Sparkles, Wand2, X, RefreshCw, Command } from 'lucide-react';
import { QUICK_PROMPTS } from '../data/products';

interface HeroSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (customQuery?: string) => void;
  isLoading: boolean;
  onReset: () => void;
  activeQuery: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  onReset,
  activeQuery,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (promptText: string) => {
    onQueryChange(promptText);
    onSearch(promptText);
  };

  return (
    <section className="hero-container" style={{
      position: 'relative',
      padding: '3.5rem 1.5rem 2rem',
      maxWidth: '1050px',
      margin: '0 auto',
      textAlign: 'center',
    }}>
      <div>
        {/* Top Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.95rem',
          borderRadius: 'var(--radius-full)',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          color: '#0f172a',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '1.25rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <Sparkles size={14} color="#0f172a" />
          <span>AI Product Recommendation Engine</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title" style={{
          fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1rem',
          color: '#0f172a',
          letterSpacing: '-0.035em',
        }}>
          Discover Products With <span style={{ textDecoration: 'underline', textUnderlineOffset: '6px' }}>Natural Language</span>
        </h1>

        <p className="hero-subtitle" style={{
          fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
          color: '#475569',
          maxWidth: '650px',
          margin: '0 auto 2rem',
          lineHeight: 1.6,
        }}>
          Describe your budget, desired features, or workflow needs. Our AI analyzes technical specifications and user reviews to deliver tailored choices.
        </p>

        {/* AI Prompt Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="hero-search-form"
          style={{
            position: 'relative',
            maxWidth: '820px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '14px',
            padding: '0.45rem',
            border: isFocused ? '2px solid #0f172a' : '1px solid #cbd5e1',
            boxShadow: isFocused ? '0 8px 24px rgba(15, 23, 42, 0.08)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div style={{
            paddingLeft: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            color: '#0f172a',
          }}>
            <Wand2 size={20} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder='e.g. "I want a laptop above $800", "Phone under $500 with great camera", "Earbuds under $200"'
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '1rem',
              padding: '0.75rem 0.5rem',
              fontWeight: 500,
              minWidth: 0,
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear text"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.6rem',
              borderRadius: '9px',
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.925rem',
              fontWeight: 800,
              cursor: isLoading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: !query.trim() && !isLoading ? 0.45 : 1,
              transition: 'var(--transition-smooth)',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={17} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Analyzing AI...</span>
              </>
            ) : (
              <>
                <Search size={17} />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="quick-prompts-container" style={{
          marginTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: '#64748b',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginRight: '0.2rem',
            flexShrink: 0,
          }}>
            <Command size={12} />
            <span>Try:</span>
          </div>

          {QUICK_PROMPTS.map((prompt, idx) => {
            const isActive = activeQuery === prompt.text;
            return (
              <button
                key={idx}
                className="quick-prompt-btn"
                onClick={() => handleChipClick(prompt.text)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? '#0f172a' : '#ffffff',
                  border: isActive ? '1px solid #0f172a' : '1px solid #e2e8f0',
                  color: isActive ? '#ffffff' : '#334155',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'var(--transition-smooth)',
                }}
              >
                <span>{prompt.icon}</span>
                <span>{prompt.text}</span>
              </button>
            );
          })}

          {activeQuery && (
            <button
              className="quick-prompt-btn"
              onClick={onReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
              }}
            >
              <X size={13} />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
