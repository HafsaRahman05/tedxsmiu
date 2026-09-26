import Link from "next/link";
import Image from "next/image";
import { 
  FaInstagram, 
  FaFacebook, 
  FaLinkedin, 
  FaYoutube, 
  FaXTwitter 
} from 'react-icons/fa6';

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
  { name: "X", href: "https://x.com", icon: FaXTwitter },
  { name: "YouTube", href: "https://youtube.com", icon: FaYoutube },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebook },
];

const LINKS = [ 
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "Speakers", href: "/speakers" },
  { label: "Team", href: "/team" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink px-4 sm:px-6 pt-16 pb-10 lg:px-12">
      
      {/* Background Watermark 3D X Emblem */}
      <div className="pointer-events-none absolute -right-16 top-0 z-0 opacity-[0.04] select-none hidden md:block">
        <Image
          src="/images/branding/X main Logo.png"
          alt="TEDxSMIU Watermark"
          width={450}
          height={450}
          className="h-full w-auto object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        
        {/* Main Footer Grid */}
        <div className="grid gap-8 sm:gap-12 border-b border-white/10 pb-12 sm:pb-16 md:grid-cols-12">
          
          {/* Column 1: Brand & Identity (Col Span 5) */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block">
              <Image
                src="/images/branding/X logo white.png"
                alt="TEDxSMIU Logo"
                width={190}
                height={42}
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
            
            <p className="mt-4 sm:mt-5 max-w-sm font-helvetica text-xs sm:text-sm font-normal text-neutral-300 leading-relaxed">
              In the spirit of ideas worth spreading, TEDxSMIU is an independently organized event bringing live local speakers, innovative creators, and thinkers to Sindh Madressatul Islam University.
            </p>

            <div className="mt-3 sm:mt-4 font-mono text-[11px] sm:text-xs text-neutral-400">
              Coordinates: <span className="text-white font-bold">24.8508° N, 67.0011° E</span>
            </div>
            
            {/* Social Icons */}
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-3 sm:gap-4">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit TEDxSMIU on ${s.name}`}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center border border-white/10 bg-surface text-neutral-300 transition-all hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Index Links (Col Span 4) */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              Directory
            </h4>
            <ul className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="font-helvetica text-xs text-neutral-400 hover:text-white transition-colors py-0.5 inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Venue & Contact Details (Col Span 3) */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-primary">
              Location
            </h4>
            <div className="mt-4 sm:mt-5 font-helvetica text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-white block pb-1">Sindh Madressatul Islam University</span>
              Sir Shahnawaz Bhutto Auditorium / Talpur House<br />
              I.I. Chundrigar Road<br />
              Karachi 74000, Pakistan
            </div>

            <div className="mt-5 sm:mt-6">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors underline underline-offset-4"
              >
                Inquiries &amp; Accreditation →
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar: TED License Disclaimer */}
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.12em] sm:tracking-[0.15em] text-neutral-400 sm:flex-row sm:text-left">
          <span>© 2026 TEDxSMIU. All rights reserved.</span>
          <span className="text-center">
            This independent TEDx event is operated under license from TED.
          </span>
          <a 
            href="https://www.ted.com/tedx" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-primary transition-colors text-white font-bold"
          >
            Official TEDx Program ↗
          </a>
        </div>

      </div>
    </footer>
  );
}