import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.domain;

  // Core static indexable pages
  const staticPages = [
    "",
    "/about",
    "/events",
    "/speakers",
    "/guests",
    "/talks",
    "/partners",
    "/team",
    "/contact",
    "/contact/core-team",
    "/contact/partner",
    "/contact/speaker",
    "/blog",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic Blog Post entries from database
  try {
    const publishedBlogs = await db
      .select({ id: blogs.id, updatedAt: blogs.updatedAt, publishedAt: blogs.publishedAt })
      .from(blogs)
      .where(eq(blogs.status, "PUBLISHED"));

    const blogEntries: MetadataRoute.Sitemap = publishedBlogs.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticEntries, ...blogEntries];
  } catch {
    return staticEntries;
  }
}
