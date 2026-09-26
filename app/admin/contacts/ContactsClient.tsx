"use client";

import React, { useState, useMemo } from "react";
import { Search, Mail, Eye, Trash2, CheckCircle, Clock, X, MessageSquare } from "lucide-react";
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

interface Inquiry {
  id: string;
  name: string;
  email: string;
  category: "SPEAKER_NOMINATION" | "SPONSORSHIP" | "VOLUNTEER" | "MEDIA" | "GENERAL";
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string | Date;
}

interface ContactsClientProps {
  initialInquiries: Inquiry[];
}

export default function ContactsClient({ initialInquiries }: ContactsClientProps) {
  const router = useRouter();
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  // Modal states for reading messages
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  const handleStatusChange = async (id: string, newStatus: Inquiry["status"]) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setInquiriesList(inquiriesList.map((i) => (i.id === id ? updated : i)));
      toast.success(`Inquiry marked as ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message record?")) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setInquiriesList(inquiriesList.filter((i) => i.id !== id));
      toast.success("Inquiry record deleted");
      if (viewingInquiry?.id === id) {
        setViewingInquiry(null);
      }
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete inquiry");
    }
  };

  // Filter inquiries based on filters and search
  const filteredInquiries = useMemo(() => {
    return inquiriesList.filter((inq) => {
      const matchesCategory = selectedCategory === "All" || inq.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || inq.status === selectedStatus;
      
      const name = inq.name.toLowerCase();
      const email = inq.email.toLowerCase();
      const subject = inq.subject.toLowerCase();
      const message = inq.message.toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        email.includes(query) ||
        subject.includes(query) ||
        message.includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [inquiriesList, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">
          Contact Inquiries
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review public form submissions, categorize queries, and manage organizer responses.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender name, email, subject, or message keywords..."
            className="w-full rounded-none border-border bg-card pl-10 focus-visible:ring-primary"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Categories</option>
            <option value="SPEAKER_NOMINATION">SPEAKER NOMINATION</option>
            <option value="SPONSORSHIP">SPONSORSHIP</option>
            <option value="VOLUNTEER">VOLUNTEER</option>
            <option value="MEDIA">MEDIA</option>
            <option value="GENERAL">GENERAL</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Inquiries Listing */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sender</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subject & Message</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Date Submittted</TableHead>
              <TableHead className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resolution Status</TableHead>
              <TableHead className="text-right font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filteredInquiries.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No inquiry submissions found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredInquiries.map((inq) => (
                <TableRow key={inq.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    <div className="font-display text-sm font-bold text-foreground">
                      {inq.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span>{inq.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-none bg-primary/10 border border-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold text-primary uppercase">
                      {inq.category.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs md:max-w-md">
                    <div className="text-sm font-bold text-foreground truncate">
                      {inq.subject}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">
                      "{inq.message}"
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as any)}
                      className={`border rounded-none px-2 py-1 font-mono text-[10px] font-bold uppercase outline-none bg-background cursor-pointer ${
                        inq.status === "RESOLVED"
                          ? "border-emerald-500/30 text-emerald-400"
                          : inq.status === "IN_PROGRESS"
                          ? "border-yellow-500/30 text-yellow-400"
                          : "border-primary/30 text-primary"
                      }`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setViewingInquiry(inq)}
                        className="h-8 w-8 rounded-none border-border hover:bg-secondary hover:text-foreground transition-colors"
                        title="Read message"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(inq.id)}
                        className="h-8 w-8 rounded-none border-border hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete inquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reader Modal Overlay */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg border border-border bg-card p-6 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Read Message Inquiry
                </span>
              </div>
              <button
                onClick={() => setViewingInquiry(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Message Details */}
            <div className="space-y-4 font-sans text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">From</p>
                  <p className="font-bold text-foreground mt-1">{viewingInquiry.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{viewingInquiry.email}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Category & Date</p>
                  <p className="font-bold text-primary mt-1">{viewingInquiry.category.replace("_", " ")}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {new Date(viewingInquiry.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Subject</p>
                <p className="font-bold text-foreground text-base mt-1 leading-snug">{viewingInquiry.subject}</p>
              </div>

              <div className="bg-background/60 p-4 border border-border rounded-none min-h-[120px] max-h-[220px] overflow-y-auto">
                <p className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2 border-b border-border pb-1">
                  Message Body
                </p>
                <p className="text-foreground/80 leading-relaxed break-words whitespace-pre-wrap">
                  {viewingInquiry.message}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                {/* Delete button */}
                <Button
                  variant="outline"
                  onClick={() => handleDelete(viewingInquiry.id)}
                  className="rounded-none border-border font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" /> Delete Inquiry
                </Button>

                {/* Close button */}
                <Button
                  onClick={() => setViewingInquiry(null)}
                  className="rounded-none font-mono text-xs font-bold uppercase tracking-wider"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
