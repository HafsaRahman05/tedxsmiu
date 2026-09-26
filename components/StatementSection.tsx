"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface StatementSectionProps {
  lines: string[];
  body?: string; 
  align?: "left" | "right";
  bgImage?: string;
  sticky?: boolean;
  zIndex?: number;
  link?: { href: string; label: string } | null;
  children?: React.ReactNode;
}

export default function StatementSection({
  lines,
  body = "", 
  align = "left",
  bgImage = "/images/hero/smiu-night-view.jpg",
  sticky = false,
  zIndex = 10,
  link = null,
  children,
}: StatementSectionProps) {
  const isRight = align === "right";

  return (
    <section
      style={{ zIndex }}
      className={`relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-20 lg:px-10 text-foreground ${
        sticky ? "sticky top-0" : ""
      }`}
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={lines?.[0] || "Statement background"}
          fill
          sizes="100vw"
          className="object-cover object-center opacity-40 brightness-90 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div
          className={`flex flex-col ${
            isRight ? "items-end text-right" : "items-start text-left"
          }`}
        >


          {/* Consistent H2 Headings */}
          <h2 className="mt-4 select-none font-helvetica font-bold tracking-tight leading-[0.9] text-[10vw] sm:text-[7vw] md:text-[5.5vw] lg:text-[4.5vw]">
            {lines.map((line, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 * idx }}
                className={`block ${
                  idx === lines.length - 1 ? "text-primary" : "text-foreground"
                }`}
              >
                {line}
              </motion.span>
            ))}
          </h2>

          {/* Standardized Paragraph Body */}
          {body && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 max-w-xl font-helvetica text-base font-normal text-muted-foreground sm:text-lg leading-relaxed"
            >
              {body}
            </motion.p>
          )}

          {/* Children Components */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 w-full"
            >
              {children}
            </motion.div>
          )}

          {/* External Link */}
          {link && (
            <motion.a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {link.label} ↗
            </motion.a>
          )}
        </div>
      </div>
    </section>
  );
}