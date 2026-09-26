import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/dashboard/",
          "/dashboard",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}
