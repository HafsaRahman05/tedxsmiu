import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Admin Portal",
  noIndex: true,
});
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Ticket, 
  Handshake, 
  Image as ImageIcon, 
  Briefcase, 
  Mail, 
  Globe 
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/dashboard/login");
  }

  const role = session.user.role;
  if (role !== "SUPER_ADMIN" && role !== "ORGANIZER") {
    redirect("/");
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Speakers", href: "/admin/speakers", icon: Users },
    { label: "Registrations", href: "/admin/registrations", icon: Ticket },
    { label: "Partners", href: "/admin/sponsors", icon: Handshake },
    { label: "Team", href: "/admin/team", icon: Briefcase },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Inquiries", href: "/admin/contacts", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <span className="font-display text-xl font-black uppercase tracking-wider text-foreground">
              TEDx<span className="text-primary">SMIU</span>
            </span>
            <span className="rounded-none bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-primary">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-none px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground border border-transparent hover:border-border hover:bg-secondary hover:text-foreground transition-all duration-200"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside Sidebar */}
        <div className="space-y-3 pt-6 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-none px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="h-4 w-4" />
            <span>Public Site</span>
          </Link>
          <div className="px-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto px-8 py-10 lg:px-12">
        {children}
      </main>
    </div>
  );
}
