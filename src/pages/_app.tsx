import Head from 'next/head'
import type { AppProps } from 'next/app'

function Serenely({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Serenely</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default Serenely
