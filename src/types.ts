export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  materialDetails: string[];
  careInstructions: string;
  images: string[]; // [Main Image, Hover/Alt Image]
  sizes: string[];
  colors: { name: string; hex: string }[];
  status?: 'new' | 'limited' | 'sale' | 'sold-out';
  stockCount: number;
  fitDescription: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
}

export interface OutfitPiece {
  id: string;
  name: string;
  category: 'top' | 'bottom' | 'outerwear' | 'accessory';
  price: number;
  image: string;
  size: string;
  product: Product;
}
