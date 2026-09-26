import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { constructMetadata } from "@/lib/seo";
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  const post = result[0];

  if (!post) return constructMetadata({ title: "Post Not Found", noIndex: true });

  return constructMetadata({
    title: post.title,
    description: post.excerpt || "",
    path: `/blog/${post.id}`,
    type: "article",
    publishedTime: post.publishedAt ? post.publishedAt.toISOString() : undefined,
    authors: post.authorId ? [post.authorId] : ["TEDxSMIU"],
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const result = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
  const post = result[0];

  if (!post) notFound();

  const formattedPost = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    author: "TEDxSMIU Curatorial Team",
    date: post.publishedAt ? post.publishedAt.toISOString() : new Date().toISOString(),
    body: post.content || "",
    tag: "Story",
    gradient: "linear-gradient(135deg,#7a1f19,#2b0f0d)",
  };

  return (
    <PageShell>
      <JsonLd
        data={[
          getBlogPostingSchema(formattedPost),
          getBreadcrumbSchema([
            { name: "Home", item: "/" },
            { name: "Blog", item: "/blog" },
            { name: formattedPost.title, item: `/blog/${formattedPost.id}` },
          ]),
        ]}
      />
      <article className="border-b border-white/10 bg-black px-6 pt-32 pb-20 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 transition-colors hover:text-[#EB0028]"
          >
            ← All Stories
          </Link>

          <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] sm:text-5xl text-white">
            {formattedPost.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
            <span>{formattedPost.author}</span>
            <span>·</span>
            <span>
              {new Date(formattedPost.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div
            className="mt-10 aspect-video w-full rounded-none border border-white/10"
            style={{ background: formattedPost.gradient }}
          />

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-neutral-300">
            <p>{formattedPost.body}</p>
          </div>
        </div>
      </article>
    </PageShell>
  );
}