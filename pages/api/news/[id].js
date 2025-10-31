import mongoose from 'mongoose';
import connectDB from '../../../lib/mongodb';
import News from '../../../models/News';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid news post ID' });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get specific news post
      const newsPost = await News.findById(id);
      
      if (!newsPost) {
        return res.status(404).json({ message: 'News post not found' });
      }

      res.status(200).json({ success: true, data: newsPost });
    } else if (req.method === 'PUT') {
      // Update news post (approve/reject)
      const { approved } = req.body;

      if (typeof approved !== 'boolean') {
        return res.status(400).json({ 
          success: false, 
          message: 'Approved status is required' 
        });
      }

      const newsPost = await News.findByIdAndUpdate(
        id,
        { approved },
        { new: true, runValidators: true }
      );

      if (!newsPost) {
        return res.status(404).json({ message: 'News post not found' });
      }

      res.status(200).json({ 
        success: true, 
        message: approved ? 'News post approved' : 'News post rejected',
        data: newsPost
      });
    } else if (req.method === 'DELETE') {
      // Delete news post
      const newsPost = await News.findByIdAndDelete(id);

      if (!newsPost) {
        return res.status(404).json({ message: 'News post not found' });
      }

      res.status(200).json({ 
        success: true, 
        message: 'News post deleted successfully' 
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling news post:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing request' 
    });
  }
}
