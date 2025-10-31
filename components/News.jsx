import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Send, X, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AlertModal from './AlertModal';
import NewsFeed from './NewsFeed';

const News = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [newsPosts, setNewsPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  });

  // Fetch news posts
  const fetchNewsPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news');
      const result = await response.json();
      
      if (result.success) {
        setNewsPosts(result.data);
      } else {
        console.error('Failed to fetch news posts');
      }
    } catch (error) {
      console.error('Error fetching news posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setAlertType('error');
      setAlertTitle('Oops!');
      setAlertMessage('Please fill in all fields.');
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/news/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setAlertType('success');
        setAlertTitle('Success!');
        setAlertMessage('Your news post has been submitted for review. Thank you!');
        setShowAlert(true);
        setFormData({ title: '', content: '', author: '' });
        setShowSubmitForm(false);
      } else {
        setAlertType('error');
        setAlertTitle('Error');
        setAlertMessage(result.message || 'Failed to submit news post.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error submitting news post:', error);
      setAlertType('error');
      setAlertTitle('Error');
      setAlertMessage('Failed to submit news post. Please try again.');
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <motion.section 
        id="news"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="min-h-screen flex items-center justify-center px-6 py-12"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-8">
              Latest <span className="text-primary">Posts</span>
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
              Stay updated with the latest posts and updates. Share your own posts with our community!
            </p>
            
            {/* Submit News Button */}
            <motion.button
              onClick={() => {
                if (session) {
                  setShowSubmitForm(true);
                } else {
                  router.push('/login');
                }
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(108, 99, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              {session ? 'Create Post' : 'Login to Create Post'}
            </motion.button>
          </motion.div>

          {/* News Posts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted">Loading news...</p>
            </div>
          ) : newsPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl shadow-xl p-12">
                <h3 className="text-2xl font-bold text-text mb-4">No Posts Yet</h3>
                <p className="text-muted mb-6">Be the first to share news with our community!</p>
                <motion.button
                  onClick={() => setShowSubmitForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Submit First Post
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <NewsFeed />
          )}
        </div>
      </motion.section>

      {/* Submit News Modal */}
      <AnimatePresence>
        {showSubmitForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowSubmitForm(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-text">Submit Post</h3>
                <button
                  onClick={() => setShowSubmitForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-muted" />
                </button>
              </div>

              {/* Submit Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter news title..."
                  />
                  <p className="text-xs text-muted mt-1">
                    {formData.title.length}/200 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Your name..."
                  />
                  <p className="text-xs text-muted mt-1">
                    {formData.author.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    maxLength={2000}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Write your news content here..."
                  />
                  <p className="text-xs text-muted mt-1">
                    {formData.content.length}/2000 characters
                  </p>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-text font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Post
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Modal */}
      {showAlert && (
        <AlertModal
          type={alertType}
          title={alertTitle}
          message={alertMessage}
          onClose={handleCloseAlert}
        />
      )}
    </>
  );
};

export default News;
