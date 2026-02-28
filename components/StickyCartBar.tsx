"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import BookingModal from "./BookingModal";

const BENEFITS = [
  "Never miss another patient call \u2014 24/7 call answering",
  "Capture every caller\u2019s details automatically",
  "Professional first impression on every call",
  "Smart appointment scheduling built in",
  "After-hours and dental emergency call coverage",
  "Custom-trained AI that knows your dental practice and services",
  "Dedicated patient lead follow-up app",
  "Replace your expensive answering service",
];

const INCLUDED_ITEMS = [
  {
    feature: "Patient Lead Capture App",
    detail: "An app for all your patient leads so you can follow up fast",
  },
  {
    feature: "CRM System",
    detail: "Manage and organize all your patient leads in one place",
  },
  {
    feature: "Dedicated Phone Number",
    detail: "A real business number connected to your AI dental receptionist",
  },
  {
    feature: "24-Hour Setup",
    detail:
      "We build your entire backend system within 24 hours so you\u2019re ready to go",
  },
  {
    feature: "Custom AI Training",
    detail:
      "We tailor the AI specifically to your dental practice, services, and patient base",
  },
];


export default function StickyCartBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Listen for custom event to open drawer (used by demo page CTA)
  useEffect(() => {
    const handler = () => setIsDrawerOpen(true);
    window.addEventListener("open-pricing-drawer", handler);
    return () => window.removeEventListener("open-pricing-drawer", handler);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <>
      {/* Sticky Bottom Bar */}
      {!isHomePage && !pathname.startsWith("/demo") && !pathname.startsWith("/booking-confirmation") && !pathname.startsWith("/thank-you") && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold/30 bg-background/95 backdrop-blur-md"
          style={{
            boxShadow: "0 -4px 20px rgba(201, 168, 76, 0.15)",
          }}
        >
          <button
            onClick={() => setIsBookingOpen(true)}
            className="flex w-full items-center justify-between px-4 py-3.5 md:px-8"
          >
            <p className="font-sans text-sm text-muted md:text-base">
              <span className="hidden md:inline">
                Get a 24/7 AI Receptionist for Your Dental Practice
              </span>
              <span className="md:hidden">
                24/7 AI Dental Receptionist
              </span>
            </p>
            <span className="shrink-0 rounded-lg bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-light md:px-6">
              Book a Call
            </span>
          </button>
        </div>
      )}

      {/* Drawer Overlay + Panel */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeDrawer}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-gold/20 bg-card custom-scrollbar transition-transform duration-300 ease-out ${isDrawerOpen ? "translate-y-0" : "translate-y-full"
            }`}
          style={{
            boxShadow: "0 -8px 40px rgba(201, 168, 76, 0.1)",
          }}
        >
          <div className="relative p-6 md:p-10">
            <div className="mx-auto max-w-2xl">
              {/* Close Button */}
              <button
                onClick={closeDrawer}
                className="absolute right-4 top-4 rounded-full p-2 text-subtle transition-colors hover:text-white md:right-6 md:top-6"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Drag Handle */}
              <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-gold/40" />

              {/* Header */}
              <h3 className="text-center font-serif text-xl font-bold leading-snug text-white md:text-2xl">
                A Smart AI Receptionist That Answers Calls &amp; Books Appointments for Your Dental Practice{" "}
                <span className="text-gold">
                  So You Never Lose a Patient to a Missed Call.
                </span>
              </h3>
              <div className="mx-auto mt-3 h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <p className="mt-3 text-center font-sans text-sm leading-relaxed text-muted">
                Every missed call could be a new patient worth thousands in
                lifetime value &mdash; patients you&apos;re probably losing while
                you&apos;re chairside. Implement a foundation part of your
                dental practice.
              </p>

              {/* Benefits List */}
              <div className="mt-8 space-y-3">
                {BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-sans text-sm text-muted">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <button
                  onClick={() => {
                    closeDrawer();
                    setIsBookingOpen(true);
                  }}
                  className="block w-full rounded-xl bg-gold py-4 text-center font-sans text-base font-semibold text-background transition-all duration-300 hover:bg-gold-light hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    boxShadow: "0 0 20px rgba(201, 168, 76, 0.3)",
                  }}
                >
                  Book a Call to Implement This for Your Practice
                </button>
                <p className="mt-3 text-center font-sans text-xs text-subtle">
                  We&apos;ll walk you through setup and have you live within 24
                  hours.
                </p>
              </div>

              {/* What's Included Table */}
              <div className="mt-10">
                <h4 className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-gold">
                  What&apos;s Included
                </h4>
                <div className="gold-glow-border overflow-hidden rounded-xl">
                  {INCLUDED_ITEMS.map((item, i) => (
                    <div
                      key={item.feature}
                      className={`px-5 py-3.5 font-sans text-sm ${i % 2 === 0 ? "bg-card" : "bg-charcoal/50"
                        }`}
                    >
                      <p className="font-medium text-white">{item.feature}</p>
                      <p className="mt-0.5 text-muted">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="font-serif text-2xl font-bold text-white md:text-3xl">
                  Ready to Stop Missing Patient Calls?
                </p>
                <p className="mt-2 font-sans text-sm text-muted">
                  Book a quick call and we&apos;ll have you set up within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Calendar Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  );
}
