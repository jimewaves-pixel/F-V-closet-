import React from 'react';

interface CategoryCardProps {
  name: string;
  targetCategory: string;
  isSale?: boolean;
  bgGradient: string;
  onSelect: (category: string, isSaleSpec?: boolean) => void;
  accentText?: string;
  key?: React.Key;
}

function CategoryCard({ name, targetCategory, isSale, bgGradient, onSelect, accentText }: CategoryCardProps) {
  return (
    <div 
      onClick={() => onSelect(targetCategory, isSale)}
      className="group relative aspect-[3/4] w-full bg-black rounded-[var(--radius-md,8px)] overflow-hidden cursor-pointer select-none shadow-md border border-brand-white/10"
    >
      {/* Background Gradient / Image Placeholder Layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out`} />

      {/* Grid Pattern / Minimal Tech Accent Layer inside card */}
      <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-[calc(var(--radius-md,8px)-2px)]" />
      
      {/* Small Tech Label Top-right */}
      <div className="absolute top-6 right-6 text-[8px] font-mono tracking-[0.2em] text-white/30 uppercase">
        {accentText || 'RELEASE VOL.01'}
      </div>

      {/* Sale Red Badge */}
      {isSale && (
        <div className="absolute top-6 left-6 bg-brand-red text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-md animate-pulse">
          SALE
        </div>
      )}

      {/* Floating abstract decorative element inside card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-playfair text-white/5 text-[9vw] sm:text-[4vw] font-black tracking-widest uppercase">
          {name.split(' ')[0]}
        </span>
      </div>

      {/* Overlay Filter for hover darkness */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 transition-colors duration-300" />

      {/* Bottom Content Panel */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent pt-12">
        {/* Category Name */}
        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wide">
          {name}
        </h3>

        {/* Sliding Shop Now CTA */}
        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out mt-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent)]">
            Shop Now <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
  setSortBy: (sortBy: string) => void;
}

export default function FeaturedCategories({ onSelectCategory, setSortBy }: FeaturedCategoriesProps) {
  const categories = [
    {
      name: "Tees & Tops",
      targetCategory: "Tees",
      bgGradient: "from-zinc-950 via-zinc-900 to-neutral-900",
      accentText: "F&V JERSEY"
    },
    {
      name: "Hoodies & Sweatshirts",
      targetCategory: "Hoodies",
      bgGradient: "from-neutral-950 via-neutral-900 to-stone-900",
      accentText: "TERRY COMPACT"
    },
    {
      name: "Bottoms",
      targetCategory: "Pants",
      bgGradient: "from-stone-950 via-stone-900 to-zinc-900",
      accentText: "TACTICAL CARGO"
    },
    {
      name: "Outerwear",
      targetCategory: "Outerwear",
      bgGradient: "from-zinc-950 via-neutral-950 to-neutral-900",
      accentText: "S-SHIELD TECH"
    },
    {
      name: "Accessories",
      targetCategory: "Accessories",
      bgGradient: "from-neutral-950 via-zinc-900 to-zinc-950",
      accentText: "ESSENTIAL ACCS"
    },
    {
      name: "Sale",
      targetCategory: "All",
      isSale: true,
      bgGradient: "from-zinc-950 via-zinc-900 to-zinc-850",
      accentText: "PRICE CODES"
    }
  ];

  const handleSelect = (cat: string, isSaleSpec?: boolean) => {
    if (isSaleSpec) {
      setSortBy('price-low');
      onSelectCategory('All');
    } else {
      onSelectCategory(cat);
    }
    
    // Smooth scroll down to the product listings
    const targetElement = document.getElementById('shop-listing');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="featured-categories" 
      className="w-full bg-brand-white border-b border-brand-black/5 py-16 px-6"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Left aligned heading */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] block">
            FOUNDATIONAL ESSENTIALS
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] font-bold text-brand-black tracking-tight leading-none">
            Shop by Category
          </h2>
        </div>

        {/* 16px Gap Grid (3 cols desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              name={cat.name}
              targetCategory={cat.targetCategory}
              isSale={cat.isSale}
              bgGradient={cat.bgGradient}
              onSelect={handleSelect}
              accentText={cat.accentText}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
