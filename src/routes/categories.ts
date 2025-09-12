import express from 'express';
import { getCategories, getCategory, getCategoryProducts } from '../controllers/categoryController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Routes
router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategory));
router.get('/:id/products', asyncHandler(getCategoryProducts));

export default router;
