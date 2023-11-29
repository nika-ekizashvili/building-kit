import "../styles/main/style.bundle.css"
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store, { persistor } from "../store/store"
import Layout from "../components/layout/Layout";
import { PersistGate } from "redux-persist/integration/react";
import { SessionProvider } from "next-auth/react"
import { ParallaxProvider } from 'react-scroll-parallax';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
           <SessionProvider session={session}>
              <ParallaxProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              </ParallaxProvider>
            </SessionProvider>
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}
