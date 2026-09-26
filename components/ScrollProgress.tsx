"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-line/40 pointer-events-none"
    >
      <motion.div
        className="relative h-full bg-red origin-left"
        style={{ scaleX: scrollYProgress }}
      >
        <span className="absolute right-0 -top-[5px] h-[13px] w-[3px] bg-red shadow-[0_0_12px_2px_rgba(235,0,40,0.7)]" />
      </motion.div>
    </div>
  );
}