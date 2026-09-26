"use client";

import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Users, Mic, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

const CONTACT_INFO = [
  {
    title: "General Inquiries",
    detail: "hello@tedxsmiu.com",
    subtext: "For questions about the event, ticketing, or schedule",
    icon: Mail,
    href: "mailto:hello@tedxsmiu.com",
  },
  {
    title: "Phone & WhatsApp",
    detail: "+92 300 0000000",
    subtext: "Mon - Fri from 9:00 AM to 5:00 PM (PKT)",
    icon: Phone,
    href: "tel:+923000000000",
  },
  {
    title: "Venue & Campus",
    detail: "Sindh Madressatul Islam University",
    subtext: "Aiwan-e-Tijarat Road, Shahrah-e-Liaquat, Karachi, Pakistan",
    icon: MapPin,
    href: "https://maps.google.com/?q=Sindh+Madressatul+Islam+University",
  },
];

export default function ContactClient() {
  return (
    <PageShell>
      <PageHero
        title="Contact Us"
        description="Have questions, ideas, or want to partner with TEDxSMIU? Reach out to our organizing team."
        gradient="linear-gradient(135deg,#110303,#500a08,#EB0028)"
      />

      {/* DIRECT CONTACT & DETAILS SECTION */}
      <section className="bg-background px-6 pt-20 pb-16 lg:px-10 text-foreground border-b border-border">
        <div className="mx-auto w-full max-w-7xl">
          
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
              Reach Out Directly
            </h2>
          </div>

          {/* Symmetrical 3-Column Direct Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CONTACT_INFO.map((info, idx) => {
              const IconComponent = info.icon;
              return (
                <a
                  key={idx}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between rounded-none border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:bg-secondary"
                >
                  <div>
                    <div className="mb-6 inline-flex items-center justify-center border border-primary/30 bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {info.title}
                    </h3>
                    <p className="mt-2 font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                      {info.detail}
                    </p>
                  </div>
                  <p className="mt-6 border-t border-border pt-4 font-sans text-xs text-muted-foreground leading-relaxed">
                    {info.subtext}
                  </p>
                </a>
              );
            })}
          </div>

        </div>
      </section>

      {/* Specific Applications Section */}
      <section className="bg-background px-6 py-20 lg:px-10 text-foreground">
        <div className="mx-auto w-full max-w-7xl">
          
          <div className="mb-12">
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">
              Specific Applications
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Card 1: Partner */}
            <Link
              href="/contact/partner"
              className="group flex h-full flex-col justify-between rounded-none border border-border bg-card p-8 transition-all hover:border-primary hover:bg-secondary md:p-10"
            >
              <div>
                <Users className="mb-6 h-8 w-8 text-primary" />
                <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
                  Become a Partner
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  At TEDxSMIU, partnerships bring ideas to life. As a partner, you
                  reach an engaged, diverse community of innovators and thought leaders.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-3">
                Apply now <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Card 2: Speaker */}
            <Link
              href="/contact/speaker"
              className="group flex h-full flex-col justify-between rounded-none border border-border bg-card p-8 transition-all hover:border-primary hover:bg-secondary md:p-10"
            >
              <div>
                <Mic className="mb-6 h-8 w-8 text-primary" />
                <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
                  Become a Speaker
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  We&apos;re searching for ideas that haven&apos;t been heard before — fresh
                  perspectives that challenge assumptions. Got an idea worth spreading?
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-3">
                Apply now <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Card 3: Core Team */}
            <Link
              href="/contact/core-team"
              className="group flex h-full flex-col justify-between rounded-none border border-border bg-card p-8 transition-all hover:border-primary hover:bg-secondary md:p-10"
            >
              <div>
                <Users className="mb-6 h-8 w-8 text-primary" />
                <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
                  Core Team
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  Drive the vision, strategy, and execution of TEDxSMIU. Applications for leadership roles are currently closed.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary transition-all group-hover:gap-3">
                Learn More <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-background px-6 py-20 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="font-display text-4xl font-black text-foreground md:text-5xl">500+</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Attendees</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-black text-foreground md:text-5xl">10+</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Speakers</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-black text-foreground md:text-5xl">50+</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Volunteers</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-black text-foreground md:text-5xl">1</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Historic Campus</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
