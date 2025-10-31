import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import Navbar from '../../components/Navbar';
import { 
  MapPin, 
  Globe, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Users, 
  UserPlus, 
  CheckCircle,
  Calendar,
  ExternalLink
} from 'lucide-react';

// Disable static generation for this dynamic page
export function getServerSideProps() {
  return { props: {} };
}

export default function ProfilePage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data: session, status } = useSession();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Handle special case for "me" - redirect to actual user ID
  useEffect(() => {
    if (userId === 'me' && session?.user?.id) {
      router.replace(`/profile/${session.user.id}`);
    }
  }, [userId, session, router]);

  // Fetch profile data
  useEffect(() => {
    if (!userId || userId === 'me') return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/profile/${userId}`);
        const data = await response.json();

        if (data.success) {
          const profileInfo = data.data;
          // Determine if this is the user's own profile
          profileInfo.isOwnProfile = session?.user?.id === userId;
          setProfileData(profileInfo);
          setIsFollowing(profileInfo.isFollowing);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred while fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/profile/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          action: isFollowing ? 'unfollow' : 'follow',
          currentUserId: session.user.id
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            followers: isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1
          }
        }));
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Profile...</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Head>
          <title>Profile Not Found</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested profile could not be found.'}</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </div>
      </>
    );
  }

  const { user, stats, posts, isOwnProfile } = profileData;

  return (
    <>
      <Head>
        <title>{user.name} - Profile</title>
        <meta name="description" content={`View ${user.name}'s profile and posts`} />
      </Head>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
          {user.coverImage && (
            <img 
              src={user.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold bg-gray-200">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* User Info */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                    {user.verified && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-4">{user.role}</p>
                  
                  {/* Stats */}
                  <div className="flex gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.followers}</div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.following}</div>
                      <div className="text-sm text-gray-600">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stats.posts}</div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowMessageModal(true)}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {/* About Section */}
              {(user.about || user.location || user.website) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  <div className="space-y-3">
                    {user.about && (
                      <p className="text-gray-700 leading-relaxed">{user.about}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {user.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      )}
                      {user.website && (
                        <a 
                          href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          {user.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined {formatDate(user.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Posts Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Posts ({stats.posts})
                </h2>
                
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <Card 
                        key={post._id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                        onClick={() => router.push(`/posts/${post._id}`)}
                      >
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(post.createdAt)}</span>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{Math.floor(Math.random() * 50) + 5}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{Math.floor(Math.random() * 20) + 2}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Users className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile ? "Start sharing your thoughts!" : "This user hasn't posted anything yet."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Send Message</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowMessageModal(false)}
                >
                  ×
                </Button>
              </div>
              <p className="text-gray-600 mb-4">
                Message functionality coming soon! This would open a chat interface.
              </p>
              <Button onClick={() => setShowMessageModal(false)} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
