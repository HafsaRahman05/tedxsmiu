"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import type { Post } from "@/types";

export default function BlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <PageHero
        title="Blog"
        description="Essays and dispatches from speakers, the organizing team, and the wider community."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />

      <section className="border-b border-white/10 bg-black px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 animate-pulse rounded-none border border-white/10 bg-white/[0.04]"
                  />
                ))
              : posts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                  >
                    <Link
                      href={`/blog/${post.id}`}
                      className="group flex flex-col gap-5 rounded-none border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#EB0028]/60 sm:flex-row sm:items-stretch"
                    >
                      <div
                        className="h-40 w-full shrink-0 rounded-none border border-white/10 sm:h-auto sm:w-56"
                        style={{ background: post.gradient }}
                      />
                      <div className="flex flex-1 flex-col justify-center gap-2">
                        <h2 className="font-display text-2xl font-black uppercase leading-tight text-white transition-colors group-hover:text-[#EB0028]">
                          {post.title}
                        </h2>
                        <p className="text-sm text-neutral-400">
                          {post.excerpt}
                        </p>
                        <div className="mt-1 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                          <span>{post.author}</span>
                          <span>·</span>
                          <span>
                            {new Date(post.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
