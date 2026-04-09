"use client";

import { useCart, ItemType } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trash2, Package, Layers } from "lucide-react";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateItemType,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  const shipping = subtotal > 10000 ? 0 : 299;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#e5f1ee] flex flex-col items-center justify-center gap-8 text-[#17191d]">
        <div className="font-display text-[clamp(60px,12vw,160px)] leading-none opacity-10 select-none">
          EMPTY
        </div>
        <div className="text-center -mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-4">
            No units loaded
          </p>
          <h2 className="font-display text-4xl uppercase mb-8">
            Your cart is empty.
          </h2>
          <Link
            href="/products"
            className="bg-[#17191d] text-white font-mono text-[11px] uppercase tracking-[3px] px-10 py-4 hover:bg-[#d4604d] transition-colors"
          >
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5f1ee] text-[#17191d] pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b-2 border-[#17191d] pb-6 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-2">
              System Cart
            </p>
            <h1 className="font-display text-[clamp(32px,6vw,80px)] leading-none uppercase tracking-tighter">
              YOUR BUILD
              <br />
              <span className="text-[#d4604d]">QUEUE.</span>
            </h1>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[2px] opacity-40">
            {totalItems} UNIT{totalItems !== 1 ? "S" : ""} STAGED
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Items */}
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {items.map((item) => {
                const isBuild = item.type === "build";
                const itemPrice = isBuild
                  ? item.upper.price + (item.sole?.price ?? 0)
                  : item.upper.price;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white border-2 border-[#17191d] overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="w-full md:w-64 h-[80vw] md:h-auto bg-[#f8fcfb] border-b-2 md:border-b-0 md:border-r-2 border-[#17191d] flex items-center justify-center p-4 overflow-hidden">
                        <img
                          src={item.upper.image}
                          alt={item.upper.name}
                          className="w-full h-full object-contain scale-125 transition-transform mix-blend-multiply"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase tracking-[2px]">
                              {item.upper.category} UPPER
                            </p>
                            <h3 className="font-display text-2xl uppercase leading-tight">
                              {item.upper.name}
                            </h3>
                            <p className="font-mono text-[9px] uppercase tracking-[2px] opacity-40 mt-1">
                              SIZE: {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-[#17191d]/30 hover:text-[#d4604d] transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Build type toggle */}
                        <div className="flex flex-col gap-2">
                          <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-40">
                            Build Configuration
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateItemType(item.id, "build")}
                              className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase px-4 py-2.5 border-2 transition-all ${isBuild ? "bg-[#17191d] text-white border-[#17191d]" : "border-[#17191d]/30 hover:border-[#17191d]"}`}
                            >
                              <Layers size={10} /> Full Build (Upper + Sole)
                            </button>
                            <button
                              onClick={() =>
                                updateItemType(item.id, "upper-only")
                              }
                              className={`flex items-center gap-2 font-mono text-[9px] font-bold uppercase px-4 py-2.5 border-2 transition-all ${!isBuild ? "bg-[#17191d] text-white border-[#17191d]" : "border-[#17191d]/30 hover:border-[#17191d]"}`}
                            >
                              <Package size={10} /> Upper Only
                            </button>
                          </div>

                          {/* Sole upsell nudge */}
                          {!isBuild && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-[#d4604d]/10 border border-[#d4604d] px-4 py-3 mt-1"
                            >
                              <p className="font-mono text-[9px] text-[#d4604d] font-bold uppercase tracking-[2px]">
                                ⚠ You&apos;re missing out on the SOLE — Full
                                Build unlocks 15 base units + saves ₹
                                {item.sole ? item.sole.price - 500 : 500} on
                                bundle pricing.
                              </p>
                            </motion.div>
                          )}

                          {/* Sole info when build */}
                          {isBuild && item.sole && (
                            <div className="flex items-center gap-3 bg-[#17191d]/5 px-4 py-3 mt-1 border border-[#17191d]/10">
                              <img
                                src={item.sole.image}
                                alt={item.sole.name}
                                className="w-10 h-10 object-contain mix-blend-multiply"
                              />
                              <div>
                                <p className="font-mono text-[8px] uppercase tracking-[2px] opacity-40">
                                  Base Unit
                                </p>
                                <p className="font-mono text-[10px] font-bold uppercase">
                                  {item.sole.name}
                                </p>
                              </div>
                              <Link
                                href="/products/soles"
                                className="ml-auto font-mono text-[9px] text-[#d4604d] border-b border-[#d4604d] hover:opacity-70 transition-opacity uppercase"
                              >
                                Change →
                              </Link>
                            </div>
                          )}
                        </div>

                        {/* Qty + Price */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#17191d]/10">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 border-2 border-[#17191d] flex items-center justify-center font-bold hover:bg-[#17191d] hover:text-white transition-colors text-sm"
                            >
                              −
                            </button>
                            <span className="font-mono text-[12px] font-bold w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 border-2 border-[#17191d] flex items-center justify-center font-bold hover:bg-[#17191d] hover:text-white transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-[9px] opacity-40 uppercase">
                              Unit Price
                            </p>
                            <p className="font-display text-2xl">
                              ₹
                              {(itemPrice * item.quantity).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-[#17191d] text-[#e5f1ee] p-8 flex flex-col gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[4px] text-[#d4604d] font-bold mb-2">
                  Order Summary
                </p>
                <h3 className="font-display text-3xl uppercase">
                  Build Total.
                </h3>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#e5f1ee]/10 pt-6">
                <div className="flex justify-between font-mono text-[10px] uppercase">
                  <span className="opacity-60">
                    Subtotal ({totalItems} units)
                  </span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px] uppercase">
                  <span className="opacity-60">Shipping</span>
                  <span className={shipping === 0 ? "text-[#d4604d]" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-mono text-[8px] text-[#d4604d] opacity-70">
                    Add ₹{(10000 - subtotal).toLocaleString("en-IN")} more for
                    free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-[#e5f1ee]/10 pt-6 flex justify-between items-end">
                <p className="font-mono text-[10px] uppercase opacity-60">
                  Total
                </p>
                <p className="font-display text-4xl">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              <Link
                href="/checkout"
                className="bg-[#d4604d] text-white font-mono text-[11px] font-bold uppercase tracking-[4px] py-5 text-center hover:bg-white hover:text-[#17191d] transition-colors"
              >
                Proceed to Checkout →
              </Link>

              <Link
                href="/products"
                className="font-mono text-[9px] uppercase tracking-[2px] text-center opacity-40 hover:opacity-100 hover:text-[#d4604d] transition-all"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
