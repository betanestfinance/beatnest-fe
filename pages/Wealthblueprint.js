"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Question({ label, children, error }) {
  return (
    <div className="p-6 border rounded-xl bg-secondary hover:bg-secondary-hover transition">
      <p className="font-semibold mb-3">{label}</p>
      <div className="space-y-2">{children}</div>
      {error && <p className="text-error text-red-800 text-sm mt-2">{error}</p>}
    </div>
  );
}

function Option({ name, value, onChange, disabled, checked }) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? "opacity-70" : ""}`}>
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        className="mr-2"
      />
      {value}
    </label>
  );
}

export default function ServicePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [disabledForm, setDisabledForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Generic change handler
  const handleChange = (e) => {
    if (disabledForm) return;
    const { name, value, type, checked } = e.target;

    // For checkboxes (if any in future) — not used here now
    if (type === "checkbox") {
      // single-selection majorEvents uses radios; keep for completeness
      if (checked) setFormData((p) => ({ ...p, [name]: value }));
      else setFormData((p) => ({ ...p, [name]: "" }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "age",
      "investmentHorizon",
      "primaryIncome",
      "incomeStability",
      "savingPercentage",
      "dependents",
      "cashReserves",
      "experience",
      "reactionToLoss",
      "maxDeclineTolerance",
      "moneyView",
      "investmentGoal",
      "expectedReturn",
      "majorEvents",
    ];

    // Only require email when user is NOT logged in
    if (!user) requiredFields.push("email");

    requiredFields.forEach((field) => {
      const val = formData[field];
      if (val === undefined || val === null || String(val).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    if (!user && formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (disabledForm) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Build payload, converting exposure fields to numbers
      const payload = {
        email: formData.email || user?.email,
        age: Number(formData.age),
        investmentHorizon: formData.investmentHorizon,
        primaryIncome: formData.primaryIncome,
        incomeStability: formData.incomeStability,
        savingPercentage: formData.savingPercentage,
        dependents: formData.dependents,
        cashReserves: formData.cashReserves,
        investmentExposure: {
          equity: Number(formData.equity ?? formData.investmentExposure?.equity ?? 0),
          debtfd: Number(formData.debtfd ?? formData.investmentExposure?.debtfd ?? 0),
          gold: Number(formData.gold ?? formData.investmentExposure?.gold ?? 0),
          crypto: Number(formData.crypto ?? formData.investmentExposure?.crypto ?? 0),
          realestate: Number(
            formData.realestate ?? formData.investmentExposure?.realestate ?? 0
          ),
          other: Number(formData.other ?? formData.investmentExposure?.other ?? 0),
        },
        experience: formData.experience,
        reactionToLoss: formData.reactionToLoss,
        maxDeclineTolerance: formData.maxDeclineTolerance,
        moneyView: formData.moneyView,
        investmentGoal: formData.investmentGoal,
        expectedReturn: formData.expectedReturn,
        majorEvents: formData.majorEvents,
      };
      // include user ID if available
      if(user?.id || localStorage.getItem("userId")){
        payload.user = user?.id || localStorage.getItem("userId");
      }


      const res = await fetch(`${API_URL}/apiv1/finance/finance-answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        throw new Error(errText || "Something went wrong, please try again.");
      }
      console.log("Response:", data);
      localStorage.setItem("riskProfile", data?.risk?.profile);
      setSubmitted(true);
      // keep form disabled so user can't resubmit; do not necessarily clear all
      setDisabledForm(true);
    } catch (err) {
      setApiError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // fetch saved answers (and flatten investmentExposure for UI)
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = user?.email || localStorage.getItem("email");
        const userId = user?.id || localStorage.getItem("userId");

        if (!email || !userId) return; // can't request without identifiers

        const res = await fetch(
          `${API_URL}/apiv1/finance/finance-answers?email=${encodeURIComponent(
            email
          )}&id=${encodeURIComponent(userId)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!res.ok) return;
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          // flatten investmentExposure for easier binding to inputs
          const ie = data.investmentExposure || data.investmentExposure || {};
          // handle various key casings (debtfd / debtFD etc.)
          const debtfd =
            ie.debtfd ?? ie.debtFD ?? ie["debt/FD"] ?? ie["debt/fd"] ?? 0;
          const realestate =
            ie.realestate ?? ie.realEstate ?? ie["real estate"] ?? 0;

          const flat = {
            ...data,
            // set top-level simple fields to match UI names
            age: data.age ?? data.age,
            email: data.email ?? data.user?.email,
            equity: ie.equity ?? 0,
            debtfd: debtfd ?? 0,
            gold: ie.gold ?? 0,
            crypto: ie.crypto ?? 0,
            realestate: realestate ?? 0,
            other: ie.other ?? 0,
            investmentExposure: ie,
          };

          setFormData(flat);
          setDisabledForm(true);
        }
      } catch (err) {
        console.error("Failed to fetch finance answers:", err);
      }
    };

    fetchAnswers();
  }, [user]);

  if (submitted) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Thank you! 🎉</h2>
        <p className="mb-6">
          Your answers have been submitted. Your risk profile is{' '}
          <span
            className={`font-semibold ${
              localStorage.getItem('riskProfile') === 'Aggressive'
                ? 'text-red-600'
                : localStorage.getItem('riskProfile') === 'Balanced'
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {localStorage.getItem('riskProfile')}
          </span>
        </p>
        <a
          href="https://calendly.com/betanestfinance"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-link mb-6"
        >
          📅 Schedule a meeting
        </a>
        <p>
          📧 Contact us:{" "}
          <a href="mailto:customer@betanest.com" className="text-link">
            customer@betanest.com
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
        style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
      >
        <h1 className="text-4xl font-bold text-center mb-6">
          Investor Profiling Questionnaire
        </h1>

        {/* 1 */}
        <Question label="1. What is your age?" error={errors.age}>
          <input
            type="number"
            name="age"
            value={formData.age ?? ""}
            onChange={handleChange}
            disabled={disabledForm}
            className="border p-2 w-full rounded"
          />
        </Question>

        {/* 2 */}
        <Question
          label="What is your preferred investment horizon?"
          error={errors.investmentHorizon}
        >
          {[
            "Less than 1 year (short-term positioning)", 
            "1–3 years (near-term planning)", 
            "3–5 years (medium-term goals)", 
            "5–10 years (long-term growth)", 
            "10+ years (generational wealth)"
          ].map((v) => (
            <Option
              key={v}
              name="investmentHorizon"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.investmentHorizon === v}
            />
          ))}
        </Question>

        {/* 3 */}
        <Question label="What is your primary source of income?" error={errors.primaryIncome}>
          {[
            "Fixed salary (Government / Corporate)",
            "Business ownership",
            "Self-employed / Professional services",
            "Passive income (rental, dividends)",
            "Retired",
            "Other (inheritance, trust, family office, etc.)",
          ].map((v) => (
            <Option
              key={v}
              name="primaryIncome"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.primaryIncome === v}
            />
          ))}
          {/* <input
            type="text"
            name="incomeSourceOther"
            value={formData.incomeSourceOther || ""}
            onChange={handleChange}
            disabled={disabledForm}
            placeholder="Other (inheritance, dividend, trust, etc.)"
            className="border p-2 w-full rounded mt-2"
          /> */}
        </Question>

        {/* 4 */}
        <Question label="How would you describe the stability of your income?" error={errors.incomeStability}>
          {[
            "Very stable and predictable", 
            "Moderately stable (occasional fluctuations)", 
            "Highly variable (uncertain or cyclical)"
          ].map((v) => (
            <Option
              key={v}
              name="incomeStability"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.incomeStability === v}
            />
          ))}
        </Question>

        {/* 5 */}
        <Question
          label="What proportion of your monthly income is allocated to saving or investing?"
          error={errors.savingPercentage}
        >
          {["Less than 10%", "10–25%", "25–40%", "More than 40%"].map((v) => (
            <Option
              key={v}
              name="savingPercentage"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.savingPercentage === v}
            />
          ))}
        </Question>

        {/* 6 */}
        <Question label="How many individuals are financially dependent on you?" error={errors.dependents}>
          {["None", "1–2", "3–4", "5 or more"].map((v) => (
            <Option
              key={v}
              name="dependents"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.dependents === v}
            />
          ))}
        </Question>

        {/* 7 */}
        <Question label="How prepared are you with an emergency reserve?" error={errors.cashReserves}>
          {["No reserves at present", "Reserves covering up to 3 months of expenses", "Reserves covering 3–6 months of expenses", "Reserves covering more than 6 months"].map((v) => (
            <Option
              key={v}
              name="cashReserves"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.cashReserves === v}
            />
          ))}
        </Question>

        {/* 8: Investment Exposure (added as requested) */}
        <Question label="What is your current portfolio exposure?" error={errors.investmentExposure}>
          {[
            { label: "Equity", key: "equity" },
            { label: "Debt/FD", key: "debtfd" },
            { label: "Gold", key: "gold" },
            { label: "Crypto", key: "crypto" },
            { label: "Real Estate", key: "realestate" },
            { label: "Other", key: "other" },
          ].map((asset) => (
            <div key={asset.key} className="flex items-center gap-2 mb-2">
              <label className="w-32">{asset.label}:</label>
              <input
                type="number"
                name={asset.key}
                value={
                  formData[asset.key] ??
                  (formData.investmentExposure && formData.investmentExposure[asset.key]) ??
                  ""
                }
                onChange={handleChange}
                disabled={disabledForm}
                className="border p-2 flex-1 rounded"
                min="0"
              />
            </div>
          ))}
        </Question>

        {/* 9 */}
        <Question label="How would you describe your experience with financial investments?" error={errors.experience}>
          {[
            "Beginner (limited experience)", 
            "Moderate (some exposure and understanding)", 
            "Experienced (actively manage or follow markets)"
          ].map((v) => (
            <Option
              key={v}
              name="experience"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.experience === v}
            />
          ))}
        </Question>

        {/* 10 */}
        <Question label="How would you respond if your portfolio declined by 15% in a year?" error={errors.reactionToLoss}>
          {[
            "Exit investments to avoid further loss", 
            "Reduce exposure and wait cautiously", 
            "Remain invested with patience", 
            "Allocate more capital to benefit from lower valuations"
          ].map((v) => (
            <Option
              key={v}
              name="reactionToLoss"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.reactionToLoss === v}
            />
          ))}
        </Question>

        {/* 11 */}
        <Question label="What is the maximum annual portfolio decline you could tolerate without selling?" error={errors.maxDeclineTolerance}>
          {[
            "Up to 5%", 
            "Up to 10%", 
            "Up to 20%", 
            "30% or more"
          ].map((v) => (
            <Option
              key={v}
              name="maxDeclineTolerance"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.maxDeclineTolerance === v}
            />
          ))}
        </Question>

        {/* 12 */}
        <Question label="How do you perceive money and wealth?" error={errors.moneyView}>
          {[
            "Primarily as security and stability", 
            "As a tool for aggressive growth and opportunity", 
            "As a balance between safety and appreciation"
          ].map((v) => (
            <Option
              key={v}
              name="moneyView"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.moneyView === v}
            />
          ))}
        </Question>

        {/* 13 */}
        <Question label="What is your primary investment goal?" error={errors.investmentGoal}>
          {[
            "Wealth creation and growth", 
            "Retirement planning", 
            "Child’s education and future planning", 
            "Tax optimization", 
            "Legacy and succession planning"
          ].map((v) => (
            <Option
              key={v}
              name="investmentGoal"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.investmentGoal === v}
            />
          ))}
        </Question>

        {/* 14 */}
        <Question label="What level of return do you expect from your portfolio?" error={errors.expectedReturn}>
          {[
            "Below 6% per annum", 
            "6–10% per annum", 
            "10–15% per annum", 
            "Above 15% per annum"
          ].map((v) => (
            <Option
              key={v}
              name="expectedReturn"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.expectedReturn === v}
            />
          ))}
        </Question>

        {/* 15 */}
        <Question label="Do you anticipate any significant financial events in the next 5–10 years?" error={errors.majorEvents}>
          {[
            "Purchase of property", 
            "Child’s higher education", 
            "Marriage-related expenses", 
            "Retirement transition", 
            "Business expansion", 
            "None of the above"
          ].map((v) => (
            <Option
              key={v}
              name="majorEvents"
              value={v}
              onChange={handleChange}
              disabled={disabledForm}
              checked={formData.majorEvents === v}
            />
          ))}
          {/* <input
            type="text"
            name="eventsOther"
            value={formData.eventsOther || ""}
            onChange={handleChange}
            disabled={disabledForm}
            placeholder="Other (please specify)"
            className="border p-2 w-full rounded mt-2"
          /> */}
        </Question>

        {
          user?.email ? null : (
            <Question label="Enter your Email" error={errors.email}>
              <input
                type="email"
                name="email"
                value={formData.email || user?.email || ""}
                onChange={handleChange}
                disabled={!!user || disabledForm}
                className="border p-2 w-full rounded"
                placeholder="you@example.com"
              />
            </Question>
          )
        }

        {apiError && <p className="text-error text-center">{apiError}</p>}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading || disabledForm}
            className="bg-primary text-onPrimary px-8 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
          >
            {disabledForm ? "Already Submitted" : loading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {disabledForm && (<div className="text-sm text-center text-muted">
          You have already submitted your responses. To make changes, please contact us at{" "}
          <a href="mailto:customer@betanest.com" className="text-link">
            customer@betanest.com
          </a>
        </div>)}
      </form>

      {
          user?.email ? null : (

          <div className="max-w-3xl mx-auto text-center mt-12 space-y-4">
            <a
              href="https://calendly.com/betanestfinance"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-link"
            >
              📅 Schedule a meeting
            </a>
            <p>
              📧 Contact us:{" "}
              <a href="mailto:customer@betanest.com" className="text-link">
                customer@betanest.com
              </a>
            </p>
          </div>
          )
      }
    </div>
  );
}
