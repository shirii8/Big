// ─── Drop Date ────────────────────────────────────────────────────────────────
export const DROP_DATE = new Date('2026-05-01T00:00:00+05:30')

// ─── Product type ─────────────────────────────────────────────────────────────
export type Product = {
  id: string
  name: string
  category: string
  price: string
  priceNum: number
  image: string
  // description: string
  specs: Record<string, string>
}

// ─── Bundle Pricing ───────────────────────────────────────────────────────────
export const BUNDLE_PRICE = 3799        // 2 uppers + 1 sole
export const SOLE_PRICE   = 3200        // standalone sole add-on
export const FOUNDATION_STOCK = 40      // launch stock count

// ─── Coupons (single source of truth used by checkout + cart) ─────────────────
export const COUPONS: Record<string, { discount: number; label: string; type: 'percent' | 'flat' }> = {
  TESSCH15:   { discount: 0.15, label: '15% off — Early Adopter',   type: 'percent' },
  DROP001:    { discount: 0.10, label: '10% off — Drop 001 Launch', type: 'percent' },
  FIRSTBUILD: { discount: 200,  label: '₹200 off — First Build',    type: 'flat'    },
  BUNDLE2:    { discount: 0.10, label: '10% off — 2 Uppers + Sole Bundle', type: 'percent' },
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const REVIEWS = [
  {
    id: 1,
    name: 'Arjun M.',
    location: 'Mumbai',
    rating: 5,
    text: 'Finally a sneaker that changes with my fit. Swapped the upper in 30 seconds. Nothing else comes close.',
    upper: 'NEON VAPOR',
    build: 'Full Build',
  },
  {
    id: 2,
    name: 'Priya S.',
    location: 'Bangalore',
    rating: 5,
    text: 'The Carbon Shield upper on the Cloud Runner sole is an insane combo. Got stopped three times at the airport.',
    upper: 'CARBON SHIELD',
    build: 'Full Build',
  },
  {
    id: 3,
    name: 'Rohan K.',
    location: 'Delhi',
    rating: 5,
    text: 'Bought the upper only first — then immediately ordered the sole. Do not make my mistake. Get the full build.',
    upper: 'ONYX GRID',
    build: 'Upper Only → Full Build',
  },
  {
    id: 4,
    name: 'Sneha T.',
    location: 'Pune',
    rating: 5,
    text: 'Ghost White with the cushion sole for my morning runs. Zero regrets. The modular system is genuinely brilliant.',
    upper: 'GHOST WHITE',
    build: 'Full Build',
  },
  {
    id: 5,
    name: 'Dev R.',
    location: 'Chennai',
    rating: 5,
    text: 'Night Raid upper is absolutely stealth. Wore it to a showcase and every designer in the room asked about it.',
    upper: 'NIGHT RAID',
    build: 'Upper Only',
  },
]

// ─── Ticker items (scrolling announcement bar) ────────────────────────────────
export const TICKER_ITEMS = [
  'DROP 001 — LIMITED RUN',
  'MODULAR BY DESIGN',
  'SWAP THE UPPER. KEEP THE SOLE.',
  'INDIA PRIORITY SHIPPING',
  'FREE DELIVERY OVER ₹10,000',
  '15 UPPERS. 1 FOUNDATION.',
  'BUILD YOUR PAIR →',
]

// ─── Marquee words ────────────────────────────────────────────────────────────
export const MARQUEE_WORDS = [
  'MODULAR', 'SNEAKERS', 'DROP 001', 'TESSCH',
  'SWAP', 'BUILD', 'WEAR', 'REPEAT',
]

// ─── Timeline (how it works steps) ───────────────────────────────────────────
export const TIMELINE = [
  {
    step: '01',
    title: 'CHOOSE YOUR BASE',
    description: 'Pick the Starter Build — your sole unit. Engineered with proprietary cushioning and traction logic. Comes paired with one upper skin.',
    tag: 'The Foundation',
  },
  {
    step: '02',
    title: 'SELECT YOUR UPPER',
    description: 'Browse 15 modular upper skins. Each engineered for a different context — from tactical to lifestyle to performance.',
    tag: 'The Skin',
  },
  {
    step: '03',
    title: 'LOCK YOUR BUILD',
    description: 'Checkout with your configuration. We assemble and dispatch within 3–5 business days. India-priority shipping.',
    tag: 'The Drop',
  },
  {
    step: '04',
    title: 'SWAP ANYTIME',
    description: 'Bought a new upper? Clip it on in under 30 seconds. No tools. No glue. No waste. Just a new look.',
    tag: 'The System',
  },
]

// ─── Sizes ────────────────────────────────────────────────────────────────────
export const SIZES = ['UK 5','UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

// ─── Best for Cta (all 15 uppers) ─────────────────────────────────────────────────

export const Best: Product[] = [
  { id: "u-002", name: "SAKURA", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAKURA_fbjawt.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-005", name: "IKKA", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/IKKA_pyj8fg.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-007", name: "BRENJAM", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BRENJAM_gqdppm.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
];

// ─── Products (all 15 uppers) ─────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  { id: "u-001", name: "TANGELO", category: "Arc", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/TANGELO_kz90o7.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-002", name: "SAKURA", category: "Arc", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAKURA_fbjawt.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-003", name: "OMNITRIX", category: "Arc", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775707205/OMNITRIX_k953ys.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-004", name: "SAHARA", category: "Arc", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAHARA_dptugl.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-005", name: "IKKA", category: "Arc", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/IKKA_pyj8fg.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-006", name: "EUPHORIA", category: "Carve", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/EUPHORIA_f5msvc.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-007", name: "BRENJAM", category: "Carve", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BRENJAM_gqdppm.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-008", name: "BISKOFF", category: "Carve", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BISKOFF_snz1bk.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-009", name: "GLACIER", category: "Tangent", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/GLACIER_xwrp5m.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-010", name: "HAYFIELD", category: "Tangent", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/HAYFIELD_wvwwgk.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-011", name: "JADE", category: "Tangent", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/JADE_fwkjt9.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-012", name: "RASPUTEEN", category: "Tangent", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/RASPUTEEN_qdxrcd.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-013", name: "VOLCANO", category: "Carve", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/VOLCANO_hmavs4.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-014", name: "PECADO", category: "Tangent", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/PECADO_bsnwke.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-015", name: "WASABI", category: "Carve", price: "₹2798", priceNum: 2798, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/WASABI_cnfms9.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
];

export const UPPERS: Product[] = [
  { id: "u-001", name: "TANGELO", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/TANGELO_kz90o7.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-002", name: "SAKURA", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAKURA_fbjawt.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-003", name: "OMNITRIX", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/v1775707205/OMNITRIX_k953ys.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-004", name: "SAHARA", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAHARA_dptugl.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-005", name: "IKKA", category: "Arc", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/IKKA_pyj8fg.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-006", name: "EUPHORIA", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/EUPHORIA_f5msvc.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-007", name: "BRENJAM", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BRENJAM_gqdppm.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-008", name: "BISKOFF", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BISKOFF_snz1bk.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-009", name: "GLACIER", category: "Tangent", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/GLACIER_xwrp5m.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-010", name: "HAYFIELD", category: "Tangent", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/HAYFIELD_wvwwgk.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-011", name: "JADE", category: "Tangent", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/JADE_fwkjt9.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-012", name: "RASPUTEEN", category: "Tangent", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/RASPUTEEN_qdxrcd.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-013", name: "VOLCANO", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/VOLCANO_hmavs4.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-014", name: "PECADO", category: "Tangent", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/PECADO_bsnwke.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-015", name: "WASABI", category: "Carve", price: "₹1499", priceNum: 1499, image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/WASABI_cnfms9.jpg", specs: { Material: "PU Leather, Suede", Range: "UK 6–11" } },
];