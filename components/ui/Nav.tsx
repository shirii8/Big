"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/#home", id: "home", label: "Home" },
  { href: "/#how-it-works", id: "how-it-works", label: "How It Works" },
  { href: "/products", id: "range", label: "Range" },
  { href: "/#about", id: "about", label: "Story" },
];

export default function Nav() {
  const [activeId, setActiveId] = useState("home");
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (pathname.includes("/products")) {
        setActiveId("range");
        return;
      }
      const sectionIds = ["home", "how-it-works", "range", "about"];
      const scrollPos = window.scrollY + 200;
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveId(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 md:px-12 py-5 bg-[#d4604d]">
      <Link href="/" className="font-display text-2xl text-[#e5f1ee] font-bold">
        TESSCH.
      </Link>

      <ul className="hidden lg:flex gap-8 list-none m-0 p-0">
        {NAV_LINKS.map(({ href, label, id }) => {
          const isActive = activeId === id;
          return (
            <li key={id} className="relative">
              <Link
                href={href}
                className={`font-mono text-[9px] uppercase tracking-[2px] font-bold transition-colors ${
                  isActive ? "text-[#17191d]" : "text-[#e5f1ee]/70"
                }`}
              >
                {label}
              </Link>
              {isActive && (
                <motion.span
                  layoutId="navDot"
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#17191d]"
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-row items-center gap-3 text-white font-mono text-[10px] uppercase">
        {isLoading ? (
          <span className="opacity-50 animate-pulse px-4 py-2">...</span>
        ) : isAuthenticated ? (
          <>
            {/* Profile */}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors whitespace-nowrap"
            >
              <User size={12} />
              <span>{user?.given_name ?? "Profile"}</span>
            </Link>

            {/* Cart with badge */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 transition-all ${
                totalItems > 0
                  ? "bg-[#17191d] text-white shadow-md"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <ShoppingCart size={12} />
              <span>Cart</span>

              {totalItems > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-white text-[#17191d] rounded-full text-[9px] flex items-center justify-center font-bold shadow-md">
                    {totalItems}
                  </span>
                  <span className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full bg-white animate-ping opacity-30"></span>
                </>
              )}
            </Link>

            {/* Logout */}
            <LogoutLink postLogoutRedirectURL="/">
              <button className="bg-[#17191d] text-[#e5f1ee] rounded-full px-5 py-2 hover:bg-black transition-all active:scale-95">
                Logout
              </button>
            </LogoutLink>
          </>
        ) : (
          <>
            <LoginLink postLoginRedirectURL="/">
              <button className="bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors">
                Sign in
              </button>
            </LoginLink>
            <RegisterLink postLoginRedirectURL="/">
              <button className="bg-[#17191d] text-[#e5f1ee] rounded-full px-4 py-2 hover:bg-black transition-colors">
                Sign up
              </button>
            </RegisterLink>
          </>
        )}
      </div>
    </nav>
  );
}