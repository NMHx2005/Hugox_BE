import mongoose, { Schema, Document } from 'mongoose';
import { INews } from '../types';

const newsSchema = new Schema<INews>({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'News slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'News content is required'],
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'News category is required'],
    enum: ['Công nghệ', 'Sản phẩm', 'Khuyến mãi', 'Tin tức', 'Khác']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  } as any,
  featuredImage: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot be more than 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot be more than 160 characters']
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
newsSchema.index({ title: 'text', content: 'text', tags: 'text' });
newsSchema.index({ category: 1 });
newsSchema.index({ status: 1 });
newsSchema.index({ featured: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug if not provided
newsSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Method to increment views
newsSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to find published news
newsSchema.statics.findPublished = function () {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

// Static method to find featured news
newsSchema.statics.findFeatured = function () {
  return this.find({ featured: true, status: 'published' }).sort({ publishedAt: -1 });
};

// Static method to find news by category
newsSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, status: 'published' }).sort({ publishedAt: -1 });
};

export default mongoose.model<INews>('News', newsSchema);
