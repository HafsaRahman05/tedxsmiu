"use client";

import { useRef, useState } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <section className="relative border-b border-line bg-ink px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative aspect-video w-full overflow-hidden border border-line bg-surface">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            poster=""
            className="h-full w-full object-cover opacity-90"
          >
            <source src="" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1b1b1e,#0a0a0b)]" />

          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center focus:outline-none"
            aria-label={playing ? "Pause reel" : "Play reel"}
          >
            <span className="flex h-20 w-20 items-center justify-center border border-paper/40 bg-ink/60 text-paper backdrop-blur transition-all hover:scale-105 hover:border-red hover:bg-ink sm:h-24 sm:w-24">
              {playing ? (
                <span className="flex gap-2">
                  <span className="h-8 w-2 bg-paper" />
                  <span className="h-8 w-2 bg-paper" />
                </span>
              ) : (
                <span className="ml-1 h-0 w-0 border-y-[14px] border-l-[22px] border-y-transparent border-l-paper" />
              )}
            </span>
          </button>

          <div className="absolute bottom-6 left-6 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
            Event Reel — Convergence 2026
          </div>
        </div>
      </div>
    </section>
  );
}