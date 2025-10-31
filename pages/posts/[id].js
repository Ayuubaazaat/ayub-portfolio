import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Heart, MessageCircle, Share2, ArrowLeft, X } from 'lucide-react';

// Disable static generation for this dynamic page
export function getServerSideProps() {
  return { props: {} };
}

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentAvatar, setNewCommentAvatar] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyAvatar, setReplyAvatar] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Mock data for now - replace with API call
  useEffect(() => {
    if (id) {
      // Mock post data - replace with actual API call
      const mockPost = {
        id: parseInt(id),
        author: "Keynan",
        avatar: "/avatar.png",
        date: "October 16, 2025",
        time: "11:16 PM",
        content: "Waxaa lasoo sheegayaa in abaaro ba'an ay ka dhaceen kaxda kuwaas oo dadkii ku qasbay inay u qaxaan shiirkole",
        likes: 12,
        shares: 2,
        comments: [
          {
            author: "Ali",
            avatar: "/avatar2.png",
            text: "This is really sad news",
            replies: [
              {
                author: "Amina",
                avatar: "/avatar3.png",
                text: "Yes, may Allah help them"
              }
            ]
          },
          {
            author: "Layla",
            avatar: "/avatar4.png",
            text: "May Allah make it easy",
            replies: []
          }
        ]
      };
      setPost(mockPost);
      setLoading(false);
    }
  }, [id]);

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      likes: prev.likes + 1
    }));
  };

  const handleAvatarUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "comment") setNewCommentAvatar(url);
      if (type === "reply") setReplyAvatar(url);
    }
  };

  const removeAvatar = (type) => {
    if (type === "comment") setNewCommentAvatar(null);
    if (type === "reply") setReplyAvatar(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const authorName = newCommentAuthor.trim() || "Anonymous";
    
    setPost(prev => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          author: authorName,
          avatar: newCommentAvatar || "/avatar.png",
          text: newComment,
          replies: [],
        },
      ],
    }));
    setNewComment("");
    setNewCommentAuthor("");
    setNewCommentAvatar(null);
  };

  const handleAddReply = (commentIdx) => {
    if (!replyText.trim()) return;
    
    const authorName = replyAuthor.trim() || "Anonymous";
    
    setPost(prev => ({
      ...prev,
      comments: prev.comments.map((c, idx) =>
        idx === commentIdx
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  author: authorName,
                  avatar: replyAvatar || "/avatar.png",
                  text: replyText,
                },
              ],
            }
          : c
      ),
    }));
    setReplyText("");
    setReplyAuthor("");
    setReplyAvatar(null);
    setReplyingTo(null);
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  const handleMenuAction = (action) => {
    console.log(`Post action: ${action}`);
    setOpenDropdown(false);
    
    switch (action) {
      case 'interested':
        alert('Marked as Interested!');
        break;
      case 'not-interested':
        alert('Marked as Not Interested!');
        break;
      case 'hide':
        alert('Post hidden from your feed');
        router.push('/posts');
        break;
      default:
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(false);
    };
    
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Button onClick={() => router.push('/posts')} className="bg-purple-500 hover:bg-purple-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Post Details - Personal Portfolio</title>
        <meta name="description" content="View post details and comments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => router.push('/posts')}
              variant="ghost" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Posts</span>
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Post Details</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4">
        {/* Post */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          {/* Author Info */}
          <div className="flex items-center justify-between p-4 pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 text-base">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {post.date} • {post.time}
                </p>
              </div>
            </div>
            {/* Three dots menu */}
            <div className="relative flex items-center space-x-2">
              <button 
                onClick={handleDropdownToggle}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center relative"
              >
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {openDropdown && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[180px]">
                  <button
                    onClick={() => handleMenuAction('interested')}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>Interested</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuAction('not-interested')}
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
                    onClick={() => handleMenuAction('hide')}
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
            <p className="text-gray-900 leading-relaxed text-base">{post.content}</p>
          </div>

          {/* Engagement Summary */}
          <div className="px-4 py-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </div>
                </div>
                <span>{post.likes}</span>
              </div>
              <div>
                <span>{post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center border-t border-gray-100">
            <button
              className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
              onClick={handleLike}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.818a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span>Like</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>Comment</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center space-x-2 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments ({post.comments.length})</h2>
            
            {/* Comments */}
            <div className="space-y-4 mb-6">
              {post.comments.map((comment, idx) => (
                <div key={idx}>
                  {/* Comment */}
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8 rounded-full">
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                        <span className="font-semibold text-sm text-gray-900">{comment.author} </span>
                        <span className="text-sm text-gray-800">{comment.text}</span>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-3 mt-2 ml-2 text-xs text-gray-500">
                        <button className="hover:text-gray-700 transition-colors duration-200">Like</button>
                        <span>·</span>
                        <button 
                          onClick={() => setReplyingTo(replyingTo === idx ? null : idx)}
                          className="hover:text-gray-700 transition-colors duration-200"
                        >
                          Reply
                        </button>
                        <span>·</span>
                        <span>2h</span>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="ml-12 mt-3 space-y-3">
                      {comment.replies.map((reply, rIdx) => (
                        <div key={rIdx} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8 rounded-full">
                            <AvatarImage src={reply.avatar} alt={reply.author} />
                            <AvatarFallback className="bg-green-100 text-green-600 text-xs font-semibold">{reply.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                              <span className="font-semibold text-sm text-gray-900">{reply.author} </span>
                              <span className="text-sm text-gray-800">{reply.text}</span>
                            </div>
                            
                            {/* Reply Actions */}
                            <div className="flex items-center space-x-3 mt-2 ml-2 text-xs text-gray-500">
                              <button className="hover:text-gray-700 transition-colors duration-200">Like</button>
                              <span>·</span>
                              <span>1h</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === idx && (
                    <div className="ml-12 mt-3 flex items-center space-x-3">
                      <Avatar className="w-8 h-8 rounded-full">
                        <AvatarImage src={replyAvatar} alt="Your avatar" />
                        <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex items-center space-x-3">
                        <input
                          type="text"
                          value={replyAuthor}
                          onChange={(e) => setReplyAuthor(e.target.value)}
                          placeholder="Your name"
                          className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        />
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-2 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg cursor-pointer transition-colors duration-200 border border-blue-200">
                          <span className="text-xs font-medium">Avatar</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarUpload(e, "reply")}
                            className="hidden"
                          />
                        </label>
                        {replyAvatar && (
                          <button
                            onClick={() => removeAvatar("reply")}
                            className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center transition-colors duration-200"
                          >
                            <X className="w-3 h-3 mr-1" /> Remove
                          </button>
                        )}
                        <button
                          onClick={() => handleAddReply(idx)}
                          className="rounded-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add Comment */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 rounded-full">
                  <AvatarImage src={newCommentAvatar} alt="Your avatar" />
                  <AvatarFallback className="bg-gray-200 text-gray-600 font-semibold">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder="Your name"
                    className="hidden"
                  />
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 border-0"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg cursor-pointer transition-colors duration-200 border border-blue-200">
                    <span className="text-xs font-medium">Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarUpload(e, "comment")}
                      className="hidden"
                    />
                  </label>
                  {newCommentAvatar && (
                    <button
                      onClick={() => removeAvatar("comment")}
                      className="text-xs text-red-500 hover:text-red-600 hover:underline flex items-center transition-colors duration-200"
                    >
                      <X className="w-3 h-3 mr-1" /> Remove
                    </button>
                  )}
                  <button
                    onClick={handleAddComment}
                    className="rounded-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
