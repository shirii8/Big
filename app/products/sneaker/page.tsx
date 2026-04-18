"use client";

import { useState, useMemo, useEffect, memo, useCallback, useRef } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { PRODUCTS, type Product } from "@/lib/data";
import { ShieldCheck, Package, Layers, AlertTriangle } from "lucide-react";

type CartState = "idle" | "loading" | "success" | "error";
type BuildChoice = "upper-only" | "build";

const SIZES = ["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

const UPPER_PRICE = 1499;
const SOLE_PRICE = 1299;
const BUILD_PRICE = UPPER_PRICE + SOLE_PRICE;

const DEFAULT_SOLE = {
  id: "sole-default",
  name: "CLOUD RUNNER",
  price: SOLE_PRICE,
  image:
    "https://res.cloudinary.com/dttnc62hp/image/upload/v1775581980/SolidLogo-removebg-preview_hw2e30.png",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UppersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  useEffect(() => {
    document.body.style.overflow = selectedId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  const ROWS = useMemo(
    () => [PRODUCTS.slice(0, 5), PRODUCTS.slice(5, 10), PRODUCTS.slice(10, 15)],
    [],
  );

  return (
    <div className="bg-[#e5f1ee] min-h-screen w-full flex flex-col text-[#17191d]">
      <header className="pt-32 pb-12 px-6 md:px-12 shrink-0">
        <h4>Drop 01 / Modular Archive</h4>
        <div className="flex justify-between items-end mt-4 border-b-2 border-[#17191d]/10 pb-6">
          <h1 className="font-display text-[clamp(36px,6vw,80px)] leading-[0.85] tracking-tighter uppercase">
            SELECT YOUR <br />
            <span className="text-[#d4604d]">SNEAKER.</span>
          </h1>
          <div className="text-right hidden md:block">
            <p className="font-mono text-[10px] uppercase tracking-[3px] font-bold">
              INSTRUCTIONS
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40">
              Hover to Pause · Drag to Scroll
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-col gap-6 md:gap-8 py-2 overflow-hidden mb-24">
        {ROWS.map((row, idx) => (
          <ArchiveRow
            key={idx}
            items={row}
            onSelect={setSelectedId}
            reverse={idx === 1}
          />
        ))}
      </main>

      <AnimatePresence>
        {selectedId && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ArchiveRow ───────────────────────────────────────────────────────────────
function ArchiveRow({
  items,
  onSelect,
  reverse,
}: {
  items: Product[];
  onSelect: (id: string) => void;
  reverse: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();
  const tripled = useMemo(() => [...items, ...items, ...items], [items]);

  // Calculate dynamically to support responsive card sizes
  const [scrollDistance, setScrollDistance] = useState(items.length * 480);

  useEffect(() => {
    const handleResize = () => {
      const cardWidth = window.innerWidth < 768 ? 280 : window.innerWidth < 1024 ? 380 : 440;
      setScrollDistance(items.length * (cardWidth + 40)); // 40px is gap-10
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items.length]);

  useEffect(() => {
    if (!isPaused && scrollDistance > 0) {
      controls.start({
        x: reverse ? [0, -scrollDistance] : [-scrollDistance, 0],
        transition: { duration: 40, repeat: Infinity, ease: "linear" },
      });
    } else {
      controls.stop();
    }
  }, [isPaused, controls, reverse, scrollDistance]);

  return (
    <div
      className="relative flex overflow-hidden h-[160px] md:h-[200px] lg:h-[240px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        drag="x"
        animate={controls}
        dragConstraints={{ left: -scrollDistance * 2, right: 0 }}
        dragElastic={0.05}
        className="flex gap-10 px-6 md:px-12 h-full items-center cursor-grab active:cursor-grabbing"
        style={{ width: "max-content", touchAction: "none" }}
      >
        {tripled.map((product, i) => (
          <ProductCard
            key={`${product.id}-${i}`}
            product={product}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
const ProductCard = memo(
  ({
    product,
    onSelect,
  }: {
    product: Product;
    onSelect: (id: string) => void;
  }) => (
    <div
      onClick={() => onSelect(product.id)}
      className="w-[280px] md:w-[380px] lg:w-[440px] h-[140px] md:h-[180px] lg:h-[220px] bg-white border-[3px] border-[#17191d] group flex flex-row overflow-hidden hover:shadow-[8px_8px_0px_#d4604d] transition-shadow duration-300 cursor-pointer shrink-0"
    >
      <div className="flex-1 h-full bg-[#f8fcfb] relative overflow-hidden border-r-[3px] border-[#17191d] p-3 md:p-6 flex items-center justify-center">
        <img
          src={product.image}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
          alt={product.name}
        />
      </div>
      <div className="w-[120px] md:w-[140px] lg:w-[160px] shrink-0 h-full p-3 md:p-5 flex flex-col justify-between bg-white group-hover:bg-[#d4604d]/5 transition-colors">
        <div>
          <p className="font-mono text-[7px] md:text-[9px] text-[#d4604d] font-bold uppercase tracking-[2px] mb-1">
            {product.category}
          </p>
          <h3 className="font-display text-lg md:text-2xl lg:text-3xl uppercase leading-[0.85] tracking-tighter line-clamp-2 md:line-clamp-none">
            {product.name}
          </h3>
        </div>
        <div className="flex flex-col gap-0.5 md:gap-1">
          <p className="font-mono text-[7px] md:text-[8px] uppercase opacity-40">From</p>
          <p className="font-display text-lg md:text-2xl lg:text-3xl leading-none mb-1 md:mb-2">
            ₹{BUILD_PRICE.toLocaleString("en-IN")}
          </p>
          <span className="font-mono text-[8px] md:text-[10px] font-bold text-[#d4604d] border-b border-[#d4604d] pb-0.5 w-fit transition-colors group-hover:text-[#17191d] group-hover:border-[#17191d]">
            VIEW DETAIL
          </span>
        </div>
      </div>
    </div>
  ),
);
ProductCard.displayName = "ProductCard";

// ─── ProductDetail ────────────────────────────────────────────────────────────
function ProductDetail({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [size, setSize] = useState("UK 9");
  const [buildChoice, setBuildChoice] = useState<BuildChoice>("build");
  const [cartState, setCartState] = useState<CartState>("idle");
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();
  const { isAuthenticated } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    setCartState("idle");
    setIsZoomed(false);
  }, [product.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") isZoomed ? setIsZoomed(false) : onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed, onClose]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageContainerRef.current || !isZoomed) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = Math.min(
        100,
        Math.max(0, ((e.clientX - rect.left) / rect.width) * 100),
      );
      const y = Math.min(
        100,
        Math.max(0, ((e.clientY - rect.top) / rect.height) * 100),
      );
      setLensPos({ x, y });
    },
    [isZoomed],
  );

  const handleAddToCart = useCallback(() => {
    if (cartState === "loading" || cartState === "success") return;
    if (!isAuthenticated) {
      router.push("/api/auth/login");
      return;
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart');
    }

    setCartState("loading");

    addItem(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: UPPER_PRICE,
        image: product.image,
      },
      size,
      buildChoice,
      buildChoice === "build" ? DEFAULT_SOLE : undefined,
    );

    setCartState("success");
    setTimeout(() => {
      setCartState("idle");
      onClose();
    }, 1200);
  }, [
    cartState,
    product,
    size,
    buildChoice,
    addItem,
    isAuthenticated,
    router,
    onClose,
  ]);

  const displayPrice =
    buildChoice === "build"
      ? `₹${BUILD_PRICE.toLocaleString("en-IN")}`
      : `₹${UPPER_PRICE.toLocaleString("en-IN")}`;

  const cartLabel: Record<CartState, string> = {
    idle:
      buildChoice === "build" ? "SECURE YOUR TESSCH →" : "ADD UPPER TO CART →",
    loading: "ADDING...",
    success: "ADDED ✓",
    error: "RETRY",
  };

  const rangeDisplay = useMemo(() => {
    const start = SIZES[0].replace("UK ", "");
    const end = SIZES[SIZES.length - 1].replace("UK ", "");
    return `${start}–${end}`;
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] bg-[#17191d]/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="fixed inset-4 md:inset-x-12 md:inset-y-8 z-[1001] bg-[#e5f1ee] border-4 border-[#17191d] shadow-[20px_20px_0px_#17191d] flex flex-col md:flex-row overflow-hidden"
      >
        {/* ── IMAGE PANEL ─────────────────────────────────────────────────── */}
        <div
          ref={imageContainerRef}
          className="w-full md:w-[48%] h-[42%] md:h-full bg-white flex items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-[#17191d] relative overflow-hidden select-none"
          onDoubleClick={() => setIsZoomed((v) => !v)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          style={{ cursor: isZoomed ? "zoom-out" : "zoom-in" }}
        >
          {/* Static metadata */}
          {!isZoomed && (
            <div className="absolute top-4 left-6 flex flex-col gap-1 pointer-events-none z-10">
              <span className="font-mono text-[8px] uppercase tracking-[3px] text-[#17191d]/20">
                Asset // {product.id}
              </span>
            </div>
          )}

          {/* Main image */}
          <img
            src={product.image}
            className={`max-h-[80%] w-auto object-contain mix-blend-multiply pointer-events-none transition-all duration-500 ${isZoomed ? "opacity-0 scale-95 blur-md" : "opacity-100 scale-100"}`}
            alt={product.name}
            draggable={false}
          />

          {/* Zoom overlay */}
          <AnimatePresence>
            {isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-20"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "350%",
                  backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </AnimatePresence>

          {/* Zoom hints */}
          {!isZoomed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 font-mono text-[9px] uppercase tracking-[2px] bg-[#17191d] text-white px-4 py-2 rounded-full"
            >
              Double-click to inspect
            </motion.div>
          )}
          {isZoomed && (
            <div className="absolute bottom-4 right-4 font-mono text-[8px] uppercase tracking-[2px] text-[#d4604d] font-bold z-30 bg-white/90 px-3 py-1.5 rounded-full">
              Move cursor · Double-click to close
            </div>
          )}
        </div>

        {/* ── INFO PANEL ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Scrollable content */}
          <div className="flex-1 p-7 md:p-9 space-y-5">
            {/* Category + close */}
            <div className="flex justify-between items-start">
              <span className="font-mono text-[10px] bg-[#d4604d] text-white px-3 py-1 uppercase font-bold tracking-[1px]">
                {product.category}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center border-2 border-[#17191d] hover:bg-[#17191d] hover:text-white transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Name */}
            <h2 className="font-display text-5xl leading-[0.85] uppercase tracking-tighter">
              {product.name}
            </h2>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-3 bg-white border-2 border-[#17191d]/10 p-4">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="text-center">
                  <p className="font-mono text-[8px] uppercase opacity-40 mb-1">
                    {k}
                  </p>
                  <p className="font-display text-lg uppercase leading-tight">
                    {/* If the key is Range, use the rangeDisplay logic, otherwise use the value v */}
                    {k.toLowerCase() === "range" ? `UK ${rangeDisplay}` : v}
                  </p>
                </div>
              ))}
            </div>

            {/* ── BUILD CHOICE TOGGLE ──────────────────────────────────── */}
            <div className="space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40">
                Choose Your Configuration
              </p>

              {/* UPPER ONLY */}
              <button
                onClick={() => setBuildChoice("upper-only")}
                className={`w-full flex items-start gap-4 p-4 border-[3px] transition-all text-left ${buildChoice === "upper-only" ? "border-[#17191d] bg-white" : "border-[#17191d]/20 hover:border-[#17191d]/50 bg-white/50"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${buildChoice === "upper-only" ? "border-[#17191d]" : "border-[#17191d]/30"}`}
                >
                  {buildChoice === "upper-only" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#17191d]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-[#17191d]/60" />
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[2px]">
                        Upper Only
                      </p>
                    </div>
                    <p className="font-display text-xl">
                      ₹{UPPER_PRICE.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="font-mono text-[9px] opacity-50 uppercase tracking-[1px] mt-1">
                    The skin only — no sole included
                  </p>
                </div>
              </button>

              {/* FULL BUILD */}
              <button
                onClick={() => setBuildChoice("build")}
                className={`w-full flex items-start gap-4 p-4 border-[3px] transition-all text-left relative ${buildChoice === "build" ? "border-[#d4604d] bg-[#d4604d]/5" : "border-[#17191d]/20 hover:border-[#d4604d]/50 bg-white/50"}`}
              >
                {/* Recommended badge */}
                <div className="absolute top-0 right-0 bg-[#d4604d] text-white font-mono text-[8px] uppercase tracking-[2px] px-3 py-1 font-bold">
                  Recommended
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${buildChoice === "build" ? "border-[#d4604d]" : "border-[#17191d]/30"}`}
                >
                  {buildChoice === "build" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#d4604d]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between pr-24 md:pr-28">
                    <div className="flex items-center gap-2">
                      <Layers size={13} className="text-[#d4604d]" />
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[2px] text-[#d4604d]">
                        Full Build (Upper + Sole)
                      </p>
                    </div>
                  </div>
                  {/* Price breakdown */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-[9px] opacity-50 uppercase">
                      ₹{UPPER_PRICE.toLocaleString("en-IN")} upper
                    </span>
                    <span className="font-mono text-[9px] opacity-30">+</span>
                    <span className="font-mono text-[9px] opacity-50 uppercase">
                      ₹{SOLE_PRICE.toLocaleString("en-IN")} sole
                    </span>
                    <span className="font-mono text-[9px] opacity-30">=</span>
                    <span className="font-display text-xl text-[#d4604d]">
                      ₹{BUILD_PRICE.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {/* Sole chip */}
                  <div className="flex items-center gap-2 mt-2 bg-[#17191d]/5 px-3 py-2 w-fit">
                    <img
                      src={DEFAULT_SOLE.image}
                      alt="Sole"
                      className="w-8 h-8 object-contain mix-blend-multiply"
                    />
                    <div>
                      <p className="font-mono text-[8px] uppercase opacity-40">
                        Includes Sole
                      </p>
                      <p className="font-mono text-[9px] font-bold uppercase">
                        {DEFAULT_SOLE.name}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* ── CONTEXT MESSAGES ─────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {buildChoice === "upper-only" ? (
                <motion.div
                  key="upper-warning"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 border-2 border-amber-300 bg-amber-50 px-4 py-3"
                >
                  <AlertTriangle
                    size={14}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[2px] text-amber-700 mb-1">
                      Upper Only — Sole Not Included
                    </p>
                    <p className="font-mono text-[9px] text-amber-700/80 uppercase tracking-[1px] leading-relaxed">
                      If you&apos;re buying Tessch for the first time, buying a
                      sole is a must. You can add a sole and complete your
                      sneaker from the cart at any time.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="build-confirm"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 border-2 border-[#17191d]/20 bg-[#17191d]/5 px-4 py-3"
                >
                  <ShieldCheck
                    size={14}
                    className="text-[#17191d] shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[2px] text-[#17191d] mb-1">
                      Secure Your Tessch
                    </p>
                    <p className="font-mono text-[9px] text-[#17191d]/60 uppercase tracking-[1px] leading-relaxed">
                      Full build includes the Cloud Runner sole — the foundation
                      of your modular pair. Swap uppers anytime, keep the sole
                      forever.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SIZE PICKER ──────────────────────────────────────────── */}
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40 mb-3">
                Select Size
              </p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`font-mono text-[10px] font-bold px-4 py-2 border-2 transition-all ${size === s ? "bg-[#17191d] text-white border-[#17191d]" : "border-[#17191d]/30 hover:border-[#17191d]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── STICKY FOOTER CTA ───────────────────────────────────────── */}
          <div className="shrink-0 p-6 md:p-8 border-t-4 border-[#17191d] bg-[#e5f1ee]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-[8px] uppercase opacity-40 tracking-[2px]">
                  {buildChoice === "build" ? "Full Build Price" : "Upper Price"}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-4xl">{displayPrice}</p>
                  {buildChoice === "build" && (
                    <span className="font-mono text-[9px] opacity-40 uppercase">
                      incl. sole
                    </span>
                  )}
                </div>
              </div>
              {/* Size reminder */}
              <div className="text-right">
                <p className="font-mono text-[8px] uppercase opacity-40">
                  Selected Size
                </p>
                <p className="font-display text-2xl">{size}</p>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={cartState === "loading"}
              className={`w-full font-mono text-[11px] font-bold uppercase tracking-[3px] py-5 transition-all flex items-center justify-center gap-3 ${cartState === "success"
                  ? "bg-emerald-600 text-white"
                  : cartState === "loading"
                    ? "bg-[#17191d]/60 text-white cursor-wait"
                    : buildChoice === "build"
                      ? "bg-[#d4604d] text-white hover:bg-[#17191d]"
                      : "bg-[#17191d] text-white hover:bg-[#d4604d]"
                }`}
            >
              {cartState === "loading" && (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {cartLabel[cartState]}
            </button>

            {cartState === "idle" && buildChoice === "upper-only" && (
              <p className="font-mono text-[8px] uppercase tracking-[1px] text-center opacity-30 mt-2">
                You can upgrade to a full build from the cart
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
