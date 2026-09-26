import { z } from "zod";

export const EventStatusSchema = z.enum(["UPCOMING", "ACTIVE", "PAST"]);
export const RegistrationStatusSchema = z.enum(["CONFIRMED", "WAITLISTED", "CANCELLED"]);
export const SpeakerStatusSchema = z.enum(["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"]);
export const VolunteerStatusSchema = z.enum(["SUBMITTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "APPROVED", "REJECTED", "ASSIGNED"]);
export const SponsorStatusSchema = z.enum(["NEW", "CONTACTED", "NEGOTIATING", "CONFIRMED", "DECLINED"]);
export const SponsorTierSchema = z.enum(["TITLE", "GOLD", "SILVER", "IN_KIND"]);
export const BlogStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]);
export const MediaTypeSchema = z.enum(["IMAGE", "VIDEO"]);
export const InquiryCategorySchema = z.enum(["SPEAKER_NOMINATION", "SPONSORSHIP", "VOLUNTEER", "MEDIA", "GENERAL"]);
export const InquiryStatusSchema = z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]);
export const UserRoleSchema = z.enum(["GUEST", "ATTENDEE", "VOLUNTEER", "SPEAKER", "CONTENT_MGR", "ORGANIZER", "SUPER_ADMIN"]);

export const SocialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name required"),
  url: z.string().min(1, "URL required"),
});

export const EventSpeakerItemSchema = z.object({
  speakerId: z.string().min(1, "Speaker ID required"),
  talkTitle: z.string().min(2, "Talk title must be at least 2 characters"),
  abstract: z.string().optional().nullable(),
  youtubeUrl: z.string().url("Invalid YouTube URL").or(z.string().length(0)).optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const EventSponsorItemSchema = z.object({
  sponsorId: z.string().min(1, "Sponsor ID required"),
  tier: SponsorTierSchema.default("GOLD"),
  sortOrder: z.number().int().default(0),
});

export const EventInputSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  theme: z.string().min(2, "Theme must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  coverImageUrl: z.string().url("Invalid cover image URL").or(z.string().length(0)).optional().nullable(),
  date: z.string().or(z.date()).transform((val) => new Date(val)),
  venue: z.string().min(2, "Venue must be at least 2 characters"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  status: EventStatusSchema.default("UPCOMING"),
  speakers: z.array(EventSpeakerItemSchema).optional().default([]),
  sponsors: z.array(EventSponsorItemSchema).optional().default([]),
});

export const EventUpdateSchema = EventInputSchema.partial();

export const SpeakerInputSchema = z.object({
  userId: z.string().optional().nullable(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").or(z.string().length(0)).optional().nullable(),
  socialLinks: z.array(SocialLinkSchema).optional().nullable(),
  eventYear: z.number().int().min(1900).max(2200).default(2023),
  status: SpeakerStatusSchema.default("ACCEPTED"),
  sortOrder: z.number().int().default(0),
});

export const SpeakerUpdateSchema = SpeakerInputSchema.partial();

export const VolunteerInputSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  userId: z.string().min(1, "User ID is required"),
  teamPreference: z.string().optional().nullable(),
  assignedRole: z.string().optional().nullable(),
  status: VolunteerStatusSchema.default("SUBMITTED"),
});

export const VolunteerUpdateSchema = VolunteerInputSchema.partial();

export const SponsorInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  eventYear: z.number().int().min(1900).max(2200).default(2023),
  logoUrl: z.string().url("Invalid logo URL").or(z.string().length(0)).optional().nullable(),
  websiteUrl: z.string().url("Invalid website URL").or(z.string().length(0)).optional().nullable(),
  socialLinks: z.array(SocialLinkSchema).optional().nullable(),
  tier: SponsorTierSchema.optional().nullable(),
  status: SponsorStatusSchema.default("CONFIRMED"),
});

export const SponsorUpdateSchema = SponsorInputSchema.partial();

export const BlogInputSchema = z.object({
  authorId: z.string().min(1, "Author ID is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  content: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().url("Invalid cover image URL").or(z.string().length(0)).optional().nullable(),
  status: BlogStatusSchema.default("DRAFT"),
  publishedAt: z.string().or(z.date()).transform((val) => val ? new Date(val) : null).optional().nullable(),
});

export const BlogUpdateSchema = BlogInputSchema.partial();

export const MediaInputSchema = z.object({
  type: MediaTypeSchema,
  url: z.string().url("Invalid media URL"),
  altText: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  albumName: z.string().optional().nullable(),
});

export const TeamInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  designation: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").or(z.string().length(0)).optional().nullable(),
  bio: z.string().optional().nullable(),
  socialLinks: z.array(SocialLinkSchema).optional().nullable(),
  eventId: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const TeamUpdateSchema = TeamInputSchema.partial();

export const ContactInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  category: InquiryCategorySchema.default("GENERAL"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  status: InquiryStatusSchema.default("NEW"),
});

export const ContactUpdateSchema = ContactInputSchema.partial();

export const ProfileUpdateSchema = z.object({
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  studentId: z.string().optional().nullable(),
});

export const UserRoleUpdateSchema = z.object({
  role: UserRoleSchema,
});
