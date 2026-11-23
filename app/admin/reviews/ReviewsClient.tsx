"use client";

import { useState } from "react";
import { Mail, Trash2, Star } from "lucide-react";
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

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string | Date;
}

const headClassName = "font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground";

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);

  const setApproved = async (id: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      const updated = await res.json();
      setReviewsList((list) => list.map((r) => (r.id === id ? updated : r)));
      toast.success(approved ? "Review published" : "Review hidden");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setReviewsList((list) => list.filter((r) => r.id !== id));
      toast.success("Review deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Could not delete review");
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-foreground">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve reviews to show them on the contact page. Pending reviews stay hidden.
        </p>
      </div>

      <div className="rounded-none border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className={headClassName}>Reviewer</TableHead>
              <TableHead className={headClassName}>Rating</TableHead>
              <TableHead className={headClassName}>Review</TableHead>
              <TableHead className={headClassName}>Date</TableHead>
              <TableHead className={headClassName}>Status</TableHead>
              <TableHead className={`text-right ${headClassName}`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {reviewsList.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground font-mono">
                  No reviews yet.
                </TableCell>
              </TableRow>
            ) : (
              reviewsList.map((review) => (
                <TableRow key={review.id} className="border-border hover:bg-secondary/20 transition-colors">
                  <TableCell>
                    <div className="font-display text-sm font-bold text-foreground">{review.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Mail className="h-3 w-3" />
                      <span>{review.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary">
                      <Star className="h-3.5 w-3.5 fill-primary" /> {review.rating}/5
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs md:max-w-md">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap break-words">{review.message}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(review.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        review.approved
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-yellow-500/30 text-yellow-400"
                      }`}
                    >
                      {review.approved ? "Published" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setApproved(review.id, !review.approved)}
                        className="h-8 rounded-none border-border font-mono text-[10px] font-bold uppercase"
                      >
                        {review.approved ? "Hide" : "Approve"}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        className="h-8 w-8 rounded-none border-border hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete review"
                        aria-label="Delete review"
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
    </div>
  );
}
