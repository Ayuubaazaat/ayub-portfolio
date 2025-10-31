import Head from 'next/head';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <>
      <Head>
        <title>Personal Portfolio - Product Designer & Visual Developer</title>
        <meta name="description" content="Building digital products, brands and experience. A Product Designer and Visual Developer specializing in UI/UX Design, Responsive Web Design, and Visual Development." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Navbar />
        <Hero />
      </main>
    </>
  );
}
