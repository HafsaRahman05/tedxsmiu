"use client";

import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import { Users, Mic, Mail, MapPin, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { APPLICATIONS_OPEN } from "./application-status";

const CONTACT_INFO = [
  {
    title: "Official Email",
    detail: "tedxsmiuofficial@gmail.com",
    subtext: "For questions about the event, ticketing, or schedule",
    icon: Mail,
    href: "mailto:tedxsmiuofficial@gmail.com",
  },
  {
    title: "Social Media",
    detail: "Follow TEDxSMIU",
    subtext: "Stay connected with our latest news, talks, and event updates",
    icon: Share2,
    socials: [
      { name: "Instagram", href: "https://www.instagram.com/tedxsmiuofficial/", icon: FaInstagram },
      { name: "LinkedIn", href: "https://www.linkedin.com/company/tedxsmiuofficial/", icon: FaLinkedinIn },
      { name: "YouTube", href: "https://www.youtube.com/@TEDxSMIU-e5m", icon: FaYoutube },
      { name: "Facebook", href: "https://www.facebook.com/tedxsmiuofficial", icon: FaFacebookF },
    ],
  },
  {
    title: "Venue & Campus",
    detail: "Sindh Madressatul Islam University",
    subtext: "Aiwan-e-Tijarat Road, Shahrah-e-Liaquat, Karachi, Pakistan",
    icon: MapPin,
    href: "https://maps.google.com/?q=Sindh+Madressatul+Islam+University",
  },
];

const LEADS = [
  {
    name: "Asadullah Shaikh",
    role: "License Holder, TEDxSMIU 2.0",
    email: "asadullahshaikh244@gmail.com",
    phone: "+92 309 2501412",
  },
  {
    name: "Ali Mehdi Abro",
    role: "Lead Organizer, TEDxSMIU 2.0",
    email: "aliabro626@gmail.com",
    phone: "+92 313 1588717",
  },
  {
    name: "Hasnain Ali",
    role: "Co-Lead Organizer, TEDxSMIU 2.0",
    email: "hasnainali7673@outlook.com",
    phone: "+92 317 0897673",
  },
];

export default function ContactClient({
  stats,
}: {
  stats: { speakerCount: number; partnerCount: number };
}) {
  const metrics = [
    { value: "300+", label: "Exclusive" },
    { value: `${stats.speakerCount.toLocaleString()}+`, label: "Speakers" },
    { value: `${stats.partnerCount.toLocaleString()}+`, label: "Partners" },
    { value: "70+", label: "Team Size" },
    { value: "1", label: "Venue" },
  ];

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
              const cardContent = (
                <>
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
                  {"socials" in info && info.socials ? (
                    <div className="mt-6 flex gap-3 border-t border-border pt-2">
                      {info.socials.map((social) => {
                        const SocialIcon = social.icon;
                        return (
                          <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit TEDxSMIU on ${social.name}`}
                            title={social.name}
                            className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            <SocialIcon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-6 border-t border-border pt-4 font-sans text-xs leading-relaxed text-muted-foreground">
                      {info.subtext}
                    </p>
                  )}
                </>
              );

              const cardClassName =
                "group relative flex flex-col justify-between rounded-none border border-border bg-card p-8 transition-all duration-300 hover:border-primary hover:bg-secondary";

              return "href" in info && typeof info.href === "string" ? (
                <a
                  key={idx}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className={cardClassName}
                >
                  {cardContent}
                </a>
              ) : (
                <article key={idx} className={cardClassName}>
                  {cardContent}
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* Lead contacts */}
      <section className="border-b border-border bg-black px-6 py-20 text-foreground lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
              TEDxSMIU 2.0
            </p>
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
              Organizing Leads
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Connect with the team leading the TEDxSMIU experience. 
              For general inquiries, reach out through our official team email.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {LEADS.map((lead, index) => (
              <article
                key={lead.name}
                className="group border border-white/10 bg-surface transition-colors duration-300 hover:border-primary"
              >
                <div className="p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    {lead.role}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-black uppercase leading-tight">
                    {lead.name}
                  </h3>
                  <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${lead.email}`}
                      className="block transition-colors hover:text-primary"
                    >
                      {lead.email}
                    </a>
                    <a
                      href={`tel:${lead.phone.replace(/\s/g, "")}`}
                      className="block transition-colors hover:text-primary"
                    >
                      Phone / WhatsApp: {lead.phone}
                    </a>
                    <a
                      href="mailto:tedxsmiuofficial@gmail.com"
                      className="block transition-colors hover:text-primary"
                    >
                      tedxsmiuofficial@gmail.com
                    </a>
                  </div>
                </div>
              </article>
            ))}
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
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {APPLICATIONS_OPEN ? (
                  <>Apply now <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-1" /></>
                ) : (
                  "Currently Closed"
                )}
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
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary">
                {APPLICATIONS_OPEN ? (
                  <>Apply now <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-1" /></>
                ) : (
                  "Currently Closed"
                )}
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
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {metrics.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-display text-4xl font-black text-foreground md:text-5xl">
                  {value}
                </p>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
