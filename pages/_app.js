import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import "../styles/globals.css";
import useIdleLogout from '../hooks/useIdleLogout';

function AppWrapper({ Component, pageProps }) {
  useIdleLogout(); 

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
