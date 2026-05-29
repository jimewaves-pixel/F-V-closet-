import React, { useEffect, useRef, useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react';

interface TrustBarProps {
  formatPrice?: (usdAmount: number, decimals?: boolean) => string;
}

export default function TrustBar({ formatPrice }: TrustBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, disconnect observer so animation doesn't re-trigger
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const trustSignals = [
    {
      icon: <Truck className="w-5 h-5 text-[var(--color-accent)] shrink-0" />,
      label: formatPrice ? (
        <span>Free Shipping Over <span data-price-usd="75">{formatPrice(75, false)}</span></span>
      ) : "Free Shipping Over $75",
      subtext: "On all orders in US/EU",
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-[var(--color-accent)] shrink-0" />,
      label: "30-Day Free Returns",
      subtext: "Risk-free home try-on",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[var(--color-accent)] shrink-0" />,
      label: "Secure Checkout",
      subtext: "256-bit SSL encrypted tracker",
    },
    {
      icon: <Star className="w-5 h-5 text-[var(--color-accent)] fill-current shrink-0" />,
      label: "4.9/5 from Reviews",
      subtext: "Loved by 3,200+ customers",
    },
  ];

  return (
    <section 
      id="trust-signals-bar"
      ref={containerRef}
      className="w-full bg-[var(--color-off-white)] border-b border-brand-black/5 py-8 md:py-0 md:h-[72px] flex items-center select-none overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 md:gap-0 h-full">
        {trustSignals.map((signal, idx) => (
          <div 
            key={idx}
            style={{ 
              animationDelay: `${idx * 100}ms` 
            }}
            className={`flex items-center gap-3 px-2 md:px-6 h-full relative transition-all duration-300
              ${isVisible ? 'animate-fadeInUp opacity-100' : 'opacity-0 translate-y-4'}
              ${idx !== 3 ? 'md:after:content-[""] md:after:absolute md:after:right-0 md:after:top-4 md:after:bottom-4 md:after:w-[1px] md:after:bg-brand-black/10' : ''}
            `}
          >
            <div className="p-2 bg-white rounded-full shadow-sm flex items-center justify-center border border-brand-black/5 shrink-0">
              {signal.icon}
            </div>
            <div className="text-left">
              <p className="font-dmsans text-[11px] sm:text-[13px] font-bold text-brand-black tracking-tight leading-snug">
                {signal.label}
              </p>
              <p className="font-sans text-[10px] text-zinc-500 font-medium tracking-wide mt-0.5">
                {signal.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
