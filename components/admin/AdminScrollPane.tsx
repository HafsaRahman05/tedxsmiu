"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionValue } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";

export default function AdminScrollPane({ children }: { children: ReactNode }) {
  const scrollContainer = useRef<HTMLElement>(null);
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const updateProgress = () => {
      const scrollableHeight = container.scrollHeight - container.clientHeight;
      scrollProgress.set(
        scrollableHeight > 0 ? container.scrollTop / scrollableHeight : 0,
      );
    };

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(container);
    if (container.firstElementChild) {
      resizeObserver.observe(container.firstElementChild);
    }

    return () => {
      container.removeEventListener("scroll", updateProgress);
      resizeObserver.disconnect();
    };
  }, [scrollProgress]);

  return (
    <>
      <ScrollProgress progress={scrollProgress} />
      <main
        ref={scrollContainer}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto px-8 py-10 lg:px-12"
      >
        {children}
      </main>
    </>
  );
}
