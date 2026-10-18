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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the local site |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |

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

In **Media Library**, set the type to **VIDEO**, upload a file or paste a URL, attach it to an event, and choose a gallery category. Uploaded videos can be MP4, WebM, MOV, or MKV, up to 50 MB.

That album appears in the homepage section **Where ideas ignite**. The homepage shows the first four albums; opening an album plays the video. A YouTube talk is added on the speaker inside **Events** and shows under **Speakers & talks**.
