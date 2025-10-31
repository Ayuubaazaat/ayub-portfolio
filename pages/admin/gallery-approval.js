import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { Check, X, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

// Note: This page requires ADMIN_EMAIL environment variable to be set

// Server-side authentication check
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Check if user is admin
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (adminEmail && session.user.email !== adminEmail) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

export default function GalleryApprovalPage({ session }) {
  const router = useRouter();
  const [pendingImages, setPendingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingImageId, setProcessingImageId] = useState(null);

  const fetchPendingImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/gallery/list-pending');
      const data = await response.json();
      if (data.success) {
        setPendingImages(data.images);
      } else {
        toast.error(data.message || 'Failed to fetch pending images.');
      }
    } catch (error) {
      console.error('Error fetching pending images:', error);
      toast.error('Network error while fetching images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingImages();
  }, []);

  const handleApprove = async (id) => {
    setProcessingImageId(id);
    try {
      const response = await fetch('/api/admin/gallery/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Image approved successfully!');
        setPendingImages((prev) => prev.filter((img) => img._id !== id));
      } else {
        toast.error(data.message || 'Failed to approve image.');
      }
    } catch (error) {
      console.error('Error approving image:', error);
      toast.error('Network error while approving image.');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleDeny = async (id) => {
    if (!confirm('Are you sure you want to deny and delete this image? This action cannot be undone.')) {
      return;
    }

    setProcessingImageId(id);
    try {
      const response = await fetch('/api/admin/gallery/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Image denied and deleted successfully.');
        setPendingImages((prev) => prev.filter((img) => img._id !== id));
      } else {
        toast.error(data.message || 'Failed to deny image.');
      }
    } catch (error) {
      console.error('Error denying image:', error);
      toast.error('Network error while denying image.');
    } finally {
      setProcessingImageId(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>Admin Gallery Approval</title>
        <meta name="description" content="Admin panel for approving gallery images" />
      </Head>
      <Navbar />
      <Toaster position="top-right" />

      <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-primary dark:text-primary mb-2">
                Admin Gallery Approval
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review and approve pending gallery images
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPendingImages}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/gallery')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Gallery
              </motion.button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
            <p className="ml-3 text-gray-600 dark:text-gray-400">Loading pending images...</p>
          </div>
        ) : pendingImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <div className="inline-block p-6 bg-gray-200 dark:bg-gray-800 rounded-full mb-4">
              <Check className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
              No pending images for approval
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              All images have been reviewed
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {pendingImages.map((image) => (
                <motion.div
                  key={image._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col group hover:shadow-xl transition-shadow"
                >
                  <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Pending image by ${image.uploaderEmail}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">Uploaded by:</span> {image.uploaderEmail || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(image.uploadTimestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(image._id)}
                        disabled={processingImageId === image._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {processingImageId === image._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeny(image._id)}
                        disabled={processingImageId === image._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {processingImageId === image._id ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Deny
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

