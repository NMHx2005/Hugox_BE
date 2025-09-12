import express from 'express';
import { body } from 'express-validator';
import { 
  getCategories, 
  getCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../controllers/admin/categoryController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];

// Routes
router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategory));
router.post('/', categoryValidation, asyncHandler(createCategory));
router.put('/:id', categoryValidation, asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

export default router;
