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
    if(!localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
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
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 text-center">Portfolio Breakdown</h2>
          
          <div className="w-full max-w-sm mx-auto">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                {/* Only show positive asset slices */}
                <Pie
                  data={chartData.filter(d => d.value > 0 && d.name !== "Liabilities")}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  strokeWidth={0}
                  label={({ name, percent }) => 
                    percent > 8 ? `${name}: ${(percent).toFixed(0)}%` : ""
                  }
                  labelStyle={{ fontSize: '12px', fontWeight: '600', fill: '#374151' }}
                >
                  {chartData.filter(d => d.value > 0 && d.name !== "Liabilities").map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${Number(value).toLocaleString()}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => {
                    const item = chartData.find(d => d.name === value);
                    return item ? `${value}: ₹${item.value.toLocaleString()}` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Liabilities & Net Worth below chart */}
          {/* <div className="mt-6 w-full max-w-sm mx-auto grid grid-cols-2 gap-3 text-center text-sm">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-gray-600 font-medium">Liabilities</p>
              <p className="text-lg font-bold text-red-600">₹{totalLiabilities.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-gray-600 font-medium">Net Worth</p>
              <p className="text-lg font-bold text-green-600">₹{netWorth.toLocaleString()}</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* 🔹 Current vs Recommended Investments */}
     <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 text-center">
        Current vs Recommended Allocation
      </h2>
      
      <div className="w-full max-w-3xl mx-auto">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart 
            data={comparisonData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            tabIndex={-1}  // PREVENTS FOCUS BORDER
            className="focus:outline-none"
          >
            <XAxis 
              dataKey="category" 
              tickLine={false} 
              tick={{ fontSize: 14, fill: '#4b5563' }}
              axisLine={true}
            />
            <YAxis 
              unit="%" 
              axisLine={true} 
              tickLine={false} 
              tick={{ fontSize: 14, fill: '#4b5563' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '13px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="rect"
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            
            <Bar 
              dataKey="Current" 
              fill="#E69F00" 
              radius={[8, 8, 0, 0]}
              barSize={50}
              stroke="none"
              activeBar={false}
            />
            
            <Bar 
              dataKey="Recommended" 
              fill="#56B4E9" 
              radius={[8, 8, 0, 0]}
              barSize={50}
              stroke="none"
              activeBar={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
}
