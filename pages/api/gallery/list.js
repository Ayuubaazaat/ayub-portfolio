import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if environment variables are set
    if (!process.env.CLOUDFLARE_R2_ENDPOINT || !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || !process.env.CLOUDFLARE_R2_BUCKET_NAME) {
      console.error('Missing R2 environment variables');
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'R2 credentials not configured. Please check your .env.local file.' 
      });
    }

    const s3Client = getS3Client();
    if (!s3Client) {
      return res.status(500).json({ 
        error: 'Server configuration error', 
        message: 'Failed to initialize S3 client' 
      });
    }

    const command = new ListObjectsV2Command({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Prefix: 'gallery/',
    });

    const response = await s3Client.send(command);
    
    const images = (response.Contents || []).map((object) => ({
      key: object.Key,
      url: `/api/gallery/image?key=${encodeURIComponent(object.Key)}`,
      lastModified: object.LastModified,
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

