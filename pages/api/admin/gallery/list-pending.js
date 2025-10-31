import connectDB from '../../../../lib/mongodb';
import GalleryImage from '../../../../models/GalleryImage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Simple admin check - check if user email matches ADMIN_EMAIL
const isAdmin = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return false;
  }
  // Check if the user's email matches the admin email from environment
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return session.user.email === adminEmail;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin authentication
  if (!await isAdmin(req, res)) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'You are not authorized to access this resource.' 
    });
  }

  try {
    await connectDB();

    const pendingImages = await GalleryImage.find({ status: 'pending' })
      .sort({ uploadTimestamp: -1 })
      .lean();

    const images = pendingImages.map((img) => ({
      _id: img._id.toString(),
      key: img.key,
      url: img.url,
      uploadTimestamp: img.uploadTimestamp,
      uploaderEmail: img.uploaderEmail || 'Anonymous',
      status: img.status,
      contentType: img.contentType,
    }));

    return res.status(200).json({ success: true, images });
  } catch (error) {
    console.error('List pending images error:', error);
    return res.status(500).json({ 
      error: 'Failed to list pending images', 
      message: error.message 
    });
  }
}

