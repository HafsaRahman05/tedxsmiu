import { SITE_CONFIG } from "./seo";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "TEDxSMIU",
    url: SITE_CONFIG.domain,
    logo: `${SITE_CONFIG.domain}/images/branding/X%20logo%20white.png`,
    image: `${SITE_CONFIG.domain}/images/branding/X%20main%20Logo.png`,
    description: SITE_CONFIG.description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Sindh Madressatul Islam University",
      url: "https://www.smiu.edu.pk",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Aiwan-e-Tijarat Road, Shahrah-e-Liaquat",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "74000",
      addressCountry: "PK",
    },
    sameAs: SITE_CONFIG.organization.sameAs,
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.domain,
    description: SITE_CONFIG.description,
    publisher: getOrganizationSchema(),
  };
}

export function getEventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "TEDxSMIU 2026 — Convergence",
    startDate: "2026-10-01T09:00:00+05:00",
    endDate: "2026-10-01T17:00:00+05:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Main Auditorium, Sindh Madressatul Islam University",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Aiwan-e-Tijarat Road",
        addressLocality: "Karachi",
        addressRegion: "Sindh",
        postalCode: "74000",
        addressCountry: "PK",
      },
    },
    image: [`${SITE_CONFIG.domain}/images/hero/smiu garden view.jpg`],
    description: "A full day of talks, installations, and conversation exploring where human ideas are headed next.",
    organizer: {
      "@type": "Organization",
      name: "TEDxSMIU",
      url: SITE_CONFIG.domain,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.domain}/contact`,
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };
}

export function getBlogPostingSchema(post: {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  body: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    articleBody: post.body,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: getOrganizationSchema(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.domain}/blog/${post.id}`,
    },
    image: `${SITE_CONFIG.domain}/images/branding/X%20main%20Logo.png`,
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : `${SITE_CONFIG.domain}${it.item}`,
    })),
  };
}
