"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Post } from "@/types";

export default function BlogGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="stories" className="border-b border-white/10 bg-black px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="mt-3 font-helvetica text-4xl font-black uppercase text-white sm:text-5xl">
              Featured Stories
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-white underline decoration-[#EB0028] decoration-2 underline-offset-4 transition-colors hover:text-[#EB0028]"
          >
            View All Stories
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-none border border-white/10 bg-white/[0.04]"
                />
              ))
            : posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-none border border-white/10 bg-white/[0.02] transition-colors hover:border-[#EB0028]/60"
                  >
                    <div
                      className="aspect-[16/10] w-full border-b border-white/10"
                      style={{ background: post.gradient }}
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-helvetica text-xl font-black uppercase leading-tight text-white transition-colors group-hover:text-[#EB0028]">
                        {post.title}
                      </h3>
                      <p className="flex-1 text-sm text-neutral-400">
                        {post.excerpt}
                      </p>
                      <div className="mt-2 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                        <span>{post.author}</span>
                        <span className="text-white transition-transform group-hover:translate-x-1 group-hover:text-[#EB0028]">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}