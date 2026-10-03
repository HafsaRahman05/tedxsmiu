import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { attendeeRegistrations } from "@/lib/db/schema";

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}

const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phone = String(formData.get("phone") || "").trim();
    const cnic = String(formData.get("cnic") || "").trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();
    const transactionId = String(formData.get("transactionId") || "").trim();
    const consent = formData.get("consent") === "agree";
    const receipt = formData.get("paymentReceipt");

    if (!fullName || !email || !phone || !cnic || !paymentMethod || !transactionId || !consent) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
      return NextResponse.json({ error: "Please enter a valid Gmail address." }, { status: 400 });
    }

    if (!/^[0-9]{11}$/.test(phone) || !/^[0-9]{13}$/.test(cnic)) {
      return NextResponse.json({ error: "Phone or CNIC format is invalid." }, { status: 400 });
    }

    if (!(receipt instanceof File) || !receipt.type.startsWith("image/") || receipt.size > MAX_RECEIPT_SIZE) {
      return NextResponse.json({ error: "Please upload an image receipt up to 10 MB." }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Receipt storage is not configured." }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tedx-smiu/ticket-receipts",
          public_id: crypto.randomUUID(),
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error || new Error("Cloudinary upload failed"));
            return;
          }
          resolve({ secure_url: result.secure_url });
        },
      );

      receipt.arrayBuffer().then((buffer) => uploadStream.end(Buffer.from(buffer))).catch(reject);
    });

    const [registration] = await db
      .insert(attendeeRegistrations)
      .values({
        id: crypto.randomUUID(),
        fullName,
        email,
        phone,
        cnic,
        paymentMethod,
        transactionId,
        receiptUrl: uploadResult.secure_url,
        consent: true,
        registrationStatus: "PENDING",
      })
      .returning({ id: attendeeRegistrations.id });

    if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFICATION_EMAIL && process.env.RESEND_FROM_EMAIL) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL,
            to: [process.env.ADMIN_NOTIFICATION_EMAIL],
            subject: `New ticket registration: ${fullName.replace(/[\r\n]/g, " ")}`,
            html: `
              <h2>New TEDxSMIU ticket registration</h2>
              <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
              <p><strong>CNIC:</strong> ${escapeHtml(cnic)}</p>
              <p><strong>Payment method:</strong> ${escapeHtml(paymentMethod)}</p>
              <p><strong>Transaction ID:</strong> ${escapeHtml(transactionId)}</p>
              <p><strong>Receipt:</strong> <a href="${uploadResult.secure_url}">View receipt</a></p>
              <p><strong>Registration ID:</strong> ${escapeHtml(registration.id)}</p>
            `,
          }),
        });
      } catch (emailError) {
        console.error("Ticket notification email failed:", emailError);
      }
    }

    return NextResponse.json({ id: registration.id }, { status: 201 });
  } catch (error) {
    console.error("Ticket registration failed:", error);
    return NextResponse.json({ error: "Registration could not be completed." }, { status: 500 });
  }
}