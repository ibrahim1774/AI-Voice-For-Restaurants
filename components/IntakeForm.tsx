"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "./LoadingOverlay";

const GOALS = [
  "Take Reservations",
  "Answer Menu Questions",
  "Handle Catering Inquiries",
  "Manage Waitlist",
  "Full Front Desk Coverage",
];

interface FormData {
  practiceName: string;
  phoneNumber: string;
  goal: string;
}

interface FormErrors {
  practiceName?: string;
  phoneNumber?: string;
  goal?: string;
}

const MINIMUM_LOADING_TIME = 4500;

export default function IntakeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    practiceName: "",
    phoneNumber: "",
    goal: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.practiceName.trim()) {
      newErrors.practiceName = "Practice name is required";
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    if (!formData.goal) {
      newErrors.goal = "Please select a goal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const [response] = await Promise.all([
        fetch("/api/create-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }),
        fetch("https://hook.us2.make.com/1ijk41d5vdixvoedkr13qliymoyv2x2w", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            practiceName: formData.practiceName,
            phoneNumber: formData.phoneNumber,
            goal: formData.goal,
          }),
        }).catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, MINIMUM_LOADING_TIME)),
      ]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "We hit a snag building your receptionist. Please try again."
        );
      }

      const data = await response.json();
      router.push(
        `/demo?assistantId=${data.assistantId}&practiceName=${encodeURIComponent(data.practiceName)}`
      );
    } catch (err) {
      setIsLoading(false);
      setApiError(
        err instanceof Error
          ? err.message
          : "We hit a snag building your receptionist. Please try again."
      );
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-white/[0.07] bg-charcoal/70 backdrop-blur-sm px-4 py-3 font-sans text-sm text-white placeholder:text-subtle focus:border-gold/40 focus:ring-1 focus:ring-gold/30 focus:bg-charcoal/90 transition-all duration-300";

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      <div className="gold-glow-border mx-auto max-w-lg rounded-2xl p-5 md:p-8 transition-all duration-500">
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 text-left">
          {/* Practice Name */}
          <div>
            <input
              type="text"
              name="practiceName"
              placeholder="Your Restaurant Name"
              value={formData.practiceName}
              onChange={handleChange}
              className={inputClasses}
              autoComplete="organization"
            />
            {errors.practiceName && (
              <p className="mt-1.5 text-sm text-red-400 font-sans">
                {errors.practiceName}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Your Mobile Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses}
              autoComplete="tel"
            />
            {errors.phoneNumber && (
              <p className="mt-1.5 text-sm text-red-400 font-sans">
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Goal */}
          <div>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className={`${inputClasses} ${!formData.goal ? "text-subtle" : ""}`}
            >
              <option value="" disabled>
                What&apos;s the #1 goal for your AI receptionist?
              </option>
              {GOALS.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            {errors.goal && (
              <p className="mt-1.5 text-sm text-red-400 font-sans">
                {errors.goal}
              </p>
            )}
          </div>

          {apiError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400 font-sans">{apiError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gold px-6 py-3.5 font-sans text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Generate My AI Restaurant Receptionist
          </button>
        </form>
      </div>
    </>
  );
}
