import connectDB from '../../../lib/mongodb';
import News from '../../../models/News';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    // Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    
    // Fetch only approved posts, sorted by date (newest first)
    const newsPosts = await News.find({ approved: true })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalPosts = await News.countDocuments({ approved: true });
    const hasMore = skip + newsPosts.length < totalPosts;

    res.status(200).json({ 
      success: true, 
      data: newsPosts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching news posts' 
    });
  }
}
