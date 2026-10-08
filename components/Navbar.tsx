"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Guests", href: "/guests" },
  { label: "Speakers", href: "/speakers" },
  { label: "Team", href: "/team" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const forceSolid = pathname !== "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid || forceSolid
          ? "bg-ink/95 backdrop-blur-xl border-b border-white/10 py-3 sm:py-3.5"
          : "bg-gradient-to-b from-ink/90 via-ink/40 to-transparent py-4 sm:py-5"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="TEDxSMIU Home"
        >
          <Image
            src="/images/branding/X logo white.png"
            alt="TEDxSMIU Logo"
            width={170}
            height={38}
            priority
            className="h-6 sm:h-7 md:h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-6 xl:gap-8 lg:flex" role="menubar">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.label} className="relative py-1" role="none">
                <Link
                  href={l.href}
                  className={`group relative font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                    active ? "text-primary font-bold" : "text-neutral-400 hover:text-white"
                  }`}
                  role="menuitem"
                >
                  {l.label}

                  {/* Active / Hover Animated Line */}
                  {active ? (
                    <motion.span
                      layoutId="activeNavTab"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action Button (Editorial Sharp Red Box) */}
        <div className="hidden lg:flex items-center gap-4">
          <Button 
            asChild 
            className="rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-white hover:text-black border border-primary px-5 xl:px-6 py-4 xl:py-5 shadow-lg active:scale-95"
          >
            <Link href="/contact">
              Contact us
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 sm:h-11 sm:w-11 flex-col items-center justify-center gap-1.5 p-2 lg:hidden text-white border border-white/10 bg-surface-raised/60 backdrop-blur-md"
          aria-label={open ? "Close menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          <span
            className={`h-[2px] w-5 bg-white transition-transform duration-300 ${
              open ? "translate-y-[8px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-5 bg-white transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-5 bg-white transition-transform duration-300 ${
              open ? "-translate-y-[8px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay with Smooth Animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 border-b border-white/10 bg-ink/98 backdrop-blur-2xl px-6 py-6 shadow-2xl lg:hidden flex flex-col gap-2 max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 pb-2 border-b border-white/10">
              Navigation
            </div>
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors border-b border-white/5 ${
                    active ? "text-primary font-bold" : "text-neutral-300 hover:text-primary"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </Link>
              );
            })}

            <div className="pt-3">
              <Button 
                asChild 
                className="w-full rounded-none bg-primary text-white font-mono text-xs font-bold uppercase tracking-widest py-5 sm:py-6 hover:bg-white hover:text-black border border-primary"
              >
                <Link href="/tickets" onClick={() => setOpen(false)}>
                  Tickets →
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}