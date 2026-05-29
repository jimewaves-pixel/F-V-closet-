import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface BestSellersProps {
  wishlist: string[];
  onToggleWishlist: (productId: string, productName: string) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  formatPrice: (usdAmount: number) => string;
}

// Set up 8 featured items based on core collection
const BEST_SELLER_PRODUCTS: Product[] = [
  {
    ...PRODUCTS[0], // Heavyweight Terry Hoodie
    id: 'tf-bs-01',
    name: 'M-1 Heavyweight French Terry Hoodie',
    status: 'new'
  },
  {
    ...PRODUCTS[1], // Tactical Cargo Pant
    id: 'tf-bs-02',
    name: 'Type-II Tactical Cargo Pant',
    status: 'limited'
  },
  {
    ...PRODUCTS[2], // Linear Box Heavy Tee
    id: 'tf-bs-03',
    name: 'Linear Box Silhouette Heavy Tee',
    status: 'limited'
  },
  {
    ...PRODUCTS[3], // Coach Windbreaker
    id: 'tf-bs-04',
    name: 'Sector Technical Coach Windbreaker',
    status: 'new'
  },
  {
    ...PRODUCTS[4], // Raw Knit Beanie
    id: 'tf-bs-05',
    name: 'Raw Gauge Knit Beanie',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], // Map standard sizes for apparel uniformity
    status: 'limited'
  },
  {
    ...PRODUCTS[5], // Chest Pack
    id: 'tf-bs-06',
    name: 'Modular Utility Chest Pack',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], // Map standard sizes for apparel uniformity
    status: 'new'
  },
  {
    ...PRODUCTS[2], // Extra heavy Tee variant
    id: 'tf-bs-07',
    name: 'M-1 Heavyweight Studio Sweatshirt',
    price: 115,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'limited'
  },
  {
    ...PRODUCTS[1], // Cargo variant
    id: 'tf-bs-08',
    name: 'Type-I Heavy Cargo Shorts',
    price: 95,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'new'
  }
];

// Gradients array for 8 distinct architectural placeholder backgrounds
const GRADIENTS = [
  'from-zinc-950 via-zinc-900 to-neutral-900',
  'from-neutral-950 via-neutral-900 to-stone-900',
  'from-stone-950 via-stone-900 to-zinc-900',
  'from-zinc-950 via-neutral-950 to-neutral-900',
  'from-neutral-950 via-zinc-900 to-zinc-950',
  'from-zinc-950 via-zinc-900 to-zinc-850',
  'from-neutral-900 via-stone-950 to-neutral-950',
  'from-stone-900 via-zinc-950 to-stone-950'
];

interface BestSellerCardProps {
  product: Product;
  gradient: string;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, productName: string) => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }) => void;
  formatPrice: (usdAmount: number) => string;
  key?: React.Key;
}

function BestSellerCard({ product, gradient, isWishlisted, onToggleWishlist, onAddToCart, formatPrice }: BestSellerCardProps) {
  // Sizes list requirement: XS, S, M, L, XL
  const sizePills = ['XS', 'S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState('M'); // Prematurely select 'M' as middle default
  const [pulseScale, setPulseScale] = useState(false);

  const handleAdd = () => {
    // Trigger brief visual scale feedback
    setPulseScale(true);
    setTimeout(() => setPulseScale(false), 300);
    // Standard color is the first available product color
    const defaultColor = product.colors[0] || { name: 'Core Black', hex: '#000000' };
    onAddToCart(product, selectedSize, defaultColor);
  };

  return (
    <div 
      className={`min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-start flex flex-col group bg-white border border-brand-black/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 relative rounded-none select-none
        ${pulseScale ? 'scale-95 duration-100' : ''}`}
    >
      {/* Aspect Ratio 1:1 Square Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        {/* Background gradient layout */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} z-0`} />
        
        {/* Decorative Grid Accent Inside Image Area */}
        <div className="absolute inset-4 border border-white/5 pointer-events-none" />

        {/* Small Technical Badge top-left */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          <span className="bg-[var(--color-accent)] text-white text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm shadow-md">
            {product.status === 'limited' ? 'BEST SELLER' : 'NEW'}
          </span>
        </div>

        {/* Wishlist Heart Icon Top-right */}
        <button
          onClick={() => onToggleWishlist(product.id, product.name)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/80 backdrop-blur-sm rounded-full text-white cursor-pointer active:scale-90 transition-all border border-white/5"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 
              ${isWishlisted ? 'text-brand-red fill-brand-red' : 'text-white'}`} 
          />
        </button>

        {/* Giant Centered Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <span className="font-playfair text-white text-[8vw] sm:text-[3.5vw] md:text-[2.2vw] font-black tracking-widest uppercase">
            {product.category}
          </span>
        </div>

        {/* Hover Product Name Overlay on card image area (Desktop Only) */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center select-none">
          <p className="font-playfair text-white font-bold text-lg leading-snug max-w-[200px]">
            {product.name}
          </p>
          <div className="w-8 h-[1px] bg-white/30 my-3" />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-zinc-400">
            {product.category} • PREMIUM SPEC
          </span>
        </div>

        {/* ADD TO CART OVERLAY BUTTON (Desktop: appears on hover; Mobile: hidden on background layer) */}
        <div className="absolute bottom-4 inset-x-4 hidden lg:block translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-350 ease-out z-20">
          <button
            onClick={handleAdd}
            className="w-full bg-[var(--color-accent)] text-white hover:bg-white hover:text-black font-bold text-[10px] uppercase tracking-[0.25em] py-3.5 px-4 cursor-pointer border border-transparent hover:border-white transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Information Panel (Below square image) */}
      <div className="p-4 flex flex-col flex-grow justify-between text-left space-y-3.5">
        <div>
          {/* Category Tag (Muted, 12px) */}
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 block mb-0.5">
            {product.category}
          </span>
          {/* Product Name (Bold, 15px) */}
          <h4 className="font-dmsans text-[14px] sm:text-[15px] font-bold text-brand-black tracking-tight leading-snug line-clamp-1">
            {product.name}
          </h4>
        </div>

        {/* Price Tag ($XX.00) */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm sm:text-base font-bold text-brand-black" data-price-usd={product.price.toString()}>
            {formatPrice(product.price)}
          </span>
          <span className="text-[9px] font-mono font-medium tracking-wide text-zinc-400 uppercase">
            TAX INCL.
          </span>
        </div>

        {/* Size Selector Row (XS, S, M, L, XL - Small Clickable Pills) */}
        <div className="space-y-1.5 pb-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
            Select Size
          </span>
          <div className="flex gap-1.5 flex-wrap">
            {sizePills.map((size) => {
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] font-bold tracking-tight border transition-all cursor-pointer rounded-none
                    ${isActive 
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-sm' 
                      : 'hover:bg-zinc-100 text-brand-black border-zinc-200'}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to Cart Button (Mobile Only - Always Visible) */}
        <div className="lg:hidden w-full pt-1">
          <button
            onClick={handleAdd}
            className="w-full bg-brand-black text-white active:bg-[var(--color-accent)] font-bold text-[10px] uppercase tracking-[0.2em] py-3 px-4 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BestSellers({ wishlist, onToggleWishlist, onAddToCart, formatPrice }: BestSellersProps) {
  
  const handleScrollToShop = () => {
    onSelectAllTab();
  };

  const onSelectAllTab = () => {
    // Smooth scroll down to the main shop listing matching category 'All'
    const targetElement = document.getElementById('shop-listing');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="best-sellers-section" 
      className="w-full bg-white border-b border-brand-black/5 py-16 px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header - "Best Sellers" heading left, with a "View All →" link right-aligned */}
        <div className="flex items-end justify-between border-b border-brand-black/5 pb-5">
          <div className="space-y-1.5 text-left">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] block">
              TRENDING EDITORIAL SELECTIONS
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-black tracking-tight leading-none">
              Best Sellers
            </h2>
          </div>
          
          <button
            onClick={handleScrollToShop}
            className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)] hover:text-brand-black flex items-center gap-1.5 transition-colors group cursor-pointer border-b border-transparent hover:border-brand-black pb-1.5"
          >
            View All <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Product Card Grid: 4 columns desktop, 2 columns tablet, 1 column horizontal-scroll on mobile */}
        <div className="flex overflow-x-auto pb-6 gap-5 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0 scrollbar-none">
          {BEST_SELLER_PRODUCTS.map((prod, index) => {
            const isWishlisted = wishlist.includes(prod.id);
            const cardGradient = GRADIENTS[index % GRADIENTS.length];
            
            return (
              <BestSellerCard
                key={prod.id}
                product={prod}
                gradient={cardGradient}
                isWishlisted={isWishlisted}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                formatPrice={formatPrice}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
