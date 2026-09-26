import { db } from "@/lib/db";
import { events, speakers, registrations, contacts } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  Ticket, 
  Mail, 
  ArrowUpRight 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch real-time statistics
  const [eventsCount] = await db.select({ value: count() }).from(events);
  const [speakersCount] = await db
    .select({ value: count() })
    .from(speakers)
    .where(eq(speakers.status, "ACCEPTED"));
  const [registrationsCount] = await db.select({ value: count() }).from(registrations);
  const [contactsCount] = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.status, "NEW"));

  // Fetch recent registrations with user and event relations
  const recentRegistrations = await db.query.registrations.findMany({
    limit: 5,
    orderBy: desc(registrations.createdAt),
    with: {
      user: true,
      event: true,
    },
  });

  // Fetch recent pending contact inquiries
  const recentInquiries = await db
    .select()
    .from(contacts)
    .where(eq(contacts.status, "NEW"))
    .limit(5)
    .orderBy(desc(contacts.createdAt));

  const stats = [
    { label: "Total Events", value: eventsCount?.value || 0, icon: Calendar, href: "/admin/events" },
    { label: "Speakers (Accepted)", value: speakersCount?.value || 0, icon: Users, href: "/admin/speakers" },
    { label: "Ticket Registrations", value: registrationsCount?.value || 0, icon: Ticket, href: "/admin/registrations" },
    { label: "Pending Inquiries", value: contactsCount?.value || 0, icon: Mail, href: "/admin/contacts" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
          Overview Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time statistics and editorial controls for the TEDxSMIU portal.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group rounded-none border border-border bg-card p-6 block hover:border-primary/45 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-6 font-display text-4xl font-black text-foreground">
                {s.value}
              </div>
              <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {s.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Detail Split Columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Registrations */}
        <div className="rounded-none border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-xl font-black uppercase text-foreground">
              Recent Registrations
            </h2>
            <Link
              href="/admin/registrations"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentRegistrations.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono py-4">No recent registrations found.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{reg.user?.name || "Attendee"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{reg.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-foreground/80">{reg.event?.title}</p>
                    <span className="inline-block rounded-none bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-400 mt-1 uppercase">
                      {reg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Inquiries */}
        <div className="rounded-none border border-border bg-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-display text-xl font-black uppercase text-foreground">
              Pending Inquiries
            </h2>
            <Link
              href="/admin/contacts"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground font-mono py-4">No pending inquiries found.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">{inq.name}</p>
                    <span className="rounded-none bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold text-primary uppercase">
                      {inq.category.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 line-clamp-1 italic">
                    "{inq.subject}"
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
