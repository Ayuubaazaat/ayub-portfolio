import connectDB from '../../lib/mongodb';
import News from '../../models/News';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Approve all pending posts
    const result = await News.updateMany(
      { approved: false },
      { $set: { approved: true } }
    );
    
    // Get all posts
    const allPosts = await News.find({}).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      message: `Approved ${result.modifiedCount} posts`,
      totalPosts: allPosts.length,
      posts: allPosts
    });
  } catch (error) {
    console.error('Error approving posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving posts',
      error: error.message
    });
  }
}
