export default function TedxExplainer() {
  return (
    <section id="about-tedx" className="border-b border-border bg-background px-6 py-20 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        
        {/* Visual Badge - Left Side */}
        <div className="relative aspect-video w-full border border-border bg-secondary flex items-center justify-center p-8 order-2 lg:order-1">
          <span className="font-helvetica text-7xl sm:text-8xl font-black text-primary tracking-tighter">
            TED<span className="text-foreground">x</span>
          </span>
        </div>

        {/* Text Content - Right Side */}
        <div className="order-1 lg:order-2">
          <h2 className="mt-2 font-helvetica text-3xl font-black uppercase text-foreground sm:text-4xl">
            What is TEDx?
          </h2>
          <p className="mt-4 font-helvetica text-base font-normal text-muted-foreground leading-relaxed">
            In the spirit of ideas worth spreading, TED created a program called TEDx.
            TEDx events are local, self-organized events that bring people together 
            to share a TED-like experience. At a TEDx event, live speakers and recorded 
            talks combine to spark deep discussion and connection.
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

      </div>
    </section>
  );
}