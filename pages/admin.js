import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, Eye, EyeOff, Lock } from 'lucide-react';

// Disable static generation for this dynamic page
export function getServerSideProps() {
  return { props: {} };
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all posts (pending and approved)
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const response = await fetch('/api/news/admin', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setPosts(result.data);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Error fetching posts');
    } finally {
      setLoadingPosts(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/news/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        await fetchPosts();
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject post
  const handlePostAction = async (postId, action) => {
    setActionLoading(postId);
    
    try {
      const response = await fetch('/api/news/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({
          postId,
          approved: action === 'approve'
        })
      });

      const result = await response.json();

      if (result.success) {
        await fetchPosts(); // Refresh the posts list
      } else {
        setError(result.message || 'Action failed');
      }
    } catch (error) {
      console.error('Action error:', error);
      setError('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setActionLoading(postId);
    
    try {
      const response = await fetch('/api/news/admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify({ postId })
      });

      const result = await response.json();

      if (result.success) {
        await fetchPosts(); // Refresh the posts list
      } else {
        setError(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">Admin Login</h1>
            <p className="text-muted">Enter password to access admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">News Admin Panel</h1>
              <p className="text-muted">Manage news posts and submissions</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {loadingPosts ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <h3 className="text-xl font-bold text-text mb-2">No Posts Yet</h3>
              <p className="text-muted">No news posts have been submitted yet.</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-bold text-text">{post.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted mb-4">
                      <span>By: {post.author}</span>
                      <span>Posted: {formatDate(post.createdAt)}</span>
                    </div>
                    <p className="text-muted leading-relaxed">{post.content}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {!post.approved && (
                    <motion.button
                      onClick={() => handlePostAction(post._id, 'approve')}
                      disabled={actionLoading === post._id}
                      whileHover={actionLoading !== post._id ? { scale: 1.05 } : {}}
                      whileTap={actionLoading !== post._id ? { scale: 0.95 } : {}}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === post._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </motion.button>
                  )}
                  
                  {post.approved && (
                    <motion.button
                      onClick={() => handlePostAction(post._id, 'reject')}
                      disabled={actionLoading === post._id}
                      whileHover={actionLoading !== post._id ? { scale: 1.05 } : {}}
                      whileTap={actionLoading !== post._id ? { scale: 0.95 } : {}}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === post._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <EyeOff className="w-4 h-4 mr-2" />
                      )}
                      Hide
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => handleDeletePost(post._id)}
                    disabled={actionLoading === post._id}
                    whileHover={actionLoading !== post._id ? { scale: 1.05 } : {}}
                    whileTap={actionLoading !== post._id ? { scale: 0.95 } : {}}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === post._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg"
          >
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;



