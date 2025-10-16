export default function Articles() {
  const articles = [
    {
      title: "Beyond Money",
      link: "https://betanestfinance.medium.com/beyond-money-45d28c182f24",
      image: "https://plus.unsplash.com/premium_photo-1680230177520-e87271066e5d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    },
    {
      title: "How people hilarious about their money",
      link: "https://betanestfinance.medium.com/how-people-hilarious-about-their-money-6ac2fcf7d466",
      image:
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MkTrdesygCRYrtmfRWos3A.png",
    },
    {
      title: "Summary of Don’t Worry by Shumyo Masuno",
      link: "https://betanestfinance.medium.com/summary-of-dont-worry-by-shumyo-masuno-5e4531884f0c",
      image:
        "https://www.armatuer.com/cdn/shop/products/MB3_1296x.jpg?v=1682237138",
    },
  ];

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-family)" }}>
      {/* Hero Section - Black */}
      <section
        className="py-20 px-6 text-center my-2"
        style={{ backgroundColor: "var(--color-black)", color: "var(--color-cream)" }}
      >
        {/* <h1 className="text-4xl md:text-5xl font-bold mb-6">Articles</h1> */}
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          Wealth is more than numbers — it is shaped by ideas, discipline, and foresight. 
          Here, we share curated perspectives on investing, markets, and the philosophy of enduring 
          prosperity, drawn from our writings on Medium.
        </p>
      </section>

      {/* Articles Grid - Taupe */}
      <section
        className="py-20 px-6 my-2"
        style={{ backgroundColor: "var(--color-taupe)", color: "var(--color-black)" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="https://medium.com/@betanestfinance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full font-medium transition duration-300"
            style={{
              backgroundColor: "var(--color-black)",
              color: "var(--color-cream)",
            }}
          >
            Read More
          </a>
        </div>
      </section>
    </div>
  );
}
