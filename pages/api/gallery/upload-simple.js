import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import connectDB from '../../../lib/mongodb';
import GalleryImage from '../../../models/GalleryImage';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// Initialize S3 client (will be created per request to avoid issues)
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
    forcePathStyle: false, // R2 uses virtual-hosted-style URLs
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Check if environment variables are set
    if (!process.env.CLOUDFLARE_R2_ENDPOINT || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_R2_BUCKET_NAME) {
      console.error('Missing R2 environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'R2 credentials not configured. Please check your .env.local file.' 
      });
    }

    const { image, fileName, contentType } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: 'Missing image or fileName' });
    }

    // Get session to identify uploader
    const session = await getServerSession(req, res, authOptions);

    const s3Client = getS3Client();
    if (!s3Client) {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'Failed to initialize S3 client' 
      });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Sanitize fileName to avoid path issues
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'image/jpeg',
    });

    await s3Client.send(command);

    // Return a URL that uses our proxy endpoint to serve the image
    const url = `/api/gallery/image?key=${encodeURIComponent(key)}`;

    // Save image metadata to MongoDB with 'pending' status
    const newImage = await GalleryImage.create({
      key: key,
      url: url,
      uploaderId: session?.user?.id || null,
      uploaderEmail: session?.user?.email || null,
      status: 'pending', // Default status is pending
      contentType: contentType || 'image/jpeg',
    });

    return res.status(200).json({ 
      success: true, 
      url, 
      key, 
      id: newImage._id,
      status: newImage.status,
      message: 'Image uploaded successfully. Waiting for admin approval.'
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

