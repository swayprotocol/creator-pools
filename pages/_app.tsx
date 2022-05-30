import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { GlobalConfigProvider } from '../contexts/Config';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalConfigProvider props={pageProps}>
      <Component {...pageProps} />
    </GlobalConfigProvider>
  )
}

export default MyApp
