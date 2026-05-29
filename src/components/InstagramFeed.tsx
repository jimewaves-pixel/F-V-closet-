import React, { useRef, useState, useEffect } from 'react';
import { Instagram, Eye } from 'lucide-react';

interface PostTile {
  id: number;
  gradient: string;
  tag: string;
}

const INSTAGRAM_POSTS: PostTile[] = [
  { id: 1, gradient: 'from-[#F3F4F6] via-[#E5E7EB] to-[#D1D5DB]', tag: '@alex.m' },
  { id: 2, gradient: 'from-[#F5E6D3] via-[#E6D4BE] to-[#D5A98C]', tag: '@sarah_k' },
  { id: 3, gradient: 'from-[#EBEBEB] via-[#DFDFDF] to-[#CDCDCD]', tag: '@marcus.daniels' },
  { id: 4, gradient: 'from-[#FDFBF7] via-[#F3EFE0] to-[#E3DEC3]', tag: '@jess.lowe' },
  { id: 5, gradient: 'from-[#E5E9EC] via-[#CED8E0] to-[#B0C3D0]', tag: '@noah_sz' },
  { id: 6, gradient: 'from-[#FAF6F0] via-[#F3E8DB] to-[#E6D2BC]', tag: '@emily_watson' },
  { id: 7, gradient: 'from-[#EDEDED] via-[#E2E2E2] to-[#D3D3D3]', tag: '@tyler.reid' },
  { id: 8, gradient: 'from-[#FBF8F5] via-[#EFE6DC] to-[#DFCDBC]', tag: '@clara_v' },
];

export default function InstagramFeed() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleShopTheLook = () => {
    const el = document.getElementById('shop-listing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="community-instagram-feed" 
      className="w-full bg-brand-white border-b border-brand-black/5 py-16 relative overflow-hidden select-none"
    >
      {/* Decorative background "COMMUNITY" typography banner */}
      <div className="absolute top-2 w-full text-center text-brand-black/[0.015] text-[15vw] leading-none font-display font-black select-none pointer-events-none z-0">
        COMMUNITY
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-accent)] block">
            WE INTEGRATED TOGETHER
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[36px] font-bold text-brand-black tracking-tight leading-none">
            @TFCLOTHING — Tag us to be featured
          </h2>
        </div>

        {/* Horizontal Drag-scrollable Strip Container */}
        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`w-full flex overflow-x-auto gap-4 py-4 px-2 scroll-smooth cursor-grab active:cursor-grabbing snap-x snap-mandatory scrollbar-none
            ${isDragging ? 'scroll-auto' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {INSTAGRAM_POSTS.map((post) => (
            <div 
              key={post.id}
              className="min-w-[180px] sm:min-w-[210px] aspect-square rounded-[var(--radius-sm,4px)] overflow-hidden relative group shadow-sm border border-brand-black/5 snap-start shrink-0 select-none bg-zinc-100"
            >
              {/* Soft Warm Gradient Inner Block */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${post.gradient} z-0`} />

              {/* Grid Lines Pattern Element inside card */}
              <div className="absolute inset-3 border border-brand-black/[0.03] pointer-events-none rounded-[calc(var(--radius-sm,4px)-2px)]" />

              {/* Large faded decorative icon */}
              <div className="absolute inset-0 flex items-center justify-center text-brand-black/[0.02] pointer-events-none select-none">
                <Instagram className="w-20 h-20" />
              </div>

              {/* Tag bottom-left overlay */}
              <div className="absolute bottom-3 left-3 bg-white/60 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.02)] px-2 py-0.5 rounded-sm z-10">
                <span className="font-mono text-[9px] font-bold text-zinc-700 tracking-tight">
                  {post.tag}
                </span>
              </div>

              {/* Instagram Hover Full-Card Dark Overlay */}
              <div className="absolute inset-0 bg-brand-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white z-20">
                <Instagram className="w-6 h-6 text-white transform group-hover:scale-110 duration-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                  View Post
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center CTA button "Shop the Look" */}
        <div className="text-center pt-2">
          <button
            onClick={handleShopTheLook}
            className="bg-brand-black hover:bg-[var(--color-accent)] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.3em] py-4.5 px-8 transition-colors duration-300 shadow-md cursor-pointer border border-transparent rounded-none"
          >
            Shop the Look
          </button>
        </div>
      </div>
    </section>
  );
}
