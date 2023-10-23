// Global Style Import
import "@/styles/globals.css";
// Other Imports
import Layout from "@/components/Layout";
import NonSSRWrapper from "@/components/NonSSRWrapper";
// For Working Redux Toolkit
import { Provider } from "react-redux";
import store from "@/store";

export default function App({ Component, pageProps }) {
  return (
    <NonSSRWrapper>
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </NonSSRWrapper>
  );
}
