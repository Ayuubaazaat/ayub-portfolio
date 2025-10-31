import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function NewsFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Helper function to format timestamp into friendly format
  const getFriendlyTime = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
  };

  // Fetch news posts from API
  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      const response = await fetch(`/api/news?page=${pageNum}&limit=5`);
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match component structure
        const transformedPosts = data.data.map(post => ({
          id: post._id,
          author: post.author,
          avatar: "/avatar.png", // Default avatar
          date: post.date,
          friendlyTime: getFriendlyTime(post.date),
          content: post.content,
          likes: Math.floor(Math.random() * 50) + 5, // Random likes for demo
          comments: [], // Empty comments array for now
          shares: Math.floor(Math.random() * 20) + 2, // Random shares for demo
        }));

        if (append) {
          setPosts(prev => [...prev, ...transformedPosts]);
        } else {
          setPosts(transformedPosts);
        }
        
        // Check if there are more posts
        setHasMore(data.data.length === 5);
      } else {
        setError('Failed to fetch news posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load news posts');
    } finally {
      setLoading(false);
    }
  };

  // Load more posts
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (id, e) => {
    e.stopPropagation(); // Prevent navigation when clicking like
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleShare = (id, e) => {
    e.stopPropagation(); // Prevent navigation when clicking share
    // Add share functionality here
    console.log("Share post:", id);
  };

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  const handleCommentClick = (postId, e) => {
    e.stopPropagation(); // Prevent post navigation when clicking comment button
    router.push(`/posts/${postId}`);
  };

  const handleDropdownToggle = (postId, e) => {
    e.stopPropagation(); // Prevent post navigation
    setOpenDropdown(openDropdown === postId ? null : postId);
  };

  const handleMenuAction = (postId, action) => {
    console.log(`Post ${postId}: ${action}`);
    setOpenDropdown(null);
    
    switch (action) {
      case 'interested':
        alert('Marked as Interested!');
        break;
      case 'not-interested':
        alert('Marked as Not Interested!');
        break;
      case 'hide':
        // Remove post from feed
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post hidden from your feed');
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600">No news posts available yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for updates!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-4 bg-gray-50 min-h-screen">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={() => handlePostClick(post.id)}
        >
          {/* Author Info */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <button 
                  className="font-semibold text-gray-900 hover:underline text-left text-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent post navigation
                    // Future: navigate to user profile
                    console.log('Navigate to profile:', post.author);
                  }}
                >
                  {post.author}
                </button>
                <p className="text-xs text-gray-500">
                  {post.friendlyTime}
                </p>
              </div>
            </div>
            {/* Three dots menu (like Facebook) */}
            <div className="relative flex items-center space-x-2">
              <button 
                onClick={(e) => handleDropdownToggle(post.id, e)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center relative"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {openDropdown === post.id && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[180px]">
                  <button
                    onClick={() => handleMenuAction(post.id, 'interested')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>Interested</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuAction(post.id, 'not-interested')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                    <span>Not Interested</span>
                  </button>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => handleMenuAction(post.id, 'hide')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 10a6 6 0 1112 0A6 6 0 014 10z" clipRule="evenodd" />
                    </svg>
                    <span>Hide Post</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-900 leading-relaxed text-sm">{post.content}</p>
          </div>

          {/* Engagement Summary (like Facebook shows reactions + comments count) */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                {/* Like emoji + count */}
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </div>
                </div>
                <span>{post.likes}</span>
              </div>
              <div>
                <button 
                  onClick={(e) => handleCommentClick(post.id, e)}
                  className="hover:underline"
                >
                  {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons (Like, Comment, Share) */}
          <div className="flex items-center border-t border-gray-100">
            <button
              className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
              onClick={(e) => handleLike(post.id, e)}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>Like</span>
            </button>
            
            <button 
              onClick={(e) => handleCommentClick(post.id, e)}
              className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Comment</span>
            </button>
            
            <button 
              onClick={(e) => handleShare(post.id, e)}
              className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
      
      {/* Load More Button */}
      {hasMore && posts.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}
      
      {/* End of posts message */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center mt-8 py-8">
          <p className="text-gray-500">You've reached the end of the posts!</p>
        </div>
      )}
    </div>
  );
}