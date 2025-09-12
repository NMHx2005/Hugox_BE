import express from 'express';
import { getReviews, getReview, updateReviewStatus, deleteReview } from '../../controllers/admin/reviewController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Routes
router.get('/', asyncHandler(getReviews));
router.get('/:id', asyncHandler(getReview));
router.put('/:id/status', asyncHandler(updateReviewStatus));
router.delete('/:id', asyncHandler(deleteReview));

export default router;
