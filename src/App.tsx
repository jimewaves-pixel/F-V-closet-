import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  Info, 
  Check, 
  Plus, 
  Minus, 
  Tag, 
  Trash2, 
  Percent, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  SlidersHorizontal, 
  ThumbsUp, 
  Clock, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { PRODUCTS, COUPONS } from './data/products';
import { Product, CartItem, Coupon } from './types';
import TrustBar from './components/TrustBar';
import FeaturedCategories from './components/FeaturedCategories';
import BestSellers from './components/BestSellers';
import LookbookTeaser from './components/LookbookTeaser';
import InstagramFeed from './components/InstagramFeed';
import Newsletter from './components/Newsletter';
import SiteFooter from './components/SiteFooter';

export default function App() {
  // Storefront Core State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Shop' | 'Collections' | 'Lookbook' | 'About' | 'Sale'>('Shop');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  
  // UI Panels Toggles
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Custom Sizing & Color selection inside Grid quick-add and Detail views
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  
  // Conversion configuration
  const rates = {
    USD: 1,
    GBP: 0.79,
    GHS: 15.20   // 1 USD = ~15.20 GHS
  };

  const currencyOptions = [
    { code: 'USD', label: 'USD', symbol: '$', flag: '🇺🇸' },
    { code: 'GBP', label: 'GBP', symbol: '£', flag: '🇬🇧' },
    { code: 'GHS', label: 'GHS', symbol: '₵', flag: '🇬🇭' },
  ] as const;

  const [currency, setCurrency] = useState<'USD' | 'GBP' | 'GHS'>(() => {
    const saved = localStorage.getItem('tf_currency');
    if (saved === 'USD' || saved === 'GBP' || saved === 'GHS') {
      return saved as 'USD' | 'GBP' | 'GHS';
    }
    return 'GHS'; // Default currency
  });

  const formatPrice = (usdAmount: number, decimals: boolean = true) => {
    const rate = rates[currency] || 1;
    const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '₵';
    const converted = usdAmount * rate;
    return `${symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0
    })}`;
  };

  const convertAllPrices = (curr: 'USD' | 'GBP' | 'GHS') => {
    const rateObj = {
      USD: 1,
      GBP: 0.79,
      GHS: 15.20
    };
    const currentSymbol = curr === 'USD' ? '$' : curr === 'GBP' ? '£' : '₵';
    const rate = rateObj[curr] || 1;
    document.querySelectorAll('[data-price-usd]').forEach((el) => {
      const usdVal = parseFloat(el.getAttribute('data-price-usd') || '0');
      if (!isNaN(usdVal)) {
        const converted = usdVal * rate;
        const formatted = converted.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        el.textContent = `${currentSymbol}${formatted}`;
      }
    });
  };

  const handleCurrencyChange = (newCurrency: 'USD' | 'GBP' | 'GHS') => {
    setCurrency(newCurrency);
    localStorage.setItem('tf_currency', newCurrency);
    triggerToast(`Currency switched to ${newCurrencyOptionsName(newCurrency)}.`);
  };

  const newCurrencyOptionsName = (code: 'USD' | 'GBP' | 'GHS') => {
    if (code === 'USD') return 'US Dollar ($)';
    if (code === 'GBP') return 'British Pound (£)';
    return 'Ghana Cedis (₵)';
  };

  useEffect(() => {
    (window as any).convertAllPrices = convertAllPrices;
    convertAllPrices(currency);
  }, [currency]);

  // Checkout & Coupons State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Coupon | null>(null);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    fullName: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '4111 2222 3333 4444',
    cardExp: '12/28',
    cardCvc: '101'
  });
  
  // Scroll compression tracker
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Interaction animation counters
  const [pulseCart, setPulseCart] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  // Custom reviews logic
  const [productReviews, setProductReviews] = useState<Record<string, { username: string; rating: number; text: string; date: string }[]>>({
    'tf-001': [
      { username: 'Lukas.V', rating: 5, text: 'Absolutely unmatched density. Sits perfectly boxy on the shoulders. Worth every dollar in cobalt! âš¡ï¸ ', date: 'May 12, 2026' },
      { username: 'Sarah_K', rating: 5, text: 'The hood holds its architecture perfectly. Standard hoodies feel like tissue paper after wearing this.', date: 'April 28, 2026' }
    ],
    'tf-002': [
      { username: 'MarcusX', rating: 5, text: 'Ripstop fabric is high grade. Articulated knees make styling with tech wear boots extremely simple.', date: 'May 04, 2026' }
    ]
  });
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');

  // Newsletter tracking
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Outfit / Lookbook Bundle Active Build State
  const [lookbookSelectedSize, setLookbookSelectedSize] = useState<Record<string, string>>({
    'tf-001': 'M',
    'tf-002': '32',
    'tf-005': 'One Size'
  });

  // Keep track of scroll depth to compress navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show customized alert notifications
  const triggerToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Add Item to bag handler
  const handleAddToCart = (product: Product, size: string, color: { name: string; hex: string }) => {
    if (!size) {
      triggerToast('Please select a size first.', 'info');
      return;
    }
    
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prevCart, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });

    // Cart pulse animation feedback
    setPulseCart(true);
    setTimeout(() => setPulseCart(false), 900);
    triggerToast(`Added ${product.name} (${size}) to your bag.`);
  };

  // Set default product selected parameters on detail modal open
  const openProductDetail = (product: Product) => {
    setSelectedDetailProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setSelectedColor(product.colors[0] || null);
    // Reset reviews input
    setNewReviewText('');
    setNewReviewName('');
    setNewReviewRating(5);
  };

  // Toggle wishlist state
  const toggleWishlist = (productId: string, productName: string) => {
    setWishlist(prev => {
      const isInclude = prev.includes(productId);
      if (isInclude) {
        triggerToast(`Removed ${productName} from wishlist.`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        triggerToast(`Added ${productName} to wishlist.`);
        return [...prev, productId];
      }
    });
  };

  // Cart values calculation
  const subtotal = cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  // Apply Coupon promo discount calculation
  const discount = appliedPromo 
    ? (appliedPromo.type === 'percent' 
        ? subtotal * (appliedPromo.value / 100) 
        : appliedPromo.value)
    : 0;

  const threshold = 75; // Free shipping standard
  const shipping = subtotal >= threshold || subtotal === 0 ? 0 : 15;
  const total = Math.max(0, subtotal - discount + shipping);

  // Quick Promo validation
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCodeInput.trim().toUpperCase();
    
    if (cleanCode === 'TF10') {
      const coupon: Coupon = { code: 'TF10', type: 'percent', value: 10, description: '10% OFF standard code' };
      setAppliedPromo(coupon);
      triggerToast('Coupon TF10 applied! 10% discount subtracted.');
      setPromoCodeInput('');
      return;
    }

    const matched = COUPONS.find(c => c.code === cleanCode);
    if (matched) {
      setAppliedPromo(matched as Coupon);
      triggerToast(`Coupon ${cleanCode} applied! ${matched.description}.`);
    } else {
      triggerToast('This checkout code is invalid.', 'info');
    }
    setPromoCodeInput('');
  };

  // Add a product review
  const handleAddReview = (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      triggerToast('Please provide your name and review review message.', 'info');
      return;
    }
    const reviewObj = {
      username: newReviewName.trim(),
      rating: newReviewRating,
      text: newReviewText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setProductReviews(prev => ({
      ...prev,
      [productId]: [reviewObj, ...(prev[productId] || [])]
    }));

    setNewReviewName('');
    setNewReviewText('');
    triggerToast('Thank you! Your feedback review is live.');
  };

  // Lookbook Bundle adder utility
  const handleAddLookbookBundle = () => {
    // Bundle contains tf-001 (hoodie), tf-002 (cargos), tf-005 (beanie)
    const itemsToAdd = [
      { id: 'tf-001', colorName: 'Electric Cobalt', defaultSize: 'M' },
      { id: 'tf-002', colorName: 'Core Black', defaultSize: '32' },
      { id: 'tf-005', colorName: 'Electric Cobalt', defaultSize: 'One Size' }
    ];

    itemsToAdd.forEach(bundleSpec => {
      const p = PRODUCTS.find(prod => prod.id === bundleSpec.id);
      if (p) {
        const c = p.colors.find(col => col.name === bundleSpec.colorName) || p.colors[0];
        const s = lookbookSelectedSize[bundleSpec.id] || bundleSpec.defaultSize;
        handleAddToCart(p, s, c);
      }
    });

    // Automatically apply standard lookbook discount code
    const lookbookPromo: Coupon = {
      code: 'LOOKBOOK15',
      type: 'percent',
      value: 15,
      description: 'Exclusive 15% off Cobalt lookbook outfit'
    };
    setAppliedPromo(lookbookPromo);
    triggerToast('Curated Lookout Bundle added! LOOKBOOK15 (15% off) auto-applied.', 'success');
  };

  // Sorting and Filtering products list
  const filteredProducts = PRODUCTS.filter(p => {
    // Filter Category
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    // Filter Query search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Global search list for the search modal (bypasses category filter for a premium global search experience)
  const globalSearchProducts = PRODUCTS.filter(p => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice || a.price;
    const priceB = b.salePrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // standard default
  });

  return (
    <div id="store-root" className="min-h-screen flex flex-col bg-brand-white text-brand-black select-none font-sans relative">
      
      {/* Dynamic Toast Feedback Overlay */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-black border border-brand-cobalt-light text-brand-white px-5 py-4 flex items-center gap-3 shadow-2xl animate-fade-in transition-all max-w-sm rounded">
          <Sparkles className="w-5 h-5 text-brand-cobalt-light animate-bounce" />
          <p className="text-xs font-bold tracking-wider uppercase leading-tight">{toast.message}</p>
        </div>
      )}

      {/* TOP ANNOUNCEMENT BAR (above layout header) */}
      <div className="w-full bg-[var(--color-accent)] text-brand-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] py-2.5 px-6 z-40 shrink-0 select-none overflow-hidden relative">
        {/* Mobile Scrolling Marquee Loop */}
        <div className="md:hidden flex overflow-hidden whitespace-nowrap w-full">
          <div className="inline-flex gap-8 whitespace-nowrap animate-marquee">
            <span>FREE SHIPPING ON ORDERS OVER <span data-price-usd="75">{formatPrice(75, false)}</span> — USE CODE: <span className="underline decoration-pink-300 decoration-2">TF10</span> FOR 10% OFF</span>
            <span>FREE SHIPPING ON ORDERS OVER <span data-price-usd="75">{formatPrice(75, false)}</span> — USE CODE: <span className="underline decoration-pink-300 decoration-2">TF10</span> FOR 10% OFF</span>
          </div>
        </div>
        {/* Desktop Static Centered version */}
        <div className="hidden md:flex justify-center items-center gap-2">
          <span>FREE SHIPPING ON ORDERS OVER <span data-price-usd="75">{formatPrice(75, false)}</span> — USE CODE: <span className="underline decoration-pink-300 decoration-2 font-black">TF10</span> FOR 10% OFF</span>
        </div>
      </div>

      {/* SITE HEADER (Sticky, Compresses on Scroll past 80px) */}
      <header 
        style={{
          backdropFilter: isScrolled ? 'blur(8px)' : 'none'
        }}
        className={`sticky top-0 w-full z-40 text-brand-white flex items-center transition-all duration-300 ease-out border-b select-none
          ${isScrolled 
            ? 'h-12 bg-black/95 border-brand-white/15 shadow-lg' 
            : 'h-14 lg:h-16 bg-black border-brand-white/10'}`}
      >
        <nav className="w-full max-w-7xl mx-auto px-6 grid grid-cols-12 items-center h-full">
          
          {/* Logo / Left-aligned brand markup in Playfair Display */}
          <div className="col-span-4 lg:col-span-2 flex items-center h-full">
            <button 
              onClick={() => { setActiveTab('Shop'); setSelectedCategory('All'); }}
              className="font-playfair text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white cursor-pointer hover:opacity-90 active:scale-95 transition-transform"
            >
              F&V<span className="text-[var(--color-accent)] animate-pulse">.</span>
            </button>
          </div>

          {/* Desktop Central Navigation Links */}
          <ul className="hidden lg:flex col-span-8 justify-center items-center h-full gap-8">
            {(['Shop', 'Collections', 'Lookbook', 'About', 'Sale'] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab} className="h-full flex items-center">
                  <button
                    onClick={() => {
                      if (tab === 'Sale') {
                        setActiveTab('Shop');
                        setSelectedCategory('All');
                        setSortBy('price-low');
                        triggerToast("Applied direct Sale sort. Premium items under MSRP.", "info");
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                    className={`h-full flex items-center justify-center text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 px-1 border-b-2 cursor-pointer 
                      hover:text-[var(--color-accent)] hover:tracking-[0.25em]
                      ${isActive 
                        ? 'text-brand-white border-[var(--color-accent)]' 
                        : 'text-brand-white/70 border-transparent hover:border-brand-white/20'}`}
                  >
                    {tab}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right Utilitarian Icons */}
          <div className="col-span-8 lg:col-span-2 flex items-center justify-end gap-3 sm:gap-5 h-full">
            
            {/* Live Search Trigger */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-1 cursor-pointer text-white hover:text-[var(--color-accent)] transition-colors duration-200"
              title="Search Products"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Link & Counter badge */}
            <button 
              onClick={() => setWishlistOpen(true)}
              className="p-1 cursor-pointer text-white hover:text-[var(--color-accent)] transition-colors duration-200 relative"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold tracking-normal animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Currency Selector Dropdown Pill */}
            <div className="relative group/curr flex items-center h-full">
              <button 
                className="bg-zinc-900 border border-zinc-700/80 hover:border-[var(--color-accent)] text-[12px] font-medium text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 cursor-pointer transition-all duration-300"
                title="Select Currency"
              >
                <span>{currencyOptions.find(o => o.code === currency)?.flag}</span>
                <span className="font-bold font-mono tracking-wider">{currency}</span>
                <span className="text-[8px] opacity-60">▼</span>
              </button>
              
              {/* Dropdown Menu (smooth fadeIn animation) */}
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-black border border-zinc-850 rounded shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/curr:opacity-100 group-hover/curr:scale-100 group-hover/curr:pointer-events-auto transition-all duration-200 z-50 text-left overflow-hidden">
                {currencyOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => handleCurrencyChange(opt.code)}
                    className={`w-full text-left px-3 py-2 text-[11px] font-mono tracking-wider flex items-center justify-between hover:bg-zinc-900 text-white cursor-pointer transition-colors
                      ${currency === opt.code ? 'bg-zinc-900 text-[var(--color-accent)] font-bold' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{opt.flag}</span>
                      <span>{opt.code}</span>
                    </div>
                    <span className="opacity-70">{opt.symbol}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bag Cart Link & Count badge (Pulses on addition) */}
            <button 
              onClick={() => setCartOpen(true)}
              className={`p-1.5 border border-brand-white/10 hover:border-[var(--color-accent)] rounded-full px-3 py-1 flex items-center gap-1.5 cursor-pointer transition-all duration-300 bg-brand-white/5 hover:bg-brand-white/10
                ${pulseCart ? 'animate-cartPulse border-[var(--color-accent)] bg-[var(--color-accent)]/20' : ''}`}
              title="View Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline text-white">Bag</span>
              <span className="bg-brand-white text-brand-black rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                {cart.reduce((count, item) => count + item.quantity, 0)}
              </span>
            </button>

            {/* Mobile Hamburger Drawer Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-full cursor-pointer text-white hover:text-[var(--color-accent)] transition-all"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* FULL-SCREEN NAVIGATION OVERLAY (Mobile Staggered Menu) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 text-brand-white flex flex-col justify-between p-8 animate-fade-in select-none">
          <div className="flex items-center justify-between border-b border-brand-white/10 pb-6">
            <span className="font-playfair text-2xl font-bold tracking-tight text-white">F&V.</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-brand-white/10 rounded-full transition-colors cursor-pointer text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <ul className="space-y-8 my-auto text-left py-12">
            {(['Shop', 'Collections', 'Lookbook', 'About', 'Sale'] as const).map((tab, idx) => {
              const isActive = activeTab === tab;
              return (
                <li 
                  key={tab}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className="animate-fadeInRight opacity-0"
                >
                  <button
                    onClick={() => {
                      if (tab === 'Sale') {
                        setActiveTab('Shop');
                        setSelectedCategory('All');
                        setSortBy('price-low');
                      } else {
                        setActiveTab(tab);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`text-4xl font-serif italic tracking-tight hover:text-[var(--color-accent)] transition-all duration-300 block cursor-pointer text-left w-full hover:translate-x-2 transform
                      ${isActive ? 'text-[var(--color-accent)]' : 'text-white'}`}
                  >
                    {tab}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-brand-white/10 pt-6 text-xs text-brand-white/50 uppercase tracking-widest space-y-4">
            <div className="flex justify-between">
              <span>ESTABLISHED 2024</span>
              <span>ACCRA / GHANA</span>
            </div>
            <div className="flex gap-4">
              <a href="#" className="underline hover:text-brand-white">INSTAGRAM</a>
              <a href="#" className="underline hover:text-brand-white">TIKTOK</a>
              <a href="#" className="underline hover:text-brand-white">STYLING ASSIST</a>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH SYSTEM OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 bg-brand-black/90 backdrop-blur-md z-50 flex flex-col justify-start animate-fade-in select-none">
          <div className="w-full max-w-3xl mx-auto px-6 pt-16">
            
            <div className="flex items-center justify-between border-b-2 border-brand-white/20 pb-4">
              <div className="flex items-center gap-3 w-full">
                <Search className="w-6 h-6 text-brand-white/50" />
                <input 
                  type="text"
                  placeholder="SEARCH GARMENTS, TEXTURES, ESSENTIALS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-brand-white text-xl md:text-2xl font-bold tracking-widest uppercase outline-none placeholder-brand-white/30 border-none w-full focus:ring-0"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => {
                  setSearchOpen(false);
                  // Query remains intact for simple tab check, but clean query on close
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-brand-white/10 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-6 h-6 text-brand-white" />
              </button>
            </div>

            {/* Quick Keywords Tags */}
            <div className="mt-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-white/50 block mb-3">Trending Searches:</span>
              <div className="flex flex-wrap gap-2.5">
                {['Cobalt', 'Terry Hoodie', 'Cargo', 'Beanie', 'Heavy Tee'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchQuery(keyword)}
                    className="border border-brand-white/20 hover:border-brand-cobalt text-brand-white hover:text-brand-white px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 bg-brand-white/5 hover:bg-brand-cobalt/20"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Search Results matches inside Overlay */}
            <div className="mt-12 overflow-y-auto max-h-[60vh] space-y-4 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-white/50 block border-b border-brand-white/10 pb-2">
                Matched Pieces ({globalSearchProducts.length})
              </span>
              
              {globalSearchProducts.length === 0 ? (
                <div className="text-center py-12 text-brand-white/40">
                  <AlertCircle className="w-10 h-10 mx-auto stroke-1 mb-3 bg-white/5 p-2 rounded-full" />
                  <p className="text-xs uppercase tracking-widest">No garments matching "{searchQuery}" located.</p>
                </div>
              ) : (
                globalSearchProducts.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setSearchOpen(false);
                      openProductDetail(p);
                    }}
                    className="flex gap-4 p-2 bg-brand-white/5 hover:bg-brand-cobalt/10 border border-brand-white/5 hover:border-brand-cobalt/30 transition-all duration-200 cursor-pointer"
                  >
                    <img 
                      src={p.images[0]} 
                      alt={p.name}
                      className="w-14 h-18 object-cover object-top shrink-0 bg-brand-gray"
                    />
                    <div className="flex flex-col justify-between py-1 text-left">
                      <div>
                        <span className="text-[9px] bg-brand-cobalt text-white font-bold tracking-widest px-2 py-0.5 uppercase mb-1 inline-block">
                          {p.category}
                        </span>
                        <h4 className="text-sm font-bold text-brand-white leading-tight">{p.name}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.salePrice ? (
                          <>
                            <span className="text-xs text-brand-red font-bold" data-price-usd={p.salePrice.toString()}>{formatPrice(p.salePrice)}</span>
                            <span className="text-[10px] text-brand-white/40 line-through" data-price-usd={p.price.toString()}>{formatPrice(p.price)}</span>
                          </>
                        ) : (
                          <span className="text-xs text-brand-white font-semibold" data-price-usd={p.price.toString()}>{formatPrice(p.price)}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center pr-4">
                      <ChevronRight className="w-4 h-4 text-brand-white/40 group-hover:text-brand-cobalt" />
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* CORE VIEWPORT CONTENT AND ROUTING */}
      <main className="flex-1 w-full text-left">
        
        {/* VIEW 1: ABOUT (BRAND PHILOSOPHY & CRAFTSMANSHIP) */}
        {activeTab === 'About' && (
          <section className="animate-fade-in max-w-5xl mx-auto px-6 py-12 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Left text column */}
              <div className="md:col-span-7 space-y-6">
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-brand-cobalt">F&V Brand Narrative</span>
                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-tight">
                  Forged in Accra, Refined for High-End Street Living
                </h1>
                <p className="text-brand-gray text-sm md:text-base leading-relaxed">
                  F&V closet was founded with a direct mandate: eliminate the noise. Streetwear shouldn't feel disposable or over-branded. It should represent precise, editorial sculpture on the human form.
                </p>
                <p className="text-brand-gray text-sm leading-relaxed">
                  We customize knit custom loopback yarn, manufacture ultra-high-density loops of 500GSM French Terry, and apply natural pre-wash shrinkage patterns. Every single silhouette is carefully drafted in Japanese ripstop or organic textiles designed to resist deformation across generations of wearing.
                </p>
                
                {/* Visual stats grid to support brand positioning (CRO improvement) */}
                <div className="grid grid-cols-3 gap-4 border-t border-brand-gray-light pt-8 mt-12">
                  <div>
                    <span className="text-3xl font-display font-black block">500G</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-bold">Max Terry Weight</span>
                  </div>
                  <div>
                    <span className="text-3xl font-display font-black block">100%</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-bold">Organic Cotton</span>
                  </div>
                  <div>
                    <span className="text-3xl font-display font-black block">150pc</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#71717A] font-bold">Strict Batch Limits</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab('Shop')}
                  className="bg-brand-black text-brand-white hover:bg-brand-cobalt px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] transition-colors duration-300 flex items-center gap-3"
                >
                  Explore Current Drop
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right decorative image panel */}
              <div className="md:col-span-5 relative">
                <div className="absolute inset-0 border-2 border-brand-cobalt translate-x-3 translate-y-3 z-0"></div>
                <img 
                  src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1000"
                  alt="Craftsmanship photoshoot"
                  className="w-full aspect-[3/4] object-cover bg-brand-gray-light relative z-10 filter grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl"
                />
                <div className="absolute top-4 right-4 z-20 bg-brand-black text-brand-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                  Editorial No. 04
                </div>
              </div>

            </div>
          </section>
        )}

        {/* VIEW 2: COLLECTIONS (SEASONAL EDITORIAL SERIES) */}
        {activeTab === 'Collections' && (
          <section className="animate-fade-in py-12 px-6 max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-cobalt">Editorial Series</span>
              <h1 className="text-5xl font-serif italic tracking-tight">Systematic Streetwear Archives</h1>
              <p className="text-brand-gray text-sm">
                Each collection operates as an independent, modular study in architectural fit, density, and monochromatic focus blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              
              {/* Collection Card 1 */}
              <div className="group relative overflow-hidden bg-brand-offwhite p-12 flex flex-col justify-between aspect-[4/3] border border-brand-gray-light hover:border-brand-cobalt transition-all duration-300">
                <div className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity mix-blend-multiply duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000')" }} />
                <div className="z-10">
                  <span className="text-[10px] font-bold text-brand-cobalt uppercase tracking-[0.2em] mb-2 block">Available Archive Drop</span>
                  <h3 className="text-4xl font-serif italic tracking-tight mb-2">SS24: The Modern Uniform</h3>
                  <p className="text-xs text-brand-gray max-w-xs uppercase tracking-wider leading-relaxed">
                    Heavy brushweights, seamless side structural blocks, featuring our signature cobalt blue stitchwork.
                  </p>
                </div>
                <div className="z-15 mt-8 flex justify-between items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest border-b border-brand-black pb-1">
                    6 Modular Pieces
                  </span>
                  <button 
                    onClick={() => {
                      setActiveTab('Shop');
                      setSelectedCategory('All');
                    }}
                    className="bg-brand-black text-brand-white group-hover:bg-brand-cobalt w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Collection Card 2 */}
              <div className="group relative overflow-hidden bg-brand-gray-dark text-brand-white p-12 flex flex-col justify-between aspect-[4/3] border border-brand-black/25 hover:border-brand-cobalt transition-all duration-300">
                <div className="absolute inset-0 bg-cover bg-center opacity-15 group-hover:opacity-30 transition-opacity mix-blend-screen duration-500" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000')" }} />
                <div className="z-10">
                  <span className="text-[10px] font-bold text-brand-cobalt-light uppercase tracking-[0.2em] mb-2 block">Released Nov 2025</span>
                  <h3 className="text-4xl font-serif italic tracking-tight mb-2 text-brand-white">AW25: Articulated Tech Tactics</h3>
                  <p className="text-xs text-brand-white/60 max-w-xs uppercase tracking-wider leading-relaxed">
                    Tear-resistant cotton-ripstop matrix weaves, Cordura modules, and fully micro-adjustable strap rigs.
                  </p>
                </div>
                <div className="z-15 mt-8 flex justify-between items-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-white/80 border-b border-brand-white pb-1">
                    Active Streetwear Drops
                  </span>
                  <button 
                    onClick={() => {
                      setActiveTab('Shop');
                      setSelectedCategory('All');
                    }}
                    className="bg-brand-white text-brand-black group-hover:bg-brand-cobalt-light w-12 h-12 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5 text-brand-black" />
                  </button>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* VIEW 3: LOOKBOOK (THE COBALT HEAVYWEIGHT BUNDLE BUILDER & INTERACTIVE OUTFITTING STYLE) */}
        {activeTab === 'Lookbook' && (
          <section className="animate-fade-in max-w-7xl mx-auto px-6 py-12">
            
            {/* Header section */}
            <div className="border-b border-brand-gray-light pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 text-left">
                <span className="inline-block px-3.5 py-1 bg-brand-cobalt text-white text-[10px] font-bold uppercase tracking-[0.2em]">Drop 01 / Cobalt Silhouette</span>
                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-tight">
                  The Curated<br/>Cobalt Offset Outfit
                </h1>
                <p className="max-w-md text-sm text-brand-gray leading-relaxed pt-2">
                  An editorial-grade layout compiled by our styling directors. Purchasing the signature outfit rewards you with a limited 15% discount auto-applied at bag.
                </p>
              </div>

              {/* Bundle pricing panel */}
              <div className="p-6 bg-brand-offwhite border border-brand-gray-light text-left space-y-4 min-w-[280px]">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray">Bundle Price (3 Pcs)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-brand-cobalt" data-price-usd="276.25">{formatPrice(276.25)}</span>
                    <span className="text-xs text-brand-gray line-through font-medium" data-price-usd="325">{formatPrice(325)}</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddLookbookBundle}
                  className="w-full bg-brand-cobalt text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-cobalt-dark transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add Complete Look To Bag
                </button>
                <div className="text-[9px] uppercase tracking-wider text-brand-gray text-center block">
                  includes auto code: <span className="font-bold text-brand-black">LOOKBOOK15</span>
                </div>
              </div>
            </div>

            {/* Split Screen showing active outfits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Product list styling controls (Sizes picker) */}
              <div className="lg:col-span-4 space-y-8 text-left order-2 lg:order-1">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-cobalt pb-2 border-b border-brand-gray-light">
                  Tailor Bundle Garment Sizes
                </h3>

                {/* Piece 1: M-1 French Terry block */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider">1. M-1 Terry Hoodie</span>
                    <span className="font-semibold text-brand-cobalt font-serif italic" data-price-usd="135">{formatPrice(135)}</span>
                  </div>
                  <div className="flex gap-2">
                    {['S', 'M', 'L', 'XL'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setLookbookSelectedSize(prev => ({...prev, 'tf-001': sz}))}
                        className={`text-xs py-1.5 px-3 border transition-all duration-200
                          ${lookbookSelectedSize['tf-001'] === sz ? 'bg-brand-black text-white border-brand-black' : 'border-brand-gray-light hover:border-brand-black'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Piece 2: Type II Tacticals */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider">2. Type-II Tactical Cargo</span>
                    <span className="font-semibold text-brand-cobalt font-serif italic" data-price-usd="145">{formatPrice(145)}</span>
                  </div>
                  <div className="flex gap-2">
                    {['30', '32', '34', '36'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setLookbookSelectedSize(prev => ({...prev, 'tf-002': sz}))}
                        className={`text-xs py-1.5 px-3 border transition-all duration-200
                          ${lookbookSelectedSize['tf-002'] === sz ? 'bg-brand-black text-white border-brand-black' : 'border-brand-gray-light hover:border-brand-black'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Piece 3: Raw Gauge Beanie */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider">3. Raw Gauge Knit Beanie</span>
                    <span className="font-semibold text-brand-cobalt font-serif italic" data-price-usd="45">{formatPrice(45)}</span>
                  </div>
                  <div className="flex gap-2">
                    {['One Size'].map(sz => (
                      <button 
                        key={sz}
                        onClick={() => setLookbookSelectedSize(prev => ({...prev, 'tf-005': sz}))}
                        className="text-xs py-1.5 px-3 border border-brand-black bg-brand-black text-white"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Stylist Advice block (CRO improvement) */}
                <div className="p-5 border border-brand-cobalt/25 bg-brand-cobalt/[0.02] text-xs leading-relaxed space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-cobalt" />
                    <span className="font-bold uppercase tracking-widest text-brand-cobalt">Styling Note / System Block</span>
                  </div>
                  <p className="text-brand-gray">
                    The extreme depth of the cobalt heavy terry creates a dynamic contrast when pairing with the dense tactical black cargos. Fold or pull the ankles tight with adjusted velcro to stack custom sneakers seamlessly. Sits comfortably at high ear crown levels.
                  </p>
                </div>
              </div>

              {/* Splendid visual hero images for lookbook */}
              <div className="lg:col-span-8 grid grid-cols-2 gap-4 order-1 lg:order-2">
                <div className="relative overflow-hidden group aspect-[3/4] bg-brand-offwhite">
                  <img 
                    src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
                    alt="Hoodie Cobalt styling look"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter saturate-[0.9]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 text-brand-white text-left">
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-80 font-bold">Styling Model A</span>
                    <p className="text-xs uppercase tracking-widest font-bold">M-1 Heavy French Terry</p>
                  </div>
                </div>

                <div className="relative overflow-hidden group aspect-[3/4] bg-brand-offwhite">
                  <img 
                    src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000"
                    alt="Tacticals cargos styling look"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filters saturate-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 text-brand-white text-left">
                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-80 font-bold">Styling Model B</span>
                    <p className="text-xs uppercase tracking-widest font-bold">Tactical Articulated ripstop</p>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* VIEW 4: DEFAULT SHOP VIEWS AND PRODUCT GRIDS */}
        {activeTab === 'Shop' && (
          <>
            {/* HIGH-IMPACT HERO VIEW (Split Layout Option A) */}
            <section className="relative w-full min-h-[calc(100svh-56px)] md:h-[calc(100svh-64px)] grid grid-cols-1 md:grid-cols-10 bg-black text-white select-none overflow-hidden">
              
              {/* Left Column: Full-Bleed Editorial Placeholder with Ken Burns Zoom Effect */}
              <div className="col-span-1 md:col-span-6 h-[50vh] md:h-full relative overflow-hidden bg-zinc-950 border-r border-brand-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 animate-kenburns" />
                
                {/* Visual grid accent block (minimalist layout) */}
                <div className="absolute inset-x-8 top-8 bottom-8 border border-white/5 pointer-events-none" />
                <div className="absolute left-10 top-10 text-[9px] text-white/40 uppercase tracking-[0.4em] font-mono hidden md:block">
                  F&V Release SS26 / VOL. 01
                </div>

                {/* Ambient dark visual overlays */}
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-radial-at-t from-transparent via-black/30 to-black/80" />
                
                {/* Centered Text Graphic placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-playfair text-xl md:text-2xl tracking-[0.4em] text-white/50 uppercase font-medium">
                    HERO IMAGE
                  </span>
                  <div className="w-16 h-[1px] bg-white/20 mt-3" />
                  <span className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase mt-2 font-mono">
                    EDITORIAL SHOT
                  </span>
                </div>
              </div>

              {/* Right Column: Premium Content Panel on Deep Black Background */}
              <div className="col-span-1 md:col-span-4 h-auto md:h-full bg-black flex flex-col justify-center px-8 py-12 md:py-10 sm:px-12 md:px-16 space-y-6 lg:space-y-8 relative overflow-y-auto">
                
                {/* Eyebrow - Small caps, accent color, space tracking */}
                <div className="animate-hero-eyebrow space-y-2">
                  <span className="text-[var(--color-accent)] font-bold text-xs uppercase tracking-[0.2em] sm:text-[13px]">
                    NEW COLLECTION — SS26
                  </span>
                </div>

                {/* Headline - Playfair Display, white */}
                <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl xl:text-[72px] leading-[1.05] text-white font-bold tracking-tight animate-hero-headline">
                  Wear What<br/>
                  You Stand For
                </h1>

                {/* Subhead - DM Sans, 18px, mid-gray */}
                <p className="font-dmsans text-[17px] sm:text-lg text-[var(--color-mid-gray)] leading-relaxed animate-hero-subhead max-w-lg">
                  Premium streetwear for those who move with intention.
                </p>

                {/* Staggered Full-width/Aesthetic Call to Actions */}
                <div className="space-y-4 pt-2 animate-hero-ctas">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      const el = document.getElementById('shop-listing');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full bg-[var(--color-accent)] hover:bg-white text-white hover:text-black font-bold text-xs sm:text-sm uppercase tracking-[0.3em] py-4.5 px-6 transition-all duration-300 cursor-pointer shadow-xl text-center outline-none border border-transparent hover:border-white"
                  >
                    Shop Collection
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Lookbook');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.3em] py-4.5 px-6 transition-all duration-300 cursor-pointer text-center outline-none"
                  >
                    View Lookbook
                  </button>
                </div>

                {/* Social Proof badge */}
                <div className="pt-2 text-center md:text-left animate-hero-ctas">
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                    <span className="text-yellow-500">★★★★★</span>
                    <span>Worn by 12,000+ customers</span>
                  </p>
                </div>

              </div>

            </section>

            {/* Social Proof / Trust Signals Bar */}
            <TrustBar formatPrice={formatPrice} />

            {/* Featured Categories Grid Section */}
            <FeaturedCategories onSelectCategory={setSelectedCategory} setSortBy={setSortBy} />

            {/* Best Sellers Grid Section */}
            <BestSellers 
              wishlist={wishlist} 
              onToggleWishlist={toggleWishlist} 
              onAddToCart={handleAddToCart} 
              formatPrice={formatPrice}
            />

            {/* Lookbook Editorial Teaser Section */}
            <LookbookTeaser 
              onViewLookbook={() => {
                setActiveTab('Lookbook');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />

            {/* User Generated Content / Instagram Feed Section */}
            <InstagramFeed />

            {/* SHOP LISTING CONTAINER (Filter bar, sort, matching layout) */}
            <section id="shop-listing" className="max-w-7xl mx-auto px-6 py-16 scroll-mt-20">
              
              {/* Category buttons and Sort selectors */}
              <div className="pb-8 border-b border-brand-gray-light flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                
                {/* Scrollable categories rail */}
                <div className="flex items-center gap-1 overflow-x-auto pb-3 md:pb-0 scrollbar-none">
                  {['All', 'Hoodies', 'Pants', 'Tees', 'Outerwear', 'Accessories'].map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 border transition-all duration-300 shrink-0 cursor-pointer
                          ${isSelected 
                            ? 'bg-brand-black text-brand-white border-brand-black' 
                            : 'bg-brand-white text-brand-black border-brand-black/15 hover:border-brand-black'}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Sort selector dropdown */}
                <div className="flex items-center justify-end gap-3 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gray flex items-center gap-1.5 leading-none">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Sort By:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-brand-white/85 border border-brand-black/15 text-xs font-bold uppercase tracking-wider px-3 py-1.5 focus:outline-none focus:border-brand-cobalt cursor-pointer"
                  >
                    <option value="featured">Featured Drop</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Reviews Rating</option>
                  </select>
                </div>

              </div>

              {/* Dynamic products list counts */}
              <div className="py-4 text-xs font-bold text-brand-gray uppercase tracking-widest flex justify-between items-center">
                <span>Displaying {sortedProducts.length} Premium Pieces</span>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="underline text-brand-black hover:text-brand-cobalt font-semibold lowercase tracking-tight"
                  >
                    Reset category filters
                  </button>
                )}
              </div>

              {/* PRODUCTS LIST GRID DISPLAY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 mt-4">
                {sortedProducts.map((p) => {
                  const isInWish = wishlist.includes(p.id);
                  return (
                    <div 
                      key={p.id}
                      className="group flex flex-col text-left space-y-4 border-b border-brand-black/5 pb-8 relative"
                    >
                      {/* Interactive Dual Hover Images wrapper */}
                      <div className="w-full aspect-[3/4] overflow-hidden bg-brand-offwhite relative">
                        
                        {/* Status Label tags ('sale', 'new', 'limited') */}
                        {p.status && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 text-white shadow
                              ${p.status === 'new' ? 'bg-brand-cobalt' : ''}
                              ${p.status === 'limited' ? 'bg-brand-black border border-brand-white/30' : ''}
                              ${p.status === 'sale' ? 'bg-brand-red' : ''}`}
                            >
                              {p.status}
                            </span>
                          </div>
                        )}

                        {/* Custom instant size floating tag */}
                        <div className="absolute bottom-3 left-3 right-3 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-brand-black/85 text-brand-white p-3 text-center flex flex-col gap-1.5">
                          <span className="text-[8px] font-bold text-brand-white/60 uppercase tracking-widest block">Available Sizes</span>
                          <div className="flex justify-center gap-1.5">
                            {p.sizes.map(sz => (
                              <span key={sz} className="text-[10px] uppercase font-bold text-brand-white px-1.5 hover:text-brand-cobalt-light transition-colors">{sz}</span>
                            ))}
                          </div>
                        </div>

                        {/* Dual Images (Hover swap effect) */}
                        <img 
                          src={p.images[0]} 
                          alt={p.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-0 absolute inset-0 z-0 bg-brand-offwhite"
                        />
                        <img 
                          src={p.images[1] || p.images[0]} 
                          alt={`${p.name} alternate view`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-0 group-hover:opacity-100 absolute inset-0 z-1 bg-brand-offwhite"
                        />

                        {/* Interactive Wishlist Heart overlay */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p.id, p.name);
                          }}
                          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-brand-white/95 text-brand-black hover:text-brand-cobalt-dark shadow flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                          title="Heart to Wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isInWish ? 'fill-brand-cobalt text-brand-cobalt' : 'text-brand-black'}`} />
                        </button>

                        {/* Quick View Over-trigger button */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <span className="bg-brand-white text-brand-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-brand-black shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto cursor-pointer"
                                onClick={() => openProductDetail(p)}>
                            Measure & Acquire
                          </span>
                        </div>
                      </div>

                      {/* Content Section below card */}
                      <div className="space-y-2 select-none text-left">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[10px] font-bold text-brand-cobalt uppercase tracking-[0.2em]">{p.category}</span>
                          
                          {/* Rating and review counter inline links */}
                          <div className="flex items-center gap-0.5 text-yellow-500">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            <span className="text-[10px] font-bold text-brand-black">{p.rating}</span>
                            <span className="text-[9px] text-brand-gray lowercase font-normal">({p.reviewsCount} reviews)</span>
                          </div>
                        </div>

                        <h3 
                          onClick={() => openProductDetail(p)}
                          className="text-base font-bold tracking-tight text-brand-black cursor-pointer hover:text-brand-cobalt transition-colors inline-block line-clamp-1"
                        >
                          {p.name}
                        </h3>

                        {/* Sizing, Fit Description and stock tracker */}
                        <p className="text-[11px] text-brand-gray leading-normal tracking-wide line-clamp-2">
                          {p.fitDescription}
                        </p>

                        {/* Brand color dot previewers info (CRO) */}
                        <div className="flex items-center gap-1 py-1">
                          <span className="text-[9px] uppercase tracking-widest text-[#71717A] pr-1">Color Block:</span>
                          {p.colors.map(col => (
                            <span 
                              key={col.name} 
                              style={{ backgroundColor: col.hex }} 
                              title={col.name}
                              className="w-2.5 h-2.5 rounded-full border border-black/15 block"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-brand-black/5">
                          {/* Price Tag values display */}
                          <div className="flex items-baseline gap-2">
                            {p.salePrice ? (
                              <>
                                <span className="text-base font-black text-brand-red" data-price-usd={p.salePrice.toString()}>{formatPrice(p.salePrice)}</span>
                                <span className="text-xs text-brand-gray line-through font-medium" data-price-usd={p.price.toString()}>{formatPrice(p.price)}</span>
                              </>
                            ) : (
                              <span className="text-base font-black text-brand-black" data-price-usd={p.price.toString()}>{formatPrice(p.price)}</span>
                            )}
                          </div>

                          {/* Stock alert warning */}
                          {p.stockCount <= 8 && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red animate-pulse">
                              Only {p.stockCount} Left
                            </span>
                          )}
                        </div>

                        {/* Interactive direct button add */}
                        <button
                          onClick={() => handleAddToCart(p, p.sizes[0], p.colors[0])}
                          className="w-full bg-brand-white hover:bg-brand-cobalt hover:text-white text-brand-black py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] border border-brand-black/20 hover:border-brand-cobalt transition-colors duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Acquire Size {p.sizes[0]}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </section>

            {/* High-converting Email Capture / Newsletter Section */}
            <Newsletter />
          </>
        )}

      </main>

      {/* BRAND NEW DETAILED SITE FOOTER */}
      <SiteFooter 
        onNavigate={(tab) => {
          setActiveTab(tab as any);
        }}
        onSelectCategory={setSelectedCategory}
        triggerToast={triggerToast}
      />

      {/* SLIDING REGISTERED CART BAG DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 select-none flex justify-end">
          {/* Dimmed Background */}
          <div 
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer contents */}
          <div className="relative w-full max-w-md bg-brand-white text-brand-black h-full shadow-2xl flex flex-col animate-[slideLeft_0.35s_cubic-bezier(0.25,1,0.5,1)_both]">
            
            {/* Header block */}
            <div className="p-6 border-b border-brand-gray-light flex justify-between items-center bg-brand-black text-brand-white pb-6">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-brand-cobalt-light" />
                <h2 className="text-sm font-bold uppercase tracking-widest">Shopping Bag Items</h2>
                <span className="bg-brand-cobalt text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((count, item) => count + item.quantity, 0)}
                </span>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-1 hover:bg-brand-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-brand-white" />
              </button>
            </div>

            {/* Free Shipping Tracker Bar (CRO element) */}
            <div className="bg-brand-offwhite p-4 border-b border-brand-gray-light text-left text-xs">
              <div className="flex justify-between items-center mb-2 font-bold uppercase tracking-wider text-[10px]">
                {subtotal >= threshold ? (
                  <span className="text-brand-cobalt flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    CONGRATS! FREE STANDARD SHIPPING ACQUIRED
                  </span>
                ) : (
                  <span className="text-brand-gray">
                    ADD <span className="text-brand-black font-extrabold" data-price-usd={(threshold - subtotal).toString()}>{formatPrice(threshold - subtotal)}</span> MORE FOR FREE SHIPPING
                  </span>
                )}
                <span><span data-price-usd={subtotal.toString()}>{formatPrice(subtotal)}</span> / <span data-price-usd={threshold.toString()}>{formatPrice(threshold)}</span></span>
              </div>
              
              {/* Colored progress bar */}
              <div className="w-full bg-brand-gray-light h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }}
                  className="bg-brand-cobalt h-full transition-all duration-500 ease-out"
                />
              </div>
            </div>

            {/* Cart scrollable items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-brand-gray max-w-xs mx-auto space-y-4">
                  <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-brand-gray-light" />
                  <p className="text-xs uppercase tracking-widest font-bold">Your shopping bag is empty.</p>
                  <button 
                    onClick={() => {
                      setCartOpen(false);
                      setActiveTab('Shop');
                    }}
                    className="text-xs font-bold text-brand-cobalt uppercase tracking-widest underline cursor-pointer"
                  >
                    Acquire Garments Now
                  </button>
                </div>
              ) : (
                cart.map((item, index) => {
                  const price = item.product.salePrice || item.product.price;
                  return (
                    <div 
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                      className="flex gap-4 p-3 bg-brand-offwhite/50 border border-brand-gray-light/60 hover:border-brand-cobalt/35 transition-colors relative"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-16 h-22 object-cover object-top shrink-0 bg-brand-gray-light"
                      />
                      <div className="flex flex-col justify-between py-0.5 text-left w-full">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-extrabold text-brand-black line-clamp-1">{item.product.name}</h4>
                            <button 
                              onClick={() => {
                                setCart(prev => prev.filter((_, i) => i !== index));
                                triggerToast(`Removed ${item.product.name} from bag.`, 'info');
                              }}
                              className="text-brand-gray hover:text-brand-red p-1 transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          {/* Sizing labels block */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[9px] bg-brand-black text-white px-2 py-0.5 font-bold uppercase">
                              Size: {item.selectedSize}
                            </span>
                            <span 
                              style={{ backgroundColor: item.selectedColor.hex }}
                              title={item.selectedColor.name}
                              className="w-3.5 h-3.5 rounded-full border border-black/15 flex items-center justify-center shrink-0"
                            />
                            <span className="text-[9px] text-brand-gray block uppercase tracking-wider">
                              {item.selectedColor.name}
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Price controllers */}
                        <div className="flex items-center justify-between mt-3.5">
                          <div className="flex items-center border border-brand-black/15 bg-brand-white">
                            <button 
                              onClick={() => {
                                setCart(prev => {
                                  if (item.quantity === 1) {
                                    return prev.filter((_, i) => i !== index);
                                  }
                                  const updated = [...prev];
                                  updated[index].quantity -= 1;
                                  return updated;
                                });
                              }}
                              className="p-1 px-2.5 hover:bg-brand-offwhite text-brand-black cursor-pointer text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold px-2 text-brand-black">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                setCart(prev => {
                                  const updated = [...prev];
                                  updated[index].quantity += 1;
                                  return updated;
                                });
                              }}
                              className="p-1 px-2.5 hover:bg-brand-offwhite text-brand-black cursor-pointer text-xs"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-black text-brand-cobalt" data-price-usd={(price * item.quantity).toString()}>{formatPrice(price * item.quantity)}</span>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Subtotal & Checkout actions (Only visible if items present) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-brand-gray-light bg-brand-offwhite space-y-4 text-left">
                
                {/* Applied Promo notice label */}
                {appliedPromo && (
                  <div className="flex justify-between items-center text-xs bg-brand-cobalt/10 border border-brand-cobalt/35 p-2 text-brand-black uppercase font-bold tracking-wider">
                    <span className="flex items-center gap-1.5 text-[10px]">
                      <Tag className="w-3.5 h-3.5 text-brand-cobalt" />
                      Promo code active: {appliedPromo.code} ({appliedPromo.value}{appliedPromo.type === 'percent' ? '%' : '$'} OFF)
                    </span>
                    <button 
                      onClick={() => {
                        setAppliedPromo(null);
                        triggerToast('Promo code removed.', 'info');
                      }}
                      className="underline text-[10px] text-brand-red cursor-pointer"
                    >
                      remove
                    </button>
                  </div>
                )}

                {/* Apply promo code input widget */}
                {!appliedPromo && (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="PROMO CODE (E.G. TF10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="bg-brand-white border border-brand-black/15 px-3 py-2 text-xs uppercase font-bold tracking-widest outline-none focus:border-brand-cobalt flex-1 rounded-none"
                    />
                    <button 
                      type="submit"
                      className="bg-brand-black hover:bg-brand-cobalt text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-none"
                    >
                      Apply Code
                    </button>
                  </form>
                )}

                <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-brand-gray">
                  
                  <div className="flex justify-between text-brand-black">
                    <span>Valued Subtotal:</span>
                    <span className="font-black" data-price-usd={subtotal.toString()}>{formatPrice(subtotal)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-brand-red">
                      <span>Promo Discount:</span>
                      <span className="font-black">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-brand-black">
                    <span>Standard Shipping Cargo:</span>
                    <span className="font-extrabold">{shipping === 0 ? 'FREE SHIPPING' : <span data-price-usd={shipping.toString()}>{formatPrice(shipping)}</span>}</span>
                  </div>

                  <div className="border-t border-brand-gray-light pt-2 flex justify-between text-sm text-brand-black">
                    <span className="font-extrabold text-brand-black">Total Due Amount:</span>
                    <span className="text-lg font-black text-brand-cobalt" data-price-usd={total.toString()}>{formatPrice(total)}</span>
                  </div>

                </div>

                {/* Checkout complete flow popup or triggering switch */}
                {checkoutComplete ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500 text-xs text-brand-black text-center font-bold tracking-wider space-y-2">
                    <p className="text-brand-cobalt animate-bounce">âœ” ORDER DEPLOYED SUCCESSFULLY!</p>
                    <p className="text-[10px] text-brand-gray normal-case font-normal">Your custom serial confirmation tracking codes sent to email.</p>
                    <button 
                      onClick={() => {
                        setCheckoutComplete(false);
                        setCart([]);
                        setAppliedPromo(null);
                        setCartOpen(false);
                      }}
                      className="underline text-brand-black block mx-auto text-[10px] cursor-pointer"
                    >
                      Accept and Continue
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 space-y-2">
                    
                    {/* Simplified conversion shipping entries */}
                    <div className="p-4 bg-brand-white border border-brand-gray-light text-left space-y-3">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-[#71717A] block">Instant Shipping Details (Mock Secure)</span>
                      
                      <input 
                        type="text" 
                        placeholder="RECIPIENT FULL NAME*"
                        required
                        value={checkoutForm.fullName}
                        onChange={(e) => setCheckoutForm({...checkoutForm, fullName: e.target.value})}
                        className="w-full text-[10px] font-semibold border border-brand-black/10 px-2.5 py-1.5 uppercase tracking-wide tracking-widest outline-none bg-brand-offwhite focus:bg-brand-white focus:border-brand-cobalt rounded-none"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="email" 
                          placeholder="EMAIL ADDRESS*"
                          required
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                          className="w-full text-[10px] font-semibold border border-brand-black/10 px-2.5 py-1.5 uppercase tracking-normal outline-none bg-brand-offwhite focus:bg-brand-white focus:border-brand-cobalt rounded-none"
                        />
                        <input 
                          type="text" 
                          placeholder="SHIPPING ADDRESS*"
                          required
                          value={checkoutForm.address}
                          onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                          className="w-full text-[10px] font-semibold border border-brand-black/10 px-2.5 py-1.5 uppercase outline-none bg-brand-offwhite focus:bg-brand-white focus:border-brand-cobalt rounded-none"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        if (!checkoutForm.fullName.trim() || !checkoutForm.email.trim() || !checkoutForm.address.trim()) {
                          triggerToast('Please provide shipping parameters before deployment.', 'info');
                          return;
                        }
                        setCheckoutComplete(true);
                        triggerToast('Order confirmed! Generating invoice codes.', 'success');
                      }}
                      className="w-full bg-brand-cobalt hover:bg-brand-cobalt-dark text-white py-4.5 text-xs font-bold uppercase tracking-[0.25em] transition-colors duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      Deploy SECURE CHECKOUT
                    </button>
                    
                    <div className="flex items-center justify-center gap-1.5 text-brand-gray text-[9px] uppercase tracking-widest pt-2">
                      <Clock className="w-3 h-3 text-brand-cobalt" />
                      Secure 256-Bit P2P Street Matrix System
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* SLIDING REGISTERED WISHLIST DRAWER */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-50 select-none flex justify-end animate-fade-in">
          {/* Dimmed Background */}
          <div 
            onClick={() => setWishlistOpen(false)}
            className="absolute inset-0 bg-brand-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer contents */}
          <div className="relative w-full max-w-sm bg-brand-white text-brand-black h-full shadow-2xl flex flex-col animate-[slideLeft_0.3s_ease_both]">
            
            {/* Header block */}
            <div className="p-6 border-b border-brand-gray-light flex justify-between items-center bg-brand-black text-brand-white">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-cobalt-light fill-brand-cobalt-light" />
                <h2 className="text-sm font-bold uppercase tracking-widest">My Wishlist Items</h2>
                <span className="bg-brand-cobalt text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              </div>
              <button 
                onClick={() => setWishlistOpen(false)}
                className="p-1 hover:bg-brand-white/10 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-brand-white" />
              </button>
            </div>

            {/* List scrollable pieces */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {wishlist.length === 0 ? (
                <div className="text-center py-24 text-brand-gray max-w-xs mx-auto space-y-4">
                  <Heart className="w-12 h-12 mx-auto stroke-1 text-brand-gray-light" />
                  <p className="text-xs uppercase tracking-widest font-bold">Your wishlist is empty.</p>
                  <button 
                    onClick={() => {
                      setWishlistOpen(false);
                      setActiveTab('Shop');
                    }}
                    className="text-xs font-bold text-brand-cobalt uppercase tracking-widest underline cursor-pointer"
                  >
                    Acquire Street pieces
                  </button>
                </div>
              ) : (
                wishlist.map((id) => {
                  const p = PRODUCTS.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <div 
                      key={p.id}
                      className="flex gap-4 p-3 bg-brand-offwhite/50 border border-brand-gray-light/65 hover:border-brand-cobalt/35 transition-colors relative"
                    >
                      <img 
                        src={p.images[0]} 
                        alt={p.name}
                        className="w-14 h-18 object-cover object-top shrink-0 bg-brand-gray-light"
                      />
                      <div className="flex flex-col justify-between py-0.5 text-left w-full">
                        <div>
                          <h4 className="text-xs font-extrabold text-brand-black line-clamp-1">{p.name}</h4>
                          <span className="text-[9px] text-brand-cobalt uppercase tracking-widest block font-bold">
                            {p.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-black text-brand-black">
                            ${p.salePrice || p.price}
                          </span>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                handleAddToCart(p, p.sizes[0], p.colors[0]);
                                setWishlistOpen(false);
                              }}
                              className="bg-brand-black text-white hover:bg-brand-cobalt text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 cursor-pointer"
                            >
                              Add to Bag
                            </button>
                            <button 
                              onClick={() => toggleWishlist(p.id, p.name)}
                              className="text-brand-gray hover:text-brand-red p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-6 border-t border-brand-gray-light bg-brand-offwhite">
              <button 
                onClick={() => {
                  setWishlistOpen(false);
                  setActiveTab('Shop');
                }}
                className="w-full bg-brand-black text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-brand-cobalt transition-colors duration-200"
              >
                Keep Exploring Drop Pieces
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PERSISTENT FULL DETAILED PRODUCT SPEC SPECIFICATION SHEET MODAL (Quick dressing room) */}
      {selectedDetailProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto select-none flex items-center justify-center p-4">
          
          {/* Backdrop screen */}
          <div 
            onClick={() => setSelectedDetailProduct(null)}
            className="fixed inset-0 bg-brand-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative bg-brand-white text-brand-black w-full max-w-4xl mx-auto shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-[fadeInUp_0.4s_cubic-bezier(0.25,1,0.5,1)_both]">
            
            {/* Absolute Close Modal Control */}
            <button
              onClick={() => setSelectedDetailProduct(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-brand-black text-brand-white hover:bg-brand-cobalt flex items-center justify-center transition-all cursor-pointer shadow"
              title="Close Panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visual gallery Showcase */}
            <div className="md:col-span-6 bg-brand-offwhite flex flex-col justify-between relative overflow-hidden aspect-[4/5] md:aspect-auto">
              {/* Product Badge tag */}
              {selectedDetailProduct.status && (
                <span className="absolute top-4 left-4 z-20 bg-brand-cobalt text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 animate-pulse">
                  {selectedDetailProduct.status} Item
                </span>
              )}

              {/* Stacked Images loop with hover sizing triggers */}
              <div className="flex-1 overflow-y-auto scrollbar-none snap-y snap-mandatory h-80 md:h-[500px]">
                {selectedDetailProduct.images.map((img, index) => (
                  <div key={index} className="snap-start w-full h-full relative shrink-0">
                    <img 
                      src={img} 
                      alt={`Dressing model showcase view ${index + 1}`} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom horizontal instruction tag */}
              <div className="p-4 bg-brand-black text-brand-white/80 text-[9px] uppercase tracking-widest text-center">
                Scroll images to view technical fit and crop details
              </div>
            </div>

            {/* Right Column: Dynamic functional buying panel */}
            <div className="md:col-span-6 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px] text-left">
              
              <div className="space-y-6">
                
                {/* Product Title Category */}
                <div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-[10px] font-bold text-brand-cobalt uppercase tracking-[0.25em]">
                      {selectedDetailProduct.category} Catalog
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-yellow-500" />
                      <span className="text-xs font-bold text-brand-black">{selectedDetailProduct.rating}</span>
                      <span className="text-[10px] text-brand-gray lowercase">({selectedDetailProduct.reviewsCount} verified reviews)</span>
                    </div>
                  </div>

                  <h2 className="text-3xl font-serif italic tracking-tight leading-tight text-brand-black">
                    {selectedDetailProduct.name}
                  </h2>
                  
                  {/* Active Pricing tags */}
                  <div className="flex items-baseline gap-2.5 mt-2">
                    {selectedDetailProduct.salePrice ? (
                      <>
                        <span className="text-2xl font-black text-brand-red" data-price-usd={selectedDetailProduct.salePrice.toString()}>{formatPrice(selectedDetailProduct.salePrice)}</span>
                        <span className="text-sm text-brand-gray line-through font-medium" data-price-usd={selectedDetailProduct.price.toString()}>{formatPrice(selectedDetailProduct.price)}</span>
                        <span className="text-[10px] text-brand-red bg-brand-red/10 px-2 py-0.5 font-bold uppercase">
                          SAVE <span data-price-usd={(selectedDetailProduct.price - selectedDetailProduct.salePrice).toString()}>{formatPrice(selectedDetailProduct.price - selectedDetailProduct.salePrice)}</span>
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-black text-brand-black" data-price-usd={selectedDetailProduct.price.toString()}>{formatPrice(selectedDetailProduct.price)}</span>
                    )}
                  </div>
                </div>

                {/* Narrative description */}
                <p className="text-xs sm:text-sm text-brand-black/70 leading-relaxed">
                  {selectedDetailProduct.description}
                </p>

                {/* Sizing choosing blocks (Responsive CRO) */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end border-b border-brand-black/10 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
                    <span>Select Street Size</span>
                    <button 
                      onClick={() => triggerToast(`Standard ${selectedDetailProduct.category} sizes: true-to-fit body sizing bounds.`, 'info')}
                      className="underline text-brand-black tracking-tight cursor-pointer"
                    >
                      Measurement Guide
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {selectedDetailProduct.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 border text-xs font-bold transition-all duration-200 cursor-pointer
                          ${selectedSize === sz 
                            ? 'bg-brand-black text-brand-white border-brand-black' 
                            : 'border-brand-black/20 hover:border-brand-black text-brand-black bg-brand-white'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-[10px] font-bold text-brand-gray italic">
                    Fit Note: {selectedDetailProduct.fitDescription}
                  </p>
                </div>

                {/* Swatch color selection */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] block border-b border-brand-black/10 pb-1">
                    Choose Colourway Option
                  </span>
                  <div className="flex gap-2.5">
                    {selectedDetailProduct.colors.map((colorItem) => (
                      <button
                        key={colorItem.name}
                        onClick={() => setSelectedColor(colorItem)}
                        style={{ backgroundColor: colorItem.hex }}
                        title={colorItem.name}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform cursor-pointer hover:scale-110
                          ${selectedColor?.name === colorItem.name ? 'ring-2 ring-offset-2 ring-brand-cobalt border-transparent' : 'border-brand-black/25'}`}
                      >
                        {selectedColor?.name === colorItem.name && (
                          <Check className={`w-3.5 h-3.5 ${colorItem.hex === '#000000' ? 'text-white' : 'text-black'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-brand-black tracking-wider uppercase">
                    Currently Selected: <span className="text-brand-cobalt">{selectedColor?.name}</span>
                  </p>
                </div>

                {/* Material characteristics sheet tabs */}
                <div className="bg-brand-offwhite p-4 border border-brand-gray-light text-[10px] space-y-2">
                  <span className="font-extrabold uppercase tracking-widest text-brand-cobalt block">Materials & Origin Spec:</span>
                  <ul className="list-disc pl-4 space-y-1 text-brand-black/75">
                    {selectedDetailProduct.materialDetails.map((det, index) => (
                      <li key={index}>{det}</li>
                    ))}
                  </ul>
                  <span className="text-brand-gray italic block pt-1.5 border-t border-brand-black/5 leading-snug">
                    Care instruction: {selectedDetailProduct.careInstructions}
                  </span>
                </div>

                {/* REVIEWS INPUT FORM AND REAL SUBMISSIONS LIST */}
                <div className="space-y-4 border-t border-brand-black/10 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] block">
                    Garment Verified Feedback ({productReviews[selectedDetailProduct.id]?.length || 0})
                  </span>
                  
                  {/* Add Review inline form */}
                  <form onSubmit={(e) => handleAddReview(e, selectedDetailProduct.id)} className="space-y-2 bg-brand-offwhite p-3 border border-brand-black/10">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brand-black block">Write a garment feedback review</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text"
                        placeholder="YOUR NAME IN INITIALS"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="text-[9px] border p-1 uppercase outline-none bg-white font-semibold"
                        required
                      />
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-[9px] text-[#71717A] uppercase font-bold pr-1">Rating:</span>
                        {[1, 2, 3, 4, 5].map((st) => (
                          <button
                            type="button"
                            key={st}
                            onClick={() => setNewReviewRating(st)}
                            className="p-0.5 cursor-pointer"
                          >
                            <Star className={`w-3 h-3 ${newReviewRating >= st ? 'text-yellow-500 fill-yellow-500' : 'text-brand-gray'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      placeholder="DESCRIBE THE BRUSHWEIGHT TEXTURE, DRYING AND FIT POSTURE..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      rows={2}
                      className="w-full text-[9px] p-2 border uppercase outline-none bg-white font-medium"
                      required
                    />

                    <button 
                      type="submit"
                      className="w-full bg-brand-black text-white hover:bg-brand-cobalt py-1 text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Deploy Live Review Feedback
                    </button>
                  </form>

                  {/* Reviews lists */}
                  <div className="space-y-3 max-h-36 overflow-y-auto pr-2">
                    {(productReviews[selectedDetailProduct.id] || []).length === 0 ? (
                      <span className="text-[9px] text-brand-gray uppercase">Zero active community feedback. Be the first to add.</span>
                    ) : (
                      productReviews[selectedDetailProduct.id].map((rev, index) => (
                        <div key={index} className="space-y-1 text-left border-b border-brand-black/5 pb-2 text-[10px]">
                          <div className="flex justify-between items-center text-brand-gray font-bold">
                            <span className="uppercase text-brand-black">{rev.username} • {rev.date}</span>
                            <div className="flex text-yellow-500">
                              {[...Array(rev.rating)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-brand-black/85 leading-normal italic font-medium">"{rev.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Primary Add Action Container */}
                <div className="pt-4 border-t border-brand-black/10 space-y-3">
                  <div className="flex justify-between items-center bg-brand-cobalt/[0.04] p-3 border border-brand-cobalt/25 text-xs text-brand-black uppercase">
                    <span className="flex items-center gap-1 font-bold">
                      <Truck className="w-4 h-4 text-brand-cobalt" />
                      Free shipping milestone eligible
                    </span>
                    <span className="text-[9px] tracking-widest text-[#71717A] text-right">dispatch 24h</span>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedColor) {
                        handleAddToCart(selectedDetailProduct, selectedSize, selectedColor);
                        setSelectedDetailProduct(null); // Close modal on success
                      }
                    }}
                    className="w-full bg-[#1A56DB] text-white py-5 text-xs font-bold uppercase tracking-[0.25em] hover:bg-brand-cobalt-dark transition-colors duration-200 flex items-center justify-center gap-4 cursor-pointer shadow-lg"
                  >
                    Acquire for Shipping Bag
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1M11 1V11M11 1H1" stroke="white" strokeWidth="1.5" />
                    </svg>
                  </button>

                  <div className="flex justify-between text-[9px] uppercase tracking-wider text-brand-gray pt-1 font-bold">
                    <span>Includes Premium Auth serial tags</span>
                    <button 
                      onClick={() => {
                        toggleWishlist(selectedDetailProduct.id, selectedDetailProduct.name);
                      }}
                      className="underline text-brand-black hover:text-brand-cobalt cursor-pointer"
                    >
                      {wishlist.includes(selectedDetailProduct.id) ? '♥ In Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
