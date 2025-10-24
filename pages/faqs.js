import Head from "next/head";

// app/faqs/page.tsx
const faqs = [
  {
    q: "What does BetaNest do?",
    a: "We are an AMFI-registered mutual fund distributor. Our role is to help you discover, design, and implement a wealth plan through mutual funds and related instruments, aligned with your goals."
  },
  {
    q: "Do you provide investment advice or portfolio management?",
    a: "No. We distribute mutual funds and provide structured processes for wealth building. We do not offer stock advisory, PMS, or any other paid services."
  },
  {
    q: "How do you decide my asset allocation?",
    a: "Through our proprietary 15-question framework, inspired by The Intelligent Investor, matching your goals, time horizon, and risk appetite."
  },
  {
    q: "Is my data safe with you?",
    a: "Yes. We collect only essential information (PAN, contact, portfolio details) and store it securely. Data is never sold or shared."
  },
  {
    q: "How do you earn?",
    a: "We are an AMFI-registered distributor. AMCs share a small distribution fee (typically 0.1%–1% p.a.) for investments made under our ARN. No direct charges to you."
  },
  {
    q: "Will I get fixed or guaranteed returns?",
    a: "No. Mutual fund returns are market-linked and cannot be guaranteed."
  },
  {
    q: "What are the risks in mutual fund investing?",
    a: "All mutual funds carry market risk. Diversification and proper allocation help manage it."
  },
  {
    q: "Can I redeem or exit my investments anytime?",
    a: "Yes, most mutual funds are liquid, though some have lock-ins (like ELSS)."
  },
  {
    q: "Do I need to pay any fees directly?",
    a: "No. Our revenue comes only from AMC distributor commissions."
  },
  {
    q: "Will you help with KYC and transaction support?",
    a: "Yes, we assist with KYC, SIP setup, folio creation, and other investment processes."
  },
];

export default function FAQPage() {
  return (
    <>
    <Head>
        <title>Frequently Asked Questions</title>
        <description>BetaNest Home</description>
    </Head>
    <section className="max-w-3xl mx-auto py-16 text-center px-4 text-black" style={{ fontFamily: "var(--font-family)" }}>
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6 text-left">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-taupe rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
            <p className="text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
