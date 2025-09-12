import express from 'express';
import { query } from 'express-validator';
import { globalSearch, searchProducts, searchNews } from '../controllers/searchController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const searchValidation = [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('type').optional().isIn(['products', 'news']).withMessage('Type must be products or news')
];

const productSearchValidation = [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isMongoId().withMessage('Category must be a valid ID'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
    query('sort').optional().isIn(['-createdAt', 'createdAt', '-price', 'price', '-name', 'name']).withMessage('Invalid sort option')
];

const newsSearchValidation = [
    query('q').trim().notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isIn(['Công nghệ', 'Sản phẩm', 'Khuyến mãi', 'Tin tức', 'Khác']).withMessage('Invalid category'),
    query('sort').optional().isIn(['-publishedAt', 'publishedAt', '-title', 'title']).withMessage('Invalid sort option')
];

// Routes
router.get('/', searchValidation, asyncHandler(globalSearch));
router.get('/products', productSearchValidation, asyncHandler(searchProducts));
router.get('/news', newsSearchValidation, asyncHandler(searchNews));

export default router;
