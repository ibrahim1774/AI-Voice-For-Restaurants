import ScrollReveal from "./ScrollReveal";

const STATS = [
  {
    stat: "40%",
    headline: "of calls to contractors go unanswered",
    detail:
      "The average contractor misses nearly half of all incoming calls. Each one of those could be a $2,000, $5,000, or even $10,000 job — gone to your competitor in seconds.",
  },
  {
    stat: "80%",
    headline: "of callers won't leave a voicemail",
    detail:
      "Your voicemail isn't cutting it. Eight out of ten callers will hang up and call the next contractor on the list. By the time you call back, they've already booked someone else.",
  },
  {
    stat: "$500",
    headline: "per month for an answering service",
    detail:
      "Traditional answering services cost $300–500/month and still put callers on hold. They don't know your business, can't book appointments, and call in sick on Mondays.",
  },
  {
    stat: "24/7",
    headline: "coverage that never sleeps",
    detail:
      "PrimeVoice answers instantly, every time. It knows your business, books appointments, takes messages, and never misses a shift. Nights, weekends, holidays — always on.",
  },
];

export default function PainPoints() {
  return (
    <section className="px-4 py-28 relative section-glow-divider overflow-hidden">
      {/* Depth gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,20,20,0.8)_0%,rgba(10,10,10,1)_80%)]" />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="text-center mb-20">
          <p className="font-sans text-sm uppercase tracking-[0.25em] text-gold mb-4">
            The Problem
          </p>
          <h2 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Every Missed Call Costs You{" "}
            <span className="text-gold">Money</span>
          </h2>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {STATS.map((item) => (
            <ScrollReveal key={item.stat}>
              <div className="group">
                <p className="font-serif text-7xl font-bold text-gold md:text-8xl">
                  {item.stat}
                </p>
                <p className="mt-4 font-sans text-xl font-medium text-white">
                  {item.headline}
                </p>
                <p className="mt-3 font-sans text-muted leading-relaxed">
                  {item.detail}
                </p>
                <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold/40 to-transparent" style={{ boxShadow: "0 0 8px rgba(201, 168, 76, 0.15)" }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
