import Image from "next/image";

export default function TedxSmiuExplainer() {
  return (
    <section id="about-smiu" className="border-b border-border bg-secondary px-6 py-24 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

        {/* Left Side: Content */}
        <div>
          <h2 className="mt-2 font-helvetica text-3xl font-black uppercase text-foreground sm:text-4xl">
            What is TEDxSMIU?
          </h2>
          <p className="mt-4 font-helvetica text-base font-normal text-muted-foreground leading-relaxed">
            TEDxSMIU is an independently organized TEDx event at Sindh Madressatul Islam University.
            By bringing live local speakers and recorded TED Talks together, we aim to spark deep discussions, celebrate local innovations, and foster lasting connections right here on campus.
          </p>
          <a
            href="https://www.ted.com/tedx"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Visit Official TEDx Program ↗
          </a>
        </div>

        {/* Right Side: Branded Showcase Cards */}
        <div className="relative flex flex-col gap-4">
          {/* Dark Surface Logo Card */}
          <div className="relative overflow-hidden border border-border bg-black p-8 flex flex-col items-center justify-center shadow-lg">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none bg-repeat bg-size-[60vh_auto]"
              style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
            />
            <Image
              src="/images/branding/X logo white.png"
              alt="TEDxSMIU White Logo (Dark Theme)"
              width={340}
              height={90}
              className="relative z-10 max-h-20 w-auto object-contain"
              priority
            />
            <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              Official Dark Theme Logo
            </span>
          </div>

          {/* Light Surface Logo Card */}
          <div className="relative overflow-hidden border border-border bg-white p-8 flex flex-col items-center justify-center shadow-lg">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none bg-repeat bg-size-[60vh_auto]"
              style={{ backgroundImage: "url('/images/branding/PATTERN - black.png')" }}
            />
            <Image
              src="/images/branding/Tedx SMIU Black.png"
              alt="TEDxSMIU Black Logo (Light Theme)"
              width={340}
              height={90}
              className="relative z-10 max-h-20 w-auto object-contain"
              priority
            />
            <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-neutral-600">
              Official Light Theme Logo
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}