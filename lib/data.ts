export interface Product {
  id: number
  name: string
  sub: string
  tag: string
  tagClass: string
  price: number
  og: number
  base: number
  accent: number
}

export interface Colorway {
  name: string
  bg: string
  text: string
}

export interface Review {
  init: string
  name: string
  loc: string
  product: string
  text: string
}

export interface TimelineItem {
  year: string
  label: string
  desc: string
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'VOID RUNNER X1',
    sub: 'High-top / Carbon mesh upper',
    tag: '★ Most Hyped',
    tagClass: 'text-acid',
    price: 18999,
    og: 24000,
    base: 0x0d0020,
    accent: 0xC6FF00,
  },
  {
    id: 2,
    name: 'ACID FLUX LOW',
    sub: 'Low-top / Reactive sole unit',
    tag: '🔥 New Drop',
    tagClass: 'text-fire',
    price: 14499,
    og: 18000,
    base: 0x001a0a,
    accent: 0x99ff00,
  },
  {
    id: 3,
    name: 'CHROME GHOST MID',
    sub: 'Mid-top / Reflective chrome finish',
    tag: '⚡ Limited 100',
    tagClass: 'text-chrome',
    price: 22999,
    og: 30000,
    base: 0x1a1a30,
    accent: 0xe8e8ff,
  },
]

export const COLORWAYS: Colorway[] = [
  { name: 'Grime',    bg: 'linear-gradient(135deg,#C6FF00,#08000F)', text: '#C6FF00' },
  { name: 'Fire Ember',   bg: 'linear-gradient(135deg,#FF3D00,#1a0a00)', text: '#FF3D00' },
  { name: 'Chrome Ghost', bg: 'linear-gradient(135deg,#E8E8FF,#2a2a4a)', text: '#E8E8FF' },
  { name: 'Ultra Violet', bg: 'linear-gradient(135deg,#9B59B6,#1a0a2e)', text: '#CE93D8' },
  { name: 'Cryo Pulse',   bg: 'linear-gradient(135deg,#00E5FF,#001a2e)', text: '#00E5FF' },
]

export const REVIEWS: Review[] = [
  {
    init: 'AK',
    name: 'Arjun K.',
    loc: 'Mumbai',
    product: 'Void Runner X1',
    text: "I tried it in AR before buying. The flick interaction on the site is genuinely addictive. Best sneaker decision I've made.",
  },
  {
    init: 'PS',
    name: 'Priya S.',
    loc: 'Delhi',
    product: 'Acid Flux Low',
    text: "The modular concept is so obvious in hindsight. Swapped from Acid Void to Chrome Ghost in literally 30 seconds.",
  },
  {
    init: 'ZG',
    name: '@zerogravity_fits',
    loc: 'Bangalore',
    product: 'Chrome Ghost Mid',
    text: "Chrome Ghost in real life is even more unreal than the renders. TESSCH is built different. Full stop.",
  },
]

export const TIMELINE: TimelineItem[] = [
  {
    year: '2024',
    label: 'The Idea',
    desc: "Mihir and Pratham notice the pattern: people don't replace shoes because they're broken — they replace them for freshness. Every time. The cycle felt wrong.",
  },
  {
    year: "Early '25",
    label: 'First ₹2 Lakhs',
    desc: 'Bootstrapped on ₹2 lakhs. No VC money, no hype. Two founders, one conviction, the discipline to validate every assumption before moving forward.',
  },
  {
    year: '18 Months',
    label: 'Build Phase',
    desc: 'Slow and deliberate. Working samples produced. The modular mechanism tested and refined. Every material chosen to last. Early testers: immediate reaction.',
  },
  {
    year: 'Feb 2026',
    label: 'Identity Drop',
    desc: 'Went public on Instagram (@tesschstore). Dropped reels — not showing the product yet. Just the identity. The mindset. People locked in immediately.',
  },
  {
    year: 'Apr 2026',
    label: 'Drop 001',
    desc: 'The first modular sneaker drop. Pre-orders open globally. Mission: prove community-first, smarter design can disrupt a broken industry.',
  },
  {
    year: 'Next',
    label: '₹1 Cr Pre-Seed',
    desc: "Raising ₹1 Cr to take TESSCH from sample to market. Building for the youth who want smarter, not just cheaper. If you back founders who question everything — let's talk.",
  },
]

export const SIZES = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12']

export const TICKER_ITEMS = [
  'Arjun K. just pre-ordered Void Runner X1 — Mumbai',
  'Priya S. spun the shoe in AR — Delhi',
  '@zerogravity_fits reviewed Chrome Ghost ★★★★★ — Bangalore',
  'Rohan M. secured Acid Flux Low — Pune',
  'Sneha T. shared TESSCH on Instagram — Chennai',
  '12 people joined the waitlist in the last hour',
]

export const DROP_DATE = new Date('2026-04-04T12:00:00+05:30').getTime()

export const MARQUEE_WORDS = [
  'BREAK THE GRID', 'DROP ZERO', 'PHYSICS-DEFYING', 'TESSCH 2026',
  'CULTURE CODED', '3D NATIVE', 'MODULAR DESIGN', 'LIMITED RUN',
  'BREAK THE GRID', 'DROP ZERO', 'PHYSICS-DEFYING', 'TESSCH 2026',
  'CULTURE CODED', '3D NATIVE', 'MODULAR DESIGN', 'LIMITED RUN',
]