import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';

// Disable static generation for this dynamic page
export function getServerSideProps() {
  return { props: {} };
}

export default function MyProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Redirect to actual profile page
    router.replace(`/profile/${session.user.id}`);
  }, [session, status, router]);

  return (
    <>
      <Head>
        <title>My Profile</title>
      </Head>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to your profile...</p>
        </div>
      </div>
    </>
  );
}
