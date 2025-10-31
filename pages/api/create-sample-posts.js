import connectDB from '../../lib/mongodb';
import News from '../../models/News';

export default async function handler(req, res) {
  try {
    await connectDB();
    
    // Create some sample posts
    const samplePosts = [
      {
        title: "Welcome to Our Community!",
        content: "Welcome to our community platform! This is your first post. Feel free to share your thoughts, ideas, and connect with other members.",
        author: "Admin",
        approved: true
      },
      {
        title: "Bitcoin Market Update",
        content: "Bitcoin has seen significant volatility in recent days. Market analysts suggest this could be due to various factors including regulatory news and institutional adoption. Stay tuned for more updates.",
        author: "CryptoAnalyst",
        approved: true
      },
      {
        title: "Community Guidelines",
        content: "Please remember to be respectful and constructive in your posts. Our community thrives on positive interactions and meaningful discussions. Thank you for being part of our community!",
        author: "Moderator",
        approved: true
      }
    ];

    // Insert sample posts
    const createdPosts = await News.insertMany(samplePosts);
    
    res.status(200).json({
      success: true,
      message: `Created ${createdPosts.length} sample posts`,
      posts: createdPosts
    });
  } catch (error) {
    console.error('Error creating sample posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating sample posts',
      error: error.message
    });
  }
}
