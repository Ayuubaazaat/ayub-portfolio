import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Heart, MessageCircle, Share2, ArrowLeft, X } from 'lucide-react';

export default function NewsDetail() {
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
          <Button onClick={() => router.push('/')} className="bg-purple-500 hover:bg-purple-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => router.push('/')}
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
      <div className="max-w-4xl mx-auto p-4">
        {/* Post */}
        <Card className="shadow-md rounded-xl border-0 bg-white mb-6">
          <CardContent className="p-6">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{post.author}</p>
                <p className="text-sm text-gray-500">
                  {post.date} • {post.time}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-6 leading-relaxed text-lg">{post.content}</p>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-gray-600">
              <button
                className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200 cursor-pointer px-4 py-2 rounded-lg hover:bg-red-50"
                onClick={handleLike}
              >
                <Heart className="w-5 h-5" />
                <span className="font-medium">{post.likes}</span>
              </button>

              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200 cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-50">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{post.comments.length}</span>
              </button>

              <button className="flex items-center space-x-2 hover:text-green-500 transition-colors duration-200 cursor-pointer px-4 py-2 rounded-lg hover:bg-green-50">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">{post.shares}</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="shadow-md rounded-xl border-0 bg-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments ({post.comments.length})</h2>
            
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
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
