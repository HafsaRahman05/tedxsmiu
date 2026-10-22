"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowDownToLine, X } from "lucide-react";

function getDownloadUrl(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.hostname === "res.cloudinary.com" && parsed.pathname.includes("/upload/")) {
      parsed.pathname = parsed.pathname.replace("/upload/", "/upload/fl_attachment/");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function getFileName(url: string) {
  try {
    return decodeURIComponent(new URL(url, window.location.origin).pathname.split("/").pop() || "tedxsmiu-moment");
  } catch {
    return "tedxsmiu-moment";
  }
}

export default function GalleryImagePreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute inset-0 cursor-zoom-in"
        aria-label={`Expand ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </button>

      {isOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close image preview"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/30 bg-black/70 text-white transition-colors hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
          <a
            href={getDownloadUrl(src)}
            download={getFileName(src)}
            onClick={(event) => event.stopPropagation()}
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 border border-white/30 bg-black/70 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:text-primary sm:left-8 sm:top-8"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Download
          </a>
          <img
            src={src}
            alt={alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
          <p className="absolute inset-x-20 bottom-6 text-center text-sm text-white/80 sm:bottom-9">
            {alt}
          </p>
        </div>,
        document.body,
      )}
    </>
  );
}
