import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Fetch all users with profile information
    const users = await User.find({})
      .select('-password -email') // Exclude sensitive information
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent large responses

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
