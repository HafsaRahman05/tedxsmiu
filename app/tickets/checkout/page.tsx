"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, Mail, Phone, Ticket, UserRound } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/PageShell";

const tiers = {
  earlyBird: { label: "Early Bird Ticket", price: "PKR 1,500" },
  general: { label: "General Pass", price: "PKR 2,500" },
} as const;

type TierKey = keyof typeof tiers;

export default function TicketCheckoutPage() {
  const [tier, setTier] = useState<TierKey>("general");
  const [submitted, setSubmitted] = useState(false);
  const [receiptError, setReceiptError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const requestedTier = new URLSearchParams(window.location.search).get("tier");
    if (requestedTier && requestedTier in tiers) {
      setTier(requestedTier as TierKey);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (receiptError || formData.get("consent") !== "agree") {
      form.reportValidity();
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ticket-registrations", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration could not be completed.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Registration could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setReceiptError("Payment receipt is required.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setReceiptError("Please upload an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setReceiptError("The receipt must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    setReceiptError("");
  }

  const selectedTier = tiers[tier];

  return (
    <PageShell>
      <main className="min-h-screen bg-neutral-950 px-6 pb-24 pt-32 text-white">
        
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[#EB0028]/15 blur-[140px]" />

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-2">
            <Link href="/tickets" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neutral-400 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to passes
            </Link>
            <div className="mt-12 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#EB0028]">
              <Ticket className="h-4 w-4" /> Ticket registration
            </div>
            {/* <h1 className="mt-5 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
              Reserve your <span className="text-[#EB0028]">seat.</span>
            </h1> */}
            <div className="mt-4 overflow-hidden border border-white/10 bg-neutral-900">
              <img
                src="https://res.cloudinary.com/rhgtzwu8/image/upload/v1789978346/Gemini_Generated_Image_yw3lk7yw3lk7yw3l.jpg"
                alt="TEDxSMIU History Revives Itself event announcement"
                className="aspect-[888/500] w-full object-cover"
              />
            </div>
            <p className="mt-4 max-w-md text-base leading-relaxed text-neutral-400">
              Complete the attendee form below. Our team will verify your details and share payment confirmation instructions by email.
            </p>

            <div className="mt-5 border-l-2 border-[#EB0028] bg-white/[0.03] px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Selected pass</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="font-display text-2xl font-bold uppercase">{selectedTier.label}</p>
                <p className="font-mono text-sm text-[#EB0028]">{selectedTier.price}</p>
              </div>
              <p className="mt-3 text-sm text-neutral-500">October 1, 2026 / Sindh Madressatul Islam University, Karachi</p>
            </div>
          </div>

          <div className="relative overflow-hidden border border-white/10 bg-neutral-900/70 p-6 sm:p-10">
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-[0.30] mix-blend-overlay bg-[length:600px_auto] sm:bg-[length:100vh_auto]"
              style={{ backgroundImage: "url('/images/branding/PATTERN - white.png')" }}
            />
            <div className="relative z-10">
              {submitted ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-[#EB0028]" />
                <h2 className="mt-6 font-display text-4xl font-bold uppercase">Registration received</h2>
                <p className="mt-4 max-w-md leading-relaxed text-neutral-400">
                  Thank you for registering. TEDxSMIU will contact you shortly with payment verification and ticket confirmation.
                </p>
                <Link href="/tickets" className="mt-8 border border-white/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:border-[#EB0028] hover:text-[#EB0028]">
                  View all passes
                </Link>
              </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <p className="font-mono text-[14px] uppercase tracking-widest text-[#EB0028]">01 Attendee details</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <label className="sm:col-span-2">
                      <span className="mb-2 block text-sm text-neutral-300">Full name <i className="text-[#EB0028]">*</i></span>
                      <span className="relative block">
                        <UserRound className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                        <input required name="fullName" type="text" placeholder="Your full name" className="h-11 w-full border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#EB0028]" />
                      </span>
                      <span className="mb-2 block text-sm text-neutral-300">Email address <i className="text-[#EB0028]">*</i></span>
                      <span className="relative block">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                        <input required name="email" type="email" placeholder="your_name@gmail.com" pattern="[a-zA-Z0-9._%+-]+@gmail\.com" title="Please enter a valid Gmail address ending with @gmail.com" className="h-11 w-full border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#EB0028]" />
                      </span>
                      <span className="mb-2 block text-sm text-neutral-300">Phone / WhatsApp <i className="text-[#EB0028]">*</i></span>
                      <span className="relative block">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                        <input required name="phone" type="tel" placeholder="03XXXXXXXXX" pattern="[0-9]{11}" inputMode="numeric" maxLength={11} title="Phone number must contain exactly 11 digits" className="h-11 w-full border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#EB0028]" />
                      </span>
                      <span className="mb-2 block text-sm text-neutral-300">CNIC <i className="text-[#EB0028]">*</i></span>
                      <input required name="cnic" type="text" placeholder="42XXXXXXXXXXX" pattern="[0-9]{13}" inputMode="numeric" maxLength={13} title="CNIC must contain exactly 13 digits without dashes" className="h-11 w-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#EB0028]" />
                    </label>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[14px] uppercase tracking-widest text-[#EB0028]">02 Payment details</p>
                  <div className="mt-5 border border-[#EB0028]/30 bg-[#EB0028]/5 p-5 text-sm text-neutral-300">
                    <h2 className="font-display text-xl font-bold uppercase text-white">Payment instructions</h2>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-400">Complete your payment using one of the methods below, then enter the transaction reference and upload your receipt.</p>
                    <div className="mt-5 grid gap-4 text-xs sm:grid-cols-3">
                      <div>
                        <p className="font-mono font-bold uppercase tracking-widest text-[#EB0028]">Bank Transfer (UBL)</p>
                        <p className="mt-2 leading-relaxed">Account Name: Hasnain Ali<br />Account No: 1266325925983<br />IBAN: PK24UNIL0109000325925983</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold uppercase tracking-widest text-[#EB0028]">JazzCash</p>
                        <p className="mt-2 leading-relaxed">Account Name: Hasnain Ali<br />Account No: 03170897673</p>
                      </div>
                      <div>
                        <p className="font-mono font-bold uppercase tracking-widest text-[#EB0028]">Easypaisa</p>
                        <p className="mt-2 leading-relaxed">Account Name: Ali Mehdi<br />Account No: 03378390809</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label>
                      <span className="mb-2 block text-sm text-neutral-300">Payment method <i className="text-[#EB0028]">*</i></span>
                      <select required name="paymentMethod" className="h-11 w-full border border-white/10 bg-neutral-950 px-3 text-sm text-white outline-none focus:border-[#EB0028]">
                        <option value="">Select payment method</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="easypaisa">Easypaisa</option>
                        <option value="jazzcash">JazzCash</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label>
                      <span className="mb-2 block text-sm text-neutral-300">Transaction ID / Reference Number <i className="text-[#EB0028]">*</i></span>
                      <span className="relative block">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
                        <input required name="transactionId" type="text" placeholder="Enter transaction reference" className="h-11 w-full border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-[#EB0028]" />
                      </span>
                    </label>
                    <label className="sm:col-span-2">
                      <span className="mb-2 block text-sm text-neutral-300">Upload payment receipt <i className="text-[#EB0028]">*</i></span>
                      <input required name="paymentReceipt" type="file" accept="image/*" onChange={handleReceiptChange} className="block w-full border border-dashed border-white/15 bg-white/[0.03] px-3 py-3 text-sm text-neutral-400 file:mr-4 file:border-0 file:bg-[#EB0028] file:px-3 file:py-2 file:font-mono file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-[#c00020]" />
                      <span className="mt-2 block text-xs text-neutral-600">Upload 1 supported file: image. Max 10 MB.</span>
                      {receiptError && <span className="mt-2 block text-xs text-[#EB0028]">{receiptError}</span>}
                    </label>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 text-sm leading-relaxed text-neutral-400">
                  <div className="space-y-2">
                    <p className="font-semibold text-neutral-300">I confirm that the information provided above is accurate.</p>
                    <p className="font-semibold text-neutral-300">I understand that my registration/ticket is subject to confirmation by the TEDxSMIU organizing team.</p>
                    <p className="font-semibold text-neutral-300">I agree to receive important event-related updates from TEDxSMIU.</p>
                  </div>
                  <fieldset className="mt-5 flex gap-6">
                    <legend className="sr-only">Consent</legend>
                    <label className="flex items-center gap-2">
                      <input required type="radio" name="consent" value="agree" className="h-4 w-4 accent-[#EB0028]" />
                      <span>Agree</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="consent" value="disagree" className="h-4 w-4 accent-[#EB0028]" />
                      <span>Disagree</span>
                    </label>
                  </fieldset>
                  <p className="mt-3 text-xs text-[#EB0028]">You must select Agree to submit your registration.</p>
                </div>

                <button type="submit" className="w-full bg-[#EB0028] px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c00020]">
                  {isSubmitting ? "Submitting registration..." : "Submit registration"}
                </button>
                {submitError && <p className="text-center text-sm text-[#EB0028]">{submitError}</p>}
                <p className="text-center text-xs text-neutral-600">Fields marked with * are required.</p>
              </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
