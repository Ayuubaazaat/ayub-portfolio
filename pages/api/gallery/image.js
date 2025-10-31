import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ error: 'Missing key parameter' });
    }

    // Security: Only allow keys that start with 'gallery/'
    if (!key.startsWith('gallery/')) {
      return res.status(403).json({ error: 'Invalid key' });
    }

    const s3Client = getS3Client();
    if (!s3Client) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);

    // Set appropriate headers
    if (response.ContentType) {
      res.setHeader('Content-Type', response.ContentType);
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

    // Stream the image data to the response
    const stream = response.Body;
    
    if (!stream) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Convert stream to buffer and send
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    res.send(buffer);
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch image', message: error.message });
  }
}

