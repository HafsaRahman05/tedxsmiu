"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type AttendeeRegistration = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cnic: string;
  paymentMethod: string;
  transactionId: string;
  receiptUrl: string;
  registrationStatus: string;
  createdAt: string | Date;
};

export default function AttendeeRegistrationsTable({ registrations }: { registrations: AttendeeRegistration[] }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return registrations.filter((registration) =>
      [registration.fullName, registration.email, registration.phone, registration.cnic, registration.transactionId]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [registrations, search]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-black uppercase text-foreground">Ticket Form Submissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Payment receipts and complete attendee details.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, CNIC, or transaction..." className="rounded-none border-border bg-card pl-10" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-none border border-border bg-card">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Attendee</TableHead>
              <TableHead>Phone / CNIC</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">No ticket submissions found.</TableCell></TableRow>
            ) : filtered.map((registration) => (
              <TableRow key={registration.id} className="border-border">
                <TableCell>
                  <div className="font-semibold text-foreground">{registration.fullName}</div>
                  <a href={`mailto:${registration.email}`} className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><Mail className="h-3 w-3" />{registration.email}</a>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{registration.phone}<br />{registration.cnic}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{registration.paymentMethod}<br /><span className="font-mono">{registration.transactionId}</span></TableCell>
                <TableCell><a href={registration.receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View <ExternalLink className="h-3 w-3" /></a></TableCell>
                <TableCell><span className="border border-yellow-500/30 px-2 py-1 font-mono text-[10px] uppercase text-yellow-500">{registration.registrationStatus}</span></TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(registration.createdAt).toLocaleDateString("en-GB")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}