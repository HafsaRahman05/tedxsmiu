import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { db } from "@/lib/db";
import { sponsors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Partner Dashboard",
  noIndex: true,
});

const METRICS = [
  { label: "Logo Impressions", value: "182K" },
  { label: "Booth Visits", value: "1,204" },
  { label: "Talk Mentions", value: "6" },
  { label: "Tier", value: "Gold" },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/dashboard/login");
  }

  const partnersList = await db
    .select()
    .from(sponsors)
    .where(eq(sponsors.status, "CONFIRMED"));

  return (
    <div className="min-h-screen bg-black px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="mt-2 font-display text-4xl font-black uppercase text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Signed in as {session.user.email}
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-none border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="font-display text-3xl font-black text-white">
                {m.value}
              </div>
              <div className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-none border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Your Listing
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              This is how your organization appears on the public Partners
              page.
            </p>
            <div className="mt-6 space-y-3">
              {partnersList.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-none border border-white/10 bg-black px-4 py-3"
                >
                  <span className="font-display text-lg font-bold text-white">
                    {p.name}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[#EB0028]">
                    {p.tier?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-none border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-2xl font-black uppercase text-white">
              Brand Assets
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Download event backdrops, deck templates, and usage guidelines.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {["Event Deck.pdf", "Logo Usage Guide.pdf", "Backdrop Kit.zip"].map(
                (file) => (
                  <button
                    key={file}
                    className="flex items-center justify-between rounded-none border border-white/10 bg-black px-4 py-3 text-left text-sm text-neutral-400 transition-colors hover:border-[#EB0028] hover:text-[#EB0028]"
                  >
                    <span>{file}</span>
                    <span>↓</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}