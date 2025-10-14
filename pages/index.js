import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
// import { FaChevronDown } from "react-icons/fa";

const testimonials = [
  {
    text: "Investing with BetaNest has been transformative. Their disciplined approach secured my family's wealth sustainably.",
    author: "— Client A",
  },
  {
    text: "BetaNest aligned my investments with my legacy goals. They blend foresight with intelligent strategies.",
    author: "— Client B",
  },
  {
    text: "A financial journey that is purposeful, enduring, and reflective of my ambitions. Highly recommend BetaNest.",
    author: "— Client C",
  },
];

export default function Home() {

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center font-sans">

      {/* Hero Section */}
      <section
        className="relative h-screen w-screen flex flex-col justify-center items-center text-center overflow-hidden"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1611810798008-f9272fe3f476?q=80&w=2232&auto=format&fit=crop"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />

        {/* Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

        {/* Text */}
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-black">
            Cultivating Beta
            <br />
            Generating Alpha
          </h1>
        </div>

        {/* Down Arrow */}
        <div className="absolute bottom-8 flex justify-center w-full z-10">
          <ChevronDown size={60} className="text-3xl animate-bounce" />
        </div>
      </section>
      {/* Hero Section */}
      <section
        className="w-full py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Mutual Fund</h1>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          Wealth is not the product of chance. It is the outcome of discipline, foresight, and intelligent decisions. 
          Time and again, we see accomplished individuals encounter the same challenge: preserving and expanding their capital 
          without being consumed by the relentless demands of the markets.
        </p>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed mt-4">
          Our role is to align your investments with your ambitions — safeguarding legacy wealth, ensuring generational continuity, 
          and building portfolios that reflect your success and stature. This is not a pursuit of quick returns; it is the curation 
          of a financial journey that is enduring, purposeful, and worthy of your accomplishments.
        </p>
      </section>

      {/* Process to Legacy */}
      <section
        className="w-full py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Process to Legacy</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div
            className="rounded-2xl p-8 shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "var(--color-cream)" }}
          >
            <h3 className="text-xl font-semibold mb-4">Discovery</h3>
            <p className="text-[var(--color-warm-gray)] leading-relaxed">
              Every journey begins with understanding. Discovery is about uncovering not just financial goals, 
              but the values, ambitions, and legacy you aspire to build.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "var(--color-cream)" }}
          >
            <h3 className="text-xl font-semibold mb-4">Design</h3>
            <p className="text-[var(--color-warm-gray)] leading-relaxed">
              Wealth is never accidental; it is carefully curated. Design is the art of structuring your capital 
              with balance, discipline, and foresight.
            </p>
          </div>
          <div
            className="rounded-2xl p-8 shadow-md hover:shadow-lg transition"
            style={{ backgroundColor: "var(--color-cream)" }}
          >
            <h3 className="text-xl font-semibold mb-4">Destiny</h3>
            <p className="text-[var(--color-warm-gray)] leading-relaxed">
              True prosperity is measured in decades, not days. Destiny represents the long arc of wealth — enduring, 
              compounding, and shaping a legacy for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="w-full py-16 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Evaluate Your Financial Status</h2>
        <p className="mb-8 text-lg">Take the first step toward building your legacy today.</p>
        <a
          href="/Wealthblueprint"
          className="font-semibold px-8 py-3 rounded-full shadow transition"
          style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
        >
          Explore Our Services
        </a>
      </section>
      {/* Testimonials Slider */}
      <section
        className="w-full py-20 px-6 my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          What Our Clients Say
        </h2>

        <div className="relative max-w-4xl mx-auto overflow-hidden">
          {/* Slides container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="w-full flex-shrink-0">
                <div
                  className="rounded-2xl shadow-md p-8 mx-6 text-center"
                  style={{ backgroundColor: "var(--color-cream)" }}
                >
                  <p className="italic text-[var(--color-warm-gray)] mb-4">
                    "{t.text}"
                  </p>
                  <h4 className="font-semibold">{t.author}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow */}
          {/* <button
            onClick={() =>
              setCurrent((current - 1 + testimonials.length) % testimonials.length)
            }
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-[var(--color-black)] text-[var(--color-cream)] p-2 rounded-full shadow hover:opacity-80"
          >
            <ChevronLeft size={20} />
          </button> */}

          {/* Right Arrow */}
          {/* <button
            onClick={() => setCurrent((current + 1) % testimonials.length)}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-[var(--color-black)] text-[var(--color-cream)] p-2 rounded-full shadow hover:opacity-80"
          >
            <ChevronRight size={20} />
          </button> */}

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-3 w-3 rounded-full ${
                  idx === current
                    ? "bg-[var(--color-black)]"
                    : "bg-[var(--color-warm-gray)]"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
