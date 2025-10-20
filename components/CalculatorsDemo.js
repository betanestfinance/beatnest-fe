import React, { useMemo, useState, useEffect } from "react";

const fmt = (n) => (isFinite(n) ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "-");
const pmtFV = (P, r, n) => {
  if (r === 0) return P * n;
  return P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
};

export default function CalculatorsDemo({ activeCalc, initial, onChange }) {
  return (
    <>
      {activeCalc === "smart-sip-optimizer" && <SmartSIP initial={initial} onChange={onChange} />}
      {activeCalc === "goal-based-sip-planner" && <GoalSIP initial={initial} onChange={onChange} />}
      {activeCalc === "financial-freedom-index" && <FFI initial={initial} onChange={onChange} />}
      {activeCalc === "systematic-transfer-plan" && <STP initial={initial} onChange={onChange} />}
      {activeCalc === "systematic-withdrawal-plan" && <SWP initial={initial} onChange={onChange} />}
      {activeCalc === "lumpsum" && <Lumpsum initial={initial} onChange={onChange} />}
      {activeCalc === "inflation-real" && <InflationReal initial={initial} onChange={onChange} />}
    </>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="bg-neutral-900/60 rounded-2xl p-5 border border-neutral-800 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className="text-neutral-400 text-sm mt-1 mb-4">{subtitle}</p>
      {children}
    </section>
  );
}

function NumberInput({ label, value, setValue, step = 1, min = 0, max }) {
  const isPercent = label.includes("%");
  const isCurrency = label.includes("₹") || /amount|corpus|withdrawal|lumpsum/i.test(label);
  const displayVal = (v) => {
    if (!isFinite(v)) return "";
    if (isPercent) return `${Number(v).toFixed(1)}%`;
    if (isCurrency) return `₹${Number(v).toLocaleString("en-IN")}`;
    return Number(v).toLocaleString("en-IN");
  };

  const clamp = (n) => {
    let v = Number(n);
    if (!isFinite(v)) v = min;
    if (typeof max === "number" && v > max) v = max;
    if (v < min) v = min;
    return v;
  };

  return (
    <label className="block mb-3">
      <span className="block text-sm text-neutral-300 mb-1">{label}</span>

      {/* slider + numeric pill layout */}
      <div className="flex items-center gap-3">
        {/* range slider (flexes) */}
        <input
          type="range"
          min={min}
          max={typeof max === "number" ? max : undefined}
          step={step}
          value={Number.isFinite(Number(value)) ? Number(value) : min}
          onChange={(e) => setValue(clamp(e.target.value))}
          className="flex-1 h-2 bg-neutral-700 rounded-lg accent-green-600"
        />

        {/* numeric input styled as rounded pill (still editable) */}
        <div className="inline-flex items-center bg-neutral-800 border border-neutral-700 rounded-full px-3 py-2">
          {isCurrency && <span className="mr-2 text-sm">₹</span>}
          <input
            type="number"
            step={step}
            min={min}
            max={max}
            value={Number.isFinite(Number(value)) ? Number(value) : ""}
            onChange={(e) => setValue(clamp(e.target.value))}
            className="appearance-none bg-transparent text-sm text-right w-20 focus:outline-none"
          />
          {isPercent && <span className="ml-2 text-sm">%</span>}
        </div>
      </div>

      {/* {typeof max === "number" && (
        <div className="text-xs text-neutral-200 mt-1">Max: {max.toLocaleString("en-IN")}</div>
      )} */}
    </label>
  );
}

export function computeSmartSIP({ sip = 10000, ret = 12, yrs = 10, step = 10 } = {}) {
  const monthlyR = (ret / 100) / 12;
  const totalMonths = yrs * 12;

  const simulate = (monthlyForMonth) => {
    let balance = 0;
    let invested = 0;
    const series = [];

    for (let m = 1; m <= totalMonths; m++) {
      const monthly = monthlyForMonth(m);
      invested += monthly;
      balance = balance * (1 + monthlyR) + monthly;
      if (m % 12 === 0) {
        const year = m / 12;
        series.push({
          year,
          invested: Math.round(invested),
          fv: Math.round(balance),
        });
      }
    }
    return series;
  };

  const flatSeries = simulate(() => sip);

  const stepSeries = simulate((m) => {
    const year = Math.ceil(m / 12);
    return Math.round(sip * Math.pow(1 + step / 100, year - 1));
  });

  const flat = flatSeries[flatSeries.length - 1] || { invested: 0, fv: 0 };
  const stepup = stepSeries[stepSeries.length - 1] || { invested: 0, fv: 0 };

  return { flat, stepup, flatSeries, stepSeries };
}

export function computeGoalSIP({ goal = 100000, ret = 12, yrs = 15 } = {}) {
  const r = ret / 100 / 12;
  const n = yrs * 12;

  let monthly;
  if (r === 0) {
    monthly = goal / n;
  } else {
    const denom = ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    monthly = goal / denom;
  }
  const monthlyRounded = Math.round(monthly * 100) / 100; 
  const totalInvested = Math.round(monthlyRounded * n);
  return { monthly: monthlyRounded, invested: totalInvested, goal };
}

export function computeFFI({ expense = 150000, passive = 60000, corpus = 25000000, ret = 10, infl = 6 } = {}) {
  const Eyr = expense * 12;
  const PIyr = passive * 12;
  const R = ret / 100;
  const I = infl / 100;

  const ffi = Eyr === 0 ? 1 : Math.min(2, PIyr / Eyr);
  if (PIyr >= Eyr) return { ffi, status: "Already financially independent", years: 0 };

  let C = corpus;
  let t = 0;
  while (t < 60) {
    const need = Eyr * Math.pow(1 + I, t) - PIyr;
    const yieldYear = C * R; 
    if (yieldYear >= need) return { ffi, status: "On course", years: t };
    C = C * (1 + R);
    t++;
  }
  return { ffi, status: "Gap persists", years: null };
}

// 1) Smart SIP Optimizer
export function SmartSIP({ initial = {}, onChange } = {}) {

  const SIP_MAX = 10_000_000;
  const YRS_MAX = 30;
  const RET_MAX = 25;

  const [sip, setSIP] = useState(initial.sip ?? 10000);
  const [ret, setRet] = useState(initial.ret ?? 12);
  const [yrs, setYrs] = useState(initial.yrs ?? 10);
  const [step, setStep] = useState(initial.step ?? 10); 

  const { flat, stepup, flatSeries, stepSeries } = useMemo(
    () => computeSmartSIP({ sip, ret, yrs, step }),
    [sip, ret, yrs, step]
  );

  const errors = [];
  if (sip > SIP_MAX) errors.push(`Monthly SIP cannot exceed ₹${SIP_MAX.toLocaleString("en-IN")}`);
  if (yrs > YRS_MAX) errors.push(`Investment duration cannot exceed ${YRS_MAX} years`);
  if (ret > RET_MAX) errors.push(`Expected return cannot exceed ${RET_MAX}% p.a.`);

  useEffect(() => {
    if (typeof onChange === "function" && errors.length === 0) {
      onChange({
        params: { sip, ret, yrs, step },
        summary: { flat, stepup },
        series: { flatSeries, stepSeries },
      });
    }
  }, [sip, ret, yrs, step, flat, stepup, flatSeries, stepSeries, onChange, errors.length]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Monthly SIP (₹)" value={sip} setValue={setSIP} step={500} max={SIP_MAX} />
        <NumberInput label="Expected Return (% p.a.)" value={ret} setValue={setRet} step={0.5} max={RET_MAX} />
        <NumberInput label="Tenure (years)" value={yrs} setValue={setYrs} max={YRS_MAX} />
        <NumberInput label="Annual Step-Up (%)" value={step} setValue={setStep} step={1} />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 text-sm text-red-400">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-neutral-800/70 rounded-xl p-3">
          <div className="text-neutral-300 mb-1">Flat SIP</div>
          <div>Invested: ₹{fmt(flat.invested)}</div>
          <div>Estimated Value: ₹{fmt(flat.fv)}</div>
        </div>
        <div className="bg-neutral-800/70 rounded-xl p-3">
          <div className="text-neutral-300 mb-1">Step-Up SIP</div>
          <div>Invested: ₹{fmt(stepup.invested)}</div>
          <div>Estimated Value: ₹{fmt(stepup.fv)}</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-neutral-400">
        Wealth Advantage (Step-Up vs Flat):{" "}
        <span className="text-neutral-200 font-medium">₹{fmt(stepup.fv - flat.fv)}</span>
      </div>
    </div>
  );
}

// 2) Goal-Based SIP Planner (solve for P)
export function GoalSIP({ initial = {}, onChange } = {}) {
  const GOAL_MAX = 500_000_000; 
  const YRS_MAX = 30;
  const RET_MAX = 35;

  const [goal, setGoal] = useState(initial.goal ?? 100000);
  const [ret, setRet] = useState(initial.ret ?? 12);
  const [yrs, setYrs] = useState(initial.yrs ?? 15);

  const required = useMemo(() => {
    const r = ret / 100 / 12;
    const n = yrs * 12;
    if (r === 0) return goal / n;
    return goal / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [goal, ret, yrs]);

  
  const errors = [];
  if (goal > GOAL_MAX) errors.push(`Goal cannot exceed ₹${GOAL_MAX.toLocaleString("en-IN")}`);
  if (yrs > YRS_MAX) errors.push(`Tenure cannot exceed ${YRS_MAX} years`);
  if (ret > RET_MAX) errors.push(`Expected return cannot exceed ${RET_MAX}% p.a.`);

  useEffect(() => {
    if (typeof onChange === "function" && errors.length === 0) {
      const { monthly, invested } = computeGoalSIP({ goal, ret, yrs });
      onChange({
        params: { goal, ret, yrs },
        summary: { monthly, invested, goal },
      });
    }

  }, [goal, ret, yrs, onChange, errors.length]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Target Corpus (₹)" value={goal} setValue={setGoal} step={50000} max={GOAL_MAX} />
        <NumberInput label="Expected Return (% p.a.)" value={ret} setValue={setRet} step={0.5} max={RET_MAX} />
        <NumberInput label="Tenure (years)" value={yrs} setValue={setYrs} max={YRS_MAX} />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 text-sm text-red-400">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="mt-4 bg-neutral-800/70 rounded-xl p-3 text-sm">
        Required Monthly SIP: <span className="text-neutral-200 font-medium">₹{fmt(required)}</span>
      </div>
      <p className="text-xs text-neutral-200 mt-2">Indicative only. Market returns vary; results are illustrative.</p>
    </div>
  );
}

// 3) Financial Freedom Index
function FFI({ initial = {}, onChange } = {}) {
   const [expense, setExpense] = useState(150000);
   const [passive, setPassive] = useState(60000);
   const [corpus, setCorpus] = useState(25000000);
   const [ret, setRet] = useState(10);
   const [infl, setInfl] = useState(6);
 
   const { ffi, status, years } = useMemo(() => {
     const Eyr = expense * 12;
     const PIyr = passive * 12;
     const R = ret / 100;
     const I = infl / 100;
 
     const ffi = Eyr === 0 ? 1 : Math.min(2, PIyr / Eyr);
     if (PIyr >= Eyr) return { ffi, status: "Already financially independent", years: 0 };
 
     let C = corpus;
     let t = 0;
     while (t < 60) {
       const need = Eyr * Math.pow(1 + I, t) - PIyr; 
       const yieldYear = C * R;
       if (yieldYear >= need) return { ffi, status: "On course", years: t };
       C = C * (1 + R); 
       t++;
     }
     return { ffi, status: "Gap persists", years: null };
   }, [expense, passive, corpus, ret, infl]);
 
   
   useEffect(() => {
     if (typeof onChange === "function") {
       const ffiPercent = Number((ffi * 100).toFixed(1));
       onChange({
         params: { expense, passive, corpus, ret, infl },
         summary: { ffiPercent, status, years },
       });
     }
   }, [ffi, status, years, expense, passive, corpus, ret, infl, onChange]);

   return (
     <div>
       <div className="grid grid-cols-1 gap-3">
         <NumberInput label="Monthly Expenses (₹)" value={expense} setValue={setExpense} step={1000} max={100000000} />
         <NumberInput label="Monthly Income (₹)" value={passive} setValue={setPassive} step={1000} max={100000000} />
         <NumberInput label="Existing Corpus (₹)" value={corpus} setValue={setCorpus} step={50000} max={100000000} />
         <NumberInput label="Expected Return (% p.a.)" value={ret} setValue={setRet} step={0.5} />
         <NumberInput label="Inflation (% p.a.)" value={infl} setValue={setInfl} step={0.5} />
       </div>
       <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
         <div className="bg-neutral-800/70 rounded-xl p-3">FFI: <span className="font-medium text-neutral-200">{(ffi*100).toFixed(0)}%</span></div>
         <div className="bg-neutral-800/70 rounded-xl p-3">Status: <span className="font-medium text-neutral-200">{status}</span></div>
       </div>
       {years !== null && (
         <div className="mt-2 text-sm text-neutral-400">Estimated years to FI: <span className="text-neutral-200 font-medium">{years}</span></div>
       )}
       <p className="text-xs text-neutral-500 mt-2">Indicative only; not investment advice.</p>
     </div>
   );
}

// 4) STP Calculator
export function computeSTP({ source = 1000000, transfer = 50000, months = 12, rd = 6, re = 12 } = {}) {
  const rdm = rd / 100 / 12;
  const rem = re / 100 / 12;
  let debt = source;
  let fvTarget = 0;

  for (let t = 1; t <= months; t++) {
    debt = debt * (1 + rdm);
    const amt = Math.min(transfer, debt);
    debt -= amt;
    
    const remaining = months - t + 1;
    fvTarget += amt * Math.pow(1 + rem, remaining);
  }

  const residual = debt;
  const totalTransferred = Math.min(transfer * months, source * Math.pow(1 + rdm, months));
  const totalFV = fvTarget + residual;

  return {
    totalTransferred: Math.round(totalTransferred),
    fvTarget: Math.round(fvTarget),
    residual: Math.round(residual),
    totalFV: Math.round(totalFV),
  };
}

function STP({ initial = {}, onChange } = {}) {
  const [source, setSource] = useState(initial.source ?? 1000000);
  const [transfer, setTransfer] = useState(initial.transfer ?? 50000);
  const [months, setMonths] = useState(initial.months ?? 12);
  const [rd, setRd] = useState(initial.rd ?? 6); // debt return p.a.
  const [re, setRe] = useState(initial.re ?? 12); // equity return p.a.

  const { totalTransferred, fvTarget, residual, totalFV } = useMemo(
    () => computeSTP({ source, transfer, months, rd, re }),
    [source, transfer, months, rd, re]
  );

  // notify parent page so chart updates dynamically
  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({
        params: { source, transfer, months, rd, re },
        summary: { totalTransferred, fvTarget, residual, totalFV },
      });
    }
  }, [source, transfer, months, rd, re, totalTransferred, fvTarget, residual, totalFV, onChange]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Source Corpus (Debt) (₹)" value={source} setValue={setSource} step={10000} max={100000000} />
        <NumberInput label="Monthly Transfer (₹)" value={transfer} setValue={setTransfer} step={1000} max={100000000} />
        <NumberInput label="Months" value={months} setValue={setMonths} />
        <NumberInput label="Debt Return (% p.a.)" value={rd} setValue={setRd} step={0.5} />
        <NumberInput label="Equity Return (% p.a.)" value={re} setValue={setRe} step={0.5} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-neutral-800/70 rounded-xl p-3">Total Transferred: ₹{fmt(totalTransferred)}</div>
        <div className="bg-neutral-800/70 rounded-xl p-3">End Value in Equity: ₹{fmt(fvTarget)}</div>
        <div className="bg-neutral-800/70 rounded-xl p-3">Residual in Debt: ₹{fmt(residual)}</div>
        <div className="bg-neutral-800/70 rounded-xl p-3">Total Value (End): ₹{fmt(totalFV)}</div>
      </div>
    </div>
  );
}

// 8) Lumpsum helper (exported)
export function computeLumpsum({ P0 = 500000, R = 12, T = 10 } = {}) {
  const FV = P0 * Math.pow(1 + R / 100, T);
  return { P0: Math.round(P0), FV: Math.round(FV) };
}

export function computeInflationReal({ R = 12, I = 6, T = 10, P0 = 1000000 } = {}) {
  const Rreal = (1 + R / 100) / (1 + I / 100) - 1;
  const FVn = P0 * Math.pow(1 + R / 100, T);
  const FVr = FVn / Math.pow(1 + I / 100, T);
  return {
    realReturnPercent: Number((Rreal * 100).toFixed(2)),
    nominalFV: Math.round(FVn),
    realFV: Math.round(FVr),
  };
}

// 5) SWP Calculator
export function computeSWP({ corpus = 10000000, withdrawal = 30000, ret = 10, yrs = 20 } = {}) {
  const monthlyR = (ret / 100) / 12;
  const totalMonths = yrs * 12;

  let balance = corpus;
  let totalWithdrawn = 0;
  let totalInterest = 0;
  const series = [];

  for (let m = 1; m <= totalMonths; m++) {
    const interest = balance * monthlyR;
    totalInterest += interest;
    balance += interest;

    const w = Math.min(withdrawal, balance);
    totalWithdrawn += w;
    balance -= w;

    
    if (m % 12 === 0 || m === totalMonths) {
      series.push({
        year: Math.ceil(m / 12),
        balance: Math.round(balance),
        totalWithdrawn: Math.round(totalWithdrawn),
        totalInterest: Math.round(totalInterest),
      });
    }

    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  return {
    final: { balance: Math.round(balance), totalWithdrawn: Math.round(totalWithdrawn), totalInterest: Math.round(totalInterest) },
    series,
  };
}

export function SWP({ initial = {}, onChange } = {}) {
  const CORPUS_MAX = 500_000_000; 
  const YRS_MAX = 30;
  const RET_MAX = 25;
  const WITHDRAWAL_MAX = 500_000;

  const [corpus, setCorpus] = useState(initial.corpus ?? 10000000);
  const [withdrawal, setWithdrawal] = useState(initial.withdrawal ?? 30000);
  const [ret, setRet] = useState(initial.ret ?? 10);
  const [yrs, setYrs] = useState(initial.yrs ?? 20);

  const { final, series } = useMemo(() => computeSWP({ corpus, withdrawal, ret, yrs }), [corpus, withdrawal, ret, yrs]);

  const errors = [];
  if (corpus > CORPUS_MAX) errors.push(`Starting corpus cannot exceed ₹${CORPUS_MAX.toLocaleString("en-IN")}`);
  if (yrs > YRS_MAX) errors.push(`Tenure cannot exceed ${YRS_MAX} years`);
  if (ret > RET_MAX) errors.push(`Expected return cannot exceed ${RET_MAX}% p.a.`);
  if (withdrawal > WITHDRAWAL_MAX) errors.push(`Monthly withdrawal cannot exceed ₹${WITHDRAWAL_MAX.toLocaleString("en-IN")}`);

  useEffect(() => {
    if (typeof onChange === "function" && errors.length === 0) {
      onChange({
        params: { corpus, withdrawal, ret, yrs },
        summary: { final, series },
      });
    }
  }, [corpus, withdrawal, ret, yrs, final, series, onChange, errors.length]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Starting Corpus (₹)" value={corpus} setValue={setCorpus} step={100000} max={CORPUS_MAX} />
        <NumberInput label="Monthly Withdrawal (₹)" value={withdrawal} setValue={setWithdrawal} step={500} max={WITHDRAWAL_MAX} />
        <NumberInput label="Expected Return (% p.a.)" value={ret} setValue={setRet} step={0.5} max={RET_MAX} />
        <NumberInput label="Tenure (years)" value={yrs} setValue={setYrs} min={1} max={YRS_MAX} />
      </div>

      {errors.length > 0 && (
        <div className="mt-3 text-sm text-red-400">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-neutral-800/70 rounded-xl p-3">
          <div className="text-neutral-300 mb-1">Final Investment Value</div>
          <div>₹{fmt(final.balance)}</div>
        </div>
        <div className="bg-neutral-800/70 rounded-xl p-3">
          <div className="text-neutral-300 mb-1">Total Interest Earned</div>
          <div>₹{fmt(final.totalInterest)}</div>
        </div>
      </div>

      <div className="mt-3 text-sm text-neutral-400">
        Total Withdrawn: <span className="text-neutral-200 font-medium">₹{fmt(final.totalWithdrawn)}</span>
      </div>
    </div>
  );
}

// 6. lumpsum calculator

function Lumpsum({ initial = {}, onChange } = {}) {
  const [P0, setP0] = useState(initial.P0 ?? 500000);
  const [R, setR] = useState(initial.R ?? 12);
  const [T, setT] = useState(initial.T ?? 10);
  const FV = useMemo(() => P0 * Math.pow(1 + R / 100, T), [P0, R, T]);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({
        params: { P0, R, T },
        summary: { lumpsum: Math.round(P0), fv: Math.round(FV) },
      });
    }
  }, [P0, R, T, FV, onChange]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Lumpsum Amount (₹)" value={P0} setValue={setP0} step={10000} max={100000000} />
        <NumberInput label="Return (% p.a.)" value={R} setValue={setR} step={0.5} min={0} max={25} />
        <NumberInput label="Tenure (years)" value={T} setValue={setT} min={1} max={30} />
      </div>
      <div className="mt-4 bg-neutral-800/70 rounded-xl p-3 text-sm">
        Estimated Future Value: <span className="text-neutral-200 font-medium">₹{fmt(FV)}</span>
      </div>
      <p className="text-xs text-neutral-500 mt-2">Illustrative only; not investment advice.</p>
    </div>
  );
}

/* 7) Inflation Impact & Real Return */
function InflationReal({ initial = {}, onChange } = {}) {
  const [R, setR] = useState(initial.R ?? 12); 
  const [I, setI] = useState(initial.I ?? 6);  
  const [T, setT] = useState(initial.T ?? 10);
  const [P0, setP0] = useState(initial.P0 ?? 1000000);

  const Rreal = useMemo(() => (1 + R / 100) / (1 + I / 100) - 1, [R, I]);
  const FVn = useMemo(() => P0 * Math.pow(1 + R / 100, T), [P0, R, T]);
  const FVr = useMemo(() => FVn / Math.pow(1 + I / 100, T), [FVn, I, T]);

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({
        params: { R, I, T, P0 },
        summary: {
          realReturn: Number((Rreal * 100).toFixed(2)), 
          nominalFV: Math.round(FVn),
          realFV: Math.round(FVr),
        },
      });
    }
  }, [Rreal, FVn, FVr, R, I, T, P0, onChange]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <NumberInput label="Nominal Return (% p.a.)" value={R} setValue={setR} step={0.5} max={25} />
        <NumberInput label="Inflation (% p.a.)" value={I} setValue={setI} step={0.5} />
        <NumberInput label="Tenure (years)" value={T} setValue={setT} min={1} max={30} />
        <NumberInput label="Lumpsum Amount (₹)" value={P0} setValue={setP0} step={10000} max={100000000} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-neutral-800/70 rounded-xl p-3">Real Return (p.a.): <span className="text-neutral-200 font-medium">{(Rreal * 100).toFixed(2)}%</span></div>
        <div className="bg-neutral-800/70 rounded-xl p-3">Nominal FV: <span className="text-neutral-200 font-medium">₹{fmt(FVn)}</span></div>
        <div className="bg-neutral-800/70 rounded-xl p-3">Real FV (today's money): <span className="text-neutral-200 font-medium">₹{fmt(FVr)}</span></div>
      </div>
      <p className="text-xs text-neutral-500 mt-2">Real return adjusts for inflation to reflect purchasing power.</p>
    </div>
  );
}


