import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdminOrOrganizer, handleApiError } from "@/server/auth/helper";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".pdf",
]);

export async function POST(request: NextRequest) {
  try {
    await requireAdminOrOrganizer();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the maximum allowed size of 5MB" },
        { status: 400 }
      );
    }

    // 2. MIME Type Validation
    if (!file.type || !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed formats: JPG, PNG, WebP, AVIF, PDF" },
        { status: 400 }
      );
    }

    // 3. Extension Validation & Sanitization
    const rawExtension = path.extname(file.name || "").toLowerCase();
    if (!rawExtension || !ALLOWED_EXTENSIONS.has(rawExtension)) {
      return NextResponse.json(
        { error: "Invalid file extension. Allowed extensions: .jpg, .jpeg, .png, .webp, .avif, .pdf" },
        { status: 400 }
      );
    }

    const uniqueFileName = `${crypto.randomUUID()}${rawExtension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      });

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "tedx-smiu",
            public_id: uniqueFileName.replace(rawExtension, ""),
            resource_type: "auto",
          },
          (error, uploadResult) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(uploadResult);
          }
        );

        uploadStream.end(buffer);
      });

      return NextResponse.json({ url: result?.secure_url || result?.url || null });
    }

    const hasR2 =
      process.env.R2_BUCKET_NAME &&
      process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY;

    if (hasR2) {
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

      const s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      });

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: uniqueFileName,
          Body: buffer,
          ContentType: file.type,
        })
      );

      const publicUrl = process.env.R2_PUBLIC_URL
        ? `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`
        : `https://${process.env.R2_BUCKET_NAME}.r2.cloudflarestorage.com/${uniqueFileName}`;

      return NextResponse.json({ url: publicUrl });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueFileName}` });
  } catch (error) {
    return handleApiError(error);
  }
}
