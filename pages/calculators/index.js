"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";

const calculators = [
  { title: "Smart SIP Optimizer", slug: "smart-sip-optimizer", subtitle: "Compare flat SIP vs annual step-up" },
  { title: "Lumpsum Calculator", slug: "lumpsum", subtitle: "One‑time investment growth" },
  { title: "Goal-Based SIP Planner", slug: "goal-based-sip-planner", subtitle: "Plan SIP to achieve your target corpus" },
  { title: "Financial Freedom Index", slug: "financial-freedom-index", subtitle: "Gauge your journey to financial independence" },
  { title: "Systematic Transfer Plan", slug: "systematic-transfer-plan", subtitle: "Move from debt to equity gradually" },
  { title: "Systematic Withdrawal Plan", slug: "systematic-withdrawal-plan", subtitle: "Plan sustainable withdrawals" },
  { title: "Inflation Impact & Real Return", slug: "inflation-real", subtitle: "See inflation's impact on purchasing power" },
];

export default function CalculatorsHome() {
  return (
    <>
    <Head>
        <title>Calculators</title>
        <description>BetaNest Home</description>
    </Head>
    <div className="bg-neutral-950 text-neutral-100" style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}>
      <section className="text-center py-16 border-b border-neutral-800">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.05 }}
        className="text-4xl font-semibold will-change-transform">Where Numbers Meet Clarity</motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.05 }}
        className="text-neutral-700 mt-2 will-change-transform">Explore calculators designed to simplify your wealth journey.</motion.p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {calculators.map((calc, i) => (
          <motion.div
            key={calc.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.26, ease: "easeOut", delay: i * 0.02 }}
            className="will-change-transform"
          >
            <Link
              href={`/calculators/${calc.slug}`}
              className="block bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition"
            >
              <h3 className="text-xl text-neutral-100 font-medium mb-2">{calc.title}</h3>
              <p className="text-neutral-300 text-sm">{calc.subtitle}</p>
            </Link>
          </motion.div>
        ))}
      </div>
      <section className="text-xl text-center py-16 border-t border-neutral-800 px-2">
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay:  0.05 }}
            className="text-neutral-700 mt-2">These calculators are more than numerical tools — they are extensions of BetaNest’s promise: <br /> To guide every investor toward enduring prosperity through clarity, discipline, and foresight.</motion.p>
        <br />
        <motion.p className="text-neutral-700">
            📧 Let's discuss:{" "}
            <a href="mailto:info@betanestfin.com" className="text-link" style={{ cursor: "pointer" }}>
              info@betanestfin.com
            </a>
          </motion.p>
          <br />
          <motion.p className="text-neutral-700">
            <a href="https://calendly.com/betanestfinance" className="text-link" style={{cursor: 'pointer'}} target="_blank" rel="noopener noreferrer">
                📅 Schedule a 30-minute consultation
              </a>
          </motion.p>
      </section>
      <section className="text-xl text-center py-16 border-t border-neutral-800 px-2">
        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
        className="text-4xl font-semibold">Disclaimer</motion.h1>
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay:  0.05 }}
        className="text-neutral-700 mt-2">Past performance may or may not be sustained in future and is not a guarantee of any future returns.
           <br /> Please note that these calculators are for illustrations only and do not represent actual returns. <br /> 
           Mutual Funds do not have a fixed rate of return and it is not possible to predict the rate of return.
           </motion.p>
      </section>
    </div>
    </>
  );
}
