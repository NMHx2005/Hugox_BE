import express from 'express';
import { body } from 'express-validator';
import {
  getNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
  changeNewsStatus
} from '../../controllers/admin/newsController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Validation rules
const newsValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').isIn(['Công nghệ', 'Sản phẩm', 'Khuyến mãi', 'Tin tức', 'Khác']).withMessage('Valid category is required')
];

const statusValidation = [
  body('status').isIn(['draft', 'published']).withMessage('Status must be either draft or published')
];

// Routes
router.get('/', asyncHandler(getNews));
router.get('/:id', asyncHandler(getNewsArticle));
router.post('/', newsValidation, asyncHandler(createNews));
router.put('/:id', newsValidation, asyncHandler(updateNews));
router.put('/:id/status', statusValidation, asyncHandler(changeNewsStatus));
router.delete('/:id', asyncHandler(deleteNews));

export default router;
