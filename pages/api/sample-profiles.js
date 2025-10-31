import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Create sample users with profile data
    const sampleUsers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        avatar: '/me-removebg-preview.png',
        coverImage: '',
        about: 'UI/UX Designer passionate about creating beautiful and functional digital experiences. Love working with startups and helping them bring their ideas to life.',
        location: 'San Francisco, CA',
        website: 'sarahjohnson.design',
        role: 'UI/UX Designer',
        verified: true,
        followers: [],
        following: []
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        avatar: '/me2-removebg-preview.png',
        coverImage: '',
        about: 'Frontend Developer and designer. Building the future of web applications with React and modern design principles.',
        location: 'New York, NY',
        website: 'mikechen.dev',
        role: 'Frontend Developer',
        verified: false,
        followers: [],
        following: []
      },
      {
        name: 'Emma Wilson',
        email: 'emma@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        avatar: '/me3-removebg-preview.png',
        coverImage: '',
        about: 'Product Designer at a leading tech company. Focused on user research and creating intuitive interfaces that users love.',
        location: 'Seattle, WA',
        website: 'emmawilson.com',
        role: 'Product Designer',
        verified: true,
        followers: [],
        following: []
      }
    ];

    const createdUsers = [];
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        createdUsers.push(user);
      } else {
        createdUsers.push(existingUser);
      }
    }

    // Create sample posts for each user
    const samplePosts = [
      {
        title: 'Designing Better User Onboarding',
        content: 'User onboarding is crucial for product success. Here are some key principles I follow when designing onboarding flows that actually work.',
        userId: createdUsers[0]._id,
        author: createdUsers[0].name,
        approved: true
      },
      {
        title: 'The Future of Web Development',
        content: 'Exploring the latest trends in web development and how they\'re shaping the future of digital experiences.',
        userId: createdUsers[1]._id,
        author: createdUsers[1].name,
        approved: true
      },
      {
        title: 'Building Inclusive Design Systems',
        content: 'Creating design systems that work for everyone, regardless of ability or background. Accessibility should be built in, not bolted on.',
        userId: createdUsers[2]._id,
        author: createdUsers[2].name,
        approved: true
      },
      {
        title: 'Mobile-First Design Principles',
        content: 'Why mobile-first design is more important than ever and how to implement it effectively in your design process.',
        userId: createdUsers[0]._id,
        author: createdUsers[0].name,
        approved: true
      },
      {
        title: 'React Performance Optimization',
        content: 'Tips and tricks for optimizing React applications for better performance and user experience.',
        userId: createdUsers[1]._id,
        author: createdUsers[1].name,
        approved: true
      }
    ];

    const createdPosts = [];
    for (const postData of samplePosts) {
      const post = new Post(postData);
      await post.save();
      createdPosts.push(post);
    }

    res.status(200).json({
      success: true,
      message: 'Sample profile data created successfully',
      data: {
        users: createdUsers.length,
        posts: createdPosts.length
      }
    });

  } catch (error) {
    console.error('Sample data creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
}
