import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  uploaderEmail: {
    type: String,
    default: null,
  },
  uploadTimestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  contentType: {
    type: String,
    default: 'image/jpeg',
  },
}, {
  timestamps: true,
});

export default mongoose.models.GalleryImage || mongoose.model('GalleryImage', galleryImageSchema);

