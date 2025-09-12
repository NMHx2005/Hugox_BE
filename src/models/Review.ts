import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  } as any,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  } as any,
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    type: String
  }],
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate reviews
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Virtual for helpful score
reviewSchema.virtual('helpfulScore').get(function () {
  const total = this.likes + this.dislikes;
  return total > 0 ? (this.likes / total) * 100 : 0;
});

// Method to like review
reviewSchema.methods.like = function () {
  this.likes += 1;
  return this.save();
};

// Method to dislike review
reviewSchema.methods.dislike = function () {
  this.dislikes += 1;
  return this.save();
};

// Static method to find reviews by product
reviewSchema.statics.findByProduct = function (productId: string) {
  return this.find({ product: productId, status: 'approved' })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
};

// Static method to find reviews by user
reviewSchema.statics.findByUser = function (userId: string) {
  return this.find({ user: userId })
    .populate('product', 'name images')
    .sort({ createdAt: -1 });
};

// Static method to get average rating for a product
reviewSchema.statics.getAverageRating = function (productId: string) {
  return this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
  ]);
};

// Static method to get rating distribution for a product
reviewSchema.statics.getRatingDistribution = function (productId: string) {
  return this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);
};

export default mongoose.model<IReview>('Review', reviewSchema);
