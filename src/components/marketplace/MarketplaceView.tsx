import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Star,
  MapPin,
  Truck,
  Sparkles,
  Info,
  SlidersHorizontal,
  CreditCard,
  X,
  ArrowRight,
  ShieldCheck,
  Wheat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  mockMandiPrices,
  mockPriceGraphData,
  mockAgriProducts,
} from '../../data/mockData';
import { AgriProduct } from '../../types';

export const MarketplaceView: React.FC = () => {
  const {
    user,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    t,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'confirm' | 'success'>('cart');
  const [selectedMandi, setSelectedMandi] = useState<string>('mandi-b');

  const categoriesList = [
    'All',
    'Seeds',
    'Fertilizers',
    'Crop Protection',
    'Sprayers',
    'Irrigation',
    'Tools',
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? mockAgriProducts
      : mockAgriProducts.filter((p) => p.category === selectedCategory);

  const handleBuyNow = (product: AgriProduct) => {
    addToCart(product, 1);
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const handleCompleteOrder = () => {
    setCheckoutStep('success');
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  // SVG dimensions for Price vs Time Graph
  const graphWidth = 650;
  const graphHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const minVal = 1800;
  const maxVal = 2900;

  const getY = (price: number) => {
    const ratio = (price - minVal) / (maxVal - minVal);
    return graphHeight - paddingY - ratio * (graphHeight - paddingY * 2);
  };

  const getX = (index: number, total: number) => {
    return paddingX + (index / (total - 1)) * (graphWidth - paddingX * 2);
  };

  const avgPoints = mockPriceGraphData.map((d, i) => `${getX(i, mockPriceGraphData.length)},${getY(d.avgPrice)}`).join(' ');
  const maxPoints = mockPriceGraphData.map((d, i) => `${getX(i, mockPriceGraphData.length)},${getY(d.maxPrice)}`).join(' ');
  const minPoints = mockPriceGraphData.map((d, i) => `${getX(i, mockPriceGraphData.length)},${getY(d.minPrice)}`).join(' ');

  return (
    <div id="marketplace-page" className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner with Cart trigger */}
      <section className="bg-white rounded-3xl border border-green-100 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-800 border border-green-200 flex items-center justify-center font-bold">
              <Store className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-green-950 tracking-tight">
                {t.navMarketplace}
              </h1>
              <p className="text-xs text-green-600 font-medium">
                Live e-NAM APMC mandi rates, harvest price forecasting & certified inputs marketplace
              </p>
            </div>
          </div>

          <button
            id="open-kisan-cart-btn"
            onClick={() => {
              setIsCartOpen(true);
              setCheckoutStep('cart');
            }}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.cart} ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
            <span className="bg-green-800 px-2 py-0.5 rounded-lg font-mono">
              ₹{cartTotal}
            </span>
          </button>
        </div>
      </section>

      {/* ===================================================
          SECTION A: CROP MARKET PRICES & NEARBY MANDIS
          =================================================== */}
      <section id="section-mandi-prices" className="bg-white rounded-3xl border border-green-100 p-5 sm:p-7 shadow-xs space-y-6">
        
        {/* Title and Active Crop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-green-50 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-800 bg-green-100 px-2 py-0.5 rounded-md">
                APMC / e-NAM Live Feeds
              </span>
              <span className="text-xs text-green-600">Regional Grain Exchange</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-green-950 mt-1">
              {t.mandiPricesTitle}
            </h2>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-2 flex items-center gap-3">
            <Wheat className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-[10px] text-green-600 font-semibold uppercase">Current Tracked Crop</div>
              <div className="text-sm font-extrabold text-green-950">
                Paddy (Swarna Sub-1) – <span className="text-green-700">₹2,350 / quintal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Mandi Comparison Cards Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-bold tracking-wider text-green-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-700" />
              <span>{t.nearbyMandis}</span>
            </h3>
            <span className="text-xs text-green-600 font-medium">Sorted by distance & price</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockMandiPrices.map((mandi) => (
              <div
                key={mandi.id}
                onClick={() => setSelectedMandi(mandi.id)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  mandi.isBestPrice
                    ? 'bg-green-50/80 border-green-300 ring-2 ring-green-500/20 shadow-xs'
                    : selectedMandi === mandi.id
                    ? 'bg-green-50/50 border-green-400'
                    : 'bg-white border-green-100 hover:border-green-300'
                }`}
              >
                {mandi.isBestPrice && (
                  <div className="absolute -top-2.5 right-3 bg-green-600 text-white text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    ⭐ {t.bestPrice}
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-green-950 leading-tight">
                    {mandi.mandiName}
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                    <Truck className="w-3 h-3 text-stone-400" />
                    <span>{mandi.distanceKm} km from your farm</span>
                  </div>
                </div>

                {/* Price tag */}
                <div className="flex items-baseline justify-between pt-1 border-t border-green-50">
                  <div>
                    <div className="text-2xl font-black text-green-950 tracking-tight">
                      ₹{mandi.currentPrice}
                    </div>
                    <div className="text-[10px] text-stone-400">per Quintal (100 kg)</div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-bold flex items-center gap-0.5 justify-end ${
                        mandi.priceChangePercent > 0
                          ? 'text-green-700'
                          : mandi.priceChangePercent < 0
                          ? 'text-red-600'
                          : 'text-stone-500'
                      }`}
                    >
                      {mandi.priceChangePercent > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {mandi.priceChangePercent > 0 ? `+${mandi.priceChangePercent}%` : `${mandi.priceChangePercent}%`}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400">{mandi.lastUpdated}</div>
                  </div>
                </div>

                <div className="text-[10px] text-stone-500 flex items-center justify-between border-t border-green-50 pt-1.5">
                  <span>Arrival: {mandi.arrivalVolumeQtl} Qtl</span>
                  <span className="font-semibold text-green-800 capitalize">Trend: {mandi.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive SVG Price vs Time Graph */}
        <div className="bg-green-50/40 border border-green-100 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-green-100 pb-3">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-green-950 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-700" />
                <span>{t.priceGraphTitle}</span>
              </h3>
              <p className="text-[11px] text-green-600 mt-0.5">
                5-Month historical arrivals & projected peak harvest realization curve
              </p>
            </div>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="px-2 py-1 bg-white text-stone-700 border border-stone-200 rounded-lg">
                {t.minPrice}: <strong>₹2,050</strong>
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg">
                {t.currentPrice}: <strong>₹2,350</strong>
              </span>
              <span className="px-2 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg">
                {t.maxPrice}: <strong>₹2,600</strong>
              </span>
              <span className="px-2.5 py-1 bg-green-100 text-green-900 rounded-lg border border-green-300">
                ⭐ {t.expectedHarvestPrice}: <strong>₹2,500</strong>
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="w-full min-w-[550px] h-48 select-none"
            >
              {/* Grid Lines */}
              <line x1={paddingX} y1={getY(2000)} x2={graphWidth - paddingX} y2={getY(2000)} stroke="#dcfce7" strokeDasharray="3 3" />
              <line x1={paddingX} y1={getY(2400)} x2={graphWidth - paddingX} y2={getY(2400)} stroke="#dcfce7" strokeDasharray="3 3" />
              <line x1={paddingX} y1={getY(2800)} x2={graphWidth - paddingX} y2={getY(2800)} stroke="#dcfce7" strokeDasharray="3 3" />

              {/* Y-axis Labels */}
              <text x={paddingX - 8} y={getY(2000) + 4} textAnchor="end" fontSize="10" fill="#15803d" fontWeight="600">₹2,000</text>
              <text x={paddingX - 8} y={getY(2400) + 4} textAnchor="end" fontSize="10" fill="#15803d" fontWeight="600">₹2,400</text>
              <text x={paddingX - 8} y={getY(2800) + 4} textAnchor="end" fontSize="10" fill="#15803d" fontWeight="600">₹2,800</text>

              {/* Area under curve */}
              <polygon
                points={`${getX(0, mockPriceGraphData.length)},${graphHeight - paddingY} ${avgPoints} ${getX(mockPriceGraphData.length - 1, mockPriceGraphData.length)},${graphHeight - paddingY}`}
                fill="rgba(22, 163, 74, 0.08)"
              />

              {/* Max line (Amber) */}
              <polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" points={maxPoints} />

              {/* Avg / Current line (Green Solid) */}
              <polyline fill="none" stroke="#16a34a" strokeWidth="3" points={avgPoints} />

              {/* Min line (Stone) */}
              <polyline fill="none" stroke="#a8a29e" strokeWidth="1.5" points={minPoints} />

              {/* Data points & X-axis Labels */}
              {mockPriceGraphData.map((d, i) => {
                const x = getX(i, mockPriceGraphData.length);
                const y = getY(d.avgPrice);
                const isHarvest = i >= 4;
                return (
                  <g key={i}>
                    {/* Circle Node */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHarvest ? 5 : 4}
                      fill={isHarvest ? '#15803d' : '#16a34a'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Price Value on top */}
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={isHarvest ? '#15803d' : '#14532d'}
                    >
                      ₹{d.avgPrice}
                    </text>

                    {/* X-axis Label */}
                    <text
                      x={x}
                      y={graphHeight - 8}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="#15803d"
                      fontWeight="600"
                    >
                      {d.period.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Graph Disclaimer */}
          <div className="p-3 bg-white border border-green-100 rounded-xl text-xs text-green-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
            <span>
              <strong>Price Disclaimer:</strong> {t.graphDisclaimer}
            </span>
          </div>

        </div>

      </section>

      {/* ===================================================
          SECTION B: AGRICULTURAL PRODUCTS E-COMMERCE
          =================================================== */}
      <section id="section-agri-store" className="space-y-6">
        
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-green-950 tracking-tight">
              {t.agriProductsTitle}
            </h2>
            <p className="text-xs text-green-600 font-medium">
              Direct-to-farm certified bio-inputs, seeds, and precision implements with doorstep delivery
            </p>
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-green-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image Banner */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {prod.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-green-600 text-white text-[10px] font-extrabold uppercase rounded-full shadow-xs">
                      {prod.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                    {prod.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-stone-400 text-[11px] font-normal">
                      ({prod.reviewCount} farmers)
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-green-950 leading-snug">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="p-5 pt-0 border-t border-green-50 mt-2 space-y-3">
                <div className="flex items-baseline justify-between pt-3">
                  <div>
                    <span className="text-xl font-black text-green-950">
                      ₹{prod.price}
                    </span>
                    <span className="text-xs text-stone-400 line-through ml-1.5 font-medium">
                      ₹{prod.originalPrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-green-700 font-bold">
                    Save ₹{prod.originalPrice - prod.price}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="py-2 px-3 bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 rounded-xl text-xs font-bold transition-colors"
                  >
                    {t.addToCart}
                  </button>
                  <button
                    onClick={() => handleBuyNow(prod)}
                    className="py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    {t.buyNow}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ===================================================
          CART DRAWER / CHECKOUT MODAL
          =================================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-green-100 shadow-2xl space-y-5 my-auto">
            
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-green-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-extrabold text-green-950">
                  {checkoutStep === 'success' ? 'Order Confirmed' : t.cart}
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Content Steps */}
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="py-10 text-center text-stone-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm font-semibold">{t.cartEmpty}</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 bg-green-50/50 rounded-2xl border border-green-100 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-green-950 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-xs font-extrabold text-green-700">
                              ₹{item.product.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-green-200 flex items-center justify-center text-stone-700 hover:bg-green-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center text-green-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-green-200 flex items-center justify-center text-stone-700 hover:bg-green-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-stone-400 hover:text-red-600 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="border-t border-green-100 pt-4 space-y-3">
                    <div className="flex justify-between text-sm font-extrabold text-green-950">
                      <span>{t.total}</span>
                      <span className="text-green-700 font-black text-lg">₹{cartTotal}</span>
                    </div>

                    <div className="text-[11px] text-green-700 bg-green-50 p-2.5 rounded-xl flex items-center gap-1.5 border border-green-100">
                      <Truck className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Free doorstep delivery to {user?.village || 'Bhatapatana Gram Panchayat'}, {user?.district || 'Khordha'}</span>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('confirm')}
                      className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Payment & Delivery</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Confirm Checkout Step */}
            {checkoutStep === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4 space-y-2 text-xs text-green-900">
                  <div className="font-bold text-green-950 border-b border-green-100 pb-1">
                    Delivery Address:
                  </div>
                  <p><strong>Farmer:</strong> {user?.fullName || 'Pranab'}</p>
                  <p><strong>Village:</strong> {user?.village || 'Bhatapatana Panchayat'}, {user?.district || 'Khordha'}, {user?.state || 'Odisha'}</p>
                  <p><strong>Phone:</strong> {user?.mobile || '+91 98612 34567'}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2 text-xs text-green-950">
                  <div className="font-bold border-b border-green-200 pb-1">
                    Payment Method (Prototype Simulation):
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="radio" name="pay" defaultChecked className="accent-green-600" />
                    <span>Cash on Delivery (Pay upon seed/fertilizer delivery)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold">
                    <input type="radio" name="pay" className="accent-green-600" />
                    <span>Kisan Credit Card (KCC) Direct Debit</span>
                  </label>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Confirm Order (₹{cartTotal})
                  </button>
                </div>
              </div>
            )}

            {/* Success Step */}
            {checkoutStep === 'success' && (
              <div className="py-6 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="text-base font-extrabold text-green-950">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
                  Your order has been booked. A confirmation SMS with dispatch details has been sent to {user?.mobile || '+91 98612 34567'}.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs mt-2"
                >
                  Back to Marketplace
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
