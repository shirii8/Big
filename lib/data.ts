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
  description: string
  specs: Record<string, string>
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
export const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

// ─── Products (all 15 uppers) ─────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  { id: "u-001", name: "TANGELO", category: "Arc", price: "₹1499", priceNum: 1499, description: "Engineered knit designed for peak aerobic output.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/TANGELO_kz90o7.jpg", specs: { Weight: "120g / High", Flex: "High", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-002", name: "SAKURA", category: "Arc", price: "₹1499", priceNum: 1499, description: "Reinforced nylon with waterproof TPU membrane.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAKURA_fbjawt.jpg", specs: { Weight: "180g / Mid", Flex: "Mid", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-003", name: "OMNITRIX", category: "Arc", price: "₹1499", priceNum: 1499, description: "Suede-textured synthetic with minimalist aesthetic.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/OMNITRIX_k953ys.jpg", specs: { Weight: "150g / Max", Flex: "Max", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-004", name: "SAHARA", category: "Arc", price: "₹1499", priceNum: 1499, description: "Sand-blasted finish with reinforced eyelets.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/SAHARA_dptugl.jpg", specs: { Weight: "165g / Low", Flex: "Low", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-005", name: "IKKA", category: "Arc", price: "₹1499", priceNum: 1499, description: "Compression-fit for lateral stability.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/IKKA_pyj8fg.jpg", specs: { Weight: "135g / High", Flex: "High", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-006", name: "EUPHORIA", category: "Carve", price: "₹1499", priceNum: 1499, description: "Essential modular upper in deep cobalt.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/EUPHORIA_f5msvc.jpg", specs: { Weight: "145g / Max", Flex: "Max", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-007", name: "BRENJAM", category: "Carve", price: "₹1499", priceNum: 1499, description: "Heat-reactive panels that change colour.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BRENJAM_gqdppm.jpg", specs: { Weight: "125g / High", Flex: "High", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-008", name: "BISKOFF", category: "Carve", price: "₹1499", priceNum: 1499, description: "Metallic-infused fibers for extreme durability.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/BISKOFF_snz1bk.jpg", specs: { Weight: "195g / Low", Flex: "Low", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-009", name: "GLACIER", category: "Tangent", price: "₹1499", priceNum: 1499, description: "Triple-white with easy-clean coating.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/GLACIER_xwrp5m.jpg", specs: { Weight: "140g / Mid", Flex: "Mid", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-010", name: "HAYFIELD", category: "Tangent", price: "₹1499", priceNum: 1499, description: "Earth-toned with extra ankle padding.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/HAYFIELD_wvwwgk.jpg", specs: { Weight: "170g / Mid", Flex: "Mid", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-011", name: "JADE", category: "Tangent", price: "₹1499", priceNum: 1499, description: "Integrated LED piping that syncs with pace.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/JADE_fwkjt9.jpg", specs: { Weight: "155g / High", Flex: "High", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-012", name: "RASPUTEEN", category: "Tangent", price: "₹1499", priceNum: 1499, description: "Retro-inspired paneling with modern rails.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/RASPUTEEN_qdxrcd.jpg", specs: { Weight: "160g / Max", Flex: "Max", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-013", name: "VOLCANO", category: "Carve", price: "₹1499", priceNum: 1499, description: "Stealth-black with light-absorbing finish.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/VOLCANO_hmavs4.jpg", specs: { Weight: "185g / Low", Flex: "Low", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-014", name: "PECADO", category: "Tangent", price: "₹1499", priceNum: 1499, description: "Weightless sensation with industrial locking.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707205/PECADO_bsnwke.jpg", specs: { Weight: "110g / Max", Flex: "Max", Material: "PU Leather, Suede", Range: "UK 6–11" } },
  { id: "u-015", name: "WASABI", category: "Carve", price: "₹1499", priceNum: 1499, description: "Windproof and snow-resistant modular archive.", image: "https://res.cloudinary.com/dttnc62hp/image/upload/q_auto/f_auto/v1775707204/WASABI_cnfms9.jpg", specs: { Weight: "210g / Low", Flex: "Low", Material: "PU Leather, Suede", Range: "UK 6–11" } },
];