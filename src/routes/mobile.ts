import express from 'express';
import { query } from 'express-validator';
import { getBottomBarConfig, getHeroBannerConfig, getFeaturedSections } from '../controllers/mobileController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const featuredSectionsValidation = [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
];

// Routes
router.get('/bottom-bar', asyncHandler(getBottomBarConfig));
router.get('/hero-banner', asyncHandler(getHeroBannerConfig));
router.get('/featured-sections', featuredSectionsValidation, asyncHandler(getFeaturedSections));

export default router;
