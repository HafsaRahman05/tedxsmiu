import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["GUEST", "ATTENDEE", "VOLUNTEER", "SPEAKER", "CONTENT_MGR", "ORGANIZER", "SUPER_ADMIN"]);
export const eventStatusEnum = pgEnum("event_status", ["UPCOMING", "ACTIVE", "PAST"]);
export const registrationStatusEnum = pgEnum("registration_status", ["CONFIRMED", "WAITLISTED", "CANCELLED"]);
export const speakerStatusEnum = pgEnum("speaker_status", ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"]);
export const volunteerStatusEnum = pgEnum("volunteer_status", ["SUBMITTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "APPROVED", "REJECTED", "ASSIGNED"]);
export const sponsorStatusEnum = pgEnum("sponsor_status", ["NEW", "CONTACTED", "NEGOTIATING", "CONFIRMED", "DECLINED"]);
export const sponsorTierEnum = pgEnum("sponsor_tier", ["TITLE", "GOLD", "SILVER", "IN_KIND"]);
export const blogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED", "SCHEDULED"]);
export const mediaTypeEnum = pgEnum("media_type", ["IMAGE", "VIDEO"]);
export const inquiryCategoryEnum = pgEnum("inquiry_category", ["SPEAKER_NOMINATION", "SPONSORSHIP", "VOLUNTEER", "MEDIA", "GENERAL"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["NEW", "IN_PROGRESS", "RESOLVED"]);

// Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").default("GUEST").notNull(),
  
  // Profile fields integrated directly into user table
  bio: text("bio"),
  phone: text("phone"),
  studentId: text("student_id"), // if student
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// App Tables
export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  slug: text("slug").notNull().unique(), // for /events/2026 routing
  description: text("description"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  coverImageUrl: text("cover_image_url"),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  capacity: integer("capacity").notNull(),
  status: eventStatusEnum("status").default("UPCOMING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const registrations = pgTable("registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  status: registrationStatusEnum("status").default("CONFIRMED").notNull(),
  qrCodeHash: text("qr_code_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index("registration_eventId_idx").on(table.eventId),
  index("registration_userId_idx").on(table.userId),
]);

export const attendeeRegistrations = pgTable("attendee_registrations", {
  id: text("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  cnic: text("cnic").notNull(),
  paymentMethod: text("payment_method").notNull(),
  transactionId: text("transaction_id").notNull(),
  receiptUrl: text("receipt_url").notNull(),
  consent: boolean("consent").default(false).notNull(),
  registrationStatus: text("registration_status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const speakers = pgTable("speakers", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  headline: text("headline"),
  bio: text("bio"), // description
  imageUrl: text("image_url"),
  socialLinks: text("social_links"), // JSON string array of { platform, url } (email included as a social link)
  eventYear: integer("Event_Year").notNull().default(2023),
  status: speakerStatusEnum("status").default("ACCEPTED").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const guests = pgTable("guests", {
  id: text("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  guestType: text("guest_type").notNull().default("VIP Guest"),
  roleTitle: text("role_title").notNull(),
  organizationHeading: text("organization_heading"),
  bioDetails: text("bio_details"),
  imageUrl: text("image_url"),
  socialLinks: text("social_links").default("[]"),
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  eventYear: integer("event_year").notNull().default(2026),
  sortOrder: integer("sort_order").default(0),
  status: text("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const eventSpeakers = pgTable("event_speakers", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  speakerId: text("speaker_id").notNull().references(() => speakers.id, { onDelete: "cascade" }),
  talkTitle: text("talk_title").notNull(),
  abstract: text("abstract"),
  youtubeUrl: text("youtube_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const volunteers = pgTable("volunteers", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  status: volunteerStatusEnum("status").default("SUBMITTED").notNull(),
  teamPreference: text("team_preference"), // e.g. "Marketing, Logistics"
  assignedRole: text("assigned_role"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const sponsors = pgTable("sponsors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  socialLinks: text("social_links"), // JSON string array of { platform, url }
  eventYear: integer("Event_Year").notNull().default(2023),
  tier: sponsorTierEnum("tier"),
  status: sponsorStatusEnum("status").default("CONFIRMED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const eventSponsors = pgTable("event_sponsors", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id, { onDelete: "cascade" }),
  sponsorId: text("sponsor_id").notNull().references(() => sponsors.id, { onDelete: "cascade" }),
  tier: sponsorTierEnum("tier").default("GOLD").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogs = pgTable("blogs", {
  id: text("id").primaryKey(),
  authorId: text("author_id").notNull().references(() => user.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  status: blogStatusEnum("status").default("DRAFT").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  type: mediaTypeEnum("type").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  albumName: text("album_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const team = pgTable("team", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  role: text("role").notNull(),
  designation: text("designation"),
  imageUrl: text("image_url"),
  bio: text("bio"),
  socialLinks: text("social_links"), // JSON string array of { platform, url }
  eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  category: inquiryCategoryEnum("category").default("GENERAL").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: inquiryStatusEnum("status").default("NEW").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  registrations: many(registrations),
  speakerApplications: many(speakers),
  volunteerApplications: many(volunteers),
  blogs: many(blogs),
}));

export const eventRelations = relations(events, ({ many }) => ({
  registrations: many(registrations),
  eventSpeakers: many(eventSpeakers),
  eventSponsors: many(eventSponsors),
  volunteers: many(volunteers),
  media: many(media),
  team: many(team),
}));

export const registrationRelations = relations(registrations, ({ one }) => ({
  user: one(user, { fields: [registrations.userId], references: [user.id] }),
  event: one(events, { fields: [registrations.eventId], references: [events.id] }),
}));

export const speakerRelations = relations(speakers, ({ one, many }) => ({
  user: one(user, { fields: [speakers.userId], references: [user.id] }),
  eventSpeakers: many(eventSpeakers),
}));

export const guestRelations = relations(guests, () => ({}));

export const eventSpeakerRelations = relations(eventSpeakers, ({ one }) => ({
  event: one(events, { fields: [eventSpeakers.eventId], references: [events.id] }),
  speaker: one(speakers, { fields: [eventSpeakers.speakerId], references: [speakers.id] }),
}));

export const volunteerRelations = relations(volunteers, ({ one }) => ({
  user: one(user, { fields: [volunteers.userId], references: [user.id] }),
  event: one(events, { fields: [volunteers.eventId], references: [events.id] }),
}));

export const sponsorRelations = relations(sponsors, ({ many }) => ({
  eventSponsors: many(eventSponsors),
}));

export const eventSponsorRelations = relations(eventSponsors, ({ one }) => ({
  event: one(events, { fields: [eventSponsors.eventId], references: [events.id] }),
  sponsor: one(sponsors, { fields: [eventSponsors.sponsorId], references: [sponsors.id] }),
}));

export const blogRelations = relations(blogs, ({ one }) => ({
  author: one(user, { fields: [blogs.authorId], references: [user.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  event: one(events, { fields: [media.eventId], references: [events.id] }),
}));

export const teamRelations = relations(team, ({ one }) => ({
  event: one(events, { fields: [team.eventId], references: [events.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

