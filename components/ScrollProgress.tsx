"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-0 top-0 z-[60] h-dvh w-[3px] bg-line/40"
    >
      <motion.div
        className="relative h-full origin-top bg-red"
        style={{ scaleY: scrollYProgress }}
      >
        <span className="absolute -bottom-[5px] -left-[5px] h-[3px] w-[13px] bg-red shadow-[0_0_12px_2px_rgba(235,0,40,0.7)]" />
      </motion.div>
    </div>
  );
}