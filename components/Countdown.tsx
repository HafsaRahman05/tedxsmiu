"use client";

import { useEffect, useState } from "react";

const EVENT_TARGET = new Date("2026-10-01T09:00:00+05:00").getTime();

function getTimeLeft() {
  const distance = EVENT_TARGET - Date.now();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
    isLive: false,
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const items = [
    { label: "Days", value: String(timeLeft.days).padStart(2, "0") },
    { label: "Hours", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "Mins", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "Secs", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="mt-4 w-full max-w-md rounded-none border border-white/10 bg-[#120d0d]/90 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-400">
          Countdown
        </span>
        <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
          {timeLeft.isLive ? "Live now" : "Until Convergence"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div key={item.label} className="border border-white/10 bg-surface/70 p-2 text-center">
            <div className="font-helvetica text-lg sm:text-xl font-black text-white leading-none">{item.value}</div>
            <div className="mt-1 font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-neutral-400">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
