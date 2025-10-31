import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    // For now, we'll handle authentication on the client side
    // In a production app, you'd want to verify the session here

    await connectDB();

    // Handle special case for "me" - this should be handled by the client
    let targetUserId = userId;

    // Fetch user data
    const user = await User.findById(targetUserId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's posts
    const posts = await Post.find({ 
      userId: targetUserId, 
      approved: true 
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('title content createdAt _id');

    // Get follower and following counts
    const followerCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;
    const postsCount = posts.length;

    // Check if current user is following this user
    // This will be handled on the client side for now
    let isFollowing = false;

    const profileData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        coverImage: user.coverImage,
        about: user.about,
        location: user.location,
        website: user.website,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt
      },
      stats: {
        followers: followerCount,
        following: followingCount,
        posts: postsCount
      },
      posts: posts,
      isFollowing: isFollowing,
      isOwnProfile: false // This will be determined on the client side
    };

    res.status(200).json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
