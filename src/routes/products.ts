import express from 'express';
import { query } from 'express-validator';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getRelatedProducts,
  searchProducts
} from '../controllers/productController';
import { getProductsByCategorySlug } from '../controllers/productControllerAddition';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const getProductsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters')
];

const searchValidation = [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Routes
router.get('/', getProductsValidation, asyncHandler(getProducts));
router.get('/search', searchValidation, asyncHandler(searchProducts));
router.get('/featured', asyncHandler(getFeaturedProducts));
router.get('/category/:slug', getProductsValidation, asyncHandler(getProductsByCategorySlug));
router.get('/:id', asyncHandler(getProduct));
router.get('/:id/related', asyncHandler(getRelatedProducts));

export default router;
