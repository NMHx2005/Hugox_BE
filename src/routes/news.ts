import express from 'express';
import { query } from 'express-validator';
import { getNews, getNewsArticle, getFeaturedNews, getNewsByCategory, getNewsCategories } from '../controllers/newsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const getNewsValidation = [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('category').optional().isIn(['Công nghệ', 'Sản phẩm', 'Khuyến mãi', 'Tin tức', 'Khác']).withMessage('Invalid category'),
    query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters')
];

// Routes
router.get('/', getNewsValidation, asyncHandler(getNews));
router.get('/categories', asyncHandler(getNewsCategories));
router.get('/featured', asyncHandler(getFeaturedNews));
router.get('/category/:category', asyncHandler(getNewsByCategory));
router.get('/:id', asyncHandler(getNewsArticle));

export default router;
