export default function TedExplainer() {
  return (
    <section id="about-ted" className="border-b border-border bg-secondary px-6 py-20 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Side: Content */}
        <div>
          <h2 className="mt-2 font-helvetica text-3xl font-black uppercase text-foreground sm:text-4xl">
            What is TED?
          </h2>
          <p className="mt-4 font-helvetica text-base font-normal text-muted-foreground leading-relaxed">
            TED is a nonprofit organization devoted to Ideas Worth Spreading.
            Beginning as a 4-day conference in California, TED has grown to support 
            world-changing ideas with multiple initiatives. The two annual TED Conferences 
            bring together the world&apos;s leading thinkers and doers.
          </p>
          <a
            href="https://www.ted.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-foreground underline decoration-primary decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Visit Official TED Website ↗
          </a>
        </div>

        {/* Right Side: Visual Badge (Sharp Edges) */}
        <div className="relative aspect-video w-full border border-border bg-background flex items-center justify-center p-8">
          <span className="font-helvetica text-7xl sm:text-8xl font-black text-primary tracking-tighter">
            TED
          </span>
        </div>
      </div>
    </section>
  );
}