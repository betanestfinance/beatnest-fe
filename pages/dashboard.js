"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [recommendedData, setRecommendedData] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      const res = await fetch(`${API_URL}/apiv1/finance/financial-data?email=${user.email}`);
      const result = await res.json();
      if (res.ok) setData(result.data);
    };
    fetchData();
  }, [user]);

  // Get user info from localStorage
  useEffect(() => {
    const age = Number(localStorage.getItem("age")) || 30;
    const riskProfile = localStorage.getItem("riskProfile") || "Balanced";

    // Base recommended allocation
    let equity = 100 - age;
    let debt = age;
    let other = 100 - (equity + debt);

    // Adjust equity based on risk profile
    switch (riskProfile) {
      case "Conservative":
        equity = Math.max(equity - 20, 20);
        break;
      case "Balanced":
        equity = Math.max(equity - 10, 20);
        break;
      case "Growth":
        equity = equity;
        break;
      case "Aggressive":
        equity = Math.min(equity + 10, 90);
        break;
      default:
        break;
    }

    debt = age;
    other = 100 - (equity + debt);
    if (other < 0) other = 0;

    setRecommendedData([
      { name: "Equity", value: equity },
      { name: "Debt", value: debt },
      { name: "Other", value: other },
    ]);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your investment data...
      </div>
    );
  }

  const COLORS = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00"];

  // Calculate totals
  const totalEquity =
    (data.equityMutualFunds?.reduce((acc, i) => acc + (i.currentValue || 0), 0) || 0) +
    (data.equityStocks?.reduce((acc, i) => acc + (i.currentValue || 0), 0) || 0);
  const totalDebt = data.debtAndFixedIncome?.reduce((acc, i) => acc + (i.amountInvested || 0), 0) || 0;
  const totalInsurance = data.insurancePolicies?.reduce((acc, i) => acc + (i.sumAssured || 0), 0) || 0;
  const totalLiabilities = data.liabilities?.reduce((acc, i) => acc + (i.outstandingBalance || 0), 0) || 0;
  const totalOtherinvestment = data.otherinvestment?.reduce((acc, i) => acc + (i.currentValue || 0), 0) || 0;

  const totalAssets = totalEquity + totalDebt + totalInsurance + totalOtherinvestment;
  const netWorth = totalAssets - totalLiabilities;
  const totalCalAssets = totalEquity + totalDebt + totalOtherinvestment

  // Current % breakdown
  const currentEquityPct = ((totalEquity / totalCalAssets) * 100).toFixed(1);
  const currentDebtPct = ((totalDebt / totalCalAssets) * 100).toFixed(1);
  const currentOtherPct = ((totalOtherinvestment / totalCalAssets) * 100).toFixed(1);

  const chartData = [
    { name: "Equity", value: totalEquity },
    { name: "Debt", value: totalDebt },
    { name: "Insurance", value: totalInsurance },
    { name: "Liabilities", value: totalLiabilities },
    { name: "Other", value: totalOtherinvestment },
  ];

  const comparisonData = recommendedData
    ? [
        {
          category: "Equity",
          Current: Number(currentEquityPct),
          Recommended: recommendedData.find((d) => d.name === "Equity")?.value || 0,
        },
        {
          category: "Debt",
          Current: Number(currentDebtPct),
          Recommended: recommendedData.find((d) => d.name === "Debt")?.value || 0,
        },
        {
          category: "Other",
          Current: Number(currentOtherPct),
          Recommended: recommendedData.find((d) => d.name === "Other")?.value || 0,
        },
      ]
    : [];

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-50 text-gray-900" style={{fontFamily: "var(--font-family)", backgroundColor: "var(--color-taupe)", color: "var(--color-black)"}}>
      <h1 className="text-3xl font-semibold mb-8 text-center">Investments Insights</h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Left: Portfolio Summary */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Portfolio Summary</h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total Assets</span>
              <span className="font-semibold text-green-600">₹{totalAssets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Total Liabilities</span>
              <span className="font-semibold text-red-600">₹{totalLiabilities.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-medium">Net Worth</span>
              <span className={`font-semibold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{netWorth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Portfolio Breakdown */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Portfolio Breakdown</h2>
          <div className="w-full flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 🔹 Current vs Recommended Investments */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Current vs Recommended Allocation</h2>
        <div className="w-full flex justify-center">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="category" />
              <YAxis unit="%" />  
              <Tooltip />
              <Legend />
              <Bar dataKey="Current" fill="#E69F00" barSize={40} />
              <Bar dataKey="Recommended" fill="#56B4E9" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
