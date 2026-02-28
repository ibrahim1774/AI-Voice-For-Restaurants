"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function ThankYouPage() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // Client-side: fire Facebook Purchase pixel
    if (window.fbq) {
      window.fbq("track", "Purchase", { value: 29.0, currency: "USD" });
    }

    // Server-side: fire Meta Conversions API
    fetch("/api/meta-conversion", { method: "POST" }).catch(() => {
      // Silent fail — client-side pixel is the primary tracker
    });
  }, []);

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-4 py-16 grid-bg overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-lg w-full text-center">
        {/* Checkmark icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/30 bg-gold/10">
          <svg
            className="h-10 w-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-serif text-3xl font-bold text-white md:text-4xl">
          Thank You for Your Purchase!
        </h1>

        <p className="mx-auto mt-4 max-w-md font-sans text-base leading-relaxed text-muted">
          Your PrimeVoice AI Receptionist is on the way. Complete the next step
          so we can get your system set up within 24 hours.
        </p>

        <div className="mt-8">
          <a
            href="https://primehubagency.com/success"
            className="inline-block w-full rounded-xl bg-gold px-8 py-4 font-sans text-base font-semibold text-background transition-all duration-300 hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98]"
            style={{
              boxShadow: "0 0 20px rgba(201, 168, 76, 0.3)",
            }}
          >
            Continue Setup
          </a>
        </div>

        <p className="mt-4 font-sans text-sm text-subtle">
          Click above to complete your onboarding form.
        </p>
      </div>
    </section>
  );
}
