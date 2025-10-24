import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
    <Head>
        <title>Privacy Policies</title>
        <description>BetaNest Home</description>
    </Head>
    <section className="max-w-3xl mx-auto py-16 text-center px-4 text-black" style={{ fontFamily: "var(--font-family)" }}>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-warm-black text-sm leading-relaxed">
        At BetaNest, we respect your privacy and safeguard your personal information with the highest standards of confidentiality.<br /><br />
        We collect only the information necessary to provide investment distribution services, such as basic contact details, PAN, and investment preferences.<br /><br />
        Your data is never sold, rented, or shared with unauthorized parties. It is used strictly for delivering our services, compliance with regulatory requirements, and improving your client experience.<br /><br />
        All digital records are stored securely with industry-standard protections. By using our services, you consent to our handling of information as outlined here.
      </p>
    </section>
    </>
  );
}
