import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'tf-001',
    name: 'M-1 Heavyweight French Terry Hoodie',
    category: 'Hoodies',
    price: 135,
    salePrice: 110,
    rating: 4.9,
    reviewsCount: 184,
    description: 'Forged from ultra-dense 500GSM custom knit French Terry. Features dropping shoulders, seamless ribbing, and a dual-lined structured hood designed to hold its shape perfectly. Zero drawcords for a clean, minimal, raw-hem street aesthetic.',
    materialDetails: [
      '100% Organic Cotton Heavyweight French Terry',
      'Dense 500GSM custom pre-shrunk weave',
      'Seamless double-ribbed side panels for comfort',
      'Double-ply structured hood (no drawstring)'
    ],
    careInstructions: 'Machine wash cold inside-out. Hang dry to maintain structural density.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Core Black', hex: '#000000' },
      { name: 'Electric Cobalt', hex: '#1A56DB' },
      { name: 'Off-White', hex: '#EAE6DF' }
    ],
    status: 'sale',
    stockCount: 12,
    fitDescription: 'Intentional oversized silhouette. Boxy, drop-shoulder cut, slightly cropped waist.'
  },
  {
    id: 'tf-002',
    name: 'Type-II Tactical Cargo Pant',
    category: 'Pants',
    price: 145,
    rating: 4.8,
    reviewsCount: 142,
    description: 'Engineered for durability and form. Crafted from tear-resistant cotton ripstop with custom Japanese gunmetal snap hardware. Engineered 3D articulation knee pleats for maximum range of mobility, complete with a modular cargo compartment system.',
    materialDetails: [
      '80% Cotton / 20% Polyester Ripstop Matrix Blend',
      'Custom gunmetal black snap hardware',
      'Integrated heavy-duty adjustable nylon web-belt',
      'Six-pocket design including high-volume utility pockets'
    ],
    careInstructions: 'Machine wash cold with like colors. Tumble dry low.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Core Black', hex: '#000000' },
      { name: 'Graphite Grey', hex: '#4B5563' }
    ],
    status: 'new',
    stockCount: 22,
    fitDescription: 'Relaxed fit through thigh, tapering down slightly to adjustable velcro ankles.'
  },
  {
    id: 'tf-003',
    name: 'Linear Box Silhouette Heavy Tee',
    category: 'Tees',
    price: 65,
    rating: 4.7,
    reviewsCount: 96,
    description: 'The absolute daily essential. Constructed from 280GSM single-yarn combed cotton. Extremely thick ribbed collar designed to resist sagging over time. This heavy tee maintains a structured, architectural drape off the torso.',
    materialDetails: [
      '100% Combed Compact Ring-Spun Cotton',
      '280GSM heavy-knit pre-shrunk premium jersey',
      '1.2-inch ultra-thick high-density ribbed collar',
      'Twin-needle cover-stitched shoulders and hems'
    ],
    careInstructions: 'Wash gold inside-out. Low tumble heat or line dry.',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Off-White', hex: '#EAE6DF' },
      { name: 'Core Black', hex: '#000000' },
      { name: 'Electric Cobalt', hex: '#1A56DB' }
    ],
    status: 'limited',
    stockCount: 5,
    fitDescription: 'True boxy streetwear fit. Drop shoulder, relaxed sleeves, true-to-size length.'
  },
  {
    id: 'tf-004',
    name: 'Sector technical coach windbreaker',
    category: 'Outerwear',
    price: 185,
    rating: 4.9,
    reviewsCount: 68,
    description: 'Designed to shield you from the elements while maintaining a refined editorial posture. Finished with water-repellent DWR coatings and laser-perforated underarm ventilation. Fully lined with breathable grid mesh and sealed premium zippers.',
    materialDetails: [
      '100% Water-Resistant Recycled Matte Nylon Shell',
      'Durable Water Repellent (DWR) eco-finish',
      'YKK AquaGuard waterproof contrast heat-sealed zippers',
      'Ultra-fine cooling internal grid mesh lining'
    ],
    careInstructions: 'Wipe down with damp cloth or hand wash cold. Dry flat.',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Core Black', hex: '#000000' },
      { name: 'Electric Cobalt', hex: '#1A56DB' }
    ],
    status: 'new',
    stockCount: 15,
    fitDescription: 'Modern athletic silhouette with custom hem drawcords for optional cropped styling.'
  },
  {
    id: 'tf-005',
    name: 'Raw Gauge Knit Beanie',
    category: 'Accessories',
    price: 45,
    rating: 4.6,
    reviewsCount: 74,
    description: 'Thick, heavy double-knit ribbed beanie styled with a modern micro-fit profile. Sits slightly high on the ears for a contemporary streetwear aesthetic. Heat-retaining thermal material that retains elasticity year-round.',
    materialDetails: [
      '70% Recycled Cotton / 30% Fine Acrylic yarn',
      'Double-layer heavy gauge knit construction',
      'Zero-itch high-comfort internal crown micro-seams',
      'Subtle minimalist F&V label stitch on contrast cuff'
    ],
    careInstructions: 'Hand wash cold. Dry flat only. Do not machine dry.',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Electric Cobalt', hex: '#1A56DB' },
      { name: 'Core Black', hex: '#000000' },
      { name: 'Off-White', hex: '#EAE6DF' }
    ],
    status: 'limited',
    stockCount: 8,
    fitDescription: 'Comfortable stretch micro-fit. Sits securely right above or on crown of ears.'
  },
  {
    id: 'tf-006',
    name: 'Modular Utility Chest pack',
    category: 'Accessories',
    price: 95,
    rating: 4.9,
    reviewsCount: 52,
    description: 'Designed for urban exploration and visual balance. Form-fitting tactical chest pack with military-grade cordura lining. Double secure compartmentalized modules, adjustable padded heavy-rigging harness, and dual accessory attachment loops.',
    materialDetails: [
      '1000D Cordura tear-proof structural nylon',
      'Breathable, padded high-airflow sports mesh backing',
      'Industrial snap-buckles with tactical quick-release',
      'Waterproof internal pocket sections for tech devices'
    ],
    careInstructions: 'Spot clean with mild soapy water. Air dry indoors.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000'
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Core Black', hex: '#000000' }
    ],
    status: 'new',
    stockCount: 6,
    fitDescription: 'Fully adjustable strapping harness layout to sit closely and securely on any frame.'
  }
];

export const COUPONS = [
  { code: 'STREET20', type: 'percent', value: 20, description: '20% off streetwear premium drop' },
  { code: 'COBALT15', type: 'fixed', value: 15, description: 'Save $15 on your first styling item' }
];
