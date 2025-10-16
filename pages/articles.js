import { motion } from "framer-motion";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Articles() {
  const articles = [
    {
      title: "Beyond Money",
      link: "https://betanestfinance.medium.com/beyond-money-45d28c182f24",
      image:
        "https://plus.unsplash.com/premium_photo-1680230177520-e87271066e5d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070",
    },
    {
      title: "How People Are Hilarious About Their Money",
      link: "https://betanestfinance.medium.com/how-people-hilarious-about-their-money-6ac2fcf7d466",
      image:
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MkTrdesygCRYrtmfRWos3A.png",
    },
    {
      title: "Summary of Don’t Worry by Shumyo Masuno",
      link: "https://betanestfinance.medium.com/summary-of-dont-worry-by-shumyo-masuno-5e4531884f0c",
      image: "https://www.armatuer.com/cdn/shop/products/MB3_1296x.jpg?v=1682237138",
    },
  ];

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-family)" }}>
      {/* Hero Section - Black */}
      <motion.section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
        initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
      >
        <motion.h1 className="text-4xl md:text-5xl font-bold mb-6" 
        initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >Insights & Perspectives</motion.h1>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-90">
          Wealth is more than numbers — it is shaped by ideas, discipline, and foresight.
          Here, we share curated perspectives on investing, markets, and the philosophy of
          enduring prosperity.
        </p>
      </motion.section>

      {/* Articles Grid - Taupe */}
      <section
        className="py-20 px-6 my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article, index) => (
            <motion.a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="overflow-hidden">
                <motion.img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-3 leading-snug">{article.title}</h3>
                <p className="text-sm opacity-70">Read on Medium →</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Button */}
        <div className="mt-14 text-center">
          <a
            href="https://medium.com/@betanestfinance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full font-medium transition duration-300 hover:opacity-90"
            style={{
              backgroundColor: "var(--color-black)",
              color: "var(--color-cream)",
            }}
          >
            Explore All Articles
          </a>
        </div>
      </section>

      {/* Closing Section - Cream */}
      <motion.section
        className="py-16 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-cream)", color: "var(--color-black)" }}
      >
        <motion.h2 className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >Ideas That Shape Wealth</motion.h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed opacity-80">
          Every article we share is an insight into building clarity, discipline, and purpose in your
          financial life — guiding you to invest not just for growth, but for legacy.
        </p>
      </motion.section>
    </div>
  );
}
