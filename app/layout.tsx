import type { Metadata } from "next";
import { Anton, Inter, Space_Mono } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const helveticaNeue = localFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeueThin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueUltraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueUltraLightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueLightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueHeavyItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeueBlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

import { constructMetadata } from "@/lib/seo";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${helveticaNeue.variable} ${anton.variable} ${inter.variable} ${spaceMono.variable} antialiased bg-ink text-paper`}
      >
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <TooltipProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </TooltipProvider>
      </body>
    </html>
  );
}
