import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import TedExplainer from "@/components/TedExplainer";
import TedxExplainer from "@/components/TedxExplainer";
import TedxSMIUExplainer from "@/components/TedxSMIUExplainer";
import BrandIdentitySection from "@/components/BrandIdentitySection";
import { Button } from "@/components/ui/button";
import { constructMetadata } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "TEDxSMIU is an independently organized TEDx event run by students at Sindh Madressatul Islam University, bringing world-changing ideas to life.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", item: "/" },
          { name: "About", item: "/about" },
        ])}
      />
      <PageHero
        title="About"
        description="An independently organized TEDx event, run entirely by students, for the whole university community."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />
      <TedExplainer />
      <TedxExplainer />
      <TedxSMIUExplainer />
      <BrandIdentitySection />

      {/* Meet The Team CTA Section */}
      {/* <section className="border-t border-border bg-background px-6 py-20 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden border border-border bg-white/[0.02] p-8 md:p-12 lg:flex lg:items-center lg:justify-between">
            
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="max-w-2xl">
              <h2 className="mt-2 font-helvetica text-3xl font-bold text-foreground md:text-4xl">
                Meet the minds making it happen.
              </h2>
              <p className="mt-4 font-helvetica text-base font-normal text-muted-foreground leading-relaxed">
                TEDxSMIU is powered entirely by dedicated students, organizers, and volunteers working together to bring world-changing ideas to life.
              </p>
            </div>

            <div className="mt-8 lg:mt-0 lg:shrink-0">
              <Button asChild variant="default" className="rounded-none border border-primary px-6 py-6 font-mono text-xs uppercase tracking-wider transition-all hover:bg-transparent hover:text-primary">
                <Link href="/team">
                  Meet Our Team →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </PageShell>
  );
}