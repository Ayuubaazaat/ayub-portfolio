import connectDB from '../../../lib/mongodb';
import GalleryImage from '../../../models/GalleryImage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Fetch only approved images from MongoDB
    const approvedImages = await GalleryImage.find({ status: 'approved' })
      .sort({ uploadTimestamp: -1 })
      .lean();

    const images = approvedImages.map((img) => ({
      _id: img._id.toString(),
      key: img.key,
      url: img.url,
      lastModified: img.uploadTimestamp || img.createdAt,
    }));

    return res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('List error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Failed to list images', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

