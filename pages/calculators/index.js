"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const calculators = [
  { title: "Smart SIP Optimizer", slug: "smart-sip-optimizer", subtitle: "Compare flat SIP vs annual step-up" },
  { title: "Goal-Based SIP Planner", slug: "goal-based-sip-planner", subtitle: "Plan SIP to achieve your target corpus" },
  { title: "Financial Freedom Index", slug: "financial-freedom-index", subtitle: "Gauge your journey to financial independence" },
  { title: "Systematic Transfer Plan", slug: "systematic-transfer-plan", subtitle: "Move from debt to equity gradually" },
  { title: "Systematic Withdrawal Plan", slug: "systematic-withdrawal-plan", subtitle: "Plan sustainable withdrawals" },
  { title: "Lumpsum Calculator", slug: "lumpsum", subtitle: "One‑time investment growth" },
  { title: "Inflation Impact & Real Return", slug: "inflation-real", subtitle: "See inflation's impact on purchasing power" },
];

export default function CalculatorsHome() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="text-center py-16 border-b border-neutral-800">
        <h1 className="text-4xl font-semibold">Where Numbers Meet Clarity</h1>
        <p className="text-neutral-400 mt-2">Explore calculators designed to simplify your wealth journey.</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {calculators.map((calc, i) => (
          <motion.div
            key={calc.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/calculators/${calc.slug}`}
              className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition"
            >
              <h3 className="text-xl font-medium mb-2">{calc.title}</h3>
              <p className="text-neutral-400 text-sm">{calc.subtitle}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
