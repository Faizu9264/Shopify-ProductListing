import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '@shopify/polaris/build/esm/styles.css'
import translations from '@shopify/polaris/locales/en.json';
import { AppProvider } from "@shopify/polaris";
import { Provider } from 'react-redux';
import { store } from '../redux/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider i18n={translations}>
       <Provider store={store}>
      <Component {...pageProps} />
       </Provider>
    </AppProvider>
  );
}
