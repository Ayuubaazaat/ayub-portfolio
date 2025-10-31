import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '../../../../lib/mongodb';
import GalleryImage from '../../../../models/GalleryImage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

// Initialize S3 client
const getS3Client = () => {
  if (!process.env.CLOUDFLARE_R2_ENDPOINT || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    return null;
  }

  return new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: false,
  });
};

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

    const imageToDelete = await GalleryImage.findById(id);

    if (!imageToDelete) {
      return res.status(404).json({ error: 'Image not found in database' });
    }

    // Delete from R2
    const s3Client = getS3Client();
    if (s3Client && process.env.CLOUDFLARE_R2_BUCKET_NAME) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: imageToDelete.key,
        });
        await s3Client.send(deleteCommand);
      } catch (r2Error) {
        console.error('Error deleting from R2:', r2Error);
        // Continue to delete from DB even if R2 deletion fails
      }
    }

    // Delete from MongoDB
    await GalleryImage.findByIdAndDelete(id);

    return res.status(200).json({ 
      success: true, 
      message: 'Image denied and deleted successfully' 
    });
  } catch (error) {
    console.error('Deny image error:', error);
    return res.status(500).json({ 
      error: 'Failed to deny and delete image', 
      message: error.message 
    });
  }
}

