import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Head from "next/head";

const testimonials = [
	{
		text: "It has been a pleasure interacting with you regarding my mutual fund investments. Your guidance reflects a deep understanding of financial products, and you consistently provide clear, well-researched advice tailored to my goals and risk profile. I truly appreciate your promptness in addressing all queries, your transparent communication, and the patience you show while explaining investment options.",
		author: "— CA Amit Kumar",
	},
	{
		text: "Working with you has been a great experience. Your expert guidance in both mutual funds and stocks has led to better returns, and your strategic approach has helped me build a solid, long-term portfolio. I appreciate how you take the time to tailor your advice to my financial goals and risk profile, providing clear, well-researched options. I feel confident about my investments and future growth.",
		author: "— Harsh Patel",
	},
	{
		text: "A financial journey that is purposeful, enduring, and reflective of my ambitions. Highly recommend BetaNest.",
		author: "— Anonymous Client",
	},
];

export default function Home() {
	const [current, setCurrent] = useState(0);
	const videoRef = useRef(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % testimonials.length);
		}, 8000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		// ensure video is muted programmatically and try to autoplay
		const v = videoRef.current;
		if (!v) return;
		try {
			v.muted = true; // important for mobile autoplay
			v.playsInline = true;
			v.setAttribute("webkit-playsinline", ""); // iOS legacy
			v.setAttribute("playsinline", "");
			const playPromise = v.play();
			if (playPromise && typeof playPromise.then === "function") {
				playPromise.catch(() => {
					// autoplay blocked — native overlay may appear; consider showing a custom play button as fallback
				});
			}
		} catch (err) {
			// ignore
		}
	}, []);

	return (
		<>
			<Head>
				<title>BetaNest - Cultivating Beta | Generating Alpha</title>
				<description>BetaNest Home</description>
			</Head>
			<div
				className="flex flex-col items-center justify-center font-sans overflow-x-hidden"
				style={{ fontFamily: "var(--font-family)" }}
			>
				{/* HERO SECTION */}
				<section
					className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden mb-2"
					style={{ height: "calc(100vh - 80px)" }}
				>
					{/* <img
          src="https://images.unsplash.com/photo-1610641825593-64f26504b439?auto=format&fit=crop&q=80&w=1770"
          alt="Hero Background"
          className="absolute inset-0 h-full w-full object-cover opacity-50 scale-105 animate-slow-zoom"
        /> */}

					<video
						ref={videoRef}
						autoPlay
						muted
						loop
						playsInline
						preload="auto"
						className="absolute inset-0 h-full w-full object-cover scale-105 animate-slow-zoom"
					>
						<source src="/bnv.mp4" type="video/mp4" />
					</video>

					<motion.div
						className="relative z-10 px-4"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
					>
						<motion.h1
							className="text-4xl md:text-7xl font-bold text-black leading-tight"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4, duration: 1.2 }}
						>
							<motion.span
								className="inline-block"
								initial={{ y: 50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.6, duration: 1 }}
							>
								Cultivating Beta
							</motion.span>
							<br />
							<motion.span
								className="inline-block text-[var(--color-black)]"
								initial={{ y: 50, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ delay: 0.9, duration: 1 }}
							>
								Generating Alpha
							</motion.span>
						</motion.h1>
					</motion.div>

					<motion.div
						className="absolute bottom-8 flex justify-center w-full z-10"
						animate={{ y: [0, 10, 0] }}
						transition={{ duration: 1.5, repeat: Infinity }}
					>
						<ChevronDown
							size={50}
							className="cursor-pointer text-gray-700 hover:text-black transition"
							onClick={() =>
								window.scrollBy({
									top: 500,
									behavior: "smooth",
								})
							}
						/>
					</motion.div>
				</section>

				{/* WHY MUTUAL FUND */}
				<section
					className="w-full py-20 px-6 text-center my-2"
					style={{
						backgroundColor: "var(--color-black)",
						color: "var(--color-cream)",
					}}
				>
					<motion.h1
						className="text-4xl md:text-5xl font-bold mb-6"
						initial={{ opacity: 0, y: 40 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
					>
						Why Mutual Fund
					</motion.h1>

					<motion.p
						className="max-w-3xl mx-auto text-lg leading-relaxed"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 1 }}
					>
						Wealth is not the product of chance. It is the outcome of discipline,
						foresight, and intelligent decisions. Time and again, we see
						accomplished individuals encounter the same challenge: preserving and
						expanding their capital without being consumed by the relentless
						demands of the markets.
					</motion.p>
					<motion.p
						className="max-w-3xl mx-auto pt-4 text-lg leading-relaxed"
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ delay: 0.3, duration: 1 }}
					>
						Our role is to align your investments with your ambitions —
						safeguarding legacy wealth, ensuring generational continuity, and
						building portfolios that reflect your success and stature. This is not
						a pursuit of quick returns; it is the curation of a financial journey
						that is enduring, purposeful, and worthy of your accomplishments.
					</motion.p>
				</section>

				{/* PROCESS TO LEGACY */}
				<section
					className="w-full py-20 px-6 text-center my-2"
					style={{
						backgroundColor: "var(--color-taupe)",
						color: "var(--color-black)",
					}}
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-12">
						Process to Legacy
					</h2>
					<div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
						{[
							{
								title: "Discovery",
								desc: "Every journey begins with understanding. Discovery is about uncovering not just financial goals, but the values, ambitions, and legacy you aspire to build. It is where clarity takes root, ensuring that your wealth strategy reflects the life you lead and the future you envision.",
							},
							{
								title: "Design",
								desc: "Wealth is never accidental; it is carefully curated. Design is the art of structuring your capital with balance, discipline, and foresight. Each decision is deliberate, harmonizing growth with preservation so that your portfolio embodies both resilience and refinement.",
							},
							{
								title: "Destiny",
								desc: "True prosperity is measured in decades, not days. Destiny represents the long arc of wealth — enduring, compounding, and ultimately shaping a legacy that outlives its creator. It is the point where intelligent choices, made with patience and vision, transform into lasting significance for generations to come.",
							},
						].map((item, i) => (
							<motion.div
								key={i}
								className="rounded-2xl p-8 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2"
								style={{ backgroundColor: "var(--color-cream)" }}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.2, duration: 0.6 }}
							>
								<h3 className="text-xl font-semibold mb-4">{item.title}</h3>
								<p className="text-[var(--color-warm-gray)] leading-relaxed">
									{item.desc}
								</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* CTA */}
				<motion.section
					className="w-full py-16 px-6 text-center my-2"
					style={{
						backgroundColor: "var(--color-black)",
						color: "var(--color-cream)",
					}}
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
				>
					<motion.h2 className="text-3xl md:text-4xl font-bold mb-6">
						Evaluate Your Financial Status
					</motion.h2>
					<motion.p className="mb-8 text-lg">
						Take the first step toward building your legacy today.
					</motion.p>
					<a
						href="/Wealthblueprint"
						className="font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition"
						style={{
							backgroundColor: "var(--color-cream)",
							color: "var(--color-black)",
						}}
					>
						Explore Our Services
					</a>
				</motion.section>

				{/* TESTIMONIALS */}
				<section
					className="w-full py-20 px-6 my-2"
					style={{
						backgroundColor: "var(--color-taupe)",
						color: "var(--color-black)",
					}}
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
						What Our Clients Say
					</h2>

					<div className="relative max-w-4xl mx-auto overflow-hidden">
						<motion.div
							className="flex transition-transform duration-700 ease-in-out"
							style={{ transform: `translateX(-${current * 100}%)` }}
						>
							{testimonials.map((t, idx) => (
								<motion.div
									key={idx}
									className="w-full flex-shrink-0"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.6 }}
								>
									<div
										className="rounded-2xl shadow-md p-8 mx-6 text-center"
										style={{ backgroundColor: "var(--color-cream)" }}
									>
										<p className="italic text-[var(--color-warm-gray)] mb-4">
											"{t.text}"
										</p>
										<h4 className="font-semibold">{t.author}</h4>
									</div>
								</motion.div>
							))}
						</motion.div>

						<div className="flex justify-center mt-6 mb-2 space-x-3">
							{testimonials.map((_, idx) => (
								<button
									key={idx}
									onClick={() => setCurrent(idx)}
									className={`h-3 w-3 rounded-full ${
										idx === current
											? "bg-[var(--color-black)] scale-125"
											: "bg-[var(--color-warm-gray)]"
									} transition-all duration-300`}
								></button>
							))}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
