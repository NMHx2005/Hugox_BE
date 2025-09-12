import express from 'express';
import { getFilterCategories, getPriceRanges, getBrands, getProductTags } from '../controllers/filterController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Routes
router.get('/categories', asyncHandler(getFilterCategories));
router.get('/price-ranges', asyncHandler(getPriceRanges));
router.get('/brands', asyncHandler(getBrands));
router.get('/tags', asyncHandler(getProductTags));

export default router;
