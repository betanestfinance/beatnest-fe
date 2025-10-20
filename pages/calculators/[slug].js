"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import CalculatorsDemo, { computeSmartSIP, computeGoalSIP, computeSWP, computeFFI, computeSTP, computeLumpsum, computeInflationReal } from "@/components/CalculatorsDemo";
import { useMemo, useState, useCallback, useEffect } from "react";

const COLORS = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00"];

export default function CalculatorPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [chartData, setChartData] = useState([]);

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
  const defaults = { sip: 10000, ret: 12, yrs: 5, step: 10, goal: 100000, corpus: 10000000, withdrawal: 30000 };
  const isFFI = slug === "financial-freedom-index";
  const isInflation = slug === "inflation-real";

  const fmtPercent = (v) => {
    if (v == null || !isFinite(v)) return "";
    return `${Number(v).toFixed(1)}%`;
  };

  const fmtL = (v) => {
    if (v == null || !isFinite(v)) return "";
    if (isFFI) return fmtPercent(v);
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
      const n = value / 1e7;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}cr`;
    }
    if (abs >= 1e5) {
      const n = value / 1e5;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}L`;
    }
    if (abs >= 1e3) {
      const n = value / 1e3;
      return `${Number.isInteger(n) ? n.toLocaleString("en-IN") : n.toFixed(2)}k`;
    }
    return value.toLocaleString("en-IN");
  };

  const safeNum = (v) => {
    const n = Number(v);
    return isFinite(n) ? Math.round(n) : 0;
  };

  const handleSWPChange = useCallback(
    ({ summary: { final } }) => {
      const data = [
        { name: "Final Investment Value", invested: safeNum(final.balance), fv: 0 },
        { name: "Total Interest Earned", invested: 0, fv: safeNum(final.totalInterest) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  const handleGoalSIPChange = useCallback(
    ({ summary: { monthly, invested, goal } }) => {
      const data = [
        { name: "Your Total Investment", invested: safeNum(invested), fv: 0 },
        { name: "Monthly SIP Amount", invested: 0, fv: safeNum(monthly) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  const handleSmartSIPChange = useCallback(
    ({ summary: { flat, stepup } }) => {
      const target = flat ?? stepup ?? { invested: 0, fv: 0 };
      const data = [
        { name: "Your Investment", invested: safeNum(target.invested), fv: 0 },
        { name: "Future value of your investment", invested: safeNum(target.fv), fv: 0 },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  const handleFFIChange = useCallback(
    ({ summary: { ffiPercent, status } = {} }) => {
      setChartData([{ name: "Financial Freedom Index", value: Number(ffiPercent) || 0, status: status || "" }]);
    },
    [setChartData]
  );

  const handleSTPChange = useCallback(
    ({ summary: { totalTransferred, fvTarget, totalFV } = {} }) => {
      const data = [
        { name: "Total Transferred", value: safeNum(totalTransferred) },
        { name: "End Value in Equity", value: safeNum(fvTarget) },
        { name: "Total Value (End)", value: safeNum(totalFV) },
      ];
      setChartData(data);
    },
    [setChartData]
  );
  const handleLumpsumChange = useCallback(
    ({ summary: { lumpsum, fv } = {} }) => {
      const data = [
        { name: "Lumpsum Amount", value: safeNum(lumpsum) },
        { name: "Estimated Future Value", value: safeNum(fv) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  const handleInflationChange = useCallback(
    ({ summary: { realReturn, nominalFV, realFV } = {} }) => {
      const data = [
        { name: "Real Return (p.a.)", value: safeNum(realReturn) },
        { name: "Nominal FV", value: safeNum(nominalFV) },
        { name: "Real FV (today's money)", value: safeNum(realFV) },
      ];
      setChartData(data);
    },
    [setChartData]
  );

  useEffect(() => {
    if (!slug) return;
    if (slug === "financial-freedom-index") {
      const { ffi, status, years } = computeFFI({
        expense: defaults.expense ?? 150000,
        passive: defaults.passive ?? 60000,
        corpus: defaults.corpus ?? defaults.corpus,
        ret: defaults.ret ?? 10,
        infl: defaults.infl ?? 6,
      });
      const ffiPercent = Number((ffi * 100).toFixed(1));
      setChartData([{ name: "Financial Freedom Index", value: ffiPercent, status }]);
      return;
    }
    if (slug === "systematic-transfer-plan") {
      const { totalTransferred, fvTarget, totalFV } = computeSTP({
        source: defaults.source ?? 1000000,
        transfer: defaults.transfer ?? 50000,
        months: defaults.months ?? 12,
        rd: defaults.rd ?? 6,
        re: defaults.re ?? 12,
      });
      setChartData([
        { name: "Transferred", value: safeNum(totalTransferred) },
        { name: "Value in Equity", value: safeNum(fvTarget) },
        { name: "Total Value", value: safeNum(totalFV) },
      ]);
      return;
    }
    if (slug === "lumpsum") {
      const { P0, FV } = computeLumpsum();
      setChartData([
        { name: "Lumpsum Amount", value: safeNum(P0) },
        { name: "Estimated Future Value", value: safeNum(FV) },
      ]);
      return;
    }
    if (slug === "systematic-withdrawal-plan") {
      const { final } = computeSWP({ corpus: defaults.corpus, withdrawal: defaults.withdrawal, ret: defaults.ret, yrs: defaults.yrs });
      setChartData([
        { name: "Final Investment Value", invested: safeNum(final.balance), fv: 0 },
        { name: "Total Interest Earned", invested: 0, fv: safeNum(final.totalInterest) },
      ]);
    } else if (slug === "goal-based-sip-planner") {
      const { invested, monthly } = computeGoalSIP({ goal: defaults.goal, ret: defaults.ret, yrs: defaults.yrs });
      setChartData([
        { name: "Your Total Investment", invested: safeNum(invested), fv: 0 },
        { name: "Monthly SIP Amount", invested: 0, fv: safeNum(monthly) },
      ]);
    } else if (slug === "smart-sip-optimizer") {
      const { flat } = computeSmartSIP(defaults);
      const target = flat ?? { invested: 0, fv: 0 };
      setChartData([
        { name: "Your Investment", invested: safeNum(target.invested), fv: 0 },
        { name: "Future value of your investment", invested: 0, fv: safeNum(target.fv) },
      ]);
    } else if (slug === "inflation-real") {
      const { realReturnPercent, nominalFV, realFV } = computeInflationReal();
      setChartData([
        { name: "Nominal FV", value: safeNum(nominalFV) },
        { name: "Real FV", value: safeNum(realFV) },
      ]);
    }
  }, [slug]);

  const chartDisplay = chartData.map((d) => {
    const investedVal = Number(d.invested ?? 0);
    const fvVal = Number(d.fv ?? 0);
    const otherVal = Number(d.value ?? 0);
    const value = investedVal || fvVal || otherVal;
    return { name: d.name, value, status: d.status ?? "" };
  });
  
  function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload;
    const isFFI = p.name === "Financial Freedom Index";
    return (
      <div style={{ background: "rgba(0,0,0,0.85)", color: "#fff", padding: 8, borderRadius: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{p.name}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>
          {isFFI ? `${Number(p.value).toFixed(1)}%` : fmtL(p.value)}
        </div>
        {isFFI && p.status ? <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{p.status}</div> : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-taupe)] text-[var(--color-black)]">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm opacity-80">
        <Link href="/" className="hover:opacity-100">Home</Link> /{" "}
        <Link href="/calculators" className="hover:opacity-100">Wealth Calculators</Link> /{" "}
        <span className="text-[var(--color-black)]">{title}</span>
      </div>

      {/* Header */}
      <section className="text-center py-10 border-b border-[var(--color-black)]/40">
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
          className="bg-[var(--color-black)] border border-[var(--color-black)] rounded-2xl p-6 text-[var(--color-cream)]"
        >
          <CalculatorsDemo
            activeCalc={slug}
            initial={defaults}
            onChange={
              slug === "smart-sip-optimizer"
                ? handleSmartSIPChange
                : slug === "goal-based-sip-planner"
                ? handleGoalSIPChange
                : slug === "systematic-transfer-plan"
                ? handleSTPChange
                : slug === "lumpsum"
                ? handleLumpsumChange
                : slug === "systematic-withdrawal-plan"
                ? handleSWPChange
                : slug === "financial-freedom-index"
                ? handleFFIChange
                : slug === "inflation-real"
                ? handleInflationChange
                : handleSmartSIPChange
            }
          />
        </motion.div>

        {/* Right — Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[var(--color-black)] border border-[var(--color-black)] rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          {/* <h3 className="text-xl font-medium mb-6 text-center text-[var(--color-cream)]">Projected Growth</h3> */}

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDisplay} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "var(--color-cream)" }} />
                {isFFI ? (
                  <YAxis
                    tick={{ fill: "var(--color-cream)" }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    allowDecimals={false}
                  />
                ) : (
                  <YAxis tick={{ fill: "var(--color-cream)" }} tickFormatter={formatYAxisLabel} />
                )}
                 <Tooltip
                   content={<CustomTooltip />} 
                 />

                {/* Render single bar per category using normalized 'value' */}
                <Bar dataKey="value" name="Value" fill={COLORS[0]} radius={[6, 6, 0, 0]} barSize={60}>
                  <LabelList dataKey="value" position="top" formatter={(v) => (isFFI ? fmtPercent(v) : fmtL(v))} />
                  {chartDisplay.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* custom legend / summary shown below the chart (matches screenshot) */}
          {(chartDisplay.length > 0) && (
            <div className="w-full mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
              {/** ensure legend colors match bar fills explicitly **/}
              {chartDisplay.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span style={{ width: 12, height: 12, background: COLORS[i % COLORS.length], borderRadius: 6, display: "inline-block" }} />
                  <div className="text-sm">
                    <div className="text-neutral-300">{d.name}</div>
                    <div className="font-semibold text-neutral-200">
                      {isFFI ? fmtPercent(d.value) : isInflation && d.name === "Real Return (p.a.)" ? fmtPercent(d.value) : fmtL(d.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Bottom Section - Related Calculators */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-xl font-medium mb-6">Explore More Calculators</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-[var(--color-cream)]">
          {Object.entries(calcTitles)
            .filter(([k]) => k !== slug)
            .slice(0, 4)
            .map(([key, value]) => (
              <Link
                key={key}
                href={`/calculators/${key}`}
                className="block bg-neutral-900 border border-yellow-800 rounded-xl p-5 hover:border-yellow-600 transition"
              >
                {value}
              </Link>
            ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/calculators"
            className="inline-block px-6 py-3 rounded-full border border-yellow-900 hover:border-yellow-700 transition"
          >
            View All
          </Link>
        </div>
      </section>
    </div>
  );
}
