import Head from 'next/head'
import type { AppProps } from 'next/app'
import { ColorsProvider } from '../hooks/useColors'

function Serenely({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Serenely</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ColorsProvider>
        <Component {...pageProps} />
        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
              Droid Sans, Helvetica Neue, sans-serif;
          }
          *::-webkit-scrollbar {
            display: none;
          }

          * {
            box-sizing: border-box;
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </ColorsProvider>
    </>
  )
}

export default Serenely
