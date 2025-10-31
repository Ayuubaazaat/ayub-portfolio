import connectDB from '../../../../lib/mongodb';
import GalleryImage from '../../../../models/GalleryImage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Simple admin check
const isAdmin = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return false;
  }
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return session.user.email === adminEmail;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin authentication
  if (!await isAdmin(req, res)) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'You are not authorized to perform this action.' 
    });
  }

  try {
    await connectDB();

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing image ID' });
    }

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Image approved successfully', 
      image: {
        _id: updatedImage._id.toString(),
        key: updatedImage.key,
        url: updatedImage.url,
        status: updatedImage.status,
      }
    });
  } catch (error) {
    console.error('Approve image error:', error);
    return res.status(500).json({ 
      error: 'Failed to approve image', 
      message: error.message 
    });
  }
}

