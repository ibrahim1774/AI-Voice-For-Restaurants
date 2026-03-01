"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import BookingModal from "./BookingModal";

interface TranscriptEntry {
  role: "assistant" | "user";
  text: string;
  timestamp: number;
}

type CallStatus = "idle" | "connecting" | "active" | "ended";

interface DemoExperienceProps {
  assistantId: string;
  practiceName: string;
}

export default function DemoExperience({
  assistantId,
  practiceName,
}: DemoExperienceProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const vapiRef = useRef<Vapi | null>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript within the container
  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [transcript]);

  // Initialize Vapi
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setError("Voice service configuration error. Please contact support.");
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
      setError(null);
    });

    vapi.on("call-end", () => {
      setCallStatus("ended");
    });

    vapi.on("message", (message: Record<string, unknown>) => {
      if (
        message.type === "transcript" &&
        message.transcriptType === "final" &&
        typeof message.transcript === "string" &&
        message.transcript.trim()
      ) {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role as "assistant" | "user",
            text: message.transcript as string,
            timestamp: Date.now(),
          },
        ]);
      }
    });

    vapi.on("error", (err: Record<string, unknown>) => {
      console.error("Vapi error:", err);
      // Extract nested Vapi error message for user-friendly display
      let message = "Something went wrong with the call. Please try again.";
      try {
        const nested = err?.error as Record<string, unknown> | undefined;
        const innerMsg =
          (nested?.message as Record<string, unknown>)?.message ??
          nested?.message ??
          err?.message;
        if (typeof innerMsg === "string") {
          if (innerMsg.toLowerCase().includes("invalid key")) {
            message = "Voice service configuration error. Please contact support.";
          } else if (innerMsg.toLowerCase().includes("unauthorized")) {
            message = "Voice service authorization failed. Please contact support.";
          } else {
            message = innerMsg;
          }
        }
      } catch {
        // keep default message
      }
      setError(message);
      setCallStatus("idle");
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!vapiRef.current) return;
    setCallStatus("connecting");
    setTranscript([]);
    setError(null);

    try {
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error("Failed to start call:", err);
      const message =
        err instanceof Error ? err.message : "Unknown error starting call";
      setError(`Failed to start call: ${message}`);
      setCallStatus("idle");
    }
  }, [assistantId]);

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  }, [isMuted]);

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 pt-6 pb-4">
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-sans text-xs font-medium text-gold uppercase tracking-wider">
            Live Demo
          </span>
        </div>

        <h1 className="font-serif text-xl font-bold text-white md:text-3xl">
          Your AI Restaurant Receptionist is Ready,{" "}
          <span className="text-gold">{practiceName}</span>
        </h1>

        <p className="mt-2 font-sans text-sm text-muted max-w-lg mx-auto leading-relaxed">
          Start a live call with your custom AI restaurant receptionist. Speak
          naturally — try booking a table, ask about the menu, or see how it
          handles a catering inquiry.
        </p>
      </div>

      {/* Call Controls */}
      <div className="flex justify-center gap-4 mb-4 shrink-0">
        {callStatus === "idle" && (
          <button
            onClick={startCall}
            className="group relative rounded-full bg-gold px-10 py-5 font-sans text-lg font-semibold text-background transition-all duration-300 hover:bg-gold-light hover:scale-[1.03] active:scale-[0.97]"
          >
            <span className="flex items-center gap-3">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Your Receptionist
            </span>
          </button>
        )}

        {callStatus === "connecting" && (
          <button
            disabled
            className="rounded-full bg-gold/50 px-10 py-5 font-sans text-lg font-semibold text-background cursor-not-allowed"
          >
            <span className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              Connecting...
            </span>
          </button>
        )}

        {callStatus === "active" && (
          <>
            <button
              onClick={toggleMute}
              className={`rounded-full border px-6 py-4 font-sans text-sm font-medium transition-all duration-300 ${isMuted
                  ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  : "border-white/20 bg-charcoal text-white hover:border-white/40"
                }`}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <button
              onClick={endCall}
              className="rounded-full bg-red-600 px-10 py-4 font-sans text-base font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                End Call
              </span>
            </button>
          </>
        )}

        {callStatus === "ended" && (
          <button
            onClick={() => {
              setCallStatus("idle");
              setTranscript([]);
            }}
            className="rounded-full border border-gold/30 bg-transparent px-10 py-5 font-sans text-base font-semibold text-gold transition-all duration-300 hover:bg-gold/10 hover:scale-[1.02]"
          >
            Call Again
          </button>
        )}
      </div>

      {/* Active call indicator */}
      {callStatus === "active" && (
        <div className="flex justify-center mb-3 shrink-0">
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-sans">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Call in progress...
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center shrink-0">
          <p className="text-sm text-red-400 font-sans">{error}</p>
        </div>
      )}

      {/* Live Transcript — fills remaining space */}
      <div className="flex-1 min-h-0 flex flex-col gold-glow-border rounded-2xl bg-card p-4 pb-5">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-gold font-semibold">
            Live Transcript
          </p>
          {callStatus === "active" && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-500/80 font-medium">Listening...</span>
            </div>
          )}
        </div>

        <div ref={scrollableRef} className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col">
          {transcript.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-subtle font-sans text-sm italic">
                {callStatus === "active"
                  ? "Waiting for conversation to begin..."
                  : "Start a call to see the live transcript here."}
              </p>
            </div>
          ) : (
            transcript.map((entry, index) => (
              <div
                key={index}
                className={
                  entry.role === "assistant"
                    ? "transcript-bubble-ai animate-fade-in-up"
                    : "transcript-bubble-user animate-fade-in-up"
                }
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-[10px] uppercase tracking-wider text-gold/60 mb-1 font-sans font-bold">
                  {entry.role === "assistant" ? "AI Receptionist" : "You"}
                </p>
                <p className="font-sans text-[15px] text-white leading-relaxed">
                  {entry.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sample disclaimer */}
      <p className="text-center font-sans text-xs text-red-400/80 mt-3 shrink-0 max-w-md mx-auto leading-relaxed">
        This is a sample receptionist based on limited info. Book a call and we&apos;ll fully customize it for {practiceName}.
      </p>

      {/* Setup promise banner */}
      <div className="shrink-0 mt-3 rounded-lg bg-gold/10 border border-gold/20 px-4 py-2.5 text-center">
        <p className="font-sans text-xs font-semibold text-gold">
          Setup in 24 Hours — We Build Your Entire System for You
        </p>
      </div>

      {/* Bottom CTA — always visible */}
      <div className="shrink-0 pt-3 pb-1">
        <button
          onClick={() => setIsBookingOpen(true)}
          className="block w-full rounded-xl bg-gold py-3.5 text-center font-sans text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-light"
        >
          Book a Call to Implement This for {practiceName}
        </button>
      </div>

      {/* Booking Calendar Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
