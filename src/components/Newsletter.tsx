import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail('');
    }, 1200);
  };

  return (
    <section 
      id="newsletter-section" 
      className="w-full bg-[var(--color-accent)] py-16 sm:py-24 px-6 relative overflow-hidden text-white"
    >
      {/* Decorative architectural grid lines or structural accents */}
      <div className="absolute inset-y-0 left-8 sm:left-12 w-[1px] bg-white/[0.04] pointer-events-none" />
      <div className="absolute inset-y-0 right-8 sm:right-12 w-[1px] bg-white/[0.04] pointer-events-none" />

      {/* Main Container constraints (max-width 560px) */}
      <div className="max-w-[560px] mx-auto text-center space-y-8 relative z-10">
        
        {/* Title Group */}
        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-[0.35em] text-white/50 uppercase block">
            F&V DIGITAL ACCESS
          </span>
          <h2 className="font-playfair text-[40px] sm:text-[56px] font-bold text-white tracking-tight leading-[0.95]">
            Get Early Access.
          </h2>
          <p className="font-dmsans text-[14px] sm:text-[16px] text-white/80 leading-relaxed max-w-[480px] mx-auto">
            New drops, exclusive discounts, and members-only offers. No spam, ever.
          </p>
        </div>

        {/* Dynamic Transition Area for Form & Success Checkmark */}
        <div className="min-h-[140px] flex flex-col justify-center">
          {!submitted ? (
            <form 
              onSubmit={handleSubmit}
              className="space-y-4"
              id="newsletter-form"
            >
              {/* Inline layout on md/sm screen, stacked on mobile */}
              <div className="flex flex-col sm:flex-row gap-0 border border-white/20 shadow-xl">
                <div className="relative flex-grow">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-white text-black font-dmsans text-sm pl-11 pr-4 py-4 focus:outline-none focus:ring-0 rounded-none border-0 placeholder-zinc-400 placeholder:font-light"
                    disabled={isSubmitting}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-black hover:bg-white text-white hover:text-black font-bold text-xs uppercase tracking-[0.25em] px-8 py-4 sm:py-0 sm:h-full cursor-pointer transition-all duration-300 rounded-none border-t sm:border-t-0 border-white/10 shrink-0 disabled:opacity-75 relative min-w-[140px]"
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent vertical-middle" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>

              {/* Counter metadata under form */}
              <p className="font-mono text-[10px] sm:text-xs text-white/60 tracking-wider">
                Join <span className="font-bold text-white">18,000+ subscribers</span> · Unsubscribe anytime
              </p>
            </form>
          ) : (
            /* Successful Submission Mock Interface */
            <div 
              className="space-y-4 animate-fadeInUp flex flex-col items-center justify-center p-6 border border-white/10 bg-black/10 backdrop-blur-sm"
              id="newsletter-success-state"
            >
              {/* Animating checkmark wrapper */}
              <div className="w-12 h-12 rounded-full bg-white text-brand-black flex items-center justify-center shadow-lg border-2 border-white/20 animate-bounce">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight">
                  You're in. Welcome to F&V closet.
                </h3>
                <p className="font-mono text-[10px] text-white/50 tracking-widest uppercase">
                  CONFIRMATION SENT SUCCESSFULLY
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
