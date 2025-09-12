import { Request, Response } from 'express';
import Review from '../../models/Review';
import { createError } from '../../middleware/errorHandler';

// Get all reviews for admin
export const getReviews = async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 12,
    search,
    status,
    product,
    sort = '-createdAt'
  } = req.query;

  const filter: any = {};

  if (search) {
    filter.$or = [
      { comment: new RegExp(search as string, 'i') },
      { title: new RegExp(search as string, 'i') }
    ];
  }

  if (status) filter.status = status;
  if (product) filter.product = product;

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate('user', 'name email')
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

// Get single review for admin
export const getReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await Review.findById(id)
    .populate('user', 'name email')
    .populate('product', 'name images');

  if (!review) {
    throw createError('Review not found', 404);
  }

  res.json({
    success: true,
    data: { review }
  });
};

// Update review status
export const updateReviewStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    throw createError('Invalid status', 400);
  }

  const review = await Review.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('user', 'name email')
   .populate('product', 'name images');

  if (!review) {
    throw createError('Review not found', 404);
  }

  res.json({
    success: true,
    message: 'Review status updated successfully',
    data: { review }
  });
};

// Delete review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await Review.findByIdAndDelete(id);

  if (!review) {
    throw createError('Review not found', 404);
  }

  res.json({
    success: true,
    message: 'Review deleted successfully'
  });
};
