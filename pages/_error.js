import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

function Error({ statusCode }) {
  return (
    <>
      <Head>
        <title>{statusCode ? `Error ${statusCode}` : 'An error occurred'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-9xl font-black text-primary dark:text-primary mb-4">
              {statusCode || '?'}
            </h1>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {statusCode === 404
              ? 'Page Not Found'
              : statusCode === 500
              ? 'Server Error'
              : 'An Error Occurred'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {statusCode === 404
              ? "The page you're looking for doesn't exist or has been moved."
              : statusCode === 500
              ? 'Something went wrong on our end. Please try again later.'
              : 'An unexpected error occurred. Please try again.'}
          </p>
          
          <Link href="/">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
            >
              Go Back Home
            </motion.a>
          </Link>
        </motion.div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

