import IntakeForm from "./IntakeForm";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center px-4 py-4 md:py-12 aurora-bg overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

      {/* Static ambient orb for depth */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          background: "rgba(201, 168, 76, 0.04)",
          filter: "blur(60px)",
        }}
      />

      {/* Top edge glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        style={{ boxShadow: "0 0 15px rgba(201, 168, 76, 0.2)" }}
      />

      {/* === CONTENT === */}
      <div className="relative z-10 mx-auto max-w-4xl w-full text-center">
        {/* Main headline */}
        <h1 className="font-serif text-xl font-bold leading-[1.2] text-white sm:text-2xl md:text-3xl lg:text-4xl">
          Your 24/7 AI Dental Receptionist: Custom Demo Built in 20 Seconds{" "}
          <span className="text-gold">— Don&apos;t Lose a Patient to a Missed Call</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-2 max-w-xl font-sans text-xs leading-relaxed text-muted md:mt-3 md:text-sm">
          Missed calls cost dental practices thousands in lost patients. Your
          custom AI receptionist can answer every call or missed call, day or
          night — booking appointments, handling insurance questions, and
          managing dental emergencies while you&apos;re with patients or
          you&apos;re away. Enter your practice name and number below and based
          on that we&apos;ll build a working demo you can talk to right now as a
          sample.
        </p>

        {/* Intake Form */}
        <div className="mt-3 md:mt-5">
          <IntakeForm />
        </div>
      </div>
    </section>
  );
}
