import connectDB from '../../../lib/mongodb';
import News from '../../../models/News';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Submit request received:', req.body);
    const { title, content, author } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, content, and author are required' 
      });
    }

    if (title.length > 200) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title cannot exceed 200 characters' 
      });
    }

    if (content.length > 2000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content cannot exceed 2000 characters' 
      });
    }

    if (author.length > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Author name cannot exceed 100 characters' 
      });
    }

    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Create new news post (defaults to not approved)
    const newsPost = new News({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      approved: false
    });

    console.log('Saving news post...');
    await newsPost.save();
    console.log('News post saved successfully:', newsPost._id);

    res.status(201).json({ 
      success: true, 
      message: 'News post submitted successfully. It will be reviewed before being published.',
      data: newsPost
    });
  } catch (error) {
    console.error('Error submitting news:', error);
    res.status(500).json({ 
      success: false, 
      message: `Error submitting news post: ${error.message}` 
    });
  }
}
