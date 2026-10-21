# TEDxSMIU

Website for TEDxSMIU, an independently organized TEDx event at Sindh Madressatul Islam University in Karachi. The public site covers the event, speakers, guests, team, gallery, talks, partners, and tickets. Organizers manage that content from the admin panel.

## Stack

- Next.js 16 and React
- PostgreSQL with Drizzle
- Better Auth for organizer sign-in

## Local setup

Install dependencies, then copy the environment template and fill in real values:

```bash
npm install
copy .env.local.example .env.local
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
Set `DATABASE_URL` in `.env.local` before running the migration command.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run db:migrate` | Apply pending PostgreSQL migrations using `DATABASE_URL` from `.env.local` |

## Environment

`.env.local.example` lists the database, Cloudinary, and email settings. The app also reads these when the matching feature is used:

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image and video uploads |
| `R2_BUCKET_NAME`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` | Optional Cloudflare R2 storage when Cloudinary is not set |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAIL` | Ticket registration emails |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO_EMAIL` | Contact page queries, sent with Nodemailer. For Gmail, `SMTP_PASS` is an app password. |
| `SEED_SECRET`, `ADMIN_SEED_EMAIL`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME` | One-time admin account, only while the user table is empty |

The seed route is `GET /api/admin/seed` and requires the `x-seed-secret` header to match `SEED_SECRET`.

## Admin media on the homepage

In **Media Library**, upload one or multiple images at once, or upload a single video/paste a URL. ZIP archives must be extracted before selecting their images. Choose the event, gallery category, and year, then save the assets to store their Cloudinary URLs and year in the database. Uploaded images can be up to 10 MB each; videos can be MP4, WebM, MOV, or MKV, up to 50 MB.

That album appears in the homepage section **Where ideas ignite** and on the gallery page, grouped by event and category without year-based sorting or labels. The homepage shows the first four albums; opening an event album displays that event's images and videos for its year. Click a photo to expand it and download it from the preview. Existing media assets can be edited in **Media Library**. A YouTube talk is added on the speaker inside **Events** and shows under **Speakers & talks**.

Before deploying the existing media-year change, apply `drizzle/0001_add_media_year.sql` to add the nullable year column for existing media. Run `npm run db:migrate` with `DATABASE_URL` configured in `.env.local` to add the sponsor ordering column required by drag-and-drop ordering. The admin ordering controls save directly to the configured PostgreSQL database through the app; no database GUI is needed.
