"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[70vh] sm:min-h-screen w-full flex-col justify-between overflow-hidden bg-black text-white"
    >
      {/* Background Talpur House Building & Subtle Ajrak Pattern */}
      <motion.div style={{ scale: plateScale }} className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/branding/talpur-house-building.png"
          alt="SMIU Talpur House Building"
          width={1920}
          height={1080}
          priority
          className="absolute bottom-0 sm:-bottom-16 md:-bottom-20 w-screen object-cover object-bottom opacity-75 max-h-[50vh] scale-200 sm:scale-100 sm:max-h-[60vh] md:max-h-none"
        />

        {/* Traditional Ajrak Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none bg-repeat bg-[length:600px_auto] sm:bg-[length:100vh_auto]"
          style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </motion.div>

      {/* Main Centered Content Area */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6 pt-28 sm:pt-36 md:pt-44 pb-8 sm:pb-12 text-center my-auto"
      >
        {/* Brand Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 mb-3 sm:mb-4 px-3 py-1 border border-white/10 bg-black/40 backdrop-blur-sm"
        >
          Sindh Madressatul Islam University
        </motion.span>

        {/* Clean, Impactful Responsive Heading */}
        <h1 className="select-none font-helvetica font-black tracking-tight leading-[0.92] text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] xl:text-[5.8vw]">
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-primary block"
          >
            THE FUTURE
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-1 sm:mt-2 text-white block"
          >
            DOESN&apos;T WAIT
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 sm:mt-6 max-w-xl sm:max-w-2xl text-center font-helvetica text-sm sm:text-base md:text-lg lg:text-xl font-normal leading-relaxed text-neutral-300 px-2"
        >
          It is imagined, challenged, and created by those bold enough to think differently.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4"
        >
          <Button 
            asChild 
            variant="default" 
            className="w-full sm:w-auto rounded-none border border-primary bg-primary px-7 sm:px-8 py-5 sm:py-6 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-transparent  shadow-[0_0_25px_rgba(235,0,40,0.3)] active:scale-95 text-center"
          >
            <Link href="/events">
              Explore Event
            </Link>
          </Button>

          <Button 
            asChild 
            variant="default" 
            className="w-full sm:w-auto rounded-none border border-white/20 bg-white/10 px-7 sm:px-8 py-5 sm:py-6 font-mono text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-primary hover:bg-white/20 active:scale-95 text-center"
          >
            <Link href="#experience">
              Discover SMIU ↓
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-2 self-center pb-6 sm:pb-8"
      >
        <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-6 sm:h-7 w-[1px] bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}