"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import CalculatorsDemo, { computeSmartSIP, computeGoalSIP } from "@/components/CalculatorsDemo";
import { useMemo, useState, useCallback } from "react";

const COLORS = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00"];

export default function CalculatorPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [chartData, setChartData] = useState([]);

  // Map slugs to proper titles
  const calcTitles = {
    "smart-sip-optimizer": "Smart SIP Optimizer",
    "goal-based-sip-planner": "Goal-Based SIP Planner",
    "financial-freedom-index": "Financial Freedom Index",
    "systematic-transfer-plan": "Systematic Transfer Plan",
    "systematic-withdrawal-plan": "Systematic Withdrawal Plan",
    "lumpsum": "Lumpsum Calculator",
    "inflation-real": "Inflation Impact & Real Return",
  };
  
  const title = calcTitles[slug] || "Calculator";
  const defaults = { sip: 10000, ret: 12, yrs: 5, step: 10, goal: 100000 };
  const fmtL = (v) => {
    if (v == null || !isFinite(v)) return "";
    if (Math.abs(v) >= 100000) {
      const lakhs = v / 100000;
      return `₹${Number.isInteger(lakhs) ? lakhs.toLocaleString("en-IN") : lakhs.toFixed(2)}L`;
    }
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
  };

  const formatYAxisLabel = (value) => {
    if (value == null || !isFinite(value)) return "";
    const abs = Math.abs(value);
    if (abs >= 1e7) {
      // crores
      const n = value / 1e7;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}cr`;
    }
    if (abs >= 1e5) {
      // lakhs
      const n = value / 1e5;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}L`;
    }
    if (abs >= 1e3) {
      const n = value / 1e3;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}k`;
    }
    return value.toLocaleString("en-IN");
  };

  const handleSmartSIPChange = useCallback(
    ({ summary: { flat, stepup } }) => {
      const target = flat ?? stepup ?? { invested: 0, fv: 0 };
      const data = [
        { name: "Your Investment", invested: Math.round(target.invested), fv: null },
        { name: "Future value of your investment", invested: null, fv: Math.round(target.fv) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  const handleGoalSIPChange = useCallback(
    ({ summary: { monthly, invested, goal } }) => {
      const data = [
        { name: "Your Total Investment", invested: Math.round(invested), fv: null },
        { name: "Monthly SIP Amount", invested: null, fv: Math.round(monthly) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  useMemo(() => {
    if (slug === "smart-sip-optimizer") {
      const { flat } = computeSmartSIP(defaults);
      const target = flat ?? { invested: 0, fv: 0 };
      setChartData([
        { name: "Your Investment", invested: Math.round(target.invested), fv: null },
        { name: "Future value of your investment", invested: null, fv: Math.round(target.fv) },
      ]);
    } else if (slug === "goal-based-sip-planner") {
      const { invested, monthly } = computeGoalSIP({ goal: defaults.goal, ret: defaults.ret, yrs: defaults.yrs });
      setChartData([
        { name: "Your Total Investment", invested: Math.round(invested), fv: null },
        { name: "Monthly SIP Amount", invested: null, fv: Math.round(monthly) },
      ]);
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-[var(--color-black)] text-[var(--color-cream)]">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm opacity-80">
        <Link href="/" className="hover:opacity-100">Home</Link> /{" "}
        <Link href="/calculators" className="hover:opacity-100">Wealth Calculators</Link> /{" "}
        <span className="text-[var(--color-cream)]">{title}</span>
      </div>

      {/* Header */}
      <section className="text-center py-10 border-b border-[var(--color-taupe)]/40">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-semibold"
        >
          {title}
        </motion.h1>
      </section>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        {/* Left — Calculator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[var(--color-taupe)]/10 border border-[var(--color-taupe)]/30 rounded-2xl p-6"
        >
          <CalculatorsDemo
            activeCalc={slug}
            initial={defaults}
            onChange={slug === "smart-sip-optimizer" ? handleSmartSIPChange : slug === "goal-based-sip-planner" ? handleGoalSIPChange : handleSmartSIPChange}
          />
        </motion.div>

        {/* Right — Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[var(--color-taupe)]/10 border border-[var(--color-taupe)]/30 rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-xl font-medium mb-6 text-center">Projected Growth</h3>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "var(--color-cream)" }} />
                <YAxis tick={{ fill: "var(--color-cream)" }} tickFormatter={formatYAxisLabel} />
                <Tooltip
                  formatter={(value) => fmtL(value)}
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "none",
                    color: "#fff",
                  }}
                />

                { (slug === "smart-sip-optimizer" || slug === "goal-based-sip-planner") ? (
                  <>
                    <Bar dataKey="invested" name="Your Total Investment" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={slug === "goal-based-sip-planner" ? 60 : 40}>
                      <LabelList dataKey="invested" position="top" formatter={(v) => fmtL(v)} />
                    </Bar>
                    <Bar dataKey="fv" name={slug === "goal-based-sip-planner" ? "Monthly SIP Amount" : "Estimated Value (₹)"} fill={COLORS[1]} radius={[6, 6, 0, 0]} barSize={slug === "goal-based-sip-planner" ? 40 : 40}>
                      <LabelList dataKey="fv" position="top" formatter={(v) => fmtL(v)} />
                    </Bar>
                  </>
                ) : (
                  <Bar dataKey="value" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={40} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {(slug === "smart-sip-optimizer" || slug === "goal-based-sip-planner") && chartData.length > 0 && (
            <div className="w-full mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <span style={{ width: 12, height: 12, background: COLORS[0], borderRadius: 6, display: "inline-block" }} />
                <div className="text-sm">
                  <div className="text-neutral-300">Your Total Investment</div>
                  <div className="font-semibold">{fmtL(chartData.find(d => d.invested != null)?.invested ?? 0)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span style={{ width: 12, height: 12, background: COLORS[1], borderRadius: 6, display: "inline-block" }} />
                <div className="text-sm">
                  <div className="text-neutral-300">{slug === "goal-based-sip-planner" ? "Monthly SIP Amount" : "Estimated Value"}</div>
                  <div className="font-semibold">{fmtL(chartData.find(d => d.fv != null)?.fv ?? 0)}</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Section - Related Calculators */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-xl font-medium mb-6">Explore More Calculators</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(calcTitles)
            .filter(([k]) => k !== slug)
            .slice(0, 4)
            .map(([key, value]) => (
              <Link
                key={key}
                href={`/calculators/${key}`}
                className="block bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 transition"
              >
                {value}
              </Link>
            ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/calculators"
            className="inline-block px-6 py-3 rounded-full border border-neutral-700 hover:border-neutral-500 transition"
          >
            View All
          </Link>
        </div>
      </section>
    </div>
  );
}
