import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import "../styles/globals.css";
import useIdleLogout from '../hooks/useIdleLogout';
import Head from "next/head";

function AppWrapper({ Component, pageProps }) {
  useIdleLogout(); 
  <Head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#ffffff" />
  </Head>
  return <Component {...pageProps} />;
}

export default function App(props) {
  return (
    <AuthProvider>
      <Layout>
        <AppWrapper {...props} />
      </Layout>
    </AuthProvider>
  );
}
