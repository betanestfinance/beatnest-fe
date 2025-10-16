import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function InvestmentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your investment data...
      </div>
    );
  }

  const COLORS = ["#2563eb", "#facc15", "#22c55e", "#f97316", "#a855f7", "#14b8a6"];

  // Calculate totals
  const totalEquity = (data.equityMutualFunds?.reduce((acc, i) => acc + (i.sipAmount || i.lumpsumAmount || 0), 0) || 0) +
    (data.equityStocks?.reduce((acc, i) => acc + (i.currentValue || 0), 0) || 0);
  const totalDebt = data.debtAndFixedIncome?.reduce((acc, i) => acc + (i.amountInvested || 0), 0) || 0;
  const totalInsurance = data.insurancePolicies?.reduce((acc, i) => acc + (i.sumAssured || 0), 0) || 0;
  const totalLiabilities = data.liabilities?.reduce((acc, i) => acc + (i.outstandingBalance || 0), 0) || 0;

  const totalAssets = totalEquity + totalDebt + totalInsurance;
  const netWorth = totalAssets - totalLiabilities;

  const chartData = [
    { name: "Equity", value: totalEquity },
    { name: "Debt", value: totalDebt },
    { name: "Insurance", value: totalInsurance },
    { name: "Liabilities", value: totalLiabilities },
  ];

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-semibold mb-6 text-center">Investments Details</h1>


      {/* Equity Section */}
      <Section title="Equity (Mutual Funds)" color="bg-white">
        {data.equityMutualFunds?.length > 0 ? (
          <Table
            headers={["AMC", "Folio", "Mode", "SIP (₹)", "Lumpsum (₹)", "Current Value (₹)", "Start Date", "Frequency", "Self", "Suggested Start", "Suggested End", "Remarks"]}
            rows={data.equityMutualFunds.map((i) => [
              i.amc,
              i.folioNumber,
              i.mode,
              i.sipAmount || "-",
              i.lumpsumAmount || "-",
              i.currentValue || "-",
              i.startDate ? new Date(i.startDate).toLocaleDateString() : "-",
              i.frequency || "-",
              i.self ? "True" : "False" || "-",
              i.suggestedStartDate ? new Date(i.suggestedStartDate).toLocaleDateString() : "-",
              i.suggestedEndDate ? new Date(i.suggestedEndDate).toLocaleDateString() : "-",
              i.remarks || "-",
            ])}
          />
        ) : (
          <Empty message="No Equity Investments Added" />
        )}
      </Section>

      {/* Equity stocks */}
      <Section title="Equity (Stocks)" color="bg-white">
        {data.equityStocks?.length > 0 ? (
          <Table
            headers={["Name", "Invest Price", "Quantity", "Current Value", "Purchase Date", "Self", "Suggested Start", "Suggested End", "Remarks"]}
            rows={data.equityStocks.map((i) => [
              i.stockName,
              i.investPrice,
              i.qty,
              i.currentValue || "-",
              i.purchaseDate ? new Date(i.purchaseDate).toLocaleDateString() : "-",
              i.self ? "True" : "False" || "-",
              i.suggestedStartDate ? new Date(i.suggestedStartDate).toLocaleDateString() : "-",
              i.suggestedEndDate ? new Date(i.suggestedEndDate).toLocaleDateString() : "-",
              i.remarks || "-",
            ])}
          />
        ) : (
          <Empty message="No Equity Investments Added" />
        )}
      </Section>

      {/* Debt Section */}
      <Section title="Debt & Fixed Income" color="bg-gray-50">
        {data.debtAndFixedIncome?.length > 0 ? (
          <Table
            headers={["Instrument", "Amount (₹)", "Interest (%)", "Start", "Maturity", "Frequency", "Self", "Suggested Start", "Suggested End", "Remarks"]}
            rows={data.debtAndFixedIncome.map((i) => [
              i.instrumentName,
              i.amountInvested,
              i.interestRate,
              i.startDate ? new Date(i.startDate).toLocaleDateString() : "-",
              i.maturityDate ? new Date(i.maturityDate).toLocaleDateString() : "-",
              i.interestFrequency,
              i.self ? "True" : "False" || "-",
              i.suggestedStartDate ? new Date(i.suggestedStartDate).toLocaleDateString() : "-",
              i.suggestedEndDate ? new Date(i.suggestedEndDate).toLocaleDateString() : "-",
              i.remarks || "-",
            ])}
          />
        ) : (
          <Empty message="No Debt Instruments Added" />
        )}
      </Section>

      {/* Equity stocks */}
      <Section title="Other Investments" color="bg-white">
        {data.otherinvestment?.length > 0 ? (
          <Table
            headers={["Name", "Invest Price", "Current Value", "Purchase Date", "Self", "Suggested Start", "Suggested End", "Remarks"]}
            rows={data.otherinvestment.map((i) => [
              i.name,
              i.investPrice,
              i.currentValue || "-",
              i.purchaseDate ? new Date(i.purchaseDate).toLocaleDateString() : "-",
              i.self ? "True" : "False" || "-",
              i.suggestedStartDate ? new Date(i.suggestedStartDate).toLocaleDateString() : "-",
              i.suggestedEndDate ? new Date(i.suggestedEndDate).toLocaleDateString() : "-",
              i.remarks || "-",
            ])}
          />
        ) : (
          <Empty message="No Equity Investments Added" />
        )}
      </Section>

      {/* Insurance Section */}
      <Section title="Insurance" color="bg-white">
        {data.insurancePolicies?.length > 0 ? (
          <Table
            headers={["Policy", "Type", "Sum Assured (₹)", "Premium (₹)", "Frequency", "Start", "Maturity"]}
            rows={data.insurancePolicies.map((i) => [
              i.policyName,
              i.type,
              i.sumAssured,
              i.premiumAmount,
              i.premiumFrequency,
              i.policyStartDate ? new Date(i.policyStartDate).toLocaleDateString() : "-",
              i.maturityDate ? new Date(i.maturityDate).toLocaleDateString() : "-",
            ])}
          />
        ) : (
          <Empty message="No Insurance Policies Added" />
        )}
      </Section>

      {/* Liabilities Section */}
      <Section title="Liabilities (Loans)" color="bg-gray-50">
        {data.liabilities?.length > 0 ? (
          <Table
            headers={["Loan Type", "Lender", "Outstanding (₹)", "EMI (₹)", "Interest (%)", "Tenure", "Status"]}
            rows={data.liabilities.map((i) => [
              i.loanType,
              i.lenderName || "-",
              i.outstandingBalance,
              i.emiAmount,
              i.interestRate,
              `${i.tenureStart ? new Date(i.tenureStart).toLocaleDateString() : "-"} → ${
                i.tenureEnd ? new Date(i.tenureEnd).toLocaleDateString() : "-"
              }`,
              i.isClosed ? "Closed" : "Active",
            ])}
          />
        ) : (
          <Empty message="No Liabilities Found" />
        )}
      </Section>

      {/* Disclaimer */}
      {/* <div className="mt-16 text-center text-sm text-gray-500 border-t pt-6">
        <h3 className="font-medium mb-2">Disclaimer</h3>
        <p>Financial data shown here is user-provided and for information purposes only. (Content pending)</p>
      </div> */}
    </div>
  );
}

/* --- Helper Components --- */
function Section({ title, color, children }) {
  return (
    <div className={`${color} rounded-2xl shadow-sm p-6 mb-10`}>
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {headers.map((h, i) => (
              <th key={i} className="text-left p-3 border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {r.map((cell, j) => (
                <td key={j} className="p-3 border-b">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty({ message }) {
  return <div className="text-gray-500 text-center py-4">{message}</div>;
}
