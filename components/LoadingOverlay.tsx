"use client";

import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LOADING_MESSAGES = [
  { text: "Analyzing your restaurant...", duration: 1500 },
  { text: "Training your AI restaurant receptionist...", duration: 2000 },
  { text: "Almost ready...", duration: 1000 },
];

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setMessageIndex(0);
      setFadeKey(0);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const advance = () => {
      if (currentIndex < LOADING_MESSAGES.length - 1) {
        currentIndex++;
        setMessageIndex(currentIndex);
        setFadeKey((prev) => prev + 1);
        timeoutId = setTimeout(advance, LOADING_MESSAGES[currentIndex].duration);
      }
    };

    timeoutId = setTimeout(advance, LOADING_MESSAGES[0].duration);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="text-center">
        {/* Gold spinning ring */}
        <div className="mx-auto mb-8 h-16 w-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />

        {/* Animated message */}
        <p
          key={fadeKey}
          className="text-xl font-sans text-gold animate-fade-in-up"
        >
          {LOADING_MESSAGES[messageIndex].text}
        </p>

        {/* Progress dots */}
        <div className="mt-6 flex justify-center gap-2">
          {LOADING_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                i <= messageIndex ? "bg-gold" : "bg-gold/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
