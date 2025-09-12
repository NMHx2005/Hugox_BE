import express from 'express';
import { body, query } from 'express-validator';
import { 
  getReviews, 
  getReview, 
  getProductReviews, 
  createReview, 
  likeReview, 
  dislikeReview 
} from '../controllers/reviewController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const getReviewsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('product').optional().isMongoId().withMessage('Invalid product ID'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

const createReviewValidation = [
  body('product').isMongoId().withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
];

// Routes
router.get('/', getReviewsValidation, asyncHandler(getReviews));
router.get('/:id', asyncHandler(getReview));
router.get('/product/:productId', getReviewsValidation, asyncHandler(getProductReviews));
router.post('/', authenticate, createReviewValidation, asyncHandler(createReview));
router.post('/:id/like', optionalAuth, asyncHandler(likeReview));
router.post('/:id/dislike', optionalAuth, asyncHandler(dislikeReview));

export default router;
