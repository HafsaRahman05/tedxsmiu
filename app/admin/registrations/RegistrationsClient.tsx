"use client";

import React, { useState, useMemo } from "react";
import { Search, Mail, Ticket, Calendar, ShieldCheck, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: "CONFIRMED" | "WAITLISTED" | "CANCELLED";
  qrCodeHash: string | null;
  createdAt: string | Date;
  user?: {
    name: string;
    email: string;
    studentId: string | null;
  } | null;
  event?: {
    title: string;
  } | null;
}

interface Event {
  id: string;
  title: string;
}

interface RegistrationsClientProps {
  initialRegistrations: Registration[];
  events: Event[];
}

export default function RegistrationsClient({ initialRegistrations, events }: RegistrationsClientProps) {
  const router = useRouter();
  const [registrationsList, setRegistrationsList] = useState<Registration[]>(initialRegistrations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("All");

  const handleStatusChange = async (id: string, newStatus: Registration["status"]) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setRegistrationsList(
        registrationsList.map((r) =>
          r.id === id ? { ...r, status: updated.status } : r
        )
      );
      toast.success(`Ticket status updated to ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleCancelRegistration = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and remove this ticket?")) return;

    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to cancel ticket");

      setRegistrationsList(registrationsList.filter((r) => r.id !== id));
      toast.success("Ticket registration cancelled");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not cancel ticket");
    }
  };

  // Filter registrations based on search and selected event
  const filteredRegistrations = useMemo(() => {
    return registrationsList.filter((reg) => {
      const matchesEvent = selectedEventId === "All" || reg.eventId === selectedEventId;
      
      const userName = reg.user?.name?.toLowerCase() || "";
      const userEmail = reg.user?.email?.toLowerCase() || "";
      const qrHash = reg.qrCodeHash?.toLowerCase() || "";
      const regId = reg.id.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      const matchesSearch =
        userName.includes(query) ||
        userEmail.includes(query) ||
        qrHash.includes(query) ||
        regId.includes(query);

      return matchesEvent && matchesSearch;
    });
  }, [registrationsList, searchQuery, selectedEventId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
          Event Registrations
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage attendee registrations, search tickets, check in guests, or process cancellations.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by attendee name, email, or ticket ID..."
            className="w-full rounded-none border-border bg-card pl-10 focus-visible:ring-primary"
          />
        </div>

        {/* Event Filter */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Event:
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="flex h-10 border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Events</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendee Datatable */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ticket ID / Hash</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attendee</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Student Status</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Registered On</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status / Actions</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filteredRegistrations.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No registrations match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((reg) => (
                <TableRow key={reg.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell className="font-mono text-[11px] text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5 text-foreground font-bold">
                      <Ticket className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate max-w-[120px]">{reg.id}</span>
                    </div>
                    {reg.qrCodeHash && (
                      <div className="text-[9px] text-muted-foreground/70 truncate max-w-[150px]" title={reg.qrCodeHash}>
                        Hash: {reg.qrCodeHash}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-display text-sm font-bold text-foreground">
                      {reg.user?.name || "Anonymous"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{reg.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{reg.event?.title || "Unknown Event"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {reg.user?.studentId ? (
                      <span className="rounded-none bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-400 uppercase">
                        Student: {reg.user.studentId}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        External
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(reg.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <select
                      value={reg.status}
                      onChange={(e) => handleStatusChange(reg.id, e.target.value as any)}
                      className={`border rounded-none px-2 py-1 font-mono text-[10px] font-bold uppercase outline-none bg-background cursor-pointer ${
                        reg.status === "CONFIRMED"
                          ? "border-emerald-500/30 text-emerald-400"
                          : reg.status === "WAITLISTED"
                          ? "border-yellow-500/30 text-yellow-400"
                          : "border-red-500/30 text-red-400"
                      }`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="WAITLISTED">WAITLISTED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCancelRegistration(reg.id)}
                      className="h-8 w-8 rounded-none border-border hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Cancel Registration"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
