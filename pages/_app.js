import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import Footer from '../components/Footer'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={session} refetchInterval={0} refetchOnWindowFocus={false}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen flex flex-col">
          <div className="flex-grow">
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </SessionProvider>
    </>
  )
}
