export default function About() {
  return (
    <div className="w-full" style={{ fontFamily: "var(--font-family)" }}>
      {/* Hero Section - Black */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        {/* <h1 className="text-4xl md:text-5xl font-bold mb-6">About BetaNest</h1> */}
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          At BetaNest, we believe wealth is not built by chance — it is cultivated with clarity,
          discipline, and foresight. Our philosophy is rooted in simplicity: understand your ambitions,
          design with precision, and guide your capital toward a destiny that endures.
        </p>
      </section>

      {/* Philosophy Section - Gray */}
      <section
        className="py-20 px-6 my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <div className="max-w-5xl mx-auto space-y-6 text-lg leading-relaxed">
          <p>
            We are not here to chase quick gains or follow market noise. Instead, we curate financial
            journeys that reflect your stature and aspirations — from preserving legacy wealth to
            building prosperity for generations.
          </p>
          <p>
            Our approach is defined by the{" "}
            <span className="font-semibold">Three Dimensions of Wealth — Discovery, Design, and Destiny</span>. 
            Together, they form a timeless framework that aligns opportunity with resilience, ambition with
            security, and today’s choices with tomorrow’s legacy.
          </p>
          <p>
            As an <span className="font-semibold">AMFI-registered Mutual Fund Distributor</span>, we combine
            regulatory trust with a refined advisory experience, ensuring your investments are managed with
            integrity, compliance, and a commitment to your long-term prosperity.
          </p>
        </div>
      </section>

      {/* Who I Help - White */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Who I Help</h2>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">
          I work with accomplished individuals, families, and entrepreneurs who value clarity,
          discipline, and legacy in their financial decisions. My clients are those who seek not just
          returns, but a trusted partner to align their wealth with their ambitions and life’s greater
          purpose.
        </p>
      </section>

      {/* How I Do It - Black */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">How I Do It</h2>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">
          Through the Three Dimensions of Wealth — <span className="font-semibold">Discovery, Design, and Destiny</span>. 
          We begin by uncovering your aspirations, then create a bespoke financial structure that balances
          growth with preservation. Finally, we align your capital with a long-term vision, ensuring your
          wealth endures beyond market cycles.
        </p>
      </section>

      {/* What’s in It for You - Gray */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8">What’s in It for You</h2>
        <p className="max-w-4xl mx-auto text-lg leading-relaxed">
          A refined financial journey that goes beyond transactions. You gain confidence, clarity, and
          continuity — with investments that not only grow but also safeguard your legacy. The result is
          wealth that serves you today, strengthens your tomorrow, and endures for generations.
        </p>
      </section>

      {/* Disclaimer - White */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-warm-gray)", color: "var(--color-black)" }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Disclaimer</h2>
        <p className="text-lg leading-relaxed">Pending</p>
      </section>
    </div>
  );
}
