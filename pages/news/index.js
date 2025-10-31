import Head from 'next/head';
import Navbar from '../../components/Navbar';
import News from '../../components/News';

export default function NewsPage() {
  return (
    <>
      <Head>
        <title>Latest Posts - Personal Portfolio</title>
        <meta name="description" content="Stay updated with the latest posts and updates. Share your own posts with our community!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <News />
      </main>
    </>
  );
}
