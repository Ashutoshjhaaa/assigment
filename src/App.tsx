import { useState, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { AiReasoningBanner } from './components/AiReasoningBanner';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ComparisonModal } from './components/ComparisonModal';
import { CartDrawer } from './components/CartDrawer';
import { INITIAL_PRODUCTS } from './data/products';
import type { Product, AiRecommendationResponse, RecommendationResult } from './types/product';
import { getStoredSettings, getAiRecommendations } from './services/aiService';
import { useCart } from './hooks/useCart';
import { useComparison } from './hooks/useComparison';
import { useToast } from './hooks/useToast';
import { useProductFilter } from './hooks/useProductFilter';
import confetti from 'canvas-confetti';

export function App() {
  // Toast notifications hook
  const { toastMessage, showToast } = useToast();

  // Cart custom hook
  const {
    cartItems,
    cartItemIds,
    cartCount,
    addToCart,
    updateQuantity,
    removeItem: removeCartItem,
    clearCart,
  } = useCart(showToast);

  // Comparison custom hook
  const {
    comparedProducts,
    comparisonCount,
    toggleCompare,
    removeProduct: removeCompareProduct,
    clearAll: clearCompareAll,
  } = useComparison(showToast);

  // Products & AI State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<AiRecommendationResponse | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiSettings] = useState(getStoredSettings);

  // Modals state
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Recommendation lookup map
  const recommendationsMap = useMemo(() => {
    const map = new Map<string, RecommendationResult>();
    if (aiResponse?.recommendations) {
      aiResponse.recommendations.forEach((rec) => {
        map.set(rec.productId, rec);
      });
    }
    return map;
  }, [aiResponse]);

  // Filtering & Sorting custom hook
  const {
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    resetFilters,
    filteredProducts,
  } = useProductFilter(products, recommendationsMap);

  // Run AI Recommendation
  const handleRunAiRecommendation = useCallback(async (searchPrompt?: string) => {
    const promptToUse = searchPrompt || query;
    if (!promptToUse.trim()) return;

    setIsLoadingAi(true);
    setActiveQuery(promptToUse);

    try {
      const response = await getAiRecommendations(promptToUse, products, aiSettings);
      setAiResponse(response);

      // Auto-filter category if AI detected a strict single category
      if (response.recommendedCategory && response.recommendedCategory !== 'all') {
        setSelectedCategory(response.recommendedCategory);
      } else {
        setSelectedCategory('all');
      }

      // Auto-adjust min & max price according to AI budget extraction
      if (response.budgetType === 'min' && response.minPrice) {
        setMinPrice(Math.min(Math.max(response.minPrice, 100), 1000));
        setMaxPrice(1000);
      } else if (response.budgetType === 'max' && response.maxPrice) {
        setMinPrice(100);
        setMaxPrice(Math.min(Math.max(response.maxPrice, 100), 1000));
      } else if (response.budgetType === 'range' && response.minPrice && response.maxPrice) {
        setMinPrice(Math.min(Math.max(response.minPrice, 100), 1000));
        setMaxPrice(Math.min(Math.max(response.maxPrice, 100), 1000));
      } else if (response.extractedBudget) {
        setMinPrice(100);
        setMaxPrice(Math.min(Math.max(response.extractedBudget, 100), 1000));
      } else {
        setMinPrice(100);
        setMaxPrice(1000);
      }

      // Confetti feedback on successful AI match
      if (response.recommendations.length > 0) {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.7 },
        });
      }
    } catch (err: any) {
      console.error('AI recommendation error:', err);
      showToast('Recommendation error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoadingAi(false);
    }
  }, [query, products, aiSettings, setSelectedCategory, setMinPrice, setMaxPrice, showToast]);

  // Reset all filters & AI state
  const handleResetFilters = useCallback(() => {
    resetFilters();
    setAiResponse(null);
    setActiveQuery('');
    setQuery('');
  }, [resetFilters]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: '#0f172a',
          border: '1px solid #0f172a',
          color: '#ffffff',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          fontSize: '0.85rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }} className="animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        comparisonCount={comparisonCount}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Hero Search Section */}
      <HeroSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={handleRunAiRecommendation}
        isLoading={isLoadingAi}
        onReset={handleResetFilters}
        activeQuery={activeQuery}
      />

      {/* AI Reasoning Summary Banner */}
      <AiReasoningBanner
        aiResponse={aiResponse}
        onClear={handleResetFilters}
        resultCount={filteredProducts.length}
      />

      {/* Main Catalog Layout */}
      <main style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 1.5rem 4rem',
        width: '100%',
        flex: 1,
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }} className="catalog-main-layout">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={handleResetFilters}
            totalProductsCount={products.length}
            filteredCount={filteredProducts.length}
          />

          {/* Product Cards Grid */}
          <ProductGrid
            products={filteredProducts}
            recommendationsMap={recommendationsMap}
            comparedProducts={comparedProducts}
            cartItemIds={cartItemIds}
            onToggleCompare={toggleCompare}
            onAddToCart={addToCart}
            onQuickView={setSelectedDetailProduct}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.825rem',
        color: '#64748b',
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>OmniPick AI</span>
            <span>• AI Product Recommendation System</span>
          </div>
          <div>
            <span>Ready for Vercel Deployment • Built with React & TypeScript</span>
          </div>
        </div>
      </footer>

      {/* Modals & Cart Drawer */}
      <ProductDetailModal
        product={selectedDetailProduct}
        recommendation={selectedDetailProduct ? recommendationsMap.get(selectedDetailProduct.id) : undefined}
        isOpen={!!selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={addToCart}
        isInCart={selectedDetailProduct ? cartItemIds.has(selectedDetailProduct.id) : false}
      />

      <ComparisonModal
        products={comparedProducts}
        recommendationsMap={recommendationsMap}
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        onRemoveProduct={removeCompareProduct}
        onClearAll={clearCompareAll}
        onAddToCart={addToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
      />
    </div>
  );
}

export default App;
