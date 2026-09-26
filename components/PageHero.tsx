"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  title: string;
  description: string;
  gradient?: string;
};

export default function PageHero({
  title,
  description,
  gradient = "linear-gradient(135deg,#2b0f0d,#7a1f19,#eb0028)",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section
      ref={ref}
      className="relative flex h-[60vh] min-h-[420px] w-full items-end overflow-hidden bg-background"
    >
      <motion.div
        style={{ y, background: gradient }}
        className="absolute inset-0 -top-[15%] h-[130%]"
      />

      {/* Cultural Ajrak Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-55 mix-blend-overlay pointer-events-none bg-repeat bg-size-[100vh_auto]"
        style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(10,10,11,0.1),rgba(10,10,11,0.95))]" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 w-full px-6 pb-14 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-helvetica text-[13vw] font-black uppercase leading-[0.88] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-xl font-helvetica text-sm text-muted-foreground leading-relaxed sm:text-base"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}