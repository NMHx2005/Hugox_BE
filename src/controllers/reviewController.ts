import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all reviews
export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 12,
    product,
    rating,
    sort = '-createdAt'
  } = req.query;

  const filter: any = { status: 'approved' };

  if (product) filter.product = product;
  if (rating) filter.rating = Number(rating);

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .populate('product', 'name images')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: {
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
};

// Get single review
export const getReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await Review.findById(id)
    .populate('user', 'name avatar')
    .populate('product', 'name images');

  if (!review) {
    throw createError('Review not found', 404);
  }

  res.json({
    success: true,
    data: { review }
  });
};

// Get product reviews
export const getProductReviews = async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.params;
  const { page = 1, limit = 12, rating } = req.query;

  const filter: any = { product: productId, status: 'approved' };
  if (rating) filter.rating = Number(rating);

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total, ratingStats] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      reviews,
      ratingStats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
};

// Create review
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { product, rating, title, comment, images } = req.body;

  // Check if product exists
  const productExists = await Product.findById(product);
  if (!productExists) {
    throw createError('Product not found', 404);
  }

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ product, user: req.userId });
  if (existingReview) {
    throw createError('You have already reviewed this product', 400);
  }

  const review = await Review.create({
    product,
    user: req.userId!,
    rating,
    title,
    comment,
    images: images || [],
    verified: true // Assuming user is verified if they can create review
  });

  await review.populate('user', 'name avatar');
  await review.populate('product', 'name images');

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review }
  });
};

// Like review
export const likeReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw createError('Review not found', 404);
  }

  review.likes += 1;
  await review.save();

  res.json({
    success: true,
    message: 'Review liked successfully',
    data: { likes: review.likes }
  });
};

// Dislike review
export const dislikeReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    throw createError('Review not found', 404);
  }

  review.dislikes += 1;
  await review.save();

  res.json({
    success: true,
    message: 'Review disliked successfully',
    data: { dislikes: review.dislikes }
  });
};
