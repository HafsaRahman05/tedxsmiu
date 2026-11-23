import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import ReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const initialReviews = await db.select().from(reviews).orderBy(desc(reviews.createdAt));

  return <ReviewsClient initialReviews={initialReviews} />;
}
