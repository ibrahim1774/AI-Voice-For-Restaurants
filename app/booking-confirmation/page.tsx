"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function BookingConfirmationPage() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // Client-side: fire Facebook Schedule pixel
    if (window.fbq) {
      window.fbq("track", "Schedule");
    }

    // Server-side: fire Meta Conversions API
    fetch("/api/meta-booking-conversion", { method: "POST" }).catch(() => {
      // Silent fail — client-side pixel is the primary tracker
    });
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-4 py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-lg w-full text-center">
        {/* Calendar checkmark icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/30 bg-gold/10">
          <svg
            className="h-10 w-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
          Your Call is Booked!
        </h1>

        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          Thank you for scheduling a call with us. We&apos;ll walk you through
          how your AI dental receptionist will work for your practice and get you
          set up within 24 hours.
        </p>

        <div className="mt-8 gold-glow-border rounded-2xl p-6 text-left">
          <h2 className="font-sans text-sm uppercase tracking-[0.2em] text-gold mb-4">
            What Happens Next
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold">
                1
              </span>
              <p className="font-sans text-sm text-muted">
                Check your email for a calendar confirmation
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold">
                2
              </span>
              <p className="font-sans text-sm text-muted">
                We&apos;ll discuss your dental practice needs on the call
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-gold text-xs font-bold">
                3
              </span>
              <p className="font-sans text-sm text-muted">
                Your AI dental receptionist gets built and goes live within 24 hours
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block rounded-xl border border-gold/30 bg-transparent px-8 py-4 font-sans text-base font-semibold text-gold transition-all duration-300 hover:bg-gold/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
}
