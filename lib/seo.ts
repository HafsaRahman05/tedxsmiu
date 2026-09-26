import type { Metadata } from "next";

export const SITE_CONFIG = {
  name: "TEDxSMIU",
  domain: "https://www.tedxsmiu.com",
  description:
    "An independently organized TEDx event at Sindh Madressatul Islam University. A cinematic journey through human innovation, creativity, and ideas worth spreading.",
  defaultOgImage: "/images/branding/X main Logo.png",
  twitterHandle: "@tedxsmiu",
  locale: "en_PK",
  organization: {
    name: "TEDxSMIU",
    url: "https://www.tedxsmiu.com",
    logo: "https://www.tedxsmiu.com/images/branding/X%20logo%20white.png",
    sameAs: [
      "https://instagram.com/tedxsmiu",
      "https://facebook.com/tedxsmiu",
      "https://linkedin.com/company/tedxsmiu",
      "https://x.com/tedxsmiu",
      "https://youtube.com/@tedxsmiu",
    ],
  },
};

export function constructMetadata({
  title,
  description = SITE_CONFIG.description,
  path = "",
  image = SITE_CONFIG.defaultOgImage,
  type = "website",
  noIndex = false,
  publishedTime,
  authors,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  authors?: string[];
} = {}): Metadata {
  const url = `${SITE_CONFIG.domain}${path.startsWith("/") ? path : `/${path}`}`;
  const pageTitle = title ? `${title} — ${SITE_CONFIG.name}` : `${SITE_CONFIG.name}`;
  const absoluteImageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.domain}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: pageTitle,
    description,
    metadataBase: new URL(SITE_CONFIG.domain),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      locale: SITE_CONFIG.locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [absoluteImageUrl],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/images/branding/X main Logo.png",
    },
  };
}
