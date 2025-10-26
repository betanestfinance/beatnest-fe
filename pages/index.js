import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";  // Add Play icon from lucide-react

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
    const videoRef = useRef(null);
    const heroRef = useRef(null);  // New: Ref for hero section
    const [current, setCurrent] = useState(0);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [userHasInteracted, setUserHasInteracted] = useState(false);  // New: Global interaction flag
    const [showPlayOverlay, setShowPlayOverlay] = useState(false);  // New: For fallback play button

    // Video handling: Eager load with CDN, retries, mobile fixes
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        // Core setup (enhanced for mobile)
        v.muted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "");
        v.setAttribute("webkit-playsinline", "");  // iOS specific

        let tryPlayOnInteraction = null;
        let playRetries = 0;
        const maxRetries = 3;

        const ensurePlay = async () => {
            try {
                await v.play();
                playRetries = 0;
                console.log('Video autoplay succeeded');
                setShowPlayOverlay(false);  // Hide overlay if showing
            } catch (err) {
                console.warn('Autoplay failed, retrying...', err);
                playRetries++;
                if (playRetries < maxRetries && userHasInteracted) {
                    // Post-interaction retry with shorter delay
                    setTimeout(ensurePlay, 500);
                } else if (!userHasInteracted) {
                    // Wait for interaction flag
                    console.log('Waiting for user interaction...');
                } else {
                    // Final fallback: Show play overlay after retries
                    setShowPlayOverlay(true);
                }
            }
        };

        // Smooth transition: Fade on 'playing' event
        const handleVideoPlaying = () => {
            setIsVideoLoaded(true);
            v.removeEventListener('playing', handleVideoPlaying);
        };
        v.addEventListener('playing', handleVideoPlaying);

        // Global interaction flag: Set on any document pointer event (unifies touch/click/mouse)
        const handleUserInteraction = (e) => {
            if (!userHasInteracted) {
                setUserHasInteracted(true);
                console.log('User interacted - retrying play');
                ensurePlay();  // Retry immediately
                document.removeEventListener('pointerdown', handleUserInteraction);
            }
        };
        // Add listener after a brief delay to avoid false positives on load
        setTimeout(() => {
            document.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: false });
        }, 100);

        // Fallback: Show overlay if no play after 5s (shorter for better UX)
        const fallbackTimeout = setTimeout(() => {
            if (!isVideoLoaded && !userHasInteracted) {
                setShowPlayOverlay(true);
            }
        }, 5000);

        // Eager load: Auto on desktop, metadata on mobile for data savings
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        v.preload = isMobile ? "metadata" : "auto";
        ensurePlay();

        // Hero-specific gesture: Direct play on section tap
        const hero = heroRef.current;
        const handleHeroGesture = () => {
            if (!userHasInteracted) setUserHasInteracted(true);
            ensurePlay();
        };
        hero?.addEventListener('pointerdown', handleHeroGesture, { passive: true });

        // Visibility observer
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (document.visibilityState === "hidden") return;
                    if (entry.isIntersecting) {
                        if (v?.paused && isVideoLoaded && userHasInteracted) ensurePlay();
                    } else {
                        v?.pause()?.catch(() => {});
                    }
                });
            },
            { root: null, rootMargin: "0px 0px -20% 0px", threshold: 0.1 }
        );
        io.observe(v);

        // Tab visibility
        const onVisibility = () => {
            if (document.visibilityState === "hidden") {
                v?.pause()?.catch(() => {});
            } else if (isVideoLoaded && userHasInteracted) {
                const rect = v.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    ensurePlay();
                }
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        // Cleanup
        return () => {
            clearTimeout(fallbackTimeout);
            v.removeEventListener('playing', handleVideoPlaying);
            document.removeEventListener('pointerdown', handleUserInteraction);
            hero?.removeEventListener('pointerdown', handleHeroGesture);
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            v?.pause()?.catch(() => {});
        };
    }, [isVideoLoaded, userHasInteracted]);  // Depend on interaction flag

    // Testimonials auto-advance
    useEffect(() => {
        const id = setInterval(
            () => setCurrent((c) => (c + 1) % testimonials.length),
            8000
        );
        return () => clearInterval(id);
    }, []);

    // Play overlay handler
    const handlePlayOverlayClick = () => {
        setUserHasInteracted(true);
        ensurePlay();  // Ensure function is accessible; in practice, use ref or context if needed
        setShowPlayOverlay(false);
    };

    return (
        <>
            <Head>
                {/* ... (unchanged Head content) ... */}
                <title>BetaNest — Cultivating Beta | Generating Alpha</title>
                <meta
                    name="description"
                    content="BetaNest provides wealth planning, mutual fund advisory and legacy portfolio design. Build, protect and grow your capital with tailored strategies."
                />
                <link rel="canonical" href="https://www.betanestfin.com/" />
                {/* Open Graph, Twitter, etc. - unchanged */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="BetaNest — Cultivating Beta | Generating Alpha" />
                <meta property="og:description" content="BetaNest provides wealth planning, mutual fund advisory and legacy portfolio design." />
                <meta property="og:url" content="https://www.betanestfin.com/" />
                <meta property="og:image" content="https://www.betanestfin.com/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="BetaNest — Cultivating Beta | Generating Alpha" />
                <meta name="twitter:description" content="BetaNest provides wealth planning, mutual fund advisory and legacy portfolio design." />
                <meta name="twitter:image" content="https://www.betanestfin.com/og-image.jpg" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <meta name="robots" content="index,follow" />
                <link 
                    rel="preload" 
                    href="https://ohpvqzryipldnupz.public.blob.vercel-storage.com/Bg_vid.mp4" 
                    as="video" 
                    type="video/mp4" 
                />
                <link 
                    rel="preload" 
                    href="/fallback_img_2.png"  
                    as="image" 
                    type="image/png" 
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "BetaNest",
                            url: "https://www.betanestfin.com",
                            logo: "https://www.betanestfin.com/logo.png",
                            sameAs: [
                                "https://www.linkedin.com/your-profile",
                                "https://twitter.com/your-profile",
                            ],
                        }),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            url: "https://www.betanestfin.com",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: "https://www.betanestfin.com/search?q={search_term_string}",
                                "query-input": "required name=search_term_string",
                            },
                        }),
                    }}
                />
            </Head>
            <div
                className="flex flex-col items-center justify-center font-sans overflow-x-hidden"
                style={{ fontFamily: "var(--font-family)" }}
            >
                {/* HERO SECTION */}
                <section
                    ref={heroRef}  // New: Hero ref for gestures
                    className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden mb-2 cursor-pointer"  // Add cursor-pointer for UX hint
                    style={{ 
                        height: "calc(100vh - 80px)",
                        backgroundImage: "url('/fallback_img_2.png')",
                    }}
                    onPointerDown={() => {  // Direct hero gesture handler (backup to listener)
                        if (!userHasInteracted) setUserHasInteracted(true);
                        videoRef.current?.play().catch(() => {});
                    }}
                >
                    {/* Fallback Image: Unchanged */}
                    <motion.img
                        src="/fallback_img_2.png"
                        alt="Hero fallback background"
                        className="absolute inset-0 h-full w-full object-cover scale-105 hero-video z-10"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isVideoLoaded ? 0 : 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        aria-hidden="true"
                    />

                    {/* Video: Omit autoPlay attr entirely */}
                    <motion.video
                        ref={videoRef}
                        src="https://ohpvqzryipldnupz.public.blob.vercel-storage.com/Bg_vid.mp4"
                        poster="/fallback_img_2.png"
                        preload="metadata"  // Handled dynamically in useEffect
                        muted
                        loop
                        playsInline
                        // autoPlay removed - use JS only
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                        className="absolute inset-0 h-full w-full object-cover scale-105 hero-video z-20"
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVideoLoaded ? 1 : 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* New: Play Overlay Fallback - Subtle centered icon if autoplay fails */}
                    {showPlayOverlay && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center z-25 bg-black bg-opacity-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handlePlayOverlayClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <motion.div
                                className="bg-[var(--color-cream)] p-4 rounded-full shadow-lg"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Play size={48} className="text-[var(--color-black)] ml-1" />  {/* Slight offset for triangle play icon */}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Text and Chevron: Unchanged, z-30 */}
                    <motion.div
                        className="relative z-30 px-4"
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
                        className="absolute bottom-8 flex justify-center w-full z-30"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ChevronDown
                            size={50}
                            className="cursor-pointer text-gray-700 hover:text-black transition"
                            onClick={() => window.scrollBy({ top: 500, behavior: "smooth" })}
                        />
                    </motion.div>
                </section>

                {/* Rest of sections unchanged: Why Mutual Fund, Process to Legacy, CTA, Testimonials */}
                {/* ... (paste the rest of your sections here - no changes needed) ... */}
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