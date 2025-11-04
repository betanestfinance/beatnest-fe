"use client";
import { use, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { motion } from "framer-motion";
import { InlineWidget } from 'react-calendly';
import Head from "next/head";
import { Check, Loader2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

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
    <label
      className={`
        flex items-center gap-3 cursor-pointer select-none
        ${disabled ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {/* Hidden native input for form submission & accessibility */}
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        className="sr-only"
      />

      {/* Custom Visual Radio */}
      <div
        className={`
          custom-radio
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        `}
      />

      {/* Label Text */}
      <span className="text-sm sm:text-base leading-tight">
        {value}
      </span>
    </label>
  );
}

function CollapsibleEntry({ index, data }) {
    const [open, setOpen] = useState(false);
    const toggle = () => setOpen(!open);

    return (
      <div className="border rounded-xl overflow-hidden">
        <button
          onClick={toggle}
          className="w-full flex justify-between items-center px-4 py-3 bg-secondary hover:bg-secondary-hover transition"
        >
          <span className="font-semibold">Submission #{index}</span>
          <span>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="p-4 bg-white space-y-2 text-sm">
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Age:</strong> {data.age}</p>
            <p><strong>Investment Horizon:</strong> {data.investmentHorizon}</p>
            <p><strong>Primary Income:</strong> {data.primaryIncome}</p>
            <p><strong>Income Stability:</strong> {data.incomeStability}</p>
            <p><strong>Saving %:</strong> {data.savingPercentage}</p>
            <p><strong>Dependents:</strong> {data.dependents}</p>
            <p><strong>Cash Reserves:</strong> {data.cashReserves}</p>
            <p><strong>Experience:</strong> {data.experience}</p>
            <p><strong>Reaction to Loss:</strong> {data.reactionToLoss}</p>
            <p><strong>Max Decline Tolerance:</strong> {data.maxDeclineTolerance}</p>
            <p><strong>Money View:</strong> {data.moneyView}</p>
            <p><strong>Investment Goal:</strong> {data.investmentGoal}</p>
            <p><strong>Expected Return:</strong> {data.expectedReturn}</p>
            <p><strong>Major Events:</strong> {data.majorEvents}</p>
            <p><strong>Risk Profile:</strong> {data.risk?.profile}</p>
            <div className="mt-3">
              <p className="font-semibold mb-1">Investment Exposure:</p>
              <ul className="ml-4 list-disc">
                <li>Equity: {data.investmentExposure?.equity}</li>
                <li>Debt/FD: {data.investmentExposure?.debtfd}</li>
                <li>Gold: {data.investmentExposure?.gold}</li>
                <li>Crypto: {data.investmentExposure?.crypto}</li>
                <li>Real Estate: {data.investmentExposure?.realestate}</li>
                <li>Other: {data.investmentExposure?.other}</li>
              </ul>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Submitted on: {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  }

function FullForm({ formData, isReadOnly, user, pastFormData }) {
  return (
    <>
    <div className="max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8" style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}>
      <motion.h1 
        className="text-4xl font-bold text-center mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Your Submitted Investor Profile
      </motion.h1>

      {/* All 15 Questions in read-only mode - copy from your stepper Q1 to Q15, but wrap each in <Question isReadOnly={isReadOnly}> and use onChange={() => {}} for Options */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Question label="What is your age?" isReadOnly={isReadOnly}>
          <input
            type="number"
            name="age"
            value={formData.age ?? ""}
            disabled={isReadOnly}
            className="border p-2 w-full rounded"
            min={0}
          />
        </Question>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Question label="What is your preferred investment horizon?" isReadOnly={isReadOnly}>
          {[
            "Less than 1 year (short-term positioning)",
            "1–3 years (near-term planning)",
            "3–5 years (medium-term goals)",
            "5–10 years (long-term growth)",
            "10+ years (generational wealth)",
          ].map((v) => (
            <Option
              key={v}
              name="investmentHorizon"
              value={v}
              onChange={() => {}}
              checked={formData.investmentHorizon === v}
              isReadOnly={isReadOnly}
            />
          ))}
        </Question>
      </motion.div>

      {/* Repeat for Q3 to Q15 - use the same pattern as your stepper, but with onChange={() => {}} and isReadOnly={isReadOnly} */}
        
      <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <Question label="What is your primary source of income?" isReadOnly={isReadOnly}>
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
                onChange={() => {}}
                
                isReadOnly={isReadOnly}
                checked={formData.primaryIncome === v}
              />
            ))}
          </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 4 */}
          <Question label="How would you describe the stability of your income?" isReadOnly={isReadOnly}>
            {[
              "Very stable and predictable", 
              "Moderately stable (occasional fluctuations)", 
              "Highly variable (uncertain or cyclical)"
            ].map((v) => (
              <Option
                key={v}
                name="incomeStability"
                value={v}
                onChange={() => {}}
                isReadOnly={isReadOnly}
                
                checked={formData.incomeStability === v}
              />
            ))}
          </Question>
        </motion.div>

        {/* 5 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <Question
            label="What proportion of your monthly income is allocated to saving or investing?"
            isReadOnly={isReadOnly}
          >
            {["Less than 10%", "10–25%", "25–40%", "More than 40%"].map((v) => (
              <Option
                key={v}
                name="savingPercentage"
                value={v}
                onChange={() => {}}
                isReadOnly={isReadOnly}
                
                checked={formData.savingPercentage === v}
              />
            ))}
          </Question>
        </motion.div>

        {/* 6 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        <Question label="How many individuals are financially dependent on you?" isReadOnly={isReadOnly}>
          {["None", "1–2", "3–4", "5 or more"].map((v) => (
            <Option
              key={v}
              name="dependents"
              value={v}
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.dependents === v}
            />
          ))}
        </Question>
        </motion.div>

          <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 7 */}
        <Question label="How prepared are you with an emergency reserve?" isReadOnly={isReadOnly}>
          {["No reserves at present", "Reserves covering up to 3 months of expenses", "Reserves covering 3–6 months of expenses", "Reserves covering more than 6 months"].map((v) => (
            <Option
              key={v}
              name="cashReserves"
              value={v}
              onChange={() => {}}
                isReadOnly={isReadOnly}
              
              checked={formData.cashReserves === v}
            />
          ))}
        </Question>
        </motion.div>

      {/* Example for Q8 (investment exposure): */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
        <Question label="What is your current portfolio exposure?" isReadOnly={isReadOnly}>
          <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-gray-200">
            {[
              { label: "Equity", key: "equity" },
              { label: "Debt/FD", key: "debtfd" },
              { label: "Gold", key: "gold" },
              { label: "Crypto", key: "crypto" },
              { label: "Real Estate", key: "realestate" },
              { label: "Other", key: "other" },
            ].map((asset) => {
              const value =
                formData[asset.key] ??
                (formData.investmentExposure?.[asset.key]) ??
                0;
              return (
                <div key={asset.key} className="flex items-center gap-3 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 w-28 sm:w-32 text-right">
                    {asset.label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    disabled
                    className="w-full max-w-xs px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
                  />
                </div>
              );
            })}
          </div>
        </Question>
      </motion.div>

      <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 9 */}
        <Question label="How would you describe your experience with financial investments?" isReadOnly={isReadOnly}>
          {[
            "Beginner (limited experience)", 
            "Moderate (some exposure and understanding)", 
            "Experienced (actively manage or follow markets)"
          ].map((v) => (
            <Option
              key={v}
              name="experience"
              value={v}
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.experience === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 10 */}
        <Question label="How would you respond if your portfolio declined by 15% in a year?" isReadOnly={isReadOnly}>
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
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.reactionToLoss === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 11 */}
        <Question label="What is the maximum annual portfolio decline you could tolerate without selling?" isReadOnly={isReadOnly}>
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
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.maxDeclineTolerance === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 12 */}
        <Question label="How do you perceive money and wealth?" isReadOnly={isReadOnly}>
          {[
            "Primarily as security and stability", 
            "As a tool for aggressive growth and opportunity", 
            "As a balance between safety and appreciation"
          ].map((v) => (
            <Option
              key={v}
              name="moneyView"
              value={v}
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.moneyView === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 13 */}
        <Question label="What is your primary investment goal?" isReadOnly={isReadOnly}>
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
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.investmentGoal === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 14 */}
        <Question label="What level of return do you expect from your portfolio?" isReadOnly={isReadOnly}>
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
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.expectedReturn === v}
            />
          ))}
        </Question>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
        {/* 15 */}
        <Question label="Do you anticipate any significant financial events in the next 5–10 years?" isReadOnly={isReadOnly}>
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
              onChange={() => {}}
              isReadOnly={isReadOnly}
              
              checked={formData.majorEvents === v}
            />
          ))}
        </Question>
        </motion.div>

      {/* Add email if not user */}
      {!user && (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.8 }}>
          <Question label="Email" isReadOnly={isReadOnly}>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              disabled={isReadOnly}
              className="border p-2 w-full rounded"
              placeholder="you@example.com"
            />
          </Question>
        </motion.div>
      )}

      {isReadOnly && (
        <div className="text-center">
          <button
            type="submit"
            disabled={isReadOnly}
            className="bg-primary text-onPrimary px-8 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
          >
            Already submitted
          </button>
          <div className="text-sm text-center text-muted pt-4">
          You have already submitted your responses. To make changes, please contact us at{" "}
          <a href="mailto:info@betanestfin.com" className="text-link">
            info@betanestfin.com
          </a>
        </div>
        </div>
      )}
    </div>
    {pastFormData.length > 0 && (
          <div className="max-w-3xl mx-auto mt-6 bg-white/80 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">📜 Previous Submissions</h2>
            <div className="space-y-4">
              {pastFormData.map((entry, index) => (
                <CollapsibleEntry key={entry._id || index} index={index + 1} data={entry} />
              ))}
            </div>
          </div>
        )}
    </>
  );
}

export default function ServicePage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({});
  const [pastFormData, setPastFormData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [showStepErrors, setShowStepErrors] = useState(false);
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [hasSaveDataLoaded, setHasSaveDataLoaded] = useState(true);
  const [emailTouched, setEmailTouched] = useState(false)

  // Clear errors when step changes
  useEffect(() => {
  if (!hasSavedData) {
    setErrors({});
    setShowStepErrors(false);
    setShowFormErrors(false);
    setApiError(null);
  }
}, [currentStep, hasSavedData])

  // Generic change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "email") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }

    // For checkboxes (if any in future) — not used here now
    if (type === "checkbox") {
      // single-selection majorEvents uses radios; keep for completeness
      if (checked) setFormData((p) => ({ ...p, [name]: value }));
      else setFormData((p) => ({ ...p, [name]: "" }));
      return;
    }

    // keep age non-negative while typing
    if (name === "age") {
      if(Number(value) > 70) return; // max age limit
      const num = Number(value);
      // allow empty string while editing; otherwise clamp to >= 0 and integer
      const normalized = value === "" ? "" : (Number.isFinite(num) ? Math.max(0, Math.floor(num)) : "");
      setFormData((prev) => ({ ...prev, [name]: normalized }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field on change
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[name]) {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  // email validation
  const validateEmail = (email) => {
    // Trim whitespace
    const trimmed = email?.trim();
    if (!trimmed) return false;

    // Max 254 characters (RFC 5321)
    if (trimmed.length > 254) return false;

    // Regex: RFC 5322 compliant (practical version)
    const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/i;

    return emailRegex.test(trimmed);
  };

  const validateStep = (step) => {
    
    let req = [];
    switch (step) {
      case 1:
        req = ["age", "investmentHorizon", "primaryIncome", "incomeStability"];
        break;
      case 2:
        req = ["savingPercentage", "dependents", "cashReserves"];
        break;
      case 3:
        req = ["experience", "reactionToLoss", "maxDeclineTolerance", "moneyView"];
        break;
      case 4:
        // No validation for step 4 until submit
        return true;
      default:
        return true;
    }

    const newErrors = {};
    
    req.forEach((field) => {
      const val = formData[field];
      if (val === undefined || val === null || String(val).trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    // age specific
    if (step === 1) {
      
      if (
        formData.age !== undefined &&
        formData.age !== "" &&
        (isNaN(Number(formData.age)) || Number(formData.age) <= 0)
      ) {
        newErrors.age = "Enter a valid age";
      }
    }

    setErrors(newErrors);
    setShowStepErrors(true);
    return Object.keys(newErrors).length === 0;
  };

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

    if (!user && formData.email) {
      const email = formData.email.trim();
      if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    if (formData.age && (isNaN(formData.age) || Number(formData.age) <= 0)) {
      newErrors.age = "Enter a valid age";
    }

    setErrors(newErrors);
    setShowFormErrors(true);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    window.scrollTo(0, 0)
    e.preventDefault();
    
    setApiError(null);
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = (e) => {
    window.scrollTo(0, 0)
    e.preventDefault();
    setApiError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

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
      if (user?.id || localStorage.getItem("userId")) {
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
      
      localStorage.setItem("riskProfile", data?.risk?.profile);
      setSubmitted(true);
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

        if (!email || !userId){
          setHasSaveDataLoaded(false);
          return;
        }

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
        const resData = await res.json();
        const data = resData.find((res) => res.isActive === true);
        const pastFormData = resData.filter((res) => res.isActive !== true);
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
          localStorage.setItem("riskProfile", data?.risk?.profile);
          // setSubmitted(true);
          setHasSavedData(true);
          setHasSaveDataLoaded(false);
        }
        setHasSaveDataLoaded(false);
        setPastFormData(pastFormData);
      } catch (err) {
        setHasSaveDataLoaded(false);
        console.error("Failed to fetch finance answers:", err);
      }
    };

    fetchAnswers();
  }, [user]);

  const Q1 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="1. What is your age?" error={showStepErrors ? errors.age : null}>
        <input
          type="number"
          name="age"
          value={formData.age ?? ""}
          onChange={handleChange}
          onBlur={(e) => {
            // ensure age is non-negative when user leaves the field
            const v = e.target.value;
            const num = Number(v);
            if (v === "" || !Number.isFinite(num) || num < 0) {
              setFormData((p) => ({ ...p, age: 0 }));
            } else {
              setFormData((p) => ({ ...p, age: Math.max(0, Math.floor(num)) }));
            }
          }}
          className="border p-2 w-full rounded"
          min={0}
          max={70}
        />
      </Question>
    </motion.div>
  );

  const Q2 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question
        label="What is your preferred investment horizon?"
        error={showStepErrors ? errors.investmentHorizon : null}
      >
        {[
          "Less than 1 year (short-term positioning)",
          "1–3 years (near-term planning)",
          "3–5 years (medium-term goals)",
          "5–10 years (long-term growth)",
          "10+ years (generational wealth)",
        ].map((v) => (
          <Option
            key={v}
            name="investmentHorizon"
            value={v}
            onChange={handleChange}
            checked={formData.investmentHorizon === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q3 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="What is your primary source of income?" error={showStepErrors ? errors.primaryIncome : null}>
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
            checked={formData.primaryIncome === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q4 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How would you describe the stability of your income?" error={showStepErrors ? errors.incomeStability : null}>
        {[
          "Very stable and predictable",
          "Moderately stable (occasional fluctuations)",
          "Highly variable (uncertain or cyclical)",
        ].map((v) => (
          <Option
            key={v}
            name="incomeStability"
            value={v}
            onChange={handleChange}
            checked={formData.incomeStability === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q5 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question
        label="What proportion of your monthly income is allocated to saving or investing?"
        error={showStepErrors ? errors.savingPercentage : null}
      >
        {["Less than 10%", "10–25%", "25–40%", "More than 40%"].map((v) => (
          <Option
            key={v}
            name="savingPercentage"
            value={v}
            onChange={handleChange}
            checked={formData.savingPercentage === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q6 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How many individuals are financially dependent on you?" error={showStepErrors ? errors.dependents : null}>
        {["None", "1–2", "3–4", "5 or more"].map((v) => (
          <Option
            key={v}
            name="dependents"
            value={v}
            onChange={handleChange}
            checked={formData.dependents === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q7 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How prepared are you with an emergency reserve?" error={showStepErrors ? errors.cashReserves : null}>
        {[
          "No reserves at present",
          "Reserves covering up to 3 months of expenses",
          "Reserves covering 3–6 months of expenses",
          "Reserves covering more than 6 months",
        ].map((v) => (
          <Option
            key={v}
            name="cashReserves"
            value={v}
            onChange={handleChange}
            checked={formData.cashReserves === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q8 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="What is your current portfolio exposure?">
        <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-gray-200">
          {[
            { label: "Equity", key: "equity", placeholder: "500000" },
            { label: "Debt/FD", key: "debtfd", placeholder: "300000" },
            { label: "Gold", key: "gold", placeholder: "100000" },
            { label: "Crypto", key: "crypto", placeholder: "50000" },
            { label: "Real Estate", key: "realestate", placeholder: "2000000" },
            { label: "Other", key: "other", placeholder: "0" },
          ].map((asset) => (
            <div
              key={asset.key}
              className="flex items-center gap-3 sm:gap-4"
            >
              <label
                htmlFor={asset.key}
                className="text-sm font-medium text-gray-700 w-28 sm:w-32 text-right"
              >
                {asset.label}:
              </label>
              <input
                id={asset.key}
                type="number"
                name={asset.key}
                value={
                  formData[asset.key] ??
                  (formData.investmentExposure?.[asset.key]) ??
                  ""
                }
                onChange={handleChange}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                min="0"
                step="0.01"
                placeholder={asset.placeholder}
              />
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-3 text-center italic">
            Enter amounts in your preferred currency (e.g., INR, USD)
          </p>
        </div>
      </Question>
    </motion.div>
  );

  const Q9 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How would you describe your experience with financial investments?" error={showStepErrors ? errors.experience : null}>
        {[
          "Beginner (limited experience)",
          "Moderate (some exposure and understanding)",
          "Experienced (actively manage or follow markets)",
        ].map((v) => (
          <Option
            key={v}
            name="experience"
            value={v}
            onChange={handleChange}
            checked={formData.experience === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q10 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How would you respond if your portfolio declined by 15% in a year?" error={showStepErrors ? errors.reactionToLoss : null}>
        {[
          "Exit investments to avoid further loss",
          "Reduce exposure and wait cautiously",
          "Remain invested with patience",
          "Allocate more capital to benefit from lower valuations",
        ].map((v) => (
          <Option
            key={v}
            name="reactionToLoss"
            value={v}
            onChange={handleChange}
            checked={formData.reactionToLoss === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q11 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="What is the maximum annual portfolio decline you could tolerate without selling?" error={showStepErrors ? errors.maxDeclineTolerance : null}>
        {["Up to 5%", "Up to 10%", "Up to 20%", "30% or more"].map((v) => (
          <Option
            key={v}
            name="maxDeclineTolerance"
            value={v}
            onChange={handleChange}
            checked={formData.maxDeclineTolerance === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q12 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="How do you perceive money and wealth?" error={showStepErrors ? errors.moneyView : null}>
        {[
          "Primarily as security and stability",
          "As a tool for aggressive growth and opportunity",
          "As a balance between safety and appreciation",
        ].map((v) => (
          <Option
            key={v}
            name="moneyView"
            value={v}
            onChange={handleChange}
            checked={formData.moneyView === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q13 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="What is your primary investment goal?" error={showFormErrors ? errors.investmentGoal : null}>
        {[
          "Wealth creation and growth",
          "Retirement planning",
          "Child’s education and future planning",
          "Tax optimization",
          "Legacy and succession planning",
        ].map((v) => (
          <Option
            key={v}
            name="investmentGoal"
            value={v}
            onChange={handleChange}
            checked={formData.investmentGoal === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q14 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="What level of return do you expect from your portfolio?" error={showFormErrors ? errors.expectedReturn : null}>
        {[
          "Below 6% per annum",
          "6–10% per annum",
          "10–15% per annum",
          "Above 15% per annum",
        ].map((v) => (
          <Option
            key={v}
            name="expectedReturn"
            value={v}
            onChange={handleChange}
            checked={formData.expectedReturn === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const Q15 = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="Do you anticipate any significant financial events in the next 5–10 years?" error={showFormErrors ? errors.majorEvents : null}>
        {[
          "Purchase of property",
          "Child’s higher education",
          "Marriage-related expenses",
          "Retirement transition",
          "Business expansion",
          "None of the above",
        ].map((v) => (
          <Option
            key={v}
            name="majorEvents"
            value={v}
            onChange={handleChange}
            checked={formData.majorEvents === v}
          />
        ))}
      </Question>
    </motion.div>
  );

  const EmailQuestion = (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      transition={{ duration: 0.8 }}
    >
      <Question label="Enter your email to complete your risk profile assessment" error={showFormErrors ? errors.email : null}>
        <input
          type="email"
          name="email"
          value={formData.email || user?.email || ""}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="you@example.com"
        />
      </Question>
    </motion.div>
  );

  if (submitted) {
    return (
      <div className="p-10 text-center" style={{ fontFamily: "var(--font-family)", backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}>
        <div 
          className="text-center space-y-4 max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
          style={{  backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
        >
          <h2 className="text-3xl font-bold mb-6">Thank you! 🎉</h2>
          <p className="mb-6">
            Your answers have been submitted. Your risk profile is{' '}
            <span
              className={`font-bold text-xl ${
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
        </div>
        {pastFormData.length > 0 && (
          <div className="max-w-3xl mx-auto mt-6 bg-white/80 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">📜 Previous Submissions</h2>
            <div className="space-y-4">
              {pastFormData.map((entry, index) => (
                <CollapsibleEntry key={entry._id || index} index={index + 1} data={entry} />
              ))}
            </div>
          </div>
        )}
        <div 
          className="text-center mt-6 space-y-4 max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
          style={{  backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
        >
          <p>
            📧 Let's discuss:{" "}
            <a href="mailto:info@betanestfin.com" className="text-link" style={{ cursor: "pointer" }}>
              info@betanestfin.com
            </a>
          </p>
        </div>
        <div 
          className="text-center mt-6 space-y-4 max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
          style={{  height: '700px', backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
        >
          <p>
            📅 Schedule a meeting
          </p>
          <InlineWidget url="https://calendly.com/betanestfinance" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Wealth blueprint</title>
        <description>BetaNest Home</description>
      </Head>
      <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)", fontFamily: "var(--font-family)" }}>
        {hasSavedData || hasSaveDataLoaded ? (
          <FullForm formData={formData} isReadOnly={true} user={user} pastFormData={pastFormData} />
        ) : currentStep === 0 && !hasSaveDataLoaded ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
            <motion.h1 
              className="text-4xl font-bold mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Start your investing journey
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Cultivating Beta, Generating Alpha
            </motion.p>
            <motion.button
              onClick={() => setCurrentStep(1)}
              className="bg-primary text-onPrimary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz
            </motion.button>
          </div>
        ) : (
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
            style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
          >
            <motion.h1 
              className="text-4xl font-bold text-center mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Investor Profiling Questionnaire
            </motion.h1>

            <div className="mb-6">
              <div className="w-full bg-gray-400 rounded-full h-2 relative">
                <motion.div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-taupe)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep / 4) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                {/* Optional: Add Lucide React icon for visual feedback */}
                {currentStep < 4 ? (
                  <Loader2 className="absolute right-0 top-0 h-2 w-2 text-gray-400 animate-spin" />
                ) : (
                  <Check className="absolute right-0 top-0 h-2 w-2 text-green-500" />
                )}
              </div>
              <p className="text-center text-sm mt-2 text-gray-600">Step {currentStep} of 4</p>
            </div>

            {currentStep === 1 && (
              <>
                {Q1}
                {Q2}
                {Q3}
                {Q4}
              </>
            )}
            {currentStep === 2 && (
              <>
                {Q5}
                {Q6}
                {Q7}
                {Q8}
              </>
            )}
            {currentStep === 3 && (
              <>
                {Q9}
                {Q10}
                {Q11}
                {Q12}
              </>
            )}
            {currentStep === 4 && (
              <>
                {Q13}
                {Q14}
                {Q15}
              </>
            )}

            {!user && currentStep === 4 && EmailQuestion}

            {apiError && <p className="text-error text-center">{apiError}</p>}

            <div className="flex justify-between items-center mt-8">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={(e) => handlePrevious(e)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button 
                  type="button"
                  onClick={(e) => handleNext(e)}
                  disabled={loading}
                  className="ml-auto bg-primary text-onPrimary px-8 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  Next
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="ml-auto bg-primary text-onPrimary px-8 py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </form>
        )}

        {!submitted && currentStep > 0 && pastFormData.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 bg-white/80 rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">📜 Previous Submissions</h2>
            <div className="space-y-4">
              {pastFormData.map((entry, index) => (
                <CollapsibleEntry key={entry._id || index} index={index + 1} data={entry} />
              ))}
            </div>
          </div>
        )}

        {!submitted && !user && (
          <>
            <div className="text-center mt-12 space-y-4 max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}>
              <p>
                📧 <span className="font-bold"> Let's discuss:{" "}</span>
                <a href="mailto:info@betanestfin.com" className="text-link" style={{cursor: 'pointer'}}>
                  info@betanestfin.com
                </a>
              </p>
            </div>
            <div  className="text-center mt-12 space-y-4 max-w-3xl mx-auto bg-surface shadow-lg rounded-2xl p-8 space-y-8"
              style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}>
              <a href="https://calendly.com/betanestfinance" className="text-link" style={{cursor: 'pointer'}} target="_blank" rel="noopener noreferrer">
                📅 Schedule a 30-minute consultation
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}