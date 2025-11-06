"use client";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import CalculatorsDemo, { computeSmartSIP, computeGoalSIP, computeSWP, computeFFI, computeSTP, computeLumpsum, computeInflationReal } from "@/components/CalculatorsDemo";
import { useMemo, useState, useCallback, useEffect } from "react";
import Head from "next/head";

const COLORS = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00"];

// ──────────────────────────────────────────────────────────────
//  NEW: Smart formatter – L → cr automatically
// ──────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────
//  NEW: fmtSmart – L → cr → B (1 B = 100 cr)
//  Handles *any* size, never overflows
// ──────────────────────────────────────────────────────────────
const fmtSmart = (v) => {
  if (!isFinite(v) || v == null) return "";
  const abs = Math.abs(v);

  // ≥ 1 Trillion (1,000 Billion = 1 lakh crore)
  if (abs >= 1e12) {
    const t = abs / 1e12;
    const fixed = Number.isInteger(t) ? t.toString() : t.toFixed(2);
    return `₹${fixed}T`;
  }

  // ≥ 100 Crore → Billion (1 B = 100 cr)
  if (abs >= 1e9) {
    const b = abs / 1e9;
    const fixed = Number.isInteger(b) ? b.toString() : b.toFixed(2);
    return `₹${fixed}B`;
  }

  // ≥ 1 Crore
  if (abs >= 1e7) {
    const cr = abs / 1e7;
    const fixed = Number.isInteger(cr) ? cr.toString() : cr.toFixed(2);
    return `₹${fixed}cr`;
  }

  // ≥ 1 Lakh
  if (abs >= 1e5) {
    const l = abs / 1e5;
    const fixed = l < 10 ? l.toFixed(2) : Number.isInteger(l) ? l.toString() : l.toFixed(2);
    return `₹${fixed}L`;
  }

  // < 1 Lakh
  return `₹${Math.round(abs).toLocaleString("en-IN")}`;
};

// Keep old name for backward compatibility
const fmtL = fmtSmart;

export default function CalculatorPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [chartData, setChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
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
  const description = "Interactive wealth calculators — SIP, Lumpsum, FFI and more.";
  const defaults = { sip: 10000, ret: 12, yrs: 5, step: 10, goal: 100000, corpus: 10000000, withdrawal: 30000 };
  const isFFI = slug === "financial-freedom-index";
  const isInflation = slug === "inflation-real";
  const isSmartSIP = slug === "smart-sip-optimizer";
  const issystematicTransfer = slug === "systematic-transfer-plan";

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
    ({ summary: { flat, stepup } = {} }) => {
      const flatObj = flat ?? { invested: 0, fv: 0 };
      const stepObj = stepup ?? { invested: 0, fv: 0 };
      // add an explicit bar for Step-Up SIP estimated value
      const data = [
        { name: "Total Invested", invested: safeNum(flatObj.invested), fv: 0 },
        { name: "Flat SIP Value", value: safeNum(flatObj.fv) },
        { name: "Step-Up SIP Value", value: safeNum(stepObj.fv) },
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
        // { name: "Real Return (p.a.)", value: safeNum(realReturn) },
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
    if (slug === "smart-sip-optimizer") {
      const { flat, stepup } = computeSmartSIP(defaults);
      const flatObj = flat ?? { invested: 0, fv: 0 };
      const stepObj = stepup ?? { invested: 0, fv: 0 };
      setChartData([
        { name: "Total Invested", invested: safeNum(flatObj.invested), fv: 0 },
        { name: "Flat SIP", value: safeNum(flatObj.fv) },
        { name: "Step-Up SIP", value: safeNum(stepObj.fv) },
      ]);
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
        { name: "Total Investment", invested: safeNum(final.balance), fv: 0 },
        { name: "Total Interest", invested: 0, fv: safeNum(final.totalInterest) },
      ]);
    } else if (slug === "goal-based-sip-planner") {
      const { invested, monthly } = computeGoalSIP({ goal: defaults.goal, ret: defaults.ret, yrs: defaults.yrs });
      setChartData([
        { name: "Total Investment", invested: safeNum(invested), fv: 0 },
        { name: "Monthly SIP Amount", invested: 0, fv: safeNum(monthly) },
      ]);
    } else if (slug === "smart-sip-optimizer") {
      const { flat } = computeSmartSIP(defaults);
      const target = flat ?? { invested: 0, fv: 0 };
      setChartData([
        { name: "Investment", invested: safeNum(target.invested), fv: 0 },
        { name: "Future value", invested: 0, fv: safeNum(target.fv) },
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
    console.log("TOOLTIP P:", isFFI, p);
    return (
      <div style={{ background: "rgba(0,0,0,0.85)", color: "#fff", padding: 8, borderRadius: 6 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{p.name}</div>
        <div style={{ fontWeight: 700, marginTop: 4 }}>
          {isFFI ? `${Number(p.value).toFixed(1)}%` : fmtSmart(p.value)}
        </div>
        {isFFI && p.status ? <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{p.status}</div> : null}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} — BetaNest</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://www.betanestfin.com/calculators/${slug}`} />
        <meta property="og:title" content={`${title} — BetaNest`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://www.betanestfin.com/calculators/${slug}`} />
      </Head>
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

        {/* ---------- RIGHT PANEL – CHART ---------- */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[var(--color-black)] border border-[var(--color-black)] rounded-2xl p-6 flex flex-col items-center justify-center"
        >
          <div className="w-full h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDisplay} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-cream)", fontSize: isMobile ? 11 : 13 }}
                  angle={isMobile ? -30 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 70 : 50}
                />
                {isFFI ? (
                  <YAxis
                    tick={{ fill: "var(--color-cream)" }}
                    domain={[0, 250]}
                    tickFormatter={(v) => `${v}%`}
                    allowDecimals={false}
                    allowDataOverflow={false}
                  />
                ) : (
                    <YAxis
                    tick={{ fill: "var(--color-cream)" }}
                    tickFormatter={(v) => {
                      if (!isFinite(v)) return "";
                      const abs = Math.abs(v);
                      const round2 = (n) => (n < 10 ? n.toFixed(1) : Math.round(n).toString());

                      if (abs >= 1e12) return `${round2(abs / 1e12)}T`;
                      if (abs >= 1e9)  return `${round2(abs / 1e9)}B`;
                      if (abs >= 1e7)  return `${round2(abs / 1e7)}cr`;
                      if (abs >= 1e5) {
                        const l = abs / 1e5;
                        return `${l < 10 ? l.toFixed(1) : Math.round(l)}L`;
                      }
                      return Math.round(abs).toLocaleString("en-IN");
                    }}
                    domain={[0, (max) => Math.ceil(max * 1.15)]}
                  />
                )}
                <Tooltip content={<CustomTooltip />} cursor={false} />

                <Bar dataKey="value" barSize={isMobile ? 40 : 60} radius={[6, 6, 0, 0]}>
                  {chartDisplay.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={i === 0 ? "#E69F00" : i === 1 ? "#56B4E9" : "#009E73"}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v) => (isFFI ? fmtPercent(v) : isInflation && v.name === "Real Return (p.a.)" ? fmtPercent(v) : fmtSmart(v))}
                    style={{ fill: "var(--color-cream)", fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND / SUMMARY */}
          {chartDisplay.length > 0 && (
            <div className="mt-6 w-full">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 justify-items-center ${isSmartSIP || issystematicTransfer ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
                {chartDisplay.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center gap-3 w-full max-w-xs justify-between sm:justify-start"
                  >
                    <span
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{
                        background:
                          i === 0 ? "#E69F00" : i === 1 ? "#56B4E9" : "#009E73",
                      }}
                    />
                    <div className="flex-1 min-w-0 text-sm text-neutral-300">
                      <div className="truncate">{d.name}</div>
                      <div className="font-semibold text-neutral-200">
                        {isFFI ? fmtPercent(d.value) : isInflation && d.name === "Real Return (p.a.)" ? fmtPercent(d.value) : fmtSmart(d.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    </>
  );
}
