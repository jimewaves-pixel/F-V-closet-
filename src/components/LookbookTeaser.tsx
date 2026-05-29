import React, { useEffect, useRef, useState } from 'react';

interface LookbookTeaserProps {
  onViewLookbook: () => void;
}

export default function LookbookTeaser({ onViewLookbook }: LookbookTeaserProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const parentTop = sectionRef.current.offsetTop;
      const scrollPos = window.scrollY;
      
      // Calculate active relative scroll multiplier
      const relativeOffset = (scrollPos - parentTop) * 0.15; // smooth slow multiplier
      setOffsetY(relativeOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="lookbook-teaser-banner"
      className="w-full h-[60vh] sm:h-[70vh] relative overflow-hidden flex items-center justify-center text-white select-none bg-black border-b border-white/5"
    >
      {/* Parallax Background Layer */}
      <div 
        style={{
          transform: `translate3d(0, ${offsetY}px, 0) scale(1.1)`,
          backgroundImage: 'linear-gradient(135deg, #020202 0%, #0c0c0e 45%, #18181b 100%)'
        }}
        className="absolute inset-0 w-full h-[140%] -top-[20%] transition-transform duration-100 ease-out will-change-transform z-0"
      />

      {/* Grid line guidelines for elegant editorial layout */}
      <div className="absolute inset-y-0 left-10 w-[1px] bg-white/[0.03] z-10 hidden md:block" />
      <div className="absolute inset-y-0 right-10 w-[1px] bg-white/[0.03] z-10 hidden md:block" />
      <div className="absolute inset-x-0 top-10 h-[1px] bg-white/[0.03] z-10 hidden md:block" />
      <div className="absolute inset-x-0 bottom-10 h-[1px] bg-white/[0.03] z-10 hidden md:block" />

      {/* Subtle Grain Overlay (From index.css definition) */}
      <div className="absolute inset-0 bg-grain opacity-80 pointer-events-none z-10" />

      {/* Vignette Shadow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/85 z-10" />

      {/* Center Layout Panel */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-6 sm:space-y-8 relative z-20">
        
        {/* Small Metadata Label */}
        <div className="space-y-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-accent)] block animate-pulse">
            LOOKBOOK — SUMMER 2026
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-white/30 uppercase block">
            ISSUE NO. 04 / RELEASE VOL. 01
          </span>
        </div>

        {/* Playfair Elegant Italic Title Accent */}
        <h2 className="font-playfair italic font-medium text-5xl sm:text-7xl lg:text-[96px] leading-[0.95] text-white tracking-tight">
          The Heat Issue
        </h2>

        {/* Editorial Subtext (DM Sans, 20px, 70% opacity) */}
        <p className="font-dmsans text-lg sm:text-xl lg:text-[20px] text-white/70 max-w-xl mx-auto leading-relaxed font-normal">
          Explore how the season's essential pieces move.
        </p>

        {/* Call to action trigger */}
        <div className="pt-4">
          <button
            onClick={onViewLookbook}
            className="bg-white hover:bg-[var(--color-accent)] text-black hover:text-white font-bold text-xs sm:text-sm uppercase tracking-[0.3em] py-4.5 px-10 transition-all duration-300 shadow-2xl cursor-pointer border border-transparent hover:border-white rounded-none"
          >
            View the Lookbook
          </button>
        </div>

      </div>
    </section>
  );
}
