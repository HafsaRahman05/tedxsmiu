import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-background px-6 pt-32 pb-20 lg:px-10 text-foreground">
        {/* Background Ajrak Overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-repeat bg-[length:320px_auto]"
          style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
        />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">
            404 Error
          </span>
          <h1 className="mt-4 font-helvetica text-6xl font-black uppercase tracking-tight text-foreground sm:text-7xl">
            Idea Not Found
          </h1>
          <p className="mt-6 font-sans text-base font-normal text-muted-foreground sm:text-lg leading-relaxed">
            The page you are looking for has moved, been renamed, or does not exist. Explore our event, speakers, or return to the main stage.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="default" className="rounded-none border border-primary px-8 py-6 font-mono text-xs font-bold uppercase tracking-wider">
              <Link href="/">
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none border border-border px-8 py-6 font-mono text-xs font-bold uppercase tracking-wider">
              <Link href="/events">
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-none border border-border px-8 py-6 font-mono text-xs font-bold uppercase tracking-wider">
              <Link href="/speakers">
                View Speakers
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
