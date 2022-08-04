// Modules
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { appWithTranslation } from "next-i18next";

import {
  ComponentType,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// Fonts
import "@fontsource/sora/300.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/700.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/noto-sans-thai/300.css";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/700.css";
import "@fontsource/sarabun/300.css";
import "@fontsource/sarabun/400.css";
import "@fontsource/sarabun/500.css";
import "@fontsource/sarabun/700.css";

// Styles
import "@styles/global.css";

// Components
import Layout from "@components/Layout";

// Types
import { Role } from "@utils/types/person";

// Supabase
import { supabase } from "@utils/supabaseClient";
import { AuthChangeEvent } from "@supabase/supabase-js";

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}) => {
  // Query client
  const [queryClient] = useState(() => new QueryClient());

  // Authentication
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent>("SIGNED_OUT");
  const router = useRouter();
  // Listen for auth state change
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log({ authEvent, event });

        // Only continue if auth state changes
        if (authEvent != "SIGNED_OUT" && authEvent == event) return;
        setAuthEvent(event);

        // Cookie
        await fetch(`/api/account/cookie`, {
          method: "POST",
          headers: new Headers({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ event, session }),
        });

        // Redirect
        const role = session?.user?.user_metadata.role as Role;
        if (event == "SIGNED_IN") {
          if (role == "student") router.push("/s/home");
          else if (role == "teacher") router.push("/t/home");
        } else if (event == "SIGNED_OUT") router.push("/");
      }
    );
    return () => authListener?.unsubscribe();
  }, []);

  // Page transition loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
    router.events.on("routeChangeError", () => setLoading(false));

    return () => {
      router.events.off("routeChangeStart", () => setLoading(true));
      router.events.off("routeChangeComplete", () => setLoading(false));
      router.events.off("routeChangeError", () => setLoading(false));
    };
  });

  // Layout
  // Use the layout defined at the page level, if available.
  // Otherwise, use the default Layout.
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {loading && <div className="fixed inset-0 z-50 cursor-progress" />}
      {getLayout(<Component {...pageProps} />)}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default appWithTranslation(App as ComponentType<AppProps>);
