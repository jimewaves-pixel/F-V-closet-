import React from 'react';
import { Instagram, Twitter } from 'lucide-react';

interface FooterLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

function FooterLink({ children, onClick, href = '#' }: FooterLinkProps) {
  return (
    <li>
      <a 
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        className="group relative inline-block text-[13px] text-zinc-400 hover:text-white transition-colors duration-300 pb-0.5"
      >
        <span>{children}</span>
        {/* Animated left-to-right underline slide hover effect */}
        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[var(--color-accent)] group-hover:w-full transition-all duration-300 ease-out" />
      </a>
    </li>
  );
}

interface SiteFooterProps {
  onNavigate: (tab: string) => void;
  onSelectCategory: (category: string) => void;
  triggerToast: (message: string, type: 'success' | 'info') => void;
}

export default function SiteFooter({ onNavigate, onSelectCategory, triggerToast }: SiteFooterProps) {
  
  const handleNewArrivals = () => {
    onNavigate('Shop');
    onSelectCategory('All');
    setTimeout(() => {
      const el = document.getElementById('shop-listing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBestSellers = () => {
    const el = document.getElementById('best-sellers-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback
      onNavigate('Shop');
    }
  };

  const handleSale = () => {
    onNavigate('Shop');
    onSelectCategory('All');
    triggerToast('Reviewing exclusive discounted markdown prices below.', 'info');
    setTimeout(() => {
      const el = document.getElementById('shop-listing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-black text-zinc-100 border-t-2 border-[var(--color-accent)] select-none">
      
      {/* Top detailed content grids */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 text-left">
        
        {/* Column 1: F&V Logo, Brand Tagline, Social Icons */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-1">
            <h3 className="font-playfair text-3xl font-black tracking-tight text-white block">
              F&V<span className="text-[var(--color-accent)]">.</span>
            </h3>
            <p className="text-xs font-mono tracking-wider text-zinc-500 uppercase">
              CLOSET DIVISION
            </p>
          </div>
          
          <p className="font-sans text-[14px] leading-relaxed text-zinc-400 max-w-xs font-medium">
            "Wear What You Stand For."
          </p>
          
          <p className="text-[11px] font-mono tracking-wide text-zinc-500 uppercase leading-relaxed max-w-xs">
            Architectural silhouettes made back-to-order. Iterations of 150 items globally. Bold and modern urban streetwear handcrafted with intention in Accra, Ghana.
          </p>

          {/* Connected social media links with gorgeous custom SVG paths and icons */}
          <div className="flex items-center gap-4 pt-1">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-zinc-900 border border-zinc-850 hover:border-white text-zinc-400 hover:text-white rounded-full transition-all duration-300"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Custom TikTok SVG Logo */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-zinc-900 border border-zinc-850 hover:border-white text-zinc-400 hover:text-white rounded-full transition-all duration-300"
              title="TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.74-.22-.22-.4-.47-.58-.73v6.56c.02 2.11-.6 4.31-2.03 5.92-1.43 1.61-3.66 2.53-5.81 2.52-2.32.08-4.73-.89-6.19-2.71-1.55-1.89-2.06-4.59-1.4-6.99.64-2.45 2.56-4.56 5.03-5.18 1.19-.3 2.45-.2 3.63.19v4.09c-.83-.34-1.77-.42-2.61-.13-1 .31-1.85 1.09-2.18 2.08-.43 1.22-.09 2.69.83 3.55.85.82 2.12 1.11 3.25.75.97-.29 1.74-1.12 1.95-2.12.11-.53.11-1.07.1-1.61L12.525.02z"/>
              </svg>
            </a>

            {/* Custom Pinterest SVG Logo */}
            <a 
              href="https://pinterest.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-zinc-900 border border-zinc-850 hover:border-white text-zinc-400 hover:text-white rounded-full transition-all duration-300"
              title="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.396-5.913 1.396-5.913s-.356-.715-.356-1.777c0-1.664.965-2.903 2.164-2.903 1.021 0 1.514.766 1.514 1.685 0 1.026-.653 2.56-1.01 3.982-.281 1.192.599 2.164 1.774 2.164 2.129 0 3.765-2.244 3.765-5.483 0-2.867-2.061-4.87-4.996-4.87-3.407 0-5.409 2.556-5.409 5.2 0 1.03.397 2.133.892 2.733a.359.359 0 01.083.344c-.097.401-.313 1.272-.355 1.448-.056.23-.189.279-.434.165-1.619-.753-2.628-3.116-2.628-5.013 0-4.085 2.969-7.838 8.562-7.838 4.494 0 7.986 3.203 7.986 7.485 0 4.467-2.817 8.06-6.733 8.06-1.314 0-2.549-.682-2.972-1.492l-.81 3.085c-.292 1.114-1.082 2.512-1.611 3.371 1.115.344 2.298.531 3.528.531 6.621 0 11.985-5.367 11.985-11.987C23.999 5.367 18.636 0 12.017 0z"/>
              </svg>
            </a>

            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 bg-zinc-900 border border-zinc-850 hover:border-white text-zinc-400 hover:text-white rounded-full transition-all duration-300"
              title="X / Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Shop links */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            SHOP SELECTIONS
          </h4>
          <ul className="space-y-3.5">
            <FooterLink onClick={handleNewArrivals}>New Arrivals</FooterLink>
            <FooterLink onClick={handleBestSellers}>Best Sellers</FooterLink>
            <FooterLink onClick={handleSale}>Sale</FooterLink>
            <FooterLink onClick={() => triggerToast('Gift vouchers release soon on exclusive drops.', 'info')}>
              Gift Cards
            </FooterLink>
          </ul>
        </div>

        {/* Column 3: Help links */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            HELP DESK
          </h4>
          <ul className="space-y-3.5">
            <FooterLink onClick={() => triggerToast('Size fit is standard. Hand or dry wash recommended.', 'info')}>
              FAQ
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Complimentary Worldwide express shipping and returns.', 'info')}>
              Shipping & Returns
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Model is 6\'1 wearing size Medium true relaxed fit.', 'info')}>
              Size Guide
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Reach our representative desk at support@fvcloset.com', 'info')}>
              Contact Us
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Enter your tracking voucher code inside the Drop confirmation email.', 'info')}>
              Track Order
            </FooterLink>
          </ul>
        </div>

        {/* Column 4: Company links */}
        <div className="lg:col-span-2.5 space-y-4">
          <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            ABOUT F&V
          </h4>
          <ul className="space-y-3.5">
            <FooterLink onClick={() => { onNavigate('About'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              About F&V
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Applications for the Accra patterns studio are open. Send resume to careers@fvcloset.com', 'info')}>
              Careers
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Global media access desk: press@fvcloset.com', 'info')}>
              Press
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Certified pre-shrunk Terry. Zero toxic microplastics.', 'info')}>
              Sustainability
            </FooterLink>
            <FooterLink onClick={() => triggerToast('Strategic ambassadors registry starts next drop cycle.', 'info')}>
              Affiliates
            </FooterLink>
          </ul>
        </div>

      </div>

      {/* 20% White Divider Line */}
      <div className="border-t border-white/20 w-full" />

      {/* Bottom Bar: Copyright left, payment badge pills right */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-wider z-10 relative">
        <div className="text-zinc-500 font-medium text-center md:text-left">
          © 2026 F&V closet. All rights reserved. Creative design crafted with intention in Accra, Ghana.
        </div>
        
        {/* Sleek uniform pill representation of checkout processors */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Klarna'].map((pay) => (
            <span 
              key={pay} 
              className="px-2.5 py-1 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-widest bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors duration-200 select-none rounded-[var(--radius-sm,4px)]"
            >
              {pay}
            </span>
          ))}
        </div>
      </div>

    </footer>
  );
}
