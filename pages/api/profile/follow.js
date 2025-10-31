import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // For now, we'll handle authentication on the client side
    // In a production app, you'd want to verify the session here
    const { userId, action, currentUserId } = req.body;

    if (!userId || !action || !currentUserId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (action !== 'follow' && action !== 'unfollow') {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await connectDB();

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUserId === userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    if (action === 'follow') {
      // Add to following list of current user
      if (!currentUser.following.includes(userId)) {
        currentUser.following.push(userId);
      }
      
      // Add to followers list of target user
      if (!targetUser.followers.includes(currentUserId)) {
        targetUser.followers.push(currentUserId);
      }
    } else {
      // Remove from following list of current user
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userId
      );
      
      // Remove from followers list of target user
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUserId
      );
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `Successfully ${action}ed user`,
      isFollowing: action === 'follow'
    });

  } catch (error) {
    console.error('Follow API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
