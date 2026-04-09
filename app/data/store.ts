export type ProductCategory =
  | "electronics"
  | "home"
  | "fashion"
  | "beauty"
  | "groceries"
  | "office";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  description: string;
  details: string;
  features: string[];
  image: string;
  accent: string;
};

export type Category = {
  slug: ProductCategory;
  name: string;
  summary: string;
  count: string;
  image: string;
  accent: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const storeStats = [
  { value: "12k+", label: "orders fulfilled", tone: "primary" },
  { value: "48h", label: "average delivery", tone: "accent" },
  { value: "99%", label: "happy customers", tone: "secondary" },
  { value: "24/7", label: "support response", tone: "muted" },
] as const;

export const categories: Category[] = [
  {
    slug: "electronics",
    name: "Electronics",
    summary: "Smart essentials, accessories, and daily tech upgrades.",
    count: "32 products",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900",
    accent: "from-cyan-500/80 to-sky-700/80",
  },
  {
    slug: "home",
    name: "Home & Kitchen",
    summary: "Practical goods that make every room feel better.",
    count: "26 products",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900",
    accent: "from-emerald-500/80 to-teal-800/80",
  },
  {
    slug: "fashion",
    name: "Fashion",
    summary: "Everyday style pieces with clean, versatile design.",
    count: "21 products",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    accent: "from-stone-600/80 to-zinc-900/80",
  },
  {
    slug: "beauty",
    name: "Beauty",
    summary: "Skincare and grooming picks for an easy routine.",
    count: "18 products",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900",
    accent: "from-amber-400/80 to-orange-700/80",
  },
  {
    slug: "groceries",
    name: "Groceries",
    summary: "Weekly staples and pantry favourites at a glance.",
    count: "40 products",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
    accent: "from-lime-500/80 to-green-800/80",
  },
  {
    slug: "office",
    name: "Office",
    summary: "Desk gear and productivity tools for focused work.",
    count: "16 products",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    accent: "from-indigo-500/80 to-slate-900/80",
  },
];

export const products: Product[] = [
  {
    id: "p-1",
    slug: "aurora-wireless-headphones",
    name: "Aurora Wireless Headphones",
    category: "electronics",
    price: 129,
    compareAtPrice: 179,
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    description:
      "Comfortable over-ear headphones with crisp sound, long battery life, and all-day wear.",
    details:
      "A balanced everyday listening experience with soft cushions, USB-C charging, and quick pairing.",
    features: ["40-hour battery", "Noise isolation", "USB-C fast charge"],
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
    accent: "from-cyan-500 to-blue-700",
  },
  {
    id: "p-2",
    slug: "atlas-smart-lamp",
    name: "Atlas Smart Lamp",
    category: "home",
    price: 74,
    compareAtPrice: 99,
    rating: 4.7,
    reviews: 198,
    badge: "New",
    description:
      "A warm, adjustable lamp that gives bedrooms and workspaces a modern glow.",
    details:
      "Tap control, scene presets, and a compact footprint make it easy to fit any setup.",
    features: ["Warm dimming", "Tap control", "Compact footprint"],
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200",
    accent: "from-emerald-500 to-teal-700",
  },
  {
    id: "p-3",
    slug: "everyday-canvas-tote",
    name: "Everyday Canvas Tote",
    category: "fashion",
    price: 38,
    compareAtPrice: 52,
    rating: 4.6,
    reviews: 121,
    badge: "Eco Pick",
    description:
      "A durable, minimalist tote for commuting, shopping, and weekend use.",
    details:
      "Reinforced handles, roomy storage, and a clean silhouette keep it practical and versatile.",
    features: ["Heavy-duty canvas", "Reinforced handles", "Easy-clean lining"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
    accent: "from-stone-500 to-zinc-800",
  },
  {
    id: "p-4",
    slug: "cleanline-skincare-set",
    name: "Cleanline Skincare Set",
    category: "beauty",
    price: 58,
    compareAtPrice: 76,
    rating: 4.9,
    reviews: 274,
    badge: "Top Rated",
    description:
      "A simple daily skincare bundle built for freshness, hydration, and balance.",
    details:
      "Three-step routine includes a cleanser, lightweight serum, and nourishing moisturiser.",
    features: ["Three-step routine", "Hydrating finish", "Gentle formula"],
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200",
    accent: "from-amber-400 to-orange-700",
  },
  {
    id: "p-5",
    slug: "market-basket-pantry-box",
    name: "Market Basket Pantry Box",
    category: "groceries",
    price: 64,
    compareAtPrice: 82,
    rating: 4.8,
    reviews: 503,
    badge: "Weekly Deal",
    description:
      "Curated household staples for fast restocking and convenient weekly shopping.",
    details:
      "Packed with essentials that keep your kitchen stocked without the extra errands.",
    features: ["Family-size pack", "Quick restock", "Value bundle"],
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200",
    accent: "from-lime-500 to-green-700",
  },
  {
    id: "p-6",
    slug: "focus-desk-organizer",
    name: "Focus Desk Organizer",
    category: "office",
    price: 44,
    compareAtPrice: 59,
    rating: 4.7,
    reviews: 164,
    badge: "Workspace Upgrade",
    description:
      "A compact desk system that keeps your phone, notes, and accessories in one place.",
    details:
      "Designed to reduce clutter and keep the most-used items within easy reach.",
    features: ["Modular trays", "Cable slot", "Minimal profile"],
    image:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
    accent: "from-indigo-500 to-slate-800",
  },
  {
    id: "p-7",
    slug: "velocity-sneakers",
    name: "Velocity Sneakers",
    category: "fashion",
    price: 92,
    compareAtPrice: 120,
    rating: 4.5,
    reviews: 87,
    badge: "Limited",
    description:
      "Lightweight everyday sneakers built for comfort, pace, and a clean silhouette.",
    details:
      "Breathable knit upper, cushioned sole, and neutral tones make them easy to style.",
    features: ["Breathable knit", "Cushioned sole", "Easy pairing"],
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1201",
    accent: "from-slate-600 to-zinc-900",
  },
  {
    id: "p-8",
    slug: "modern-ceramic-mug-set",
    name: "Modern Ceramic Mug Set",
    category: "home",
    price: 29,
    compareAtPrice: 41,
    rating: 4.9,
    reviews: 243,
    badge: "Gift Ready",
    description:
      "A set of four ceramic mugs with a soft matte finish and easy-grip handle.",
    details:
      "Perfect for gifting, office coffee breaks, and a polished kitchen shelf.",
    features: ["Set of four", "Matte finish", "Dishwasher safe"],
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200",
    accent: "from-stone-500 to-amber-700",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Amina W.",
    role: "Frequent shopper",
    quote:
      "The layout is clean, fast, and easy to trust. I can find what I need without digging through clutter.",
    rating: 5,
  },
  {
    id: "t-2",
    name: "Brian K.",
    role: "Small business owner",
    quote:
      "It feels like a real storefront brand, not a generic template. The product pages and cart flow are polished.",
    rating: 5,
  },
  {
    id: "t-3",
    name: "Maya S.",
    role: "Online buyer",
    quote:
      "The whole experience feels balanced and modern. The colours and section flow make the store look premium.",
    rating: 4,
  },
];

export const heroHighlights = [
  "Curated products only",
  "Fast checkout flow",
  "Simple category browsing",
  "Frontend-only storefront",
];

export const quickServices = [
  {
    title: "Fast Dispatch",
    description: "Most orders are packed the same day and delivered quickly.",
  },
  {
    title: "Easy Returns",
    description: "Flexible return handling keeps the shopping experience calm.",
  },
  {
    title: "Secure Checkout",
    description: "A streamlined checkout journey with clear order totals.",
  },
];
