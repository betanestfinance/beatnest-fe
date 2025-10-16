"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <div className="w-full" style={{ fontFamily: "var(--font-family)" }}>
      {/* Hero Section */}
      <section
        className="py-24 px-6 text-center my-2 relative overflow-hidden"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-8 tracking-tight"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            About <span className="text-[var(--color-taupe)]">BetaNest</span>
          </motion.h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-[var(--color-cream)]/90">
            At BetaNest, we believe wealth is not built by chance — it is cultivated with clarity,
            discipline, and foresight. Our philosophy is rooted in simplicity: understand your ambitions,
            design with precision, and guide your capital toward a destiny that endures.
          </p>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section
        className="py-24 px-6 my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <motion.div
          className="max-w-5xl mx-auto space-y-8 text-lg md:text-xl leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>
      </section>

      {/* Who I Help Section */}
      <section
        className="py-24 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Who I Help</h2>
          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed text-[var(--color-black)]/90">
            I work with accomplished individuals, families, and entrepreneurs who value clarity,
            discipline, and legacy in their financial decisions. My clients are those who seek not just
            returns, but a trusted partner to align their wealth with their ambitions and life’s greater
            purpose.
          </p>
        </motion.div>
      </section>

      {/* How I Do It Section */}
      <section
        className="py-24 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">How I Do It</h2>
          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed text-[var(--color-cream)]/90">
            Through the Three Dimensions of Wealth — <span className="font-semibold">Discovery, Design, and Destiny</span>. 
            We begin by uncovering your aspirations, then create a bespoke financial structure that balances
            growth with preservation. Finally, we align your capital with a long-term vision, ensuring your
            wealth endures beyond market cycles.
          </p>
        </motion.div>
      </section>

      {/* What’s in It for You */}
      <section
        className="py-24 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">What’s in It for You</h2>
          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed text-[var(--color-black)]/90">
            A refined financial journey that goes beyond transactions. You gain confidence, clarity, and
            continuity — with investments that not only grow but also safeguard your legacy. The result is
            wealth that serves you today, strengthens your tomorrow, and endures for generations.
          </p>
        </motion.div>
      </section>

      {/* Disclaimer */}
      <section
        className="py-24 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-warm-gray)", color: "var(--color-black)" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Disclaimer</h2>
          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed mb-6 text-[var(--color-black)]/80">
            The information and tools provided on this page are intended solely for educational and illustrative purposes. 
            BetaNest is an AMFI-registered mutual fund distributor and does not offer portfolio management, stock advisory, 
            or investment guarantees of any kind.
          </p>
          <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed text-[var(--color-black)]/80">
            Mutual Fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. 
            The asset allocation and portfolio illustrations generated through this platform are indicative and should not be construed as financial advice.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
